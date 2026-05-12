export function ScrollCue({ label = "Scroll" }: { label?: string }) {
  return (
    <div className="scroll-cue" aria-hidden="true">
      <span />
      {label}
    </div>
  );
}
