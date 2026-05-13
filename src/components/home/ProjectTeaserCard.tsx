import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatusPill } from "@/components/ui/StatusPill";
import type { Project } from "@/data/projects";

export function ProjectTeaserCard({
  project,
  index,
  isActive,
}: {
  project: Project;
  index: number;
  isActive: boolean;
}) {
  return (
    <article className="project-card diagnostic-card" data-active={isActive}>
      <div className="project-card__meta">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <StatusPill tone={project.href ? "green" : "amber"}>{project.status}</StatusPill>
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className="project-card__tags">
        {project.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <Button href={project.href} disabled={!project.href} variant={project.href ? "primary" : "secondary"}>
        {project.cta} {project.href ? <ArrowRight size={16} aria-hidden="true" style={{marginLeft: '4px'}}/> : null}
      </Button>
    </article>
  );
}
