"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { projects } from "@/data/projects";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { ProjectTeaserCard } from "./ProjectTeaserCard";

export function ProjectCardScroller() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeIndexRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      activeIndexRef.current = 0;
      return;
    }

    function update() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const nextProgress = Math.min(1, Math.max(0, -rect.top / Math.max(travel, 1)));
      const nextIndex = Math.min(projects.length - 1, Math.round(nextProgress * (projects.length - 1)));

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
  }, [prefersReducedMotion]);

  const displayedActiveIndex = prefersReducedMotion ? 0 : activeIndex;

  return (
    <section
      id="work"
      className="project-scroller"
      data-static={prefersReducedMotion}
      ref={sectionRef}
      aria-labelledby="projects-title"
      style={
        {
          minHeight: prefersReducedMotion ? undefined : `calc(${projects.length * 100}vh + 80px)`,
        } as CSSProperties
      }
    >
      <Container className="project-scroller__sticky">
        <div className="project-scroller__intro">
          <SectionLabel>Selected project systems</SectionLabel>
          <h2 id="projects-title" className="section-heading">
            Project cards staged like field reports, with enough signal to invite a deeper read.
          </h2>
        </div>
        <div className="project-scroller__cards">
          {projects.map((project, index) => {
            const position =
              index < displayedActiveIndex ? "before" : index > displayedActiveIndex ? "after" : "active";

            return (
              <div
                className="project-scroller__card-shell"
                key={project.id}
                style={{
                  zIndex: position === "active" ? projects.length : projects.length - index,
                  pointerEvents: index === displayedActiveIndex ? "auto" : "none",
                }}
                data-position={position}
                aria-hidden={!prefersReducedMotion && index !== displayedActiveIndex}
              >
                <ProjectTeaserCard project={project} index={index} isActive={index === displayedActiveIndex} />
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
