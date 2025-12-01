"use client";

import { useState } from "react";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export function SignInForm({ open = true, onClose }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  if (!open) return null;

  const placeholderClick = (id: string, name: string) => {
    // Show an inline message instead of attempting real sign-in
    setMessage(
      `${name} is a template button (not configured). Add ${id.toUpperCase()}_ID and ${id.toUpperCase()}_SECRET to enable.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden
        onClick={() => onClose?.()}
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md mx-4 bg-[var(--background)] text-[var(--foreground)] rounded-lg shadow-lg ring-1 ring-neutral/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral/10">
          <h3 className="text-lg font-semibold">Sign in</h3>
          <button
            aria-label="Close sign in"
            onClick={() => onClose?.()}
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral/5"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral">
            Sign in with one of the following providers:
          </p>

          <div className="flex flex-col gap-3">
            {[
              { id: "google", name: "Google" },
              { id: "github", name: "GitHub" },
              { id: "linkedin", name: "LinkedIn" },
              { id: "facebook", name: "Facebook" },
            ].map((p) => (
              <button
                key={p.id}
                className="btn btn-outline w-full"
                onClick={() => placeholderClick(p.id, p.name)}
              >
                Continue with {p.name}
              </button>
            ))}

            {message && (
              <div className="text-sm text-neutral pt-2">{message}</div>
            )}
          </div>

          <div className="pt-2 text-xs text-neutral">
            By signing in you agree to the terms and privacy of the site.
          </div>
        </div>
      </div>
    </div>
  );
}

// Small convenience component: a button that opens the modal
export function SignInModalButton({ label = "Sign in" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        {label}
      </button>
      <SignInForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default SignInForm;
