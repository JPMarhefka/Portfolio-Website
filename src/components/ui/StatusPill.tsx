import type { ReactNode } from "react";

export function StatusPill({
  children,
  tone = "cyan",
}: {
  children: ReactNode;
  tone?: "cyan" | "amber" | "green";
}) {
  return (
    <span className="status-pill" data-tone={tone}>
      {children}
    </span>
  );
}
