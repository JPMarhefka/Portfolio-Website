"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { droneHotspots } from "@/data/droneHotspots";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { DroneInspectionCard } from "./DroneInspectionCard";

const DroneScene = dynamic(() => import("./DroneScene").then((module) => module.DroneScene), {
  ssr: false,
  loading: () => <div className="drone-canvas-fallback">Preparing 3D inspection scene</div>,
});

function DroneScrollStaticVisual() {
  return (
    <div
      className="drone-canvas-static"
      role="img"
      aria-label="Static rendering of the autonomous laser guided drone"
    />
  );
}

export function DroneScrollExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [isClientReady, setIsClientReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const isLowPowerDevice = useIsLowPowerDevice();
  const useStaticMode = !isClientReady || reducedMotion || isLowPowerDevice;

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (useStaticMode) {
      activeIndexRef.current = 0;
      setActiveIndex(0);
      return;
    }

    function update() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / Math.max(travel, 1)));
      const nextIndex = Math.min(droneHotspots.length - 1, Math.round(nextProgress * (droneHotspots.length - 1)));

      if (nextIndex !== activeIndexRef.current) {
        activeIndexRef.current = nextIndex;
        setActiveIndex(nextIndex);
      }
    }

    function requestUpdate() {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        update();
      });
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [useStaticMode]);

  const displayedActiveIndex = useStaticMode ? 0 : activeIndex;
  const snappedSceneProgress =
    droneHotspots.length <= 1 ? 0 : displayedActiveIndex / (droneHotspots.length - 1);

  return (
    <section
      id="drone-walkthrough"
      className="drone-scroll"
      data-static={useStaticMode}
      ref={sectionRef}
      aria-labelledby="walkthrough-title"
      style={
        {
          minHeight: useStaticMode ? undefined : `calc(${droneHotspots.length * 100}vh + 80px)`,
          "--drone-scroll-stage-height": useStaticMode ? undefined : `${droneHotspots.length * 100}vh`,
        } as CSSProperties
      }
    >
      <Container className="drone-scroll__intro">
        <SectionLabel>Scroll activated 3D walkthrough</SectionLabel>
        <h2 id="walkthrough-title" className="section-heading">
          A guided inspection system for the drone’s sensing, control, and telemetry layers.
        </h2>
      </Container>

      <Container className="drone-scroll__stage">
        <div className="drone-scroll__sticky">
          {useStaticMode ? (
            <DroneScrollStaticVisual />
          ) : (
            <DroneScene progress={snappedSceneProgress} reducedMotion={false} />
          )}
          <div className="drone-scroll__progress" aria-hidden="true">
            {droneHotspots.map((hotspot, index) => (
              <span key={hotspot.id} data-active={index <= displayedActiveIndex} />
            ))}
          </div>
        </div>
        <div className="drone-scroll__cards">
          {droneHotspots.map((hotspot, index) => {
            const position =
              index < displayedActiveIndex ? "before" : index > displayedActiveIndex ? "after" : "active";

            return (
              <div
                className="drone-scroll__card-shell"
                key={hotspot.id}
                style={{
                  zIndex: position === "active" ? droneHotspots.length : droneHotspots.length - index,
                  pointerEvents: index === displayedActiveIndex ? "auto" : "none",
                }}
                data-position={position}
                aria-hidden={!useStaticMode && index !== displayedActiveIndex}
              >
                <DroneInspectionCard hotspot={hotspot} isActive={index === displayedActiveIndex} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
