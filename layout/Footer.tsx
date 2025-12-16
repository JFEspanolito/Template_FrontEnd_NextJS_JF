"use client";

import Link from "next/link";
import Image from "next/image";
import configProject from "@/data/configProject";
import { SocialDock } from "./SocialDock";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const year = new Date().getFullYear();
  const supportEmail = configProject?.support?.email || null;
  const { t } = useLanguage();


  return (
    <footer
      className="relative flex items-center justify-center font-sans"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="w-full max-w-3xl mx-auto px-8 py-24">
        <div className="flex lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
          {/* Brand */}
          <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
            <Link href="/" aria-current="page" className="flex gap-2 justify-center md:justify-start items-center">
              <Image src="/favicon.ico" alt={`${configProject.appName} logo`} priority className="w-6 h-6" width={24} height={24} />
              <strong className="font-extrabold tracking-tight text-base md:text-lg">{configProject.appName}</strong>
            </Link>

            {configProject.appDescription && <p className="mt-3 text-sm text-base-content/80">{configProject.appDescription}</p>}

            <p>{t("SendMail")} <a href={`mailto:${supportEmail}`} className="text-primary hover:underline">{supportEmail}</a></p>

            <p className="mt-3 text-sm text-base-content/60">Copyright © {year} — {t("Copyright")}</p>
          </div>

          {/* Columns */}
          <div className="flex-grow flex flex-wrap justify-center -mb-10 md:mt-0 mt-10 text-center">
            {/* Links */}
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">LINKS</div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm">
                <SocialDock mode="vinline" />
              </div>
            </div>

            {/* Legal */}
            <div className="lg:w-1/3 md:w-1/2 w-full px-4">
              <div className="footer-title font-semibold text-base-content tracking-widest text-sm md:text-left mb-3">LEGAL</div>

              <div className="flex flex-col justify-center items-center md:items-start gap-2 mb-10 text-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
