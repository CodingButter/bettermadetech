"use client";

import { ThemeToggle } from "@repo/ui";

export function ThemeToggleHeader() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
  );
}