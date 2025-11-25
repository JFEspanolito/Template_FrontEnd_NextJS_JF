"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { aboutData } from "@/data/about";
import StylishDock from "@/components/ui/magicdock";
import { Mail } from "@/components/icons/mail";
import { Github } from "@/components/icons/github";
import { Linkedin } from "@/components/icons/linkedin";
import { Twitter } from "@/components/icons/twitter";
import { Instagram } from "@/components/icons/instagram";
import { Telegram } from "@/components/icons/telegram";
import { Wakatime } from "@/components/icons/wakatime";

const getIcon = (iconName: string, size: 1 | 2 | 3 = 2) => {
  const iconSizes = {
    1: "w-4 h-4", // Pequeño
    2: "w-6 h-6", // Mediano
    3: "w-8 h-8", // Grande
  };

  const sizeClass = iconSizes[size] || iconSizes[2];
  const iconClass = `${sizeClass} fill-current text-white`;
  
  const normalizedIcon = iconName.toLowerCase().trim();

  switch (normalizedIcon) {
    case "mail":
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

export function SocialDock() {
  const profile = aboutData.ES[0];
  if (!profile) return null;

  const dockSocialItems = profile.social.map((social, index) => ({
    id: index + 1000,
    icon: getIcon(social.icon, 3),
    label: social.name,
    onClick: () => window.open(social.url, "_blank"),
  }));

  const dockContactItems = profile.contact.map((contact, index) => ({
    id: index + 2000,
    icon: getIcon(contact.icon, 3),
    label: contact.name,
    onClick: () => window.open(contact.url, "_blank"),
  }));

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <motion.div
          className="fixed top-6 left-1/100 z-50"
          initial={{ opacity: 0, x: 400, y: -20 }}
          animate={{ opacity: 1, x: 400, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StylishDock
            items={dockContactItems}
            baseItemSize={40}
            magnification={60}
            panelHeight={50}
            className="bg-transparent border-none shadow-none flex items-center"
            itemClassName="bg-transparent border-none shadow-none"
            hoverAnimation={false}
            hoverDistance="0"
            labelPosition="bottom"
          />
        </motion.div>

        <motion.div
          className="fixed top-6 right-1/100 z-50"
          initial={{ opacity: 0, x: -400, y: -20 }}
          animate={{ opacity: 1, x: -400, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <StylishDock
            items={dockSocialItems}
            baseItemSize={40}
            magnification={60}
            panelHeight={50}
            className="bg-transparent border-none shadow-none flex items-center"
            itemClassName="bg-transparent border-none shadow-none"
            hoverAnimation={false}
            hoverDistance="0"
            labelPosition="bottom"
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
            items={[...dockContactItems, ...dockSocialItems]}
            baseItemSize={34}
            magnification={34}
            panelHeight={46}
            distance={120}
            className="bg-black/60 backdrop-blur-md border-neutral-700/40"
            itemClassName="bg-transparent border-none shadow-none"
            hoverAnimation={false}
            labelPosition="top"
          />
        </motion.div>
      </div>
    </>
  );
}
