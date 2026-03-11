"use client";

import configProject from "@/data/configProject";

export default function Contact() {
  return (
    <div
      className="relative flex min-h-screen items-center justify-center font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      Welcome Contact Me {configProject.appName}
    </div>
  );
}
