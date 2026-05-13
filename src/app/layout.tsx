import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://jpmarhefka.com"),
  title: {
    default: "JP Marhefka | Portfolio",
    template: "%s",
  },
  description:
    "Portfolio of Joseph-Paul Marhefka, a Santa Clara University student building robotics, embedded systems, full-stack software, and polished technical interfaces.",
  icons: {
    icon: [
      { url: "/icons/site-icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/site-icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/site-icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
