"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const STORAGE_KEY = "oneko:bedPosition";

export default function Oneko() {
  const [pos, setPos] = useState(() => ({ x: 0, y: 0 }));
  const dragging = useRef(false);
  const start = useRef({ sx: 0, sy: 0, px: 0, py: 0 });
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    import("@/scripts/oneko.js").catch(() => {
      // ignore load failures (e.g., SSR or missing asset)
    });
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          setPos(clamp(parsed.x, parsed.y));
          return;
        }
      }

      // No saved position: place bed at bottom-right according to viewport size
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxX = Math.max(0, w - 48);
      const maxY = Math.max(0, h - 48);
      setPos({ x: maxX, y: maxY });
    } catch (e) {
      // ignore
    }
  }, []);

  function clamp(x: number, y: number) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxX = Math.max(0, w - 48);
    const maxY = Math.max(0, h - 48);
    return { x: Math.min(Math.max(0, x), maxX), y: Math.min(Math.max(0, y), maxY) };
  }

  function onPointerDown(e: React.PointerEvent) {
    const el = wrapperRef.current;
    if (!el) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    dragging.current = true;
    start.current = { sx: e.clientX, sy: e.clientY, px: pos.x, py: pos.y };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    const dx = e.clientX - start.current.sx;
    const dy = e.clientY - start.current.sy;
    const next = clamp(start.current.px + dx, start.current.py + dy);
    setPos(next);
  }

  function onPointerUp(e: React.PointerEvent) {
    try {
      dragging.current = false;
      (e.target as Element).releasePointerCapture(e.pointerId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
    } catch (err) {
      // ignore
    }
  }

  return (
      <div
        ref={wrapperRef}
        id="oneko-container"
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          zIndex: 9999,
          touchAction: "none",
          cursor: dragging.current ? "grabbing" : "grab",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={(e) => {
          // left click: show the oneko
          const evt = e as React.MouseEvent;
          if (evt.button === 0) {
            const detail = { x: evt.clientX, y: evt.clientY };
            window.dispatchEvent(new CustomEvent("oneko:show", { detail }));
          }
        }}
        onContextMenu={(e) => {
          // right click: open variant picker
          e.preventDefault();
          window.dispatchEvent(new Event("oneko:picker"));
        }}
      >
        <Image
          src="/onekoAssets/petBed.svg"
          alt="oneko bed"
          width={40}
          height={40}
          draggable={false}
          title="Drag to move me! Left click to summon the cat, right click to change pet style."
        />
      </div>
  );
}