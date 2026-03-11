import Link from "next/link";
import { btn } from "@/components/buttons/buttonStyles";

export default function NotFound() {
  return (
    <main
      className="min-h-[calc(100vh-64px)] flex items-center justify-center"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-3xl text-center px-4">
        <div className="inline-flex items-center gap-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold">404</h1>
          <div className="h-10 border-l border-[var(--border-dim)]" aria-hidden />
          <p className="text-lg sm:text-xl">This page could not be found.</p>
        </div>

        <p className="mt-6 text-sm text-[var(--text-muted)]">Try returning to the homepage or check the URL.</p>

        <div className="mt-6">
          <Link href="/" className={btn("primary")}>
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
