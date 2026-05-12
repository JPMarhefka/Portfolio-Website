import { ArrowLeft, Code2, Mail, Network } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function DroneNextSteps() {
  return (
    <section className="section drone-next" aria-labelledby="next-title">
      <Container className="drone-next__inner">
        <SectionLabel>Next steps</SectionLabel>
        <h2 id="next-title" className="section-heading">
          Integration work is focused on timing, field robustness, and flight command tuning.
        </h2>
        <p className="body-copy">
          The next revision will tune the hotspot camera positions against the final GLB, replace
          placeholder media with real renderings and bench images, and add deeper telemetry
          screenshots once the end-to-end pipeline is stable.
        </p>
        <div className="contact-cta__links">
          <Button href="/">
            <ArrowLeft size={17} aria-hidden="true" /> Back home
          </Button>
          <Button href="mailto:jmarhefka@scu.edu" variant="primary">
            <Mail size={17} aria-hidden="true" /> Email
          </Button>
          <Button href="https://www.linkedin.com/in/jpm05" target="_blank" rel="noreferrer">
            <Network size={17} aria-hidden="true" /> LinkedIn
          </Button>
          <Button href="https://github.com/JPMarhefka" target="_blank" rel="noreferrer">
            <Code2 size={17} aria-hidden="true" /> GitHub
          </Button>
        </div>
      </Container>
    </section>
  );
}
