"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_ACCENT_COLOR, DEFAULT_API_URL, STORAGE_KEYS } from "@/constants/app";
import { contrastingForegroundHsl, hexToHslTriplet } from "@/utils/color";
import type { AppSettings, ThemeMode } from "@/types/meal";

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  isHydrated: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  apiUrl: DEFAULT_API_URL,
  accentColor: DEFAULT_ACCENT_COLOR,
  theme: "system",
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStoredSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      apiUrl: parsed.apiUrl?.trim() || DEFAULT_SETTINGS.apiUrl,
      accentColor: parsed.accentColor || DEFAULT_SETTINGS.accentColor,
      theme: (parsed.theme as ThemeMode) || DEFAULT_SETTINGS.theme,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSettings(readStoredSettings());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
  }, [settings, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.style.setProperty("--accent", hexToHslTriplet(settings.accentColor));
    document.documentElement.style.setProperty(
      "--accent-foreground",
      contrastingForegroundHsl(settings.accentColor),
    );
  }, [settings.accentColor, isHydrated]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const value = useMemo(
    () => ({ settings, updateSettings, isHydrated }),
    [settings, updateSettings, isHydrated],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within a SettingsProvider");
  return ctx;
}
