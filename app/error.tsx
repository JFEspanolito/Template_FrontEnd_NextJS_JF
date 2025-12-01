"use client";

import Link from "next/link";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-3xl text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold">Something went wrong</h1>
        <p className="mt-4 text-sm text-neutral">An unexpected error occurred. You can try again or go back home.</p>

        <div className="mt-6 flex justify-center gap-4">
          <button onClick={() => reset()} className="btn">
            Try again
          </button>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
