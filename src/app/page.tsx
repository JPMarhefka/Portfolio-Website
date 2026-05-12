import type { Metadata } from "next";
import { AssetPreloader } from "@/components/loading/AssetPreloader";
import { HomeContactCTA } from "@/components/home/HomeContactCTA";
import { HomeSplash } from "@/components/home/HomeSplash";
import { ProjectCardScroller } from "@/components/home/ProjectCardScroller";

export const metadata: Metadata = {
  title: "JP Marhefka | Portfolio",
  description:
    "Portfolio of Joseph-Paul Marhefka, a Santa Clara University student building robotics, embedded systems, full-stack software, and polished technical interfaces.",
};

export default function HomePage() {
  return (
    <AssetPreloader>
      <main>
        <HomeSplash />
        <ProjectCardScroller />
        <HomeContactCTA />
      </main>
    </AssetPreloader>
  );
}
