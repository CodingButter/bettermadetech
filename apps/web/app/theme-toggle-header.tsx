"use client";

import React from "react";
import { ThemeToggle } from "@repo/ui";

export const ThemeToggleHeader: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle />
    </div>
  );
}