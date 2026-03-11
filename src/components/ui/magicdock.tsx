"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { cn } from "@/libs/utils";

type SpringOptions = {
  stiffness?: number;
  damping?: number;
  mass?: number;
  velocity?: number;
  restSpeed?: number;
  restDelta?: number;
};

export type DockItemData = {
  id: number;
  icon: React.ReactNode;
  label: string;
  description?: string;
  image?: string;
  onClick: () => void;
  className?: string;
};

export type MagicDockProps = {
  items: DockItemData[];
  className?: string;
  itemClassName?: string;
  distance?: number;
  panelHeight?: number;
  baseItemSize?: number;
  dockHeight?: number;
  magnification?: number;
  spring?: SpringOptions;
  variant?: "default" | "gradient" | "tooltip";
  hoverAnimation?: boolean;
  hoverDistance?: string;
  labelPosition?: "top" | "bottom";
};

type DockItemProps = {
  item: DockItemData;
  mouseX: React.RefObject<number>;
  spring: SpringOptions;
  distance: number;
  baseItemSize: number;
  magnification: number;
  variant: "default" | "gradient" | "tooltip";
  setHoveredIndex: React.Dispatch<React.SetStateAction<number | null>>;
  hoveredIndex: number | null;
  isTouchDevice: boolean;
  itemClassName?: string;
  hoverAnimation: boolean;
  hoverDistance?: string;
  labelPosition: "top" | "bottom";
};

function DockItem({
  item,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  variant,
  setHoveredIndex,
  hoveredIndex,
  isTouchDevice,
  itemClassName,
  hoverAnimation,
  hoverDistance,
  labelPosition,
}: DockItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseXMotion = useMotionValue(0);
  const isHovered = useMotionValue(0);
  const x = useMotionValue(0);
  const tooltipSpringConfig = { stiffness: 100, damping: 5 };
  const [isStableHover, setIsStableHover] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-15, 15]),
    tooltipSpringConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-20, 20]),
    tooltipSpringConfig
  );

  useEffect(() => {
    if (hoveredIndex === item.id) {
      isHovered.set(1);
    } else {
      isHovered.set(0);
    }
  }, [hoveredIndex, item.id, isHovered]);

  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const distance = e.clientX - (rect.x + rect.width / 2);
      mouseXMotion.set(distance);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseXMotion, isTouchDevice]);

  const handleItemMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (isTouchDevice) return;
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  const targetSize = useTransform(
    mouseXMotion,
    [-distance, 0, distance],
    [baseItemSize, isTouchDevice || !hoverAnimation ? baseItemSize : magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  const defaultItemStyles = "bg-black border-2 shadow-md border-neutral-700";

  const handleMouseEnter = () => {
    if (isTouchDevice) return;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    setIsStableHover(true);
    setHoveredIndex(item.id);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;

    hoverTimeoutRef.current = setTimeout(() => {
      setIsStableHover(false);
      setHoveredIndex(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`group relative ${item.className || ""}`}
      style={{
        width: size,
        height: size,
        padding: "8px",
        margin: "-8px",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleItemMouseMove}
      onClick={item.onClick}
      tabIndex={0}
      role="button"
      aria-haspopup="true"
    >
      <motion.div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-full transition-colors duration-300",
          defaultItemStyles,
          itemClassName
        )}
        initial={{}}
        animate={{
          y: isStableHover && hoverDistance && hoverAnimation ? `-${hoverDistance}` : "0rem",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
        }}
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.label}
            className="h-full w-full rounded-full object-cover object-center p-1"
          />
        ) : (
          <div className="flex items-center justify-center">{item.icon}</div>
        )}
      </motion.div>

      {!isTouchDevice && (
        <AnimatePresence>
          {hoveredIndex === item.id && (
            <motion.div
              initial={{ opacity: 0, y: labelPosition === "top" ? -8 : 8, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: labelPosition === "top" ? -6 : 6,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 400,
                  damping: 15,
                },
              }}
              exit={{ 
                opacity: 0, 
                y: labelPosition === "top" ? -8 : 8, 
                scale: 0.8,
                transition: { duration: 0.15 }
              }}
              style={
                variant === "tooltip"
                  ? {
                      translateX: translateX,
                      rotate: rotate,
                      whiteSpace: "nowrap",
                    }
                  : { whiteSpace: "nowrap" }
              }
              className={cn(
                "absolute z-50 -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-4 py-2 text-xs shadow-xl",
                labelPosition === "top" 
                  ? (variant === "tooltip" ? "-top-12" : "-top-10")
                  : (variant === "tooltip" ? "-bottom-12" : "-bottom-10")
              )}
            >
              <div className="relative z-30 text-base font-bold text-white">
                {item.label}
              </div>
              {item.description && (
                <div className="text-xs text-white/70">{item.description}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

export default function MagicDock({
  items,
  className = "",
  itemClassName = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 150,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
  variant = "default",
  hoverAnimation = true,
  hoverDistance,
  labelPosition = "bottom",
}: MagicDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const mouseX = useRef<number>(Infinity as number);
  const isHovered = useMotionValue(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(pointer: coarse)");
    const handleChange = (e: MediaQueryListEvent) => {
      setIsTouchDevice(e.matches);
    };
    setIsTouchDevice(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const maxHeight = Math.max(dockHeight, magnification + magnification / 2 + 4);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  const getBgStyles = () => {
    switch (variant) {
      case "gradient":
        return "bg-black/85 backdrop-blur-md";
      case "tooltip":
        return "bg-black/70 backdrop-blur-lg";
      default:
        return "bg-black/90";
    }
  };

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center"
    >
      <motion.div
        onMouseMove={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          if (!isTouchDevice && hoverAnimation) {
            isHovered.set(1);
            mouseX.current = e.pageX;
          }
        }}
        onMouseLeave={() => {
          if (!isTouchDevice && hoverAnimation) {
            isHovered.set(0);
            mouseX.current = Infinity;
          }
        }}
        className={cn(
          `fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-end w-fit gap-4 rounded-2xl border-neutral-700/50 border-2 pb-2 px-4 z-50 ${getBgStyles()}`,
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        {items.map((item) => (
          <DockItem
            key={item.id}
            item={item}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
            variant={variant}
            setHoveredIndex={setHoveredIndex}
            hoveredIndex={hoveredIndex}
            isTouchDevice={isTouchDevice}
            itemClassName={itemClassName}
            hoverAnimation={hoverAnimation}
            hoverDistance={hoverDistance}
            labelPosition={labelPosition}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
