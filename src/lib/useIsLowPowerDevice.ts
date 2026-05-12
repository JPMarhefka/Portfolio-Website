"use client";

import { useSyncExternalStore } from "react";

type NavigatorWithMemory = Navigator & {
  deviceMemory?: number;
};

export function useIsLowPowerDevice() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("resize", onStoreChange);
      const pointerQuery = window.matchMedia("(pointer: coarse)");
      const screenQuery = window.matchMedia("(max-width: 720px)");
      pointerQuery.addEventListener("change", onStoreChange);
      screenQuery.addEventListener("change", onStoreChange);

      return () => {
        window.removeEventListener("resize", onStoreChange);
        pointerQuery.removeEventListener("change", onStoreChange);
        screenQuery.removeEventListener("change", onStoreChange);
      };
    },
    () => {
      const navigatorWithMemory = navigator as NavigatorWithMemory;
      const hasVeryLowMemory =
        typeof navigatorWithMemory.deviceMemory === "number" &&
        navigatorWithMemory.deviceMemory <= 2;
      const hasSmallScreen = window.matchMedia("(max-width: 720px)").matches;
      const hasCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

      return Boolean(hasSmallScreen && (hasCoarsePointer || hasVeryLowMemory));
    },
    () => false,
  );
}
