"use client";

import { useState } from "react";
import { Bell, Box, Boxes, Cuboid, Home as HomeIcon, Rocket, ScanSearch, Shield, Sparkles, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Card from "@/components/ui/card";
import MagicDock from "@/components/ui/magicdock";
import STLViewer from "@/components/ui/STLViewer";
import { TextSpotlight } from "@/components/ui/text-spotlight";
import {
  CardFlip,
  CardFlipBack,
  CardFlipContent,
  CardFlipDescription,
  CardFlipFront,
  CardFlipHeader,
  CardFlipTitle,
} from "@/components/ui/card-flip";
import {
  TopSecret,
  TopSecretClose,
  TopSecretContent,
  TopSecretDescription,
  TopSecretFooter,
  TopSecretHeader,
  TopSecretOverlay,
  TopSecretPortal,
  TopSecretTitle,
  TopSecretTrigger,
} from "@/components/ui/top-secret";

import Button from "@/components/buttons/ButtonBasic";

export default function Home() {
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

  const expandableCards = [
    {
      id: 1,
      content: (
        <div className="flex h-full flex-col justify-end bg-[linear-gradient(135deg,#0f172a,#1d4ed8)] p-5 text-white">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Boxes className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold">Panel A</h3>
          <p className="mt-1 text-sm text-white/75">Pasa el cursor para expandir esta tarjeta.</p>
        </div>
      ),
    },
    {
      id: 2,
      content: (
        <div className="flex h-full flex-col justify-end bg-[linear-gradient(135deg,#3f6212,#84cc16)] p-5 text-black">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-black/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold">Panel B</h3>
          <p className="mt-1 text-sm text-black/70">Cada item se entrega una sola vez al componente.</p>
        </div>
      ),
    },
    {
      id: 3,
      content: (
        <div className="flex h-full flex-col justify-end bg-[linear-gradient(135deg,#4c0519,#fb7185)] p-5 text-white">
          <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold">Panel C</h3>
          <p className="mt-1 text-sm text-white/75">Ideal para hero blocks o listas destacadas.</p>
        </div>
      ),
    },
  ];

  return (
    <div
      className="relative min-h-screen font-sans"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-16 sm:px-8 lg:px-10">
        Button
        <Button typeButton={2} className="px-6 py-3 text-sm" title="Primary Button" shape={2} size={3} />
        Badge
        <Badge className="w-fit border-white/10 bg-white/10 text-white hover:bg-white/15">Demo</Badge>
        Avatar
        <Avatar className="h-16 w-16 ring-2 ring-lime-400/40">
          <AvatarImage src="PageCover/cover.webp" alt="Demo avatar" />
          <AvatarFallback>Demo</AvatarFallback>
        </Avatar>
        Card
        <Card
          className="h-56"
          content={
            <div className="flex h-full flex-col justify-between bg-[linear-gradient(135deg,#111827,#1f2937_55%,#4f46e5)] p-6 text-white">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Box className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-white/70">content prop</p>
                <h3 className="mt-1 text-2xl font-semibold">Card wrapper</h3>
              </div>
            </div>
          }
        />
        CardFlip
        <CardFlip className="min-h-[280px]">
          {[
            <CardFlipFront key="front" className="h-full justify-between border-black/10 bg-white dark:border-white/10 dark:bg-black/20">
              <CardFlipHeader>
                <CardFlipTitle>Frente</CardFlipTitle>
                <CardFlipDescription>Haz click en el icono para girar.</CardFlipDescription>
              </CardFlipHeader>
              <CardFlipContent>
                <div className="rounded-2xl bg-black/[0.04] p-4 text-sm dark:bg-white/[0.04]">
                  Este lado resume el componente o el dato principal.
                </div>
              </CardFlipContent>
            </CardFlipFront>,
            <CardFlipBack
              key="back"
              className="h-full justify-between border-black/10 bg-lime-300/20 dark:border-white/10 dark:bg-lime-300/10"
            >
              <CardFlipHeader>
                <CardFlipTitle>Reverso</CardFlipTitle>
                <CardFlipDescription>Contenido complementario o acciones.</CardFlipDescription>
              </CardFlipHeader>
              <CardFlipContent>
                <ul className="space-y-2 text-sm opacity-80">
                  <li>Animación con framer-motion</li>
                  <li>Botones por defecto incluidos</li>
                  <li>Altura sincronizada entre caras</li>
                </ul>
              </CardFlipContent>
            </CardFlipBack>,
          ]}
        </CardFlip>
        STLViewer
        <STLViewer files={[]} height={260} />
        TextSpotlight
        <TextSpotlight
          text="Move the cursor across this title"
          className="mx-auto max-w-2xl"
          textClassName="text-3xl font-black text-center"
          baseTextClassName="text-3xl font-black text-center text-white/20"
          spotlightColor="56, 189, 248"
          spotlightSize={180}
        />
        TopSecret
        <TopSecret>
          <TopSecretTrigger asChild>
            <button className="rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/85 dark:bg-white dark:text-black dark:hover:bg-white/85">
              Abrir ejemplo de TopSecret
            </button>
          </TopSecretTrigger>

          <TopSecretPortal>
            <TopSecretOverlay />
            <TopSecretContent
              direction="right"
              size="50"
              className="border-l border-black/10 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-neutral-950"
            >
              <TopSecretHeader>
                <TopSecretTitle>TopSecret abierto</TopSecretTitle>
                <TopSecretDescription>Este panel se monta con trigger, portal, overlay y botón de cierre.</TopSecretDescription>
              </TopSecretHeader>
              <div className="mt-6 rounded-2xl bg-black/[0.04] p-4 text-sm dark:bg-white/[0.04]">
                Puedes usarlo como drawer lateral, bottom sheet o panel de detalle.
              </div>
              <TopSecretFooter>
                <TopSecretClose asChild>
                  <button className="rounded-2xl border border-black/10 px-4 py-2 text-sm font-medium transition hover:bg-black/[0.04] dark:border-white/10 dark:hover:bg-white/[0.04]">
                    Cerrar
                  </button>
                </TopSecretClose>
              </TopSecretFooter>
            </TopSecretContent>
          </TopSecretPortal>
        </TopSecret>
        MagicDock (on bot)
        <MagicDock items={dockItems} variant="tooltip" hoverDistance="8px" />
      </div>
    </div>
  );
}
