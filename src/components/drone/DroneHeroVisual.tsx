"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useIsLowPowerDevice } from "@/lib/useIsLowPowerDevice";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

const HomeDroneScene = dynamic(() => import("@/components/home/HomeDroneScene").then((module) => module.HomeDroneScene), {
  ssr: false,
  loading: () => <DroneHeroFallback />,
});

function DroneHeroFallback() {
  return <div className="home-drone-fallback home-drone-fallback--render" aria-hidden="true" />;
}

export function DroneHeroVisual() {
  const [isClientReady, setIsClientReady] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isLowPowerDevice = useIsLowPowerDevice();
  const useStaticVisual = !isClientReady || isLowPowerDevice;

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  if (useStaticVisual) return <DroneHeroFallback />;

  return <HomeDroneScene reducedMotion={prefersReducedMotion} />;
}
