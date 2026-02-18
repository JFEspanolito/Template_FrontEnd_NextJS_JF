import configProject from "@/data/configProject";

export default function Home() {
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
