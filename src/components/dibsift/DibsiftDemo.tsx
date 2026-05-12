"use client";

import { Check, ChevronDown, Copy, ExternalLink, Settings } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { dibsiftAnalysis, dibsiftGoal, dibsiftListings, type DibsiftListing, type DibsiftTopPick } from "@/data/dibsiftDemo";

const apiKeyPlaceholder = "demo-gemini-key-stored-locally";
const dibsiftRepoUrl = "https://github.com/JPMarhefka/DibSift";
const dibsiftFallbackVersion = "v1.0.0";

type ReleaseInfo = {
  label: string;
  source: string;
  url: string;
  publishedAt?: string;
};

function parsePrice(price: string) {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

function getPriceRange(listings: DibsiftListing[]) {
  if (listings.length === 0) return "No items";
  const values = listings.map((listing) => parsePrice(listing.price)).filter(Boolean);
  if (values.length === 0) return "No prices";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `$${min}` : `$${min}-$${max}`;
}

function buildPrompt(goal: string, listings: DibsiftListing[]) {
  const selectedGoal = goal.trim() || dibsiftGoal;
  const listingText = listings
    .map(
      (listing, index) =>
        `${index + 1}. ${listing.title} | ${listing.price} | ${listing.condition} | ${listing.location} | ${listing.description}`,
    )
    .join("\n");

  return `Shopping goal: ${selectedGoal}\n\nSaved listings:\n${listingText}\n\nRank the best options, suggest offers, risks, questions, and a seller message.`;
}

function buildCsv(listings: DibsiftListing[]) {
  const rows = [
    ["Title", "Price", "Condition", "Location", "Description", "Copied At"],
    ...listings.map((listing) => [
      listing.title,
      listing.price,
      listing.condition,
      listing.location,
      listing.description,
      listing.copiedAt,
    ]),
  ];

  return rows
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

function buildReport(goal: string, listings: DibsiftListing[]) {
  const prompt = buildPrompt(goal, listings);
  const picks = dibsiftAnalysis.topItems
    .filter((item) => listings.some((listing) => listing.id === item.listingId))
    .map((item) => `#${item.rank} ${item.title}\n${item.score} - ${item.verdict}\nOffer: ${item.suggestedOffer}`)
    .join("\n\n");

  return `DibSift Demo Report\n\n${prompt}\n\nAI Top Picks\n${picks || "No ranked picks for the current selection."}`;
}

function downloadText(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function DibsiftDemo() {
  const [goal, setGoal] = useState(dibsiftGoal);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [apiKey, setApiKey] = useState(apiKeyPlaceholder);
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo>({
    label: dibsiftFallbackVersion,
    source: "Manifest version",
    url: dibsiftRepoUrl,
  });
  const [isReleaseLoading, setIsReleaseLoading] = useState(true);
  const [notice, setNotice] = useState("Demo mode: saved listings and Gemini output are local to this page.");

  const listings = dibsiftListings;
  const selectedCount = selectedIds.size;
  const savedCount = listings.length;
  const selectedListings = useMemo(
    () => listings.filter((listing) => selectedIds.has(listing.id)),
    [selectedIds],
  );
  const visibleTopPicks = hasAnalysis
    ? dibsiftAnalysis.topItems.filter((item) => selectedIds.has(item.listingId))
    : [];
  const allSelected = savedCount > 0 && selectedCount === savedCount;
  const priceRange = getPriceRange(listings);

  useEffect(() => {
    let isActive = true;

    async function fetchLatestRelease() {
      try {
        const response = await fetch("https://api.github.com/repos/JPMarhefka/DibSift/releases/latest", {
          headers: { Accept: "application/vnd.github+json" },
        });

        if (!response.ok) {
          throw new Error(`GitHub release lookup failed: ${response.status}`);
        }

        const data = await response.json() as {
          html_url?: string;
          name?: string;
          published_at?: string;
          tag_name?: string;
        };

        if (!isActive) return;
        setReleaseInfo({
          label: data.name || data.tag_name || dibsiftFallbackVersion,
          source: "Latest GitHub release ",
          url: data.html_url || dibsiftRepoUrl,
          publishedAt: data.published_at,
        });
      } catch {
        if (!isActive) return;
        setReleaseInfo({
          label: dibsiftFallbackVersion,
          source: "Manifest version",
          url: dibsiftRepoUrl,
        });
      } finally {
        if (isActive) setIsReleaseLoading(false);
      }
    }

    fetchLatestRelease();

    return () => {
      isActive = false;
    };
  }, []);

  function toggleListing(listingId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else if (next.size < 10) {
        next.add(listingId);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedIds(new Set());
      setNotice("Selection cleared.");
      return;
    }

    setSelectedIds(new Set(listings.slice(0, 10).map((listing) => listing.id)));
    setNotice("Selected all saved listings for Gemini analysis.");
  }

  function handleSaveCurrentListing() {
    setNotice("The website demo uses four fixed TV listings. The Chrome extension saves live Marketplace listings.");
  }

  function removePreviousListing() {
    setNotice("Listing removal is disabled here so the premade Gemini response stays consistent.");
  }

  function clearSaved() {
    setNotice("Clear Saved is disabled in the portfolio demo. The full extension can clear saved Marketplace data.");
  }

  function handleAnalyze() {
    if (isAnalyzing || selectedIds.size === 0) return;
    setNotice(`Running the saved Gemini response against ${selectedIds.size} selected listing${selectedIds.size === 1 ? "" : "s"}.`);
    setIsAnalyzing(true);

    window.setTimeout(() => {
      setHasAnalysis(true);
      setIsAnalyzing(false);
      setNotice("Gemini analysis restored from the canned DibSift TV response.");
    }, 720);
  }

  function clearAnalysis() {
    setHasAnalysis(false);
    setNotice("Cleared the local AI response.");
  }

  function saveKey() {
    setApiKey(apiKey.trim() || apiKeyPlaceholder);
    setNotice("Saved the demo Gemini key locally in React state.");
  }

  function clearKey() {
    setApiKey("");
    setNotice("Cleared the demo Gemini key.");
  }

  async function copyPrompt() {
    const prompt = buildPrompt(goal, selectedListings.length > 0 ? selectedListings : listings);
    try {
      await navigator.clipboard.writeText(prompt);
      setNotice("Copied the Gemini prompt.");
    } catch {
      setNotice("Prompt is generated locally, but clipboard access was blocked by the browser.");
    }
  }

  function exportCsv() {
    downloadText("dibsift-demo-listings.csv", buildCsv(listings), "text/csv;charset=utf-8");
    setNotice("Exported a CSV from the local demo listings.");
  }

  function exportReport() {
    downloadText("dibsift-demo-report.txt", buildReport(goal, selectedListings.length > 0 ? selectedListings : listings), "text/plain;charset=utf-8");
    setNotice("Exported a local DibSift demo report.");
  }

  async function copyMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      setNotice("Copied the seller message.");
    } catch {
      setNotice("Seller message is visible in the expanded card.");
    }
  }

  return (
    <div className="dibsift-demo" aria-label="Interactive DibSift extension demo">
      <section className="dibsift-demo__context">
        <div className="dibsift-demo__logo-wrap">
          <img src="/images/dibsift/icon-fullresolution.png" alt="" />
        </div>
        <div>
          <p className="eyebrow">Interactive extension demo</p>
          <h1 className="page-headline">DibSift</h1>
          <p className="body-copy">
            Formerly Deal Scout, DibSift saves visible Facebook Marketplace listings, normalizes the messy
            details, and turns selected items into a practical buying recommendation.
          </p>
        </div>
        <div className="dibsift-release-card" aria-label="DibSift release and repository">
          <div>
            <p>Current release</p>
            <strong>{isReleaseLoading ? "Checking GitHub..." : releaseInfo.label}</strong>
            <span>{releaseInfo.source}</span>
            {releaseInfo.publishedAt ? (
              <time dateTime={releaseInfo.publishedAt}>
                {new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(releaseInfo.publishedAt))}
              </time>
            ) : null}
          </div>
          <a href={releaseInfo.url} target="_blank" rel="noreferrer">
            Try the latest version <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="dibsift-extension diagnostic-card" aria-label="DibSift popup simulator">
        <header className="dibsift-extension__header">
          <div>
            <p className="dibsift-extension__eyebrow">AI Powered Facebook Marketplace Analysis Tool</p>
            <h2>DibSift</h2>
          </div>
          <div className="dibsift-extension__header-actions">
            <span className="dibsift-pill dibsift-pill--count">{savedCount} saved</span>
            <button
              className="dibsift-icon-button"
              type="button"
              aria-label="Open settings"
              aria-expanded={isSettingsOpen}
              onClick={() => setIsSettingsOpen((current) => !current)}
            >
              <Settings size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        {isSettingsOpen ? (
          <div className="dibsift-settings" aria-label="Demo settings">
            <div className="dibsift-settings__topline">
              <h3>Gemini AI</h3>
              <div className="dibsift-settings__key-actions">
                <button type="button" onClick={saveKey}>Save Key</button>
                <button type="button" className="dibsift-danger-button" onClick={clearKey}>Clear Key</button>
              </div>
            </div>

            <label htmlFor="dibsift-api-key">Gemini API key</label>
            <input
              id="dibsift-api-key"
              type="password"
              value={apiKey}
              placeholder="Paste your Gemini API key"
              onChange={(event) => setApiKey(event.target.value)}
            />
            <p>Stored locally in this Chrome profile</p>

            <div className="dibsift-settings__divider" />

            <h4>Tools</h4>
            <div className="dibsift-settings__actions">
              <button type="button" onClick={copyPrompt}>Copy Prompt</button>
              <button type="button" onClick={exportCsv}>Export CSV</button>
              <button type="button" onClick={exportReport}>Export Report</button>
              <button type="button" className="dibsift-danger-button" onClick={clearSaved}>Clear Saved</button>
            </div>
          </div>
        ) : null}

        <div className="dibsift-goal">
          <label htmlFor="dibsift-shopping-goal">What are you looking for today?</label>
          <textarea
            id="dibsift-shopping-goal"
            rows={3}
            value={goal}
            placeholder="Example: used couch under $300, MacBook for college, dorm desk, reliable appliance for an apartment"
            onChange={(event) => setGoal(event.target.value)}
          />
        </div>

        <div className="dibsift-actions" aria-label="DibSift demo actions">
          <button type="button" className="dibsift-action-button dibsift-action-button--save" onClick={handleSaveCurrentListing}>
            Save Current Listing
          </button>
          <button type="button" className="dibsift-action-button dibsift-action-button--danger" onClick={removePreviousListing}>
            Remove Previous Listing
          </button>
          <button
            type="button"
            className="dibsift-action-button dibsift-action-button--analyze"
            onClick={handleAnalyze}
            disabled={isAnalyzing || selectedCount === 0}
          >
            {isAnalyzing ? "Analyzing with Gemini" : "Analyze with Gemini"}
          </button>
          <button type="button" className="dibsift-action-button" onClick={clearAnalysis}>
            Clear AI Response
          </button>
        </div>

        <section className="dibsift-panel dibsift-top-picks" aria-label="AI top picks">
          <div className="dibsift-panel__heading">
            <div>
              <h3>AI Top Picks</h3>
              <p>{hasAnalysis ? dibsiftAnalysis.summary : "Run Gemini analysis to reveal the top 3."}</p>
            </div>
            <span className="dibsift-pill">{hasAnalysis ? "Complete" : "Not run"}</span>
          </div>

          {hasAnalysis ? (
            visibleTopPicks.length > 0 ? (
              <div className="dibsift-results">
                {visibleTopPicks.map((item) => (
                  <TopPickCard
                    key={item.listingId}
                    item={item}
                    listing={listings.find((listing) => listing.id === item.listingId)}
                    onCopyMessage={copyMessage}
                  />
                ))}
              </div>
            ) : (
              <div className="dibsift-empty-state">
                The canned top picks are outside the current selection. Select the saved TV listings and run analysis again.
              </div>
            )
          ) : (
            <div className="dibsift-empty-state">
              AI results will appear here with pros, cons, offers, questions, and seller messages.
            </div>
          )}
        </section>

        <section className="dibsift-panel dibsift-saved-panel" aria-label="Saved listing comparison">
          <div className="dibsift-saved-panel__header">
            <div>
              <h3>Saved Items</h3>
              <p>{selectedCount} selected, 10 max for Gemini.</p>
            </div>
            <div className="dibsift-saved-panel__actions">
              <button type="button" onClick={toggleSelectAll}>{allSelected ? "Deselect All" : "Select All"}</button>
              <span className="dibsift-pill">{priceRange}</span>
            </div>
          </div>

          <div className="dibsift-listings">
            {listings.length > 0 ? (
              listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  selected={selectedIds.has(listing.id)}
                  onToggle={() => toggleListing(listing.id)}
                />
              ))
            ) : (
              <div className="dibsift-empty-state">No saved items. Use Save Current Listing to restore the preloaded demo listings.</div>
            )}
          </div>
        </section>

        <div className="dibsift-notice" role="status" aria-live="polite">
          {notice}
        </div>
      </section>
    </div>
  );
}

