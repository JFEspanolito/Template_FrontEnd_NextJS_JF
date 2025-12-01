"use client";

import { useRouter } from "next/navigation";
import config from "@/config";

export default function Home() {
  const router = useRouter();

  const handleExperienceClick = () => {
    router.push("/Experience");
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center font-sans dark"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      Welcome to {config.appName}
    </div>
  );
}
