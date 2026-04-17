"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";
import { btn } from "@/components/buttons/buttonStyles";
import { createClient } from "@/libs/supabase/client";

type OAuthProvider = "google" | "github" | "linkedin" | "facebook";

type Props = {
  open?: boolean;
  onClose?: () => void;
};

export function SignInForm({ open = true, onClose }: Props) {
  const { t } = useLanguage();
  const [message, setMessage] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  if (!open) return null;

  const handleProviderSignIn = async (provider: OAuthProvider) => {
    setMessage(null);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error(`[DEV] OAuth Error (${provider}):`, error.message);
        toast.error(t("errorSigningIn"), { duration: 3000, position: "bottom-center" });
      }
    } catch (error) {
      console.error(`[DEV] Sign-in exception (${provider}):`, (error as Error)?.message || String(error));
      toast.error(t("errorSigningIn"), { duration: 3000, position: "bottom-center" });
    }
  };

  const emailPasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsErrorMessage(false);
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
      setIsErrorMessage(true);
      setMessage(t("pleaseEnterEmailPassword"));
      return;
    }

    setEmailBusy(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setIsErrorMessage(true);
        setMessage(error.message);
        return;
      }

      onClose?.();
      window.location.href = "/dashboard";
    } catch (error) {
      setIsErrorMessage(true);
      setMessage(t("errorSigningIn"));
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
        className="relative w-full max-w-md mx-4 bg-[var(--bg-2)] text-[var(--foreground)] rounded-lg shadow-lg ring-1 ring-[var(--border-dim)] overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-dim)]">
          <h3 className="text-lg font-semibold">{t("signIn")}</h3>
          <button
            aria-label="Close sign in"
            onClick={() => onClose?.()}
            className={`${btn("primary")} inline-flex items-center justify-center rounded-md p-2 hover:bg-black/5 dark:hover:bg-white/5`}
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[var(--text)]">{t("signInDescription")}</p>

          {/* Email/Password */}
          <form onSubmit={emailPasswordSignIn} className="space-y-3">
            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="email">
                {t("email")}
              </label>
              <input
                id="email"
                type="email"
                className={`w-full rounded-md border ${
                  emailError ? "border-red-500 focus:ring-red-500" : "border-[var(--border-dim)] focus:ring-[var(--border-highlight)]"
                } bg-transparent px-3 py-2 text-sm outline-none focus:ring-2`}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false);
                }}
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm" htmlFor="password">
                {t("password")}
              </label>
              <input
                id="password"
                type="password"
                className={`w-full rounded-md border ${
                  passwordError ? "border-red-500 focus:ring-red-500" : "border-[var(--border-dim)] focus:ring-[var(--border-highlight)]"
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

            <button type="submit" className={`${btn("primary")} w-full`} disabled={emailBusy}>
              {emailBusy ? t("signingIn") : t("continueWithEmail")}
            </button>
          </form>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-[var(--border-dim)]" />
            <div className="text-xs text-[var(--text-muted)]">{t("or")}</div>
            <div className="h-px flex-1 bg-[var(--border-dim)]" />
          </div>

          {/* Social providers */}
          <div className="flex flex-col gap-3">
            {(
              [
                { id: "google", name: "Google" },
                { id: "github", name: "GitHub" },
                { id: "linkedin", name: "LinkedIn" },
                { id: "facebook", name: "Facebook" },
              ] as { id: OAuthProvider; name: string }[]
            ).map((p) => (
              <button
                key={p.id}
                className={`${btn("outline")} w-full`}
                onClick={() => handleProviderSignIn(p.id)}
                type="button"
              >
                {t("continueWith")} {p.name}
              </button>
            ))}
          </div>

          {message && (
            <div
              className={`text-sm pt-2 px-3 py-2 rounded-md ${
                emailError || passwordError || isErrorMessage
                  ? "bg-red-500/10 text-white-500 border border-red-500/20"
                  : "text-[var(--text-muted)]"
              }`}
            >
              {message}
            </div>
          )}

          <div className="pt-2 text-xs text-[var(--text-muted)]">{t("bySigningInAgree")}</div>
        </div>
      </div>
    </div>
  );
}

export function SignInModalButton({ label = "Sign in" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={btn("primary")} onClick={() => setOpen(true)}>
        {label}
      </button>
      <SignInForm open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export default SignInForm;