function TopPickCard({
  item,
  listing,
  onCopyMessage,
}: {
  item: DibsiftTopPick;
  listing?: DibsiftListing;
  onCopyMessage: (message: string) => void;
}) {
  return (
    <details className="dibsift-result-card" open={item.rank === 1}>
      <summary>
        <span className="dibsift-rank">#{item.rank}</span>
        <span>
          <strong>{item.title}</strong>
          <em>{item.score} | {item.verdict}</em>
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="dibsift-result-card__body">
        <div className="dibsift-result-card__meta">
          <span>Offer: {item.suggestedOffer}</span>
          <span>Max: {item.maxPrice}</span>
          {listing ? <span>{listing.location}</span> : null}
        </div>
        <TextList title="Pros" values={item.pros} />
        <TextList title="Cons" values={item.cons} />
        <TextList title="Risks" values={item.risks} />
        <TextList title="Questions" values={item.questions} />
        <div className="dibsift-message">
          <h4>Seller message</h4>
          <p>{item.message}</p>
          <button type="button" onClick={() => onCopyMessage(item.message)}>
            <Copy size={15} aria-hidden="true" /> Copy message
          </button>
        </div>
      </div>
    </details>
  );
}

function TextList({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="dibsift-text-list">
      <h4>{title}</h4>
      <ul>
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}

function ListingCard({
  listing,
  selected,
  onToggle,
}: {
  listing: DibsiftListing;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="dibsift-listing-card" data-selected={selected}>
      <div className="dibsift-listing-card__media">
        <img src={listing.image} alt="" />
      </div>
      <div className="dibsift-listing-card__body">
        <div className="dibsift-listing-card__select-row">
          <button className="dibsift-check" type="button" aria-pressed={selected} onClick={onToggle}>
            {selected ? <Check size={17} aria-hidden="true" /> : null}
          </button>
          <span>Analyze</span>
        </div>
        <div className="dibsift-listing-card__title-row">
          <h4>{listing.title}</h4>
          <strong>{listing.price}</strong>
        </div>
        <dl>
          <div>
            <dt>Condition</dt>
            <dd>{listing.condition}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{listing.location}</dd>
          </div>
        </dl>
        <p>{listing.description}</p>
      </div>
    </article>
  );
}
