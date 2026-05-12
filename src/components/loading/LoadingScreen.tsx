"use client";

const loadingSteps = [
  "INITIALIZING PROJECT LAB",
  "LOADING DRONE MODEL",
  "CALIBRATING TELEMETRY",
  "READY",
];

export function LoadingScreen({ progress }: { progress: number }) {
  const activeIndex = Math.min(loadingSteps.length - 1, Math.floor(progress * loadingSteps.length));

  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-screen__panel">
        <div className="loading-screen__dial" aria-hidden="true">
          <span />
        </div>
        <div>
          <p className="loading-screen__eyebrow">Mission control boot</p>
          <h1>{loadingSteps[activeIndex]}</h1>
        </div>
        <div className="loading-screen__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
        </div>
        <div className="loading-screen__steps">
          {loadingSteps.map((step, index) => (
            <span key={step} data-active={index <= activeIndex}>
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
