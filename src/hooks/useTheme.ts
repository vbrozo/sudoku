import { useEffect, useState } from "react";

export type ThemeMode = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "sudoku-theme";

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  } catch {
    return "system";
  }
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}

const NEXT_MODE: Record<ThemeMode, ThemeMode> = {
  system: "light",
  light: "dark",
  dark: "system",
};

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(readStoredMode);
  const resolvedTheme = resolveTheme(mode);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore — storage may be unavailable
    }
  }, [mode]);

  // Follow system changes live while in "system" mode.
  useEffect(() => {
    if (mode !== "system" || !window.matchMedia) return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      document.documentElement.setAttribute("data-theme", getSystemTheme());
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [mode]);

  function cycleMode() {
    setMode((prev) => NEXT_MODE[prev]);
  }

  return { mode, resolvedTheme, cycleMode };
}
