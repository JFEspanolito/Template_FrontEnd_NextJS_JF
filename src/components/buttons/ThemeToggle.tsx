"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  const themes = [
    { value: "light", icon: Sun, label: "Claro" },
    { value: "dark", icon: Moon, label: "Oscuro" },
    { value: "system", icon: Monitor, label: "Sistema" },
  ];

  // resolvedTheme is the actual applied theme (light/dark) when `theme` === 'system'
  const applied = resolvedTheme ?? theme;

  return (
    <div
      className="flex gap-2 items-center p-1 rounded-lg"
      style={{ backgroundColor: "var(--btn-secondary)" }}
    >
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = value === "system" ? theme === "system" : applied === value;

        const baseStyle: React.CSSProperties = {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem",
          borderRadius: "0.375rem",
          transition: "background-color 0.15s ease, color 0.15s ease",
          border: "1px solid transparent",
        };

        const activeStyle: React.CSSProperties = {
          backgroundColor: "var(--btn-primary)",
          color: "var(--btn-text-primary)",
          boxShadow: "var(--shadow-soft)",
        };

        const inactiveStyle: React.CSSProperties = {
          backgroundColor: "transparent",
          color: "var(--btn-text-secondary)",
        };

        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            title={label}
            style={{ ...baseStyle, ...(isActive ? activeStyle : inactiveStyle) }}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}
