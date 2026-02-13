"use client";

import { type CSSProperties, type Dispatch, type MouseEvent, type SetStateAction, useEffect, useRef, useState } from "react";
import ScrollDroneScene from "@/components/ScrollDroneScene";
import styles from "./page.module.css";

type SectionId = "mission" | "constraints" | "build" | "lock" | "tracking" | "control" | "validation" | "contact";

type Metric = {
  key: "carrier" | "lock" | "range" | "control" | "telemetry";
  label: string;
  target: number;
  unit: string;
  meaning: string;
  prefix?: string;
  fixed?: boolean;
};

const sectionOrder: SectionId[] = ["mission", "constraints", "build", "lock", "tracking", "control", "validation", "contact"];

const railSteps: Array<{ id: SectionId; title: string }> = [
  { id: "mission", title: "Mission" },
  { id: "constraints", title: "Constraints" },
  { id: "build", title: "Build" },
  { id: "lock", title: "Lock" },
  { id: "tracking", title: "Tracking" },
  { id: "control", title: "Control" },
  { id: "validation", title: "Validation" },
  { id: "contact", title: "Contact" },
];

const metrics: Metric[] = [
  { key: "carrier", label: "Carrier frequency", target: 38, unit: "kHz", meaning: "TSOP38238 compatible.", fixed: true },
  { key: "lock", label: "Typical lock time", target: 4, unit: "s", meaning: "Controlled indoor tests.", prefix: "2 to " },
  {
    key: "range",
    label: "Effective range",
    target: 3,
    unit: "m",
    meaning: "Varies with reflectivity and ambient IR.",
    prefix: "1.5 to ",
    fixed: true,
  },
  { key: "control", label: "Control loop", target: 100, unit: "Hz", meaning: "Autonomy control scaffold rate." },
  { key: "telemetry", label: "Telemetry", target: 10, unit: "Hz", meaning: "Over TCP.", prefix: "5 to " },
];

