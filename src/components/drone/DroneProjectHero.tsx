import Image from "next/image";
import { ArrowDown, FileText } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusPill } from "@/components/ui/StatusPill";

export function DroneProjectHero() {
  return (
    <section className="drone-hero" aria-labelledby="drone-title">
      <Container className="drone-hero__grid">
        <div>
          <SectionLabel>Flagship Case Study</SectionLabel>
          <h1 id="drone-title" className="page-headline">
            Autonomous Laser Guided Drone
          </h1>
          <p className="body-copy">
            An IR beacon tracking prototype built around lock confirmation, coarse-to-fine
            direction estimation, altitude fallback, and real-time telemetry.
          </p>
          <div className="drone-hero__status">
            <StatusPill tone="amber">Verified subsystems · End-to-end integration in progress</StatusPill>
          </div>
          <div className="home-splash__actions">
            <Button href="#drone-walkthrough" variant="primary">
              Start system walkthrough <ArrowDown size={17} aria-hidden="true" />
            </Button>
            <Button href="#system-summary">
              View technical summary <FileText size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="drone-hero__visual">
          <Image
            src="/images/drone/drone-render-front-01.png"
            alt="drone-render-front-01"
            fill
            priority
            sizes="(max-width: 760px) 92vw, 42vw"
            style={{
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>
      </Container>
    </section>
  );
}
