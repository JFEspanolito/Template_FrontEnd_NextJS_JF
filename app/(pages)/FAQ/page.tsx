"use client";

import configProject from "@/data/configProject";

export default function FAQ() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      Welcome FAQ {configProject.appName}
    </div>
  );
}
