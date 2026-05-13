"use client";

import { useState, type CSSProperties } from "react";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

type RoadmapCategory = "Input/Sensing" | "Processing" | "Control" | "Flight Controller" | "Telemetry";

type RoadmapNode = {
  id: string;
  title: string;
  description: string;
  detail: string;
  tags: string[];
  category: RoadmapCategory;
};

const roadmapCategories: Record<
  RoadmapCategory,
  {
    color: string;
    tint: string;
  }
> = {
  "Input/Sensing": {
    color: "#69d9ef",
    tint: "rgba(105, 217, 239, 0.12)",
  },
  Processing: {
    color: "#7ce09f",
    tint: "rgba(124, 224, 159, 0.11)",
  },
  Control: {
    color: "#8aa8ff",
    tint: "rgba(138, 168, 255, 0.12)",
  },
  "Flight Controller": {
    color: "#c7b7ff",
    tint: "rgba(199, 183, 255, 0.12)",
  },
  Telemetry: {
    color: "#64f1c2",
    tint: "rgba(100, 241, 194, 0.11)",
  },
};

const roadmapNodes: RoadmapNode[] = [
  {
    id: "ir-beacon-input",
    title: "IR Beacon Input",
    description:
      "A user points an invisible IR/laser beacon toward the drone. The drone does not follow GPS or vision first. It begins by detecting the direction and strength of the IR signal.",
    detail: "This stage defines the target the autonomy stack is trying to align with before any control output is generated.",
    tags: ["IR beacon", "user input", "target direction"],
    category: "Input/Sensing",
  },
  {
    id: "coarse-direction-detection",
    title: "Coarse Direction Detection",
    description:
      "Four IR sensors mounted around the rotor guard corners compare signal strength to estimate the rough direction of the beacon. This gives the ESP32 a baseline target direction before using the finer array.",
    detail: "The coarse baseline prevents the system from treating every sensor equally once a stronger target direction appears.",
    tags: ["4 corner sensors", "signal comparison", "coarse lock"],
    category: "Input/Sensing",
  },
  {
    id: "fine-alignment-array",
    title: "Fine Alignment Array",
    description:
      "After coarse lock, the system transfers to a more precise front sensor array. The ESP32 compares small changes in IR intensity to refine pitch and yaw corrections.",
    detail: "The fine array narrows the correction loop once the target is already in the front tracking region.",
    tags: ["fine tracking", "intensity gradient", "target alignment"],
    category: "Input/Sensing",
  },
  {
    id: "vl53l3cx-ground-distance",
    title: "VL53L3CX Ground Distance",
    description:
      "A VL53L3CX Time-of-Flight sensor measures ground distance over I2C. The ESP32 filters readings by range status, signal rate, and ambient light to choose the best valid altitude measurement.",
    detail: "Altitude awareness gives the companion controller another confidence signal before movement commands are packaged.",
    tags: ["I2C", "ToF", "altitude", "signal quality"],
    category: "Input/Sensing",
  },
  {
    id: "esp32-s3-sensor-processing",
    title: "ESP32-S3 Sensor Processing",
    description:
      "The ESP32-S3 polls the ToF sensor and IR sensor array, filters noisy readings, chooses the strongest valid data, and packages the system state for control and telemetry.",
    detail: "This is the companion controller layer where raw sensor readings become structured state.",
    tags: ["embedded C/C++", "PlatformIO", "filtering", "sensor fusion"],
    category: "Processing",
  },
  {
    id: "autopilot-state-machine",
    title: "Autopilot State Machine",
    description:
      "The control software moves through states such as idle, sensor check, target search, coarse lock, fine lock, hover assist, command output, and failsafe. This keeps the drone predictable and testable.",
    detail: "The state machine keeps autonomy behavior explicit instead of allowing sensor noise to directly drive movement.",
    tags: ["state machine", "autonomy", "failsafe"],
    category: "Processing",
  },
  {
    id: "command-generation",
    title: "Command Generation",
    description:
      "Sensor outputs are converted into flight intentions such as pitch forward, yaw correction, roll correction, throttle trim, or hover hold. The ESP32 does not directly drive motors.",
    detail: "Commands stay at the intention layer, preserving a clean boundary between autonomy and stabilization.",
    tags: ["pitch", "roll", "yaw", "throttle"],
    category: "Control",
  },
  {
    id: "msp-uart-link",
    title: "MSP UART Link",
    description:
      "The ESP32 sends control data to the flight controller through UART using the MultiWii Serial Protocol. This creates a clean separation between autonomous logic and flight stabilization.",
    detail: "The serial protocol boundary makes the autonomy controller replaceable without rewriting the stabilization stack.",
    tags: ["UART", "MSP", "serial control"],
    category: "Control",
  },
  {
    id: "flight-controller-stabilization",
    title: "Flight Controller Stabilization",
    description:
      "The Betaflight flight controller receives commands, runs stabilization and PID loops, handles arming logic, failsafe behavior, ESC output, and motor mixing.",
    detail: "Betaflight remains responsible for the timing-critical flight control work the ESP32 should not own directly.",
    tags: ["Betaflight", "PID", "ESC", "failsafe"],
    category: "Flight Controller",
  },
  {
    id: "flight-response",
    title: "Flight Response",
    description:
      "The drone physically responds to the command by adjusting motor speeds. The ESP32 observes the next sensor frame and the loop repeats continuously.",
    detail: "Every movement becomes feedback for the next sensing frame, closing the autonomy loop.",
    tags: ["closed loop", "motor output", "flight response"],
    category: "Flight Controller",
  },
  {
    id: "live-telemetry",
    title: "Live Telemetry",
    description:
      "The ESP32 streams live debugging data over Wi-Fi, including ToF distance, signal strength, ambient light, IR sensor states, selected target channel, flight state, and outgoing control commands.",
    detail: "The browser dashboard replaces serial-only debugging so the autonomy loop can be inspected while it runs.",
    tags: ["Wi-Fi", "SoftAP", "telemetry", "dashboard"],
    category: "Telemetry",
  },
];

