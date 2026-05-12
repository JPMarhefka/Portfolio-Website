import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";

const media = [
  {
    src: "/images/drone/drone-render-front-01.png",
    alt: "Front left view of drone with blank background",
    label: "Front Left",
  },
  {
    src: "/images/drone/drone-render-front-02.png",
    alt: "Front right view of drone with blank background",
    label: "Front Right",
  },
  {
    src: "/images/drone/drone-bench-photo-01.webp",
    alt: "Placeholder bench photo for drone subsystem validation",
    label: "Bench photo",
  },
  {
    src: "/images/drone/telemetry-placeholder.webp",
    alt: "Placeholder telemetry interface screenshot",
    label: "Telemetry UI",
  },
];

export function DroneMediaGallery() {
  return (
    <section className="section media-gallery" aria-labelledby="media-title">
      <Container>
        <SectionLabel>Renderings and validation media</SectionLabel>
        <h2 id="media-title" className="section-heading">
          Still images can document the physical build after the 3D walkthrough.
        </h2>
        <div className="media-gallery__grid">
          {media.map((item) => (
            <figure className="media-tile" key={item.src}>
              <Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 92vw, 46vw" />
              <figcaption>{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
