export type DroneHotspot = {
  id: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
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
    title: "Laser-Guided Flight System",
    description:
      "A drone prototype designed to detect a reflected laser target, confirm signal lock, and adjust its movement through sensing, control, and telemetry.",
    tags: ["LASER GUIDANCE", "ROBOTICS", "SYSTEM DESIGN"],
    cameraPosition: [-3, 1, 1],
    target: [0, 0, 0],
    modelRotation: [.4, -.5, 0],
    modelPosition: [.2, -.3, 0],
    modelScale: 1,
  },
  {
    id: "front-array",
    label: "02 Sensor Array",
    title: "Fine Tracking Array",
    description:
      "The front sensor array compares signal strength across multiple receivers to estimate where the reflected laser target is coming from.",
    tags: ["FINE TRACKING", "SIGNAL COMPARISON", "SENSING"],
    cameraPosition: [-3, 1, 1],
    target: [0.6, 0.1, 0.4],
    modelRotation: [0, 0, 0],
    modelPosition: [.2, -.5, .5],
    modelScale: 3,
  },
  {
    id: "rear-baseline",
    label: "03 Sensor Array",
    title: "Coarse Directional Lock",
    description:
      "Four sensors are placed at the corners of the rotor guards to give the drone a rough baseline direction toward the reflected laser target before handing tracking over to the fine front array.",
    tags: ["COARSE TRACKING", "TARGET DIRECTION"],
    cameraPosition: [-1.7, 1.0, 2.8],
    target: [-0.4, 0.1, -0.3],
    modelRotation: [0, 1.1, 0],
    modelPosition: [-.5, -0.1, 0],
    modelScale: 1.5,
  },
  {
    id: "flight-controller",
    label: "04 Control Stack",
    title: "ESP32 to Flight Controller",
    description:
      "A connected ESP32 handles sensor data and telemetry, draws power from the drone battery, and communicates with the flight controller through MSP and Betaflight to send PID-stabilized control signals.",
    tags: ["ESP32", "MSP", "BETAFLIGHT", "PID CONTROL"],
    cameraPosition: [0, -.5, 2.2],
    target: [0, 0.15, 0],
    modelRotation: [0.8, 0.1, 0],
    modelPosition: [0, -0.3, 0],
    modelScale: 1.55,
  },
  {
    id: "rotors",
    label: "05 Rotor",
    title: "Flight Output and Stability",
    description:
      "The rotor system turns control decisions into movement, keeping the drone responsive as it corrects toward the laser target.",
    tags: ["MOTION", "STABILITY", "FLIGHT RESPONSE"],
    cameraPosition: [0.9, 1.5, 2.4],
    target: [0.4, 0.5, 0.2],
    modelRotation: [0.4, -0.4, 0.1],
    modelPosition: [0, -0.25, 0],
    modelScale: 1.5,
  },
  {
    id: "telemetry",
    label: "06 Telemetry",
    title: "Live System Feedback",
    description:
      "Telemetry makes the drone easier to debug by showing lock state, sensor readings, and system behavior while the prototype is being tested.",
    tags: ["TELEMETRY", "DEBUGGING", "VALIDATION"],
    cameraPosition: [0, 0.8, 5.2],
    target: [0, 0, 0],
    modelRotation: [0.2, Math.PI * 2.5, 0],
    modelPosition: [0, -0.2, 0],
    modelScale: 1.5,
  },
];
