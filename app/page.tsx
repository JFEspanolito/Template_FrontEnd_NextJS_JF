"use client";

import { useRouter } from "next/navigation";
import configProject from "@/data/configProject";

export default function Home() {
  const router = useRouter();

  const handleExperienceClick = () => {
    router.push("/Experience");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      Welcome to {configProject.appName}

    </div>

  );
}
