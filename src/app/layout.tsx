import "@/styles/globals.css";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { Toaster } from "react-hot-toast";
import { Footer } from "@/layout/Footer";
import { Header } from "@/layout/Header";
import AnalyticsBanner from "@/components/layout/Analytics";
import { LanguageProvider } from "@/i18n/LanguageContext";
import ThemeProviderWrapper from "@/components/layout/ThemeProvider";
import Oneko from "@/components/ui/oneko";
import { getSEOTags } from "@/libs/seo";

export const metadata = getSEOTags();

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
      <body suppressHydrationWarning className={`antialiased bg-[var(--background)] text-[var(--foreground)]`}>
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
