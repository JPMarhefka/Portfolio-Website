import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function DiagnosticCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("diagnostic-card", className)}>{children}</div>;
}
