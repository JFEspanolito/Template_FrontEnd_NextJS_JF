"use client";

import React from "react";
import { motion } from "framer-motion";
import configProject from "@/data/configProject";
import StylishDock from "@/components/ui/magicdock";
import { Mail } from "@/components/icons/mail";
import { Github } from "@/components/icons/github";
import { Linkedin } from "@/components/icons/linkedin";
import { Twitter } from "@/components/icons/twitter";
import { Instagram } from "@/components/icons/instagram";
import { Telegram } from "@/components/icons/telegram";
import { Wakatime } from "@/components/icons/wakatime";

const iconSizes = 1;

const ICON_SIZE_MAP = {
  1: "w-4 h-4",
  2: "w-6 h-6",
  3: "w-8 h-8",
} as const;

const getIcon = (iconName: string, size: 1 | 2 | 3 = 2) => {
  const sizeClass = ICON_SIZE_MAP[size] || ICON_SIZE_MAP[2];
  const iconClass = `${sizeClass} fill-current`;
  
  const normalizedIcon = iconName.toLowerCase().trim();

  switch (normalizedIcon) {
    case "mail":
    case "email":
      return <Mail className={iconClass} />;
    case "github":
      return <Github className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    case "instagram":
      return <Instagram className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    case "telegram":
      return <Telegram className={iconClass} />;
    case "wakatime":
      return <Wakatime className={iconClass} />;
    default:
      if (typeof window !== 'undefined') {
        console.warn(`Icon not found: "${iconName}" (normalized: "${normalizedIcon}")`);
      }
      return <Wakatime className={iconClass} />; 
  }
};

type SocialDockMode = "floating" | "vinline" | "hinline";

interface SocialDockProps {
  mode?: SocialDockMode;
  showLabel?: boolean;
}

interface DockItem {
  id: number;
  icon: React.ReactElement;
  label: string;
  url: string;
  onClick: () => void;
}

export function SocialDock({ mode = "floating", showLabel }: SocialDockProps) {
  // Determinar showLabel default por modo
  const shouldShowLabel = showLabel !== undefined ? showLabel : (mode !== "floating");

  // Construir items unificados (email + socials)
  const items: DockItem[] = [];
  
  // 1. Email primero
  const email = configProject.support?.email;
  if (email && email.trim()) {
    items.push({
      id: 1,
      icon: getIcon("email", iconSizes),
      label: "Email",
      url: `mailto:${email}`,
      onClick: () => window.open(`mailto:${email}`, "_blank"),
    });
  }

  // 2. Socials después
  const socialEntries = Object.entries(configProject.socials || {});
  socialEntries.forEach(([key, url], index) => {
    if (url && url.trim()) {
      items.push({
        id: 100 + index,
        icon: getIcon(key, iconSizes),
        label: key.charAt(0).toUpperCase() + key.slice(1),
        url: url,
        onClick: () => window.open(url, "_blank"),
      });
    }
  });

  if (items.length === 0) return null;

  // Render según modo
  if (mode === "floating") {
    return (
      <>
        {/* Desktop */}
        <div className="hidden md:block">
          <motion.div
            className="fixed top-6 right-4 z-50"
            initial={{ opacity: 0, x: -40, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StylishDock
              items={items.map(item => ({
                id: item.id,
                icon: item.icon,
                label: item.label,
                onClick: item.onClick,
              }))}
              baseItemSize={40}
              magnification={60}
              panelHeight={50}
              className="bg-transparent border-none shadow-none flex items-center"
              itemClassName="bg-transparent border-none shadow-none"
              hoverAnimation={false}
              hoverDistance="0"
              labelPosition={shouldShowLabel ? "bottom" : "bottom"}
            />
          </motion.div>
        </div>

        {/* Mobile */}
        <div className="block md:hidden">
          <motion.div
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <StylishDock
              items={items.map(item => ({
                id: item.id,
                icon: item.icon,
                label: item.label,
                onClick: item.onClick,
              }))}
              baseItemSize={34}
              magnification={34}
              panelHeight={46}
              distance={120}
              className="bg-black/60 backdrop-blur-md border-neutral-700/40"
              itemClassName="bg-transparent border-none shadow-none"
              hoverAnimation={false}
              labelPosition={shouldShowLabel ? "top" : "top"}
            />
          </motion.div>
        </div>
      </>
    );
  }

  if (mode === "vinline") {
    return (
      <nav aria-label="Social links" className="flex flex-col gap-2 w-full">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-2 py-1.5 rounded-md transition-colors hover:bg-[var(--bg-2)] text-[var(--text)]"
            aria-label={!shouldShowLabel ? item.label : undefined}
          >
            <span className="flex-shrink-0 text-[var(--text)]">
              {item.icon}
            </span>
            {shouldShowLabel && (
              <span className="text-sm font-medium">{item.label}</span>
            )}
          </a>
        ))}
      </nav>
    );
  }

  if (mode === "hinline") {
    return (
      <nav aria-label="Social links" className="flex flex-wrap items-center justify-center gap-3">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 px-2 py-1.5 rounded-md transition-colors hover:bg-[var(--bg-2)] text-[var(--text)]"
            aria-label={!shouldShowLabel ? item.label : undefined}
          >
            <span className="flex-shrink-0 text-[var(--text)]">
              {item.icon}
            </span>
            {shouldShowLabel && (
              <span className="text-xs font-medium">{item.label}</span>
            )}
          </a>
        ))}
      </nav>
    );
  }

  return null;
}

/**
 * SocialDock
 *
 * Componente de navegación social unificado (Email + redes) con múltiples modos
 * de renderizado: flotante o inline.
 *
 * PROPS
 *
 * @param mode?: "floating" | "vinline" | "hinline"
 *
 * Controla el tipo de layout del dock.
 *
 * - "floating" (default)
 *   - Dock flotante con position: fixed.
 *   - Visible siempre (desktop y mobile).
 *   - Desktop: esquina superior derecha.
 *   - Mobile: centrado en la parte inferior.
 *   - Usa StylishDock + framer-motion.
 *
 * - "vinline"
 *   - Render inline vertical (columna).
 *   - Respeta el flujo del layout (NO fixed).
 *   - Ideal para footer o sidebar.
 *   - Renderiza <nav> con enlaces verticales.
 *
 * - "hinline"
 *   - Render inline horizontal (fila).
 *   - Respeta el flujo del layout (NO fixed).
 *   - Ideal para footer compacto o header.
 *   - Renderiza <nav> con enlaces en fila.
 *
 * @param showLabel?: boolean
 *
 * Controla la visibilidad del texto (label) de cada item.
 *
 * - true:
 *   - Muestra el label junto al icono.
 *
 * - false:
 *   - Muestra solo iconos.
 *   - Usa aria-label para accesibilidad.
 *
 * - undefined (default):
 *   - mode === "floating"  → false
 *   - mode !== "floating"  → true
 *
 * FUENTE DE DATOS (interno, no props):
 *
 * - configProject.support.email
 *   - Si existe y no está vacío, se agrega como primer item:
 *     label: "Email"
 *     url: mailto:<email>
 *
 * - configProject.socials
 *   - Objeto key → url (github, linkedin, twitter, instagram, etc.)
 *   - Se renderizan en el orden definido en el objeto.
 *   - Entradas vacías o undefined se omiten.
 *
 * ESTRUCTURA INTERNA DE ITEMS:
 * {
 *   id: number;
 *   icon: ReactElement;
 *   label: string;
 *   url: string;
 *   onClick: () => void;
 * }
 *
 * EJEMPLOS DE USO
 *
 * // Dock flotante (default)
 * <SocialDock />
 *
 * // Dock flotante mostrando labels explícitamente
 * <SocialDock showLabel={true} />
 *
 * // Footer vertical
 * <SocialDock mode="vinline" />
 *
 * // Footer horizontal sin labels
 * <SocialDock mode="hinline" showLabel={false} />
 */
