import { Code2, FileText, Mail, Network } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function HomeContactCTA() {
  return (
    <section className="section contact-cta" aria-labelledby="contact">
      <Container className="contact-cta__inner">
        <SectionLabel>Contact Me</SectionLabel>
        <h2 id="contact" className="section-heading">
          Looking for roles where software, hardware, and systems thinking come together.
        </h2>
        <p className="body-copy">
          I’m interested in opportunities across software engineering, robotics,
          embedded systems, full-stack development, and technology-focused problem solving.
        </p>
        <div className="contact-cta__links">
          <Button href="mailto:jmarhefka@scu.edu" variant="primary">
            <Mail size={17} aria-hidden="true" style={{marginRight: '4px'}}/>  Email
          </Button>
          <Button href="https://www.linkedin.com/in/jpm05" target="_blank" rel="noreferrer">
            <Network size={17} aria-hidden="true" style={{marginRight: '4px'}}/>  LinkedIn
          </Button>
          <Button href="https://github.com/JPMarhefka" target="_blank" rel="noreferrer">
            <Code2 size={17} aria-hidden="true" style={{marginRight: '4px'}}/>  GitHub
          </Button>
          {/* Replace this placeholder path if the resume filename changes. */}
          <Button href="/resume/Joseph-Paul Marhefka - Computer Science and Engineering Student Resume.pdf">
            <FileText size={17} aria-hidden="true" style={{marginRight: '4px'}}/>  Resume PDF
          </Button>
        </div>
      </Container>
    </section>
  );
}
