import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ThemeBridge } from "@/providers/ThemeBridge";
import { SettingsProvider } from "@/providers/SettingsProvider";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Diet",
  description: "Your day's meal plan, one calm card at a time.",
  applicationName: "Daily Diet",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Daily Diet",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F2" },
    { media: "(prefers-color-scheme: dark)", color: "#14130F" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SettingsProvider>
            <ThemeBridge />
            <ServiceWorkerRegister />
            {children}
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
