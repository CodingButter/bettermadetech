"use client";

import * as React from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./button";
import { cn } from "./lib/utils";

interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end";
  size?: "sm" | "default" | "lg";
}

export function ThemeToggle({ 
  className, 
  align = "center",
  size = "default",
  ...props 
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = React.useCallback(() => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  }, [theme, setTheme]);

  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18;
  
  return (
    <div className={cn("flex", className)} {...props}>
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={toggleTheme}
        className={cn(
          "flex items-center justify-center",
          align === "start" && "justify-start",
          align === "end" && "justify-end"
        )}
      >
        {theme === "light" && (
          <SunIcon className="h-[1em] w-[1em]" style={{ fontSize: `${iconSize}px` }} />
        )}
        {theme === "dark" && (
          <MoonIcon className="h-[1em] w-[1em]" style={{ fontSize: `${iconSize}px` }} />
        )}
        {theme === "system" && (
          <SystemIcon className="h-[1em] w-[1em]" style={{ fontSize: `${iconSize}px` }} />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SystemIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}