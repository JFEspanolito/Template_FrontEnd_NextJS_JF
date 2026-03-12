"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import config from "@/data/configProject";
import { SignInModalButton } from "@/components/auth/SignInForm";
import ThemeToggle from "@/components/buttons/ThemeToggle";
import { LanguageSwitcher } from "@/components/buttons/LanguageSwitcher";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/libs/utils";

type NavChild = {
  href: string;
  label: string;
};

type NavItem = {
  label: string;
  href?: string;
  childrens?: NavChild[];
};

export function Header() {
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdownLabel, setOpenDropdownLabel] = useState<string | null>(null);
  const [hoveredDropdownLabel, setHoveredDropdownLabel] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const navRef = useRef<HTMLElement | null>(null);

  const links: NavItem[] = Object.values(config.navigation[language]).map((item) => ({
    label: item.label,
    href: item.href,
    childrens: item.submenu,
  }));

  useEffect(() => {
    setIsOpen(false);
    setOpenDropdownLabel(null);
  }, [searchParams]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setOpenDropdownLabel(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const toggleDropdown = (label: string) => {
    setOpenDropdownLabel((current) => (current === label ? null : label));
  };

  return (
    <header
      className="sticky top-0 z-50 flex w-full items-center justify-center font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <nav ref={navRef} className="container mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link className="flex items-center gap-2" href="/" title={`${config.appName} homepage`}>
            <Image src="/PageCover/favicon.ico" alt={`${config.appName} logo`} className="w-8" priority width={32} height={32} />
            <span className="whitespace-nowrap text-lg font-extrabold">{config.appName}</span>
          </Link>
        </div>

        <div className="flex lg:hidden">
          <button type="button" className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5" onClick={() => setIsOpen(true)}>
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-[var(--color-foreground)]"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-12">
          {links.map((link) => {
            if (link.href) {
              return (
                <Link href={link.href} key={link.href} className="nav-link hover:opacity-80" title={link.label}>
                  {link.label}
                </Link>
              );
            }

            if (link.childrens?.length) {
              const isDropdownOpen = openDropdownLabel === link.label || hoveredDropdownLabel === link.label;

              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => setHoveredDropdownLabel(link.label)}
                  onMouseLeave={() => setHoveredDropdownLabel((current) => (current === link.label ? null : current))}
                >
                  <button
                    type="button"
                    className="nav-link hover:opacity-80 inline-flex items-center gap-2"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="menu"
                    onClick={() => toggleDropdown(link.label)}
                  >
                    <span>{link.label}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")}
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 min-w-52 -translate-x-1/2 pt-3 transition-all duration-150",
                      isDropdownOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0",
                    )}
                    role="menu"
                    aria-label={link.label}
                  >
                    <div className="flex flex-col gap-1 rounded-2xl border border-[var(--border-dim)] bg-[var(--background)] p-2 shadow-xl">
                      {link.childrens.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="rounded-xl px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                          title={child.label}
                          onClick={() => setOpenDropdownLabel(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex lg:flex-1 lg:justify-end">
          <div className="flex h-10 items-center">
            <SignInModalButton label={t("logIn")} />
          </div>
          <div className="flex h-10 items-center">
            <LanguageSwitcher />
          </div>
          <div className="flex h-10 items-center">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className={`relative z-50 ${isOpen ? "" : "hidden"}`}>
        <div
          className="fixed inset-y-0 right-0 z-10 w-full origin-right overflow-y-auto px-8 py-4 transition ease-in-out sm:max-w-sm sm:ring-1 sm:ring-[var(--border-dim)]"
          style={{
            backgroundColor: "var(--background)",
            color: "var(--foreground)",
          }}
        >
          <div className="flex items-center justify-between">
            <Link className="flex shrink-0 items-center gap-2" title={`${config.appName} homepage`} href="/">
              <Image src="/PageCover/favicon.ico" alt={`${config.appName} logo`} className="w-8" priority width={32} height={32} />
              <span className="text-lg font-extrabold">{config.appName}</span>
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5" onClick={() => setIsOpen(false)}>
              <span className="sr-only">Close menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="py-4">
              <div className="flex flex-col items-start gap-y-4">
                {links.map((link) => {
                  if (link.href) {
                    return (
                      <Link
                        href={link.href}
                        key={link.href}
                        className="nav-link hover:opacity-80"
                        title={link.label}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    );
                  }

                  if (link.childrens?.length) {
                    const isDropdownOpen = openDropdownLabel === link.label;

                    return (
                      <div key={link.label} className="w-full">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-left"
                          aria-expanded={isDropdownOpen}
                          onClick={() => toggleDropdown(link.label)}
                        >
                          <span className="nav-link hover:opacity-80">{link.label}</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className={cn("h-4 w-4 transition-transform", isDropdownOpen && "rotate-180")}
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>

                        {isDropdownOpen && (
                          <div className="mt-2 flex flex-col gap-2 pl-4">
                            {link.childrens.map((child) => (
                              <Link
                                href={child.href}
                                key={child.href}
                                className="rounded-xl px-3 py-2 text-sm transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                title={child.label}
                                onClick={() => {
                                  setOpenDropdownLabel(null);
                                  setIsOpen(false);
                                }}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return null;
                })}
              </div>
            </div>
            <div className="my-4 h-px w-full bg-[var(--border-dim)]"></div>
            <div className="flex flex-col gap-3">
              <div className="flex h-10 items-center w-full">
                <LanguageSwitcher />
              </div>
              <div className="flex h-10 items-center w-full">
                <ThemeToggle />
              </div>
              <div className="flex h-10 items-center w-full">
                <SignInModalButton label={t("logIn")} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
