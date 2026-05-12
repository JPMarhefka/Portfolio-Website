import { Cpu, Gauge, Radio, ScanLine, Send, Signal, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { DiagnosticCard } from "@/components/ui/DiagnosticCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

const architecture = [
  { title: "Beacon", detail: "38 kHz modulated IR/laser source", icon: Signal },
  { title: "IR receivers", detail: "Coarse baseline and fine front array", icon: ScanLine },
  { title: "ESP32 processing", detail: "Thresholds, filters, lock state, telemetry", icon: Cpu },
  { title: "Flight controller", detail: "Direction commands and integration layer", icon: Send },
  { title: "TOF altitude", detail: "Primary altitude sensing for low range", icon: Gauge },
  { title: "Barometer fallback", detail: "Resilience when TOF data is unavailable", icon: SlidersHorizontal },
  { title: "TCP telemetry", detail: "Streaming observability into a web UI", icon: Radio },
];

export function DroneSystemSection() {
  return (
    <section id="system-summary" className="section system-section" aria-labelledby="system-title">
      <Container>
        <SectionLabel>Technical summary</SectionLabel>
        <div className="split-heading">
          <h2 id="system-title" className="section-heading">
            The prototype is organized around sensing confidence, not just movement.
          </h2>
          <p className="body-copy">
            The user points an invisible beacon and the drone moves toward it. Current work is in
            verified-subsystems stage with end-to-end integration in progress, so the portfolio
            frames the project as an engineering system under active validation.
          </p>
        </div>

        <div className="architecture-grid">
          {architecture.map((item) => {
            const Icon = item.icon;
            return (
              <DiagnosticCard className="architecture-card" key={item.title}>
                <Icon size={20} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
              </DiagnosticCard>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
