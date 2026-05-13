import { ArrowDown } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { StatusPill } from "@/components/ui/StatusPill";
import { DroneHeroVisual } from "./DroneHeroVisual";

export function DroneProjectHero() {
  return (
    <section className="drone-hero" aria-labelledby="drone-title">
      <Container className="drone-hero__grid">
        <div>
          <SectionLabel>Flagship Project</SectionLabel>
          <h1 id="drone-title" className="page-headline">
            Autonomous Laser-Tracking Drone Prototype
          </h1>
          <p className="body-copy">
            A drone prototype that tracks a reflected laser target, confirms signal lock,
            estimates direction through coarse-to-fine sensing, and uses ESP32-based telemetry
            and control to guide flight.
          </p>
          <div className="drone-hero__status">
            <StatusPill tone="amber">Verified subsystems · End-to-end integration in progress</StatusPill>
          </div>
          <div className="home-splash__actions">
            <Button href="#drone-walkthrough" variant="primary">
              Start system walkthrough <ArrowDown size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="drone-hero__visual">
          <DroneHeroVisual />
        </div>
      </Container>
    </section>
  );
}
