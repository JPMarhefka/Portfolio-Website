"use client";

import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const HomeDroneScene = dynamic(() => import("./HomeDroneScene").then((module) => module.HomeDroneScene), {
  ssr: false,
  loading: () => <HomeDroneFallback />,
});

function HomeDroneFallback() {
  return <div className="home-drone-fallback home-drone-fallback--render" aria-hidden="true" />;
}

function HomeDroneVisual({
  reducedMotion,
  useStaticVisual,
}: {
  reducedMotion: boolean;
  useStaticVisual: boolean;
}) {
  if (useStaticVisual) return <HomeDroneFallback />;

  return <HomeDroneScene reducedMotion={reducedMotion} />;
}

export function HomeSplash() {
  const [isClientReady, setIsClientReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowPowerDevice = useIsLowPowerDevice();
  const useStaticVisual = !isClientReady || isLowPowerDevice;

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  function scrollToProjects() {
    document.getElementById("work")?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  return (
    <section className="home-splash" aria-labelledby="home-title">
      <Container className="home-splash__grid">
        <div className="home-splash__content">
          <SectionLabel>Software Engineering · Robotics · Embedded Systems</SectionLabel>
          <h1 id="home-title" className="headline">
            Building systems that make complex behavior visible.
          </h1>
          <p className="body-copy">
            I’m Joseph-Paul Marhefka, a Santa Clara University student building robotics,
            embedded, and full-stack projects with a focus on instrumentation, validation,
            and polished user experience.
          </p>
          <div className="home-splash__actions">
            <Button type="button" onClick={scrollToProjects} variant="primary">
              Explore Projects <ChevronDown size={17} aria-hidden="true" />
            </Button>
          </div>
        </div>
        <div className="home-splash__visual" aria-label="Drone telemetry visualization">
          <div className="home-splash__poster">
            <HomeDroneVisual reducedMotion={prefersReducedMotion} useStaticVisual={useStaticVisual} />
          </div>
        </div>
      </Container>
    </section>
  );
}
