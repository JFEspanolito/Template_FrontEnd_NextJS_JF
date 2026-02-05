"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    clarity?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID ?? "";

function getConsent(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|; )eb_consent=([^;]*)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function writeConsentCookie(val: string) {
  if (typeof document === "undefined") return;
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);
  document.cookie = `eb_consent=${encodeURIComponent(val)}; expires=${d.toUTCString()}; path=/; samesite=lax`;
}

function dntEnabled() {
  if (typeof navigator === "undefined") return false;
  return (
    navigator.doNotTrack === "1" ||
    (window as any)?.doNotTrack === "1" ||
    (navigator as any).msDoNotTrack === "1"
  );
}

export default function AnalyticsBanner() {
  const [isClient, setIsClient] = useState(false);
  const [consent, setConsentState] = useState<string>("");

  useEffect(() => {
    setIsClient(true);
    setConsentState(getConsent());
  }, []);

  const accept = useCallback(() => {
    writeConsentCookie("accepted");
    setConsentState("accepted");

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
      });
    }

    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("consent", true);
    }
  }, []);

  const decline = useCallback(() => {
    writeConsentCookie("denied");
    setConsentState("denied");

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied",
      });
    }

    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("consent", false);
    }
  }, []);

  const shouldLoadScripts = consent === "accepted" && !dntEnabled();
  const shouldShowBanner = isClient && consent === "" && !dntEnabled();

  return (
    <>
      {shouldLoadScripts && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('consent', 'default', {
                ad_storage: 'denied',
                analytics_storage: 'denied'
              });
              gtag('config', '${GA_ID}');
            `}
          </Script>
          {consent === "accepted" && (
            <Script id="ga-consent-grant" strategy="afterInteractive">
              {`
                if (window.gtag) {
                  window.gtag('consent', 'update', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted'
                  });
                }
              `}
            </Script>
          )}
        </>
      )}

      {shouldLoadScripts && CLARITY_ID && (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      )}

      <SpeedInsights />

      {shouldShowBanner && (
        <div
          className="fixed inset-x-0 bottom-0"
          style={{
            zIndex: 1000,
            background: "var(--color-surface-1)",
            color: "var(--color-text)",
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3 p-3">
            <span className="text-sm">Usamos cookies para analitica (GA/Clarity). Aceptas?</span>
            <div className="flex gap-2">
              <button onClick={accept} className="btn btn-primary" aria-label="Aceptar cookies de analitica">
                Aceptar
              </button>
              <button onClick={decline} className="btn btn-tertiary" aria-label="Rechazar cookies de analitica">
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

      <script
        dangerouslySetInnerHTML={{
          __html: `(function () { try { console.clear(); } catch (e) {} })();`,
        }}
      />
    </>
  );
}
