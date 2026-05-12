import type { DroneHotspot } from "@/data/droneHotspots";

export function DroneInspectionCard({
  hotspot,
  isActive,
}: {
  hotspot: DroneHotspot;
  isActive: boolean;
}) {
  return (
    <article className="inspection-card diagnostic-card" data-active={isActive}>
      <span className="inspection-card__label">{hotspot.label}</span>
      <h3>{hotspot.title}</h3>
      <p>{hotspot.description}</p>
      <div className="inspection-card__tags">
        <span>Scroll linked</span>
        <span>Editable hotspot</span>
      </div>
    </article>
  );
}
