export type DroneHotspot = {
  id: string;
  label: string;
  title: string;
  description: string;
  cameraPosition: [number, number, number];
  target: [number, number, number];
  modelRotation: [number, number, number];
  modelPosition: [number, number, number];
  modelScale: number;
};

// Tune these values after the final GLB is in /public/models/drone.glb.
// Each hotspot controls both camera framing and drone transform.
export const droneHotspots: DroneHotspot[] = [
  {
    id: "overview",
    label: "01 Overview",
    title: "System overview",
    description:
      "The drone is presented as a complete sensing and control platform, with IR tracking, altitude sensing, and telemetry working together.",
    cameraPosition: [-3, 1, 1],
    target: [0, 0, 0],
    modelRotation: [.4, -.5, 0],
    modelPosition: [.2, -.3, 0],
    modelScale: 1,
  },
  {
    id: "front-array",
    label: "02 Front sensor array",
    title: "Fine tracking array",
    description:
      "The front sensor region compares signal strength across receivers to estimate direction without mechanical scanning.",
    cameraPosition: [-3, 1, 1],
    target: [0.6, 0.1, 0.4],
    modelRotation: [0, 0, 0],
    modelPosition: [.2, -.5, .5],
    modelScale: 3,
  },
  {
    id: "rear-baseline",
    label: "03 Coarse baseline",
    title: "Coarse direction lock",
    description:
      "Wider receiver spacing gives the system a rough directional estimate before fine tracking takes over.",
    cameraPosition: [-1.7, 1.0, 2.8],
    target: [-0.4, 0.1, -0.3],
    modelRotation: [0, 1.1, 0],
    modelPosition: [-.5, -0.1, 0],
    modelScale: 1.5,
  },
  {
    id: "flight-controller",
    label: "04 Flight controller",
    title: "Embedded control layer",
    description:
      "An ESP32 coordinates sensing, filtering, telemetry, and flight controller communication through modular subsystems.",
    cameraPosition: [0, -.5, 2.2],
    target: [0, 0.15, 0],
    modelRotation: [0.8, 0.1, 0],
    modelPosition: [0, -0.3, 0],
    modelScale: 1.55,
  },
  {
    id: "rotors",
    label: "05 Rotor system",
    title: "Motion and stability",
    description:
      "The rotors stay animated during the walkthrough to keep the system feeling alive while the page explains each subsystem.",
    cameraPosition: [0.9, 1.5, 2.4],
    target: [0.4, 0.5, 0.2],
    modelRotation: [0.4, -0.4, 0.1],
    modelPosition: [0, -0.25, 0],
    modelScale: 1.5,
  },
  {
    id: "telemetry",
    label: "06 Telemetry",
    title: "Observability first",
    description:
      "The project is designed around visibility into lock state, sensor values, and system behavior through a web telemetry interface.",
    cameraPosition: [0, 0.8, 5.2],
    target: [0, 0, 0],
    modelRotation: [0.2, Math.PI * 1.75, 0],
    modelPosition: [0, -0.2, 0],
    modelScale: 1,
  },
];
