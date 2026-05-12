import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "DibSift Privacy Policy | Joseph-Paul Marhefka",
  description:
    "Privacy policy for DibSift, covering local Chrome profile storage, Gemini API analysis, and data sharing.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DibsiftPrivacyPolicyPage() {
  return (
    <main className="privacy-page">
      <Container>
        <article className="privacy-policy-card" aria-labelledby="privacy-policy-title">
          <h1 id="privacy-policy-title">DibSift Privacy Policy</h1>

          <p>DibSift is a Chrome extension that helps users save, compare, export, and analyze Facebook Marketplace listings.</p>

          <h2>Data DibSift Stores Locally</h2>
          <p>
            DibSift stores saved listing information locally in the user's Chrome profile. This may include listing titles,
            prices, descriptions, condition, displayed listing location, seller/listing details, thumbnail URLs or images,
            listing URLs, user notes or shopping goals, selected item states, and AI analysis results.
          </p>
          <p>
            DibSift also stores the user's Gemini API key locally in the user's Chrome profile so the user can run AI
            analysis without re-entering the key each time.
          </p>

          <h2>Data Sent to Gemini</h2>
          <p>
            DibSift sends selected listing information and the user's shopping goal to the Gemini API only when the user
            chooses to run AI analysis. DibSift does not automatically send saved listings to Gemini in the background.
          </p>

          <h2>How Data Is Used</h2>
          <p>
            DibSift uses saved listing data only to provide its core features: saving listings, comparing listings,
            exporting listing research, and generating AI-powered buying guidance.
          </p>

          <h2>Data Sharing</h2>
          <p>
            DibSift does not sell user data. DibSift does not transfer user data to third parties except when the user
            chooses to run Gemini analysis, in which case selected listing data and the user's shopping goal are sent to the
            Gemini API to generate a response.
          </p>

          <h2>Remote Code</h2>
          <p>
            DibSift does not load or execute remote JavaScript or WebAssembly. All extension scripts are included in the
            extension package.
          </p>

          <h2>Contact</h2>
          <p>For questions about DibSift or this privacy policy, contact Joseph-Paul Marhefka through jpmarhefka.com.</p>
        </article>
      </Container>
    </main>
  );
}
