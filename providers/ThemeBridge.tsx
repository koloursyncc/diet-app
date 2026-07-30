"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useSettings } from "@/providers/SettingsProvider";

/** Keeps next-themes in sync with the theme stored in our own SettingsProvider. */
export function ThemeBridge() {
  const { settings, isHydrated } = useSettings();
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    if (!isHydrated) return;
    if (theme !== settings.theme) {
      setTheme(settings.theme);
    }
    // Only run when our own settings hydrate/change — next-themes' own state is a mirror.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, settings.theme]);

  return null;
}
