"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-60">
      <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-neutral-700/40 rounded-full p-1 h-[38px]">
        <button
          onClick={() => setLanguage("ES")}
          className={`relative px-6 rounded-full text-sm font-medium transition-colors duration-300 h-7 flex items-center justify-center ${
            language === "ES"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {language === "ES" && (
            <motion.div
              layoutId="activeLanguage"
              className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">ES</span>
        </button>

        <button
          onClick={() => setLanguage("EN")}
          className={`relative px-6 rounded-full text-sm font-medium transition-colors duration-300 h-7 flex items-center justify-center ${
            language === "EN"
              ? "text-white"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          {language === "EN" && (
            <motion.div
              layoutId="activeLanguage"
              className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-600 rounded-full"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          <span className="relative z-10">EN</span>
        </button>
      </div>
    </div>
  );
}
