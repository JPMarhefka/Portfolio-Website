import type { Metadata } from "next";
import { DroneMediaGallery } from "@/components/drone/DroneMediaGallery";
import { DroneNextSteps } from "@/components/drone/DroneNextSteps";
import { DroneProjectHero } from "@/components/drone/DroneProjectHero";
import { DroneScrollExperience } from "@/components/drone/DroneScrollExperience";
import { DroneSystemSection } from "@/components/drone/DroneSystemSection";
import { DroneTelemetrySection } from "@/components/drone/DroneTelemetrySection";

export const metadata: Metadata = {
  title: "Autonomous Laser Guided Drone | Joseph-Paul Marhefka",
  description:
    "A flagship robotics case study for an IR beacon tracking drone prototype using ESP32, 38 kHz IR sensing, lock confirmation, coarse-to-fine tracking, altitude fallback, and TCP telemetry.",
};

export default function DroneProjectPage() {
  return (
    <main>
      <DroneProjectHero />
      <DroneScrollExperience />
      <DroneSystemSection />
      <DroneTelemetrySection />
      <DroneMediaGallery />
      <DroneNextSteps />
    </main>
  );
}
