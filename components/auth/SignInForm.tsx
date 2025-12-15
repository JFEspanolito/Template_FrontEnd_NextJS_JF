"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export function SignInForm({ open = true, onClose }: Props) {
  const [message, setMessage] = useState<string | null>(null);

  // Email/password (template mode)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  if (!open) return null;

  const handleProviderSignIn = async (providerId: string) => {
    setMessage(null);
    try {
      const result = await signIn(providerId, {
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        console.error(`[DEV] OAuth Error (${providerId}):`, result?.error || "Authentication failed");
        console.warn(`[DEV] Missing env vars: ${providerId.toUpperCase()}_ID and ${providerId.toUpperCase()}_SECRET`);
        
        toast.error("Configuración Enviroment Incompleta. Favor de Validar.", {
          duration: 4000,
          position: "bottom-center",
        });
        return;
      }

      if (result?.ok && result?.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error(`[DEV] Sign-in exception (${providerId}):`, error);
      toast.error("Error al intentar iniciar sesión. Intenta nuevamente.", {
        duration: 3000,
        position: "bottom-center",
      });
    }
  };

  const emailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setEmailError(false);
    setPasswordError(false);

    let hasError = false;

    if (!email.trim()) {
      setEmailError(true);
      hasError = true;
    }

    if (!password) {
      setPasswordError(true);
      hasError = true;
    }

    if (hasError) {
      setMessage("Please enter email and password.");
      return;
    }

    setEmailBusy(true);
    try {
      // Template-only behavior (no DB, no real auth)
      await new Promise((r) => setTimeout(r, 400));
      setMessage(`Email/Password sign-in is running in template mode. Received: ${email.trim()}`);
      // Optionally close modal on "success"
      // onClose?.();
    } finally {
      setEmailBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={() => onClose?.()} />

      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md mx-4 bg-[var(--bg-2)] text-[var(--foreground)] rounded-lg shadow-lg ring-1 ring-neutral/10 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral/10">
          <h3 className="text-lg font-semibold">Sign in</h3>
          <button
            aria-label="Close sign in"
            onClick={() => onClose?.()}
            className="btn btn-primary inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral/5"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral">Sign in with email/password or one of the following providers:</p>

          {/* Email/Password */}
          <form onSubmit={emailPasswordSignIn} className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full rounded-md border ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-neutral/10 focus:ring-neutral/20"
                } bg-transparent px-3 py-2 text-sm outline-none focus:ring-2`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                autoComplete="email"
                placeholder="email@providermail.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className={`w-full rounded-md border ${
                  passwordError ? "border-red-500 focus:ring-red-500" : "border-neutral/10 focus:ring-neutral/20"
                } bg-transparent px-3 py-2 text-sm outline-none focus:ring-2`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false);
                }}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={emailBusy}>
              {emailBusy ? "Signing in..." : "Continue with Email"}
            </button>
          </form>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-neutral/10" />
            <div className="text-xs text-neutral">OR</div>
            <div className="h-px flex-1 bg-neutral/10" />
          </div>

          {/* Social providers */}
          <div className="flex flex-col gap-3">
            {[
              { id: "google", name: "Google" },
              { id: "github", name: "GitHub" },
              { id: "linkedin", name: "LinkedIn" },
              { id: "facebook", name: "Facebook" },
            ].map((p) => (
              <button key={p.id} className="btn btn-outline btn-primary w-full" onClick={() => handleProviderSignIn(p.id)} type="button">
                Continue with {p.name}
              </button>
            ))}
          </div>

          {message && (
            <div className={`text-sm pt-2 px-3 py-2 rounded-md ${
              emailError || passwordError 
                ? "bg-red-500/10 text-white-500 border border-red-500/20" 
                : "text-neutral"
            }`}>
              {message}
            </div>
          )}

          <div className="pt-2 text-xs text-neutral">By signing in you agree to the terms and privacy of the site.</div>
        </div>
      </div>
    </div>
  );
}

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
