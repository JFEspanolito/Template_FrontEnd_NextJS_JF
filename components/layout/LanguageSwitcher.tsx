"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-[var(--bg-1)] border border-[var(--border)] rounded-lg p-1 h-10">
      <button
        onClick={() => setLanguage("ES")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 h-8 flex items-center justify-center ${
          language === "ES"
            ? "bg-[var(--btn-primary)] text-[var(--btn-text-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-2)]"
        }`}
        aria-label="Cambiar a Español"
      >
        ES
      </button>

      <button
        onClick={() => setLanguage("EN")}
        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 h-8 flex items-center justify-center ${
          language === "EN"
            ? "bg-[var(--btn-primary)] text-[var(--btn-text-primary)] shadow-sm"
            : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-2)]"
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
}
