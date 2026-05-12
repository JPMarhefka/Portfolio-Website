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
    title: "Autonomous Laser Guided Drone",
    status: "Flagship case study",
    tags: ["Robotics", "Embedded", "Telemetry", "3D"],
    summary:
      "An IR beacon tracking drone prototype built around lock confirmation, coarse-to-fine sensing, altitude fallback, and telemetry-first observability.",
    cta: "Open case study",
    href: "/work/autonomous-laser-guided-drone",
  },
  {
    id: "deal-scout",
    title: "DibSift",
    status: "Interactive demo",
    tags: ["Chrome Extension", "Marketplace Tools", "AI Ranking"],
    summary:
      "A Chrome extension for saving Facebook Marketplace listings, comparing messy product details, and turning selected items into offer-ready AI buying advice.",
    cta: "Open demo",
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