const project = {
  hero: {
    title: "Autonomous Laser Guided Drone",
    status: "Prototype in integration",
    subtitle: "IR beacon tracking at 38 kHz, real-time control scaffolding at 100 Hz, and a telemetry UI that makes behavior visible.",
    body: "This project is an autonomy prototype built around a simple promise: the drone should be able to find a reflected IR beacon, confirm it is real, align its heading, and begin a controlled approach without guessing. I chose IR because it is deceptively hard in the real world. Reflections flicker, sunlight and heat sources add interference, and noisy signals can trigger false locks if you rely on a single threshold. The core of the system is not just detection, it is confidence and state transitions that remain predictable under noise.",
  },
  mission:
    "Build an autonomy loop that can be tested like a system, not a magic demo. The goal is to detect a known IR signature reflected off a target surface, confirm lock using time-based consistency checks, and then use a coarse-to-fine sensor layout to estimate direction and refine angle. A key requirement is observability. Every major decision in the autonomy flow should be visible in telemetry so I can debug quickly and explain behavior clearly during integration.",
  constraints:
    "IR tracking is sensitive to conditions you cannot fully control. Ambient IR from sunlight can swamp receivers, reflections change with surface material and angle, and noise spikes can look like real targets if the logic is too eager. I designed the system around two constraints. First, the target signal must be recognizable, so the beacon is modulated at 38 kHz to match the TSOP38238 receiver carrier behavior. Second, lock must be earned over time, not triggered instantly, so detection uses thresholding plus a sliding window confirmation step before the system commits to a new state. These choices reduce false positives and make the behavior more repeatable during integration.",
  build:
    "The system is split into a beacon side and a drone side. On the beacon side, a custom laser diode module is driven by an ESP32 using PWM so the emitted signal flashes at a controlled 38 kHz carrier. On the drone side, an ESP32 handles IR signal processing, lock confirmation, and tracking logic, while the flight controller is responsible for stabilization. The flight controller is an X12 5-in-1 AIO, providing IMU and barometer data through the existing flight stack. Altitude is managed using a time-of-flight sensor as the primary reference, with the barometer as backup. For integration and debugging, telemetry is streamed over TCP to a minimal web UI so internal state and sensor-derived values are visible in real time.",
  lock:
    "Lock is treated as a confidence decision, not a single sensor event. The IR receivers are monitored continuously, then filtered to reduce noise and short spikes. A threshold identifies candidate detections, but lock is only declared after a sliding window confirms consistent signal presence across time. This prevents the system from reacting to brief reflections or ambient interference that happen to cross the threshold. Once the lock condition is met, the autonomy state machine can transition predictably, and if confidence drops later, the system can fall back without unstable oscillation between states.",
  tracking:
    "Direction estimation is done in two stages so the system can react quickly without sacrificing precision. For coarse tracking, two IR sensors on the rear and two on the front are placed in parallel with a fixed baseline. This provides a fast directional cue and helps establish which way the drone should orient. After the general target direction is known, fine tracking is handled by a front-facing module of three closely spaced sensors. Fine tracking compares relative signal strengths and uses the local intensity gradient to refine angle estimates. This approach avoids mechanical scanning and produces smoother heading corrections during alignment and early approach.",
  control:
    "The control loop is designed to remain responsive while still allowing useful observability. The autonomy control scaffolding runs at 100 Hz to support timely adjustments and stable behavior during state transitions. Telemetry is intentionally slower, streamed at 5 to 10 Hz over TCP, which keeps the UI smooth without competing with the control loop. The telemetry view is meant to answer practical questions during integration, such as whether lock confidence is rising, whether the angle estimate is converging, and whether altitude sensing is stable under movement.",
  validation:
    "I validate subsystems independently with measurable checks before combining them into end-to-end behavior. This keeps integration predictable and makes failures easier to isolate. Current validation focuses on signal detectability, lock stability, tracking consistency, loop timing, and telemetry reliability. Full controlled flight behavior is being built by composing these verified parts into a single state machine with clear fallback rules.",
  contact:
    "If you are hiring for robotics, embedded, or autonomy roles, I would love to chat. This project reflects how I work. I prefer systems that are measurable, debuggable, and designed around clear state behavior rather than one-off demos. I can walk through the architecture, the signal processing choices, and how I validated each subsystem during integration.",
};

const stateBySection: Record<SectionId, "Search" | "Lock confirm" | "Align" | "Approach" | "Fallback"> = {
  mission: "Search",
  constraints: "Search",
  build: "Search",
  lock: "Lock confirm",
  tracking: "Align",
  control: "Approach",
  validation: "Fallback",
  contact: "Fallback",
};

const validatedSubsystems = [
  "38 kHz beacon modulation on ESP32 PWM",
  "IR detection + lock confirmation (threshold + sliding window)",
  "Coarse direction estimate (front/rear pairs)",
  "Fine tracking angle refinement (3-sensor front module)",
  "Altitude sensing (ToF primary, barometer fallback)",
  "Telemetry streaming over TCP to web UI (5 to 10 Hz)",
];

const telemetryFields = [
  "Mode and state: search, lock confirm, align, approach, fallback",
  "Lock confidence and per-sensor signal levels",
  "Angle estimate and heading correction",
  "Altitude from ToF and barometer fallback indicator",
  "Update rates for loop and telemetry",
];

