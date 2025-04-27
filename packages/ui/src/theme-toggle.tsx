"use client"

import * as React from "react"
import { useTheme } from "./theme-provider"
import { Button } from "./button"
import { cn } from "./lib/utils"

interface ThemeToggleProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: "start" | "center" | "end"
  size?: "sm" | "default" | "lg"
  showLabels?: boolean
}

export function ThemeToggle({
  className,
  align = "center",
  size = "default",
  showLabels = false,
  ...props
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const cycleTheme = React.useCallback(() => {
    if (theme === "light") setTheme("dark")
    else if (theme === "dark") setTheme("system")
    else setTheme("light")
  }, [theme, setTheme])

  const buttonSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "default"
  const iconSize = size === "sm" ? 16 : size === "lg" ? 22 : 18

  if (!mounted) {
    return null // Avoid hydration mismatch
  }

  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Button
        variant="ghost"
        size={buttonSize}
        onClick={cycleTheme}
        className={cn(
          "relative flex items-center justify-center overflow-hidden transition-all duration-200",
          "hover:bg-primary/10 focus-visible:ring-primary/20",
          "rounded-full group",
          align === "start" && "justify-start",
          align === "end" && "justify-end"
        )}
        aria-label={`Current theme: ${theme}. Click to switch theme.`}
      >
        <div className="relative h-[1em] w-[1em]" style={{ fontSize: `${iconSize}px` }}>
          <div
            className={cn(
              "absolute inset-0 transition-all duration-300",
              theme === "light" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90"
            )}
          >
            <SunIcon className="h-full w-full animate-in spin-in-0" />
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-all duration-300",
              theme === "dark" ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-90"
            )}
          >
            <MoonIcon className="h-full w-full animate-in spin-in-0" />
          </div>

          <div
            className={cn(
              "absolute inset-0 transition-all duration-300",
              theme === "system" ? "opacity-100 scale-100" : "opacity-0 scale-50"
            )}
          >
            <SystemIcon className="h-full w-full animate-in fade-in-0" />
          </div>
        </div>

        {showLabels && <span className="ml-2 text-sm capitalize">{theme}</span>}
      </Button>

      {showLabels && (
        <div className="text-xs text-muted-foreground">
          {theme === "light" && "Light"}
          {theme === "dark" && "Dark"}
          {theme === "system" && "System"}
        </div>
      )}
    </div>
  )
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
      <circle cx="12" cy="12" r="5" className="fill-yellow-400/20" />
      <line
        x1="12"
        y1="1"
        x2="12"
        y2="3"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="12"
        y1="21"
        x2="12"
        y2="23"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="4.22"
        y1="4.22"
        x2="5.64"
        y2="5.64"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="18.36"
        y1="18.36"
        x2="19.78"
        y2="19.78"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="1"
        y1="12"
        x2="3"
        y2="12"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="21"
        y1="12"
        x2="23"
        y2="12"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="4.22"
        y1="19.78"
        x2="5.64"
        y2="18.36"
        className="transform origin-center group-hover:animate-pulse"
      />
      <line
        x1="18.36"
        y1="5.64"
        x2="19.78"
        y2="4.22"
        className="transform origin-center group-hover:animate-pulse"
      />
    </svg>
  )
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
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" className="fill-blue-400/20" />
      <circle cx="18" cy="5" r="1" className="fill-current opacity-50 animate-twinkle" />
      <circle cx="14" cy="8" r="0.5" className="fill-current opacity-30 animate-twinkle-delayed" />
      <circle cx="20" cy="10" r="0.75" className="fill-current opacity-40 animate-twinkle" />
    </svg>
  )
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
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" className="fill-gray-400/10" />
      <path d="M8 10 L16 10" strokeDasharray="2,2" className="animate-[dash_3s_linear_infinite]" />
      <path d="M10 7 L14 7" strokeDasharray="3,3" className="animate-[dash_2s_linear_infinite]" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}
