export type Project = {
  id: string;
  title: string;
  status: string;
  tags: string[];
  summary: string;
  cta: string;
  href?: string;
};

export const projects: Project[] = [
  {
    id: "autonomous-laser-guided-drone",
    title: "Autonomous Laser-Tracking Drone Prototype",
    status: "FLAGSHIP PROJECT",
    tags: ["ROBOTICS", "ESP32", "TELEMETRY", "LASER TRACKING", "EMBEDDED C++"],
    summary:
      "A drone prototype that follows a laser target reflected off walls or surfaces, using signal lock, directional sensing, altitude fallback, and live telemetry.",
    cta: "Learn More",
    href: "/work/autonomous-laser-guided-drone",
  },
  {
    id: "deal-scout",
    title: "DibSift",
    status: "CHROME EXTENSION",
    tags: ["CHROME EXTENSION", "MARKETPLACE TOOL", "AI RANKING", "BUYER WORKFLOW"],
    summary:
      "A Chrome extension for collecting Facebook Marketplace listings, organizing product details, comparing options, and generating AI-powered buying recommendations.",
    cta: "Learn More",
    href: "/work/dibsift",
  },
  {
    id: "mechatronics-robot",
    title: "Mechatronics Robot",
    status: "Coming soon",
    tags: ["Arduino", "PID", "Sensors", "Competition"],
    summary:
      "A competition robot project involving line following, sensor logic, servo control, and state-based behavior.",
    cta: "Page coming soon",
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    status: "In progress",
    tags: ["Next.js", "3D", "Motion", "Storytelling"],
    summary:
      "This site, rebuilt as a cinematic engineering portfolio with scroll-driven storytelling and optimized 3D presentation.",
    cta: "Page coming soon",
  },
];
