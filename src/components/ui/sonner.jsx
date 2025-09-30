"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

const Toaster = ({ ...props }) => {
  const { theme } = useTheme()

  // fallback to 'system' if theme is undefined
  const activeTheme = theme || "system"

  return (
    <Sonner
      theme={activeTheme}
      className="toaster group"
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  )
}

export { Toaster }
