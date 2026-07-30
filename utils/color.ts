/** Converts a #rrggbb hex string to an "H S% L%" triplet for CSS custom properties. */
export function hexToHslTriplet(hex: string): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  if (Number.isNaN(bigint) || normalized.length !== 6) {
    return "95 20% 38%";
  }

  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      default:
        h = (r - g) / d + 4;
    }
    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

/** Returns "0 0% 100%" (white) or "0 0% 10%" (near-black) for best contrast against a hex bg. */
export function contrastingForegroundHsl(hex: string): string {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized, 16);
  if (Number.isNaN(bigint) || normalized.length !== 6) return "0 0% 100%";

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "30 12% 12%" : "60 30% 97%";
}