const roadmapIntro =
  "From IR beacon detection to stabilized flight, this roadmap shows how the drone moves from raw sensor input through embedded processing, flight command generation, Betaflight stabilization, and live telemetry output.";

export function DroneSystemRoadmap() {
  const [activeNodeId, setActiveNodeId] = useState(roadmapNodes[0].id);

  return (
    <section id="system-summary" className="section system-section roadmap-section" aria-labelledby="system-title">
      <Container>
        <SectionLabel>Autopilot roadmap</SectionLabel>
        <div className="split-heading roadmap-section__heading">
          <h2 id="system-title" className="section-heading">
            Autopilot System Roadmap
          </h2>
          <p className="body-copy">{roadmapIntro}</p>
        </div>

        <div className="roadmap-legend" aria-label="Roadmap color legend">
          {(Object.keys(roadmapCategories) as RoadmapCategory[]).map((category) => (
            <span
              key={category}
              style={
                {
                  "--roadmap-accent": roadmapCategories[category].color,
                  "--roadmap-tint": roadmapCategories[category].tint,
                } as CSSProperties
              }
            >
              {category}
            </span>
          ))}
        </div>

        <div className="roadmap-shell" aria-label="Autopilot system architecture roadmap">
          <div className="roadmap-track">
            {roadmapNodes.map((node, index) => {
              const category = roadmapCategories[node.category];
              const isActive = node.id === activeNodeId;

              return (
                <article
                  className={cn("roadmap-node", isActive && "roadmap-node--active")}
                  key={node.id}
                  style={
                    {
                      "--roadmap-accent": category.color,
                      "--roadmap-tint": category.tint,
                    } as CSSProperties
                  }
                >
                  <button
                    className="roadmap-node__trigger"
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`${node.id}-detail`}
                    onClick={() => setActiveNodeId(node.id)}
                  >
                    <span className="roadmap-node__topline">
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <span>{node.category}</span>
                    </span>
                    <span className="roadmap-node__title">{node.title}</span>
                    <span className="roadmap-node__description">{node.description}</span>
                    <span className="roadmap-node__tags">
                      {node.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </span>
                  </button>
                  <div className="roadmap-node__detail" id={`${node.id}-detail`} hidden={!isActive}>
                    <span>Active stage</span>
                    <p>{node.detail}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
