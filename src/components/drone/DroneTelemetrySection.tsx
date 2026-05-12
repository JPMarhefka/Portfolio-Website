import { Container } from "@/components/layout/Container";
import { DiagnosticCard } from "@/components/ui/DiagnosticCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

const notes = [
  {
    label: "Signal lock logic",
    title: "A lock has to survive noise.",
    body: "The beacon is modulated at 38 kHz, then receiver output is thresholded and confirmed through a sliding window before the system treats it as a reliable lock. That reduces false positives while preserving fast response.",
  },
  {
    label: "Coarse-to-fine tracking",
    title: "Direction estimation without scanning.",
    body: "Wider receiver spacing establishes a rough baseline, then the front array compares signal strength across receivers for finer direction estimation. The design avoids a mechanical scanning stage.",
  },
  {
    label: "Telemetry and observability",
    title: "The debug UI is part of the system.",
    body: "TCP telemetry exposes lock state, sensor values, altitude readings, and subsystem behavior through a web interface, making integration problems visible before flight behavior becomes ambiguous.",
  },
  {
    label: "Validation status",
    title: "Subsystems verified, integration next.",
    body: "Verified pieces include sensing, lock confirmation, altitude paths, and telemetry plumbing. Current risks are end-to-end timing, signal robustness in field conditions, and flight controller command tuning.",
  },
];

export function DroneTelemetrySection() {
  return (
    <section className="section telemetry-section" aria-labelledby="telemetry-title">
      <Container>
        <SectionLabel>Engineering field report</SectionLabel>
        <h2 id="telemetry-title" className="section-heading">
          Key implementation notes for the drone system.
        </h2>
        <div className="field-notes">
          {notes.map((note, index) => (
            <DiagnosticCard className="field-note" key={note.label}>
              <span>{String(index + 1).padStart(2, "0")} · {note.label}</span>
              <h3>{note.title}</h3>
              <p>{note.body}</p>
            </DiagnosticCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
