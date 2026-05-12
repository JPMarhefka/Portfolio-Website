import type { Metadata } from "next";
import { DibsiftDemo } from "@/components/dibsift/DibsiftDemo";

export const metadata: Metadata = {
  title: "DibSift | Joseph-Paul Marhefka",
  description:
    "An interactive portfolio demo of DibSift, a Chrome extension for saving, comparing, and AI-ranking Facebook Marketplace listings.",
};

export default function DibsiftProjectPage() {
  return (
    <main>
      <DibsiftDemo />
    </main>
  );
}
