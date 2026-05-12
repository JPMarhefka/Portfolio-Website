import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="label">{children}</span>;
}
