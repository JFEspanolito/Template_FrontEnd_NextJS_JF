import config from "@/data/configProject";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import AnalyticsBanner from "@/layout/Analytics";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ThemeProviderWrapper from "@/components/ui/ThemeProvider";
import Oneko from "@/components/ui/oneko";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: config.appName,
  description: config.appDescription,
  keywords: config.keywords,
  authors: [{ name: config.author }],
  creator: config.author,
  publisher: config.author,
  robots: "index, follow",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: config.appName + " " + config.author,
    description: config.appDescription,
    url: config.siteUrl,
    type: "website",
    locale: config.language?.replace("-", "_") ?? "es_MX",
    siteName: config.appName,
    images: [
      {
        url: "/og/og-default.webp",
        width: 1200,
        height: 630,
        alt: `${config.appName} – OpenGraph`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: config.twitter ?? "@Espanolito",
    creator: config.twitter ?? "@Espanolito",
    title: config.appName,
    description: config.appDescription,
    images: ["/og/twitter-card.webp"],
  },
  alternates: {
    languages: {
      "es-MX": config.siteUrl,
      "en-US": `${config.siteUrl}/en`,
    },
  },
  metadataBase: new URL(config.siteUrl),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const languageCookie = cookieStore.get("language")?.value;
  const initialLanguage = languageCookie === "EN" ? "EN" : "ES";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <ThemeProviderWrapper>
          <LanguageProvider initialLanguage={initialLanguage}>
            {/* Toast notifications (react-hot-toast) */}
            <Toaster position="bottom-center" />

            <Oneko />

            {/* Header — wrapped in Suspense because it uses useSearchParams */}
            <Suspense fallback={null}>
              <Header />
            </Suspense>

            {/* Page content */}
            <main className="min-h-[calc(100vh-8rem)]">{children}</main>

            {/* Footer */}
            <Footer />

            {/* Analytics & cookie consent banner */}
            <AnalyticsBanner />
          </LanguageProvider>
        </ThemeProviderWrapper>
      </body>
    </html>
  );
}