function createSectionMap<T>(initial: T): Record<SectionId, T> {
  return {
    mission: initial,
    constraints: initial,
    build: initial,
    lock: initial,
    tracking: initial,
    control: initial,
    validation: initial,
    contact: initial,
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return prefersReducedMotion;
}

function formatMetric(metric: Metric, value: number) {
  const shown = metric.fixed ? value.toFixed(1).replace(/\.0$/, "") : Math.round(value).toString();
  if (metric.prefix) {
    return `${metric.prefix}${shown} ${metric.unit}`;
  }
  return `${shown} ${metric.unit}`;
}

export default function Home() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const splashRef = useRef<HTMLElement>(null);

  const [isInContent, setIsInContent] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("mission");
  const [visitedSections, setVisitedSections] = useState<Record<SectionId, boolean>>(createSectionMap(false));
  const [visibleSections, setVisibleSections] = useState<Record<SectionId, boolean>>(createSectionMap(false));

  const [counterValues, setCounterValues] = useState<Record<Metric["key"], number>>({
    carrier: 0,
    lock: 0,
    range: 0,
    control: 0,
    telemetry: 0,
  });

  const ratiosRef = useRef<Record<SectionId, number>>(createSectionMap(0));
  const activeRef = useRef<SectionId>("mission");
  const hasAnimatedValidationRef = useRef(false);

  useEffect(() => {
    activeRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const splash = splashRef.current;
        if (!splash) return;
        setIsInContent(splash.getBoundingClientRect().bottom <= 0);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const sections = sectionOrder
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((current) => {
          const next = { ...current };
          let changed = false;

          for (const entry of entries) {
            const id = entry.target.id as SectionId;
            const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
            ratiosRef.current[id] = ratio;

            const visible = ratio >= 0.18;
            if (next[id] !== visible) {
              next[id] = visible;
              changed = true;
            }

            if (id === "validation" && ratio >= 0.35 && !hasAnimatedValidationRef.current) {
              hasAnimatedValidationRef.current = true;
              startMetricAnimation(prefersReducedMotion, setCounterValues);
            }
          }

          return changed ? next : current;
        });

        setVisitedSections((current) => {
          const next = { ...current };
          let changed = false;
          for (const entry of entries) {
            const id = entry.target.id as SectionId;
            const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
            if (ratio >= 0.18 && !next[id]) {
              next[id] = true;
              changed = true;
            }
          }
          return changed ? next : current;
        });

        const epsilon = 0.07;
        let nextActive = activeRef.current;
        let bestRatio = ratiosRef.current[nextActive] ?? 0;

        for (const id of sectionOrder) {
          const ratio = ratiosRef.current[id] ?? 0;
          if (ratio > bestRatio + epsilon) {
            bestRatio = ratio;
            nextActive = id;
          }
        }

        if (bestRatio < 0.04) {
          const anchor = window.innerHeight * 0.35;
          let bestDistance = Number.POSITIVE_INFINITY;
          for (const id of sectionOrder) {
            const section = document.getElementById(id);
            if (!section) continue;
            const distance = Math.abs(section.getBoundingClientRect().top - anchor);
            if (distance < bestDistance) {
              bestDistance = distance;
              nextActive = id;
            }
          }
        }

        if (nextActive !== activeRef.current) {
          activeRef.current = nextActive;
          setActiveSection(nextActive);
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const handleRailClick = (event: MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault();
    const node = document.getElementById(id);
    if (!node) return;
    node.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
  };

  const currentState = stateBySection[activeSection];
  const activeIndex = railSteps.findIndex((step) => step.id === activeSection);
  const safeActiveIndex = activeIndex >= 0 ? activeIndex : 0;
  const maxIndex = Math.max(railSteps.length - 1, 1);
  const progressToActive = safeActiveIndex / maxIndex;

  return (
    <div className={styles.page}>
      <section ref={splashRef} className={styles.splash}>
        <div className={styles.splashCanvas}>
          <ScrollDroneScene className={styles.canvasFrame} />
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.contentLayout}>
          <aside className={styles.railSlot}>
            <div className={`${styles.rail} ${isInContent ? styles.railVisible : styles.railHidden}`}>
            <p className={styles.railTitle}>Progress</p>
            <nav
              className={styles.railNav}
              aria-label="Content sections"
              style={{ "--progress-to-active": progressToActive } as CSSProperties}
            >
              <span className={styles.railTrack} aria-hidden="true" />
              <span className={styles.railProgress} aria-hidden="true" />
              <ul className={styles.railList}>
                {railSteps.map((step, idx) => {
                  const complete = idx <= safeActiveIndex;
                  const dotOpacity =
                    idx === safeActiveIndex
                      ? 1
                      : complete
                        ? clamp(0.5 + 0.5 * (idx / Math.max(safeActiveIndex, 1)), 0.5, 1)
                        : 0.24;
                  const itemStyle = {
                    "--i": idx,
                    "--dot-opacity": dotOpacity,
                    "--dot-mix": `${Math.round(dotOpacity * 100)}%`,
                  } as CSSProperties;
                  const active = step.id === activeSection;
                  const visited = visitedSections[step.id] || active;
                  return (
                    <li
                      key={step.id}
                      className={`${styles.railItem} ${visited ? styles.railItemVisited : ""} ${active ? styles.railItemActive : ""}`}
                      data-active={active ? "true" : "false"}
                      data-complete={complete ? "true" : "false"}
                      style={itemStyle}
                    >
                      <a
                        href={`#${step.id}`}
                        className={styles.railLink}
                        onClick={(event) => handleRailClick(event, step.id)}
                        aria-current={active ? "true" : undefined}
                      >
                        <span className={styles.railDotWrap} aria-hidden="true">
                          <span className={styles.railDot} />
                        </span>
                        <span>{step.title}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          </aside>

          <div className={styles.storyBody}>
            <header className={`${styles.storySection} ${styles.heroSection} ${isInContent ? styles.sectionVisible : ""}`}>
              <p className={styles.eyebrow}>{project.hero.title}</p>
              <h1 className={styles.title}>{project.hero.title}</h1>
              <p className={styles.status}>{project.hero.status}</p>
              <p className={styles.subtitle}>{project.hero.subtitle}</p>
              <p className={styles.sectionCopy}>{project.hero.body}</p>
              <div className={styles.contactActions}>
                <a className={styles.primaryButton} href="#validation" onClick={(event) => handleRailClick(event, "validation")}>
                  Jump to Validation
                </a>
                <a className={styles.secondaryButton} href="#contact" onClick={(event) => handleRailClick(event, "contact")}>
                  Contact
                </a>
              </div>
            </header>

            <section id="mission" className={`${styles.storySection} ${visibleSections.mission ? styles.sectionVisible : ""}`}>
              <h2>Mission</h2>
              <p className={styles.sectionCopy}>{project.mission}</p>
              <ul className={styles.list}>
                <li>Carrier frequency: 38 kHz, TSOP38238 compatible</li>
                <li>Control loop scaffold: 100 Hz</li>
                <li>Telemetry: 5 to 10 Hz over TCP to a lightweight web UI</li>
              </ul>
            </section>

            <section id="constraints" className={`${styles.storySection} ${visibleSections.constraints ? styles.sectionVisible : ""}`}>
              <h2>Constraints</h2>
              <p className={styles.sectionCopy}>{project.constraints}</p>
              <p className={styles.inlineStatus}>This project is currently at a verified-subsystems stage, with full end-to-end integration in progress.</p>
            </section>

            <section id="build" className={`${styles.storySection} ${visibleSections.build ? styles.sectionVisible : ""}`}>
              <h2>Build</h2>
              <p className={styles.sectionCopy}>{project.build}</p>
              <pre className={styles.archCard}>
Beacon ESP32 PWM (38 kHz) → reflected IR → TSOP38238 array → lock + tracking on ESP32
→ MSP over UART → flight stack → telemetry over TCP → web UI
              </pre>
            </section>

            <section id="lock" className={`${styles.storySection} ${visibleSections.lock ? styles.sectionVisible : ""}`}>
              <div className={styles.sectionHeadRow}>
                <h2>Detection and lock</h2>
                <span className={styles.stateChip}>State: {currentState}</span>
              </div>
              <p className={styles.sectionCopy}>{project.lock}</p>
              <p className={styles.inlineStatus}>Modulation at 38 kHz makes the target signature predictable, the sliding window makes the lock decision stable.</p>
            </section>

            <section id="tracking" className={`${styles.storySection} ${visibleSections.tracking ? styles.sectionVisible : ""}`}>
              <div className={styles.sectionHeadRow}>
                <h2>Tracking and angle estimation</h2>
                <span className={styles.stateChip}>State: {currentState}</span>
              </div>
              <p className={styles.sectionCopy}>{project.tracking}</p>
              <p className={styles.inlineStatus}>Coarse tracking gets you pointed the right way fast, fine tracking gives stable alignment without twitchy motion.</p>
            </section>

            <section id="control" className={`${styles.storySection} ${visibleSections.control ? styles.sectionVisible : ""}`}>
              <div className={styles.sectionHeadRow}>
                <h2>Control and telemetry</h2>
                <span className={styles.stateChip}>State: {currentState}</span>
              </div>
              <p className={styles.sectionCopy}>{project.control}</p>
              <ul className={styles.list}>
                {telemetryFields.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section id="validation" className={`${styles.storySection} ${visibleSections.validation ? styles.sectionVisible : ""}`}>
              <h2>Validation</h2>
              <p className={styles.subhead}>Bench verified, integration in progress</p>
              <p className={styles.sectionCopy}>{project.validation}</p>
              <div className={styles.verifiedTag}>Bench verified</div>

              <div className={styles.metricGrid}>
                {metrics.map((metric) => (
                  <article key={metric.key} className={styles.metricCard}>
                    <p className={styles.metricLabel}>{metric.label}</p>
                    <p className={styles.metricValue}>{formatMetric(metric, counterValues[metric.key])}</p>
                    <p className={styles.metricDetail}>{metric.meaning}</p>
                  </article>
                ))}
              </div>

              <p className={styles.inlineStatus}>Works best indoors or in low-glare conditions where sunlight and strong heat sources do not saturate IR.</p>

              <h3 className={styles.subhead}>Validated subsystems</h3>
              <ul className={styles.checklist}>
                {validatedSubsystems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h3 className={styles.subhead}>Next integration steps</h3>
              <ul className={styles.list}>
                <li>Tie approach speed to lock confidence and add conservative abort thresholds.</li>
                <li>Improve resilience under higher ambient IR.</li>
                <li>Add replayable logging for post-test debugging.</li>
              </ul>
            </section>

            <section id="contact" className={`${styles.storySection} ${visibleSections.contact ? styles.sectionVisible : ""}`}>
              <h2>Contact</h2>
              <p className={styles.sectionCopy}>{project.contact}</p>
              <div className={styles.contactActions}>
                <a className={styles.primaryButton} href="mailto:you@example.com">
                  Email
                </a>
                <a className={styles.secondaryButton} href="https://www.linkedin.com" target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a className={styles.secondaryButton} href="#" aria-label="Resume link">
                  Resume
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function startMetricAnimation(
  prefersReducedMotion: boolean,
  setCounterValues: Dispatch<SetStateAction<Record<Metric["key"], number>>>,
) {
  const targets: Record<Metric["key"], number> = {
    carrier: 38,
    lock: 4,
    range: 3,
    control: 100,
    telemetry: 10,
  };

  if (prefersReducedMotion) {
    setCounterValues(targets);
    return;
  }

  const durationMs = 900;
  const start = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const progress = clamp((now - start) / durationMs, 0, 1);
    const eased = 1 - (1 - progress) ** 3;

    setCounterValues({
      carrier: targets.carrier * eased,
      lock: targets.lock * eased,
      range: targets.range * eased,
      control: targets.control * eased,
      telemetry: targets.telemetry * eased,
    });

    if (progress < 1) {
      raf = requestAnimationFrame(tick);
    }
  };

  raf = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(raf);
}
