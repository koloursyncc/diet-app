"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/providers/SettingsProvider";
import { ACCENT_PRESETS, DEFAULT_API_URL } from "@/constants/app";
import type { ThemeMode } from "@/types/meal";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export function Settings() {
  const { settings, updateSettings } = useSettings();
  const { setTheme } = useTheme();
  const [apiUrlDraft, setApiUrlDraft] = useState(settings.apiUrl);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) setApiUrlDraft(settings.apiUrl);
  }, [open, settings.apiUrl]);

  const handleSaveApiUrl = () => {
    const trimmed = apiUrlDraft.trim();
    updateSettings({ apiUrl: trimmed.length > 0 ? trimmed : DEFAULT_API_URL });
  };

  const handleThemeChange = (mode: ThemeMode) => {
    updateSettings({ theme: mode });
    setTheme(mode);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open settings"
          className="text-muted-foreground hover:text-ink"
        >
          <SlidersHorizontal className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Personalize how Daily Diet looks and where it reads from.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-8 overflow-y-auto pb-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="api-url">Google Apps Script API URL</Label>
            <Input
              id="api-url"
              value={apiUrlDraft}
              onChange={(e) => setApiUrlDraft(e.target.value)}
              onBlur={handleSaveApiUrl}
              placeholder="https://script.google.com/macros/s/.../exec"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <p className="text-[13px] text-muted-foreground">
              Daily Diet reads your plan directly from this endpoint. Paste a new one to switch sheets.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Accent color</Label>
            <div className="flex flex-wrap gap-3">
              {ACCENT_PRESETS.map((preset) => {
                const isSelected = preset.value.toLowerCase() === settings.accentColor.toLowerCase();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => updateSettings({ accentColor: preset.value })}
                    aria-label={`${preset.label} accent`}
                    aria-pressed={isSelected}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition-transform",
                      isSelected ? "scale-110 border-ink" : "border-transparent hover:scale-105",
                    )}
                    style={{ backgroundColor: preset.value }}
                  />
                );
              })}
              <label className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-dashed border-border text-[10px] text-muted-foreground">
                Custom
                <input
                  type="color"
                  value={settings.accentColor}
                  onChange={(e) => updateSettings({ accentColor: e.target.value })}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Custom accent color"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Appearance</Label>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleThemeChange(option.value)}
                  aria-pressed={settings.theme === option.value}
                  className={cn(
                    "rounded-2xl border border-border px-3 py-2.5 text-sm font-medium transition-colors",
                    settings.theme === option.value
                      ? "border-accent bg-accent/10 text-ink"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
