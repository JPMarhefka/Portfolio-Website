import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { PartunoWaitlistForm } from "@/components/partuno/PartunoWaitlistForm";
import { SectionLabel } from "@/components/ui/SectionLabel";
import styles from "./partuno.module.css";

export const metadata: Metadata = {
  title: "Partuno | Coming Soon",
  description:
    "Partuno is a procurement and design assistant for BOM analysis, component matching, and supplier research.",
};

const capabilities = [
  "BOM analysis",
  "Component matching",
  "Supplier and pricing research",
];

export default function PartunoPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero} aria-labelledby="partuno-heading">
        <Container className={styles.heroInner}>
          <div className={styles.copy}>
            <SectionLabel>Coming Soon</SectionLabel>
            <p className={styles.productName}>Partuno</p>
            <h1 className={styles.headline} id="partuno-heading">
              From BOM to <span>build-ready.</span>
            </h1>
            <p className={`body-copy ${styles.description}`}>
              Partuno is a procurement and design assistant that helps engineers analyze
              BOMs, match components, and research supplier options in one workflow.
            </p>
            <ul className={styles.capabilities} aria-label="Partuno capabilities">
              {capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
            <PartunoWaitlistForm />
            <p className={styles.developmentNote}>Partuno is currently in development.</p>
          </div>

          <div className={styles.visual}>
            <div className={styles.logoFrame}>
              <Image
                className={styles.logo}
                src="/images/partuno-logo.png"
                alt="Partuno logo"
                width={613}
                height={613}
                priority
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
