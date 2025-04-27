import { type JSX } from "react";
import { cn } from "./lib/utils";

export function Code({
  children,
  className,
  variant = "inline",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "inline" | "block";
}): JSX.Element {
  return (
    <code 
      className={cn(
        "font-mono text-sm",
        variant === "inline" && "bg-muted px-1.5 py-0.5 rounded-md",
        variant === "block" && "block bg-muted/50 p-4 rounded-lg overflow-x-auto",
        className
      )}
    >
      {children}
    </code>
  );
}
