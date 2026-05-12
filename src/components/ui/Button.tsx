import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  href?: string;
  disabled?: boolean;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({
  children,
  variant = "secondary",
  href,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const classes = cn(
    "button",
    variant === "primary" && "button--primary",
    disabled && "button--disabled",
    className,
  );

  if (href && !disabled) {
    if (href.startsWith("/")) {
      return (
        <Link className={classes} href={href}>
          {children}
        </Link>
      );
    }

    return (
      <a className={classes} href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
