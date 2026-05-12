"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function AssetPreloader({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const startedAt = performance.now();

    const poster = new Image();
    poster.src = "/images/drone/drone-poster.webp";

    const staticRender = new Image();
    staticRender.src = "/images/drone/drone-render-front-01.png";

    const interval = window.setInterval(() => {
      setProgress((current) => Math.min(current + 0.14, 0.86));
    }, 90);

    Promise.allSettled([
      new Promise((resolve) => {
        poster.onload = resolve;
        poster.onerror = resolve;
      }),
      new Promise((resolve) => {
        staticRender.onload = resolve;
        staticRender.onerror = resolve;
      }),
    ]).finally(() => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, 820 - elapsed);
      window.setTimeout(() => {
        if (!isMounted) return;
        window.clearInterval(interval);
        setProgress(1);
        window.setTimeout(() => setIsVisible(false), 230);
      }, remaining);
    });

    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      {isVisible ? <LoadingScreen progress={progress} /> : null}
      {children}
    </>
  );
}
