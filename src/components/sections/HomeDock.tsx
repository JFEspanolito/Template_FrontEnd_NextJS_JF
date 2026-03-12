"use client";

import { useState } from "react";
import { Bell, Home as HomeIcon, Rocket } from "lucide-react";
import MagicDock from "@/components/ui/magicdock";

export default function HomeDock() {
  const [dockMessage, setDockMessage] = useState("Haz click en un item del dock.");

  const dockItems = [
    {
      id: 1,
      icon: <HomeIcon className="h-4 w-4 text-white" />,
      label: "Home",
      onClick: () => setDockMessage("MagicDock: Home activado."),
    },
    {
      id: 2,
      icon: <Bell className="h-4 w-4 text-white" />,
      label: "Alerts",
      onClick: () => setDockMessage("MagicDock: Alerts activado."),
    },
    {
      id: 3,
      icon: <Rocket className="h-4 w-4 text-white" />,
      label: "Launch",
      onClick: () => setDockMessage("MagicDock: Launch activado."),
    },
  ];

  return (
    <>
      <MagicDock items={dockItems} variant="tooltip" hoverDistance="8px" />
      {dockMessage && (
        <p className="text-center text-sm text-[var(--text-muted)]">{dockMessage}</p>
      )}
    </>
  );
}
