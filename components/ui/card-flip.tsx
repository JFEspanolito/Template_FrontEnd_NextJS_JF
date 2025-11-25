"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Info, X } from "lucide-react";
import { cn } from "@/libs/utils";

type CardFlipChildren =
  | [React.ReactNode, React.ReactNode]
  | ((params: {
      flip: () => void;
      isFlipped: boolean;
    }) => [React.ReactNode, React.ReactNode]);

function CardFlip({
  className,
  children,
  hideDefaultButtons = false,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  children: CardFlipChildren;
  hideDefaultButtons?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const flip = () => setIsFlipped(!isFlipped);
  const childrenArray =
    typeof children === "function" ? children({ flip, isFlipped }) : children;
  const [front, back] = React.Children.toArray(childrenArray);

  useEffect(() => {
    const calculateMaxHeight = () => {
      if (frontRef.current && backRef.current) {
        const frontHeight = frontRef.current.offsetHeight;
        const backHeight = backRef.current.offsetHeight;
        const max = Math.max(frontHeight, backHeight);
        setMaxHeight(max);
      }
    };
    calculateMaxHeight();
    const timeoutId = setTimeout(calculateMaxHeight, 100);
    const resizeObserver = new ResizeObserver(calculateMaxHeight);
    if (frontRef.current) resizeObserver.observe(frontRef.current);
    if (backRef.current) resizeObserver.observe(backRef.current);
    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [front, back]);

  return (
    <div
      className={cn("relative w-full h-full min-h-[250px]", className)}
      style={{
        perspective: "1000px",
        height: maxHeight ? `${maxHeight}px` : "auto",
      }}
      {...props}
    >
      <motion.div
        className="relative w-full h-full"
        initial={false}
        animate={{ rotateY: isFlipped ? -180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* CARA FRONTAL */}
        <div
          ref={frontRef}
          className="w-full flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            position: maxHeight ? "absolute" : "relative",
            top: 0,
            left: 0,
            height: maxHeight ? `${maxHeight}px` : "auto",
            zIndex: isFlipped ? 0 : 1,
          }}
        >
          {!hideDefaultButtons && (
            <button
              onClick={() => setIsFlipped(true)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Show info"
              style={{
                opacity: isFlipped ? 0 : 1,
                pointerEvents: isFlipped ? "none" : "auto",
                transition: "opacity 0.3s",
              }}
            >
              <Info className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {front}
        </div>

        {/* CARA TRASERA */}
        <div
          ref={backRef}
          className="absolute inset-0 w-full flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
            height: maxHeight ? `${maxHeight}px` : "auto",
            zIndex: isFlipped ? 1 : 0,
          }}
        >
          {!hideDefaultButtons && (
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
              aria-label="Close"
              style={{
                opacity: isFlipped ? 1 : 0,
                pointerEvents: isFlipped ? "auto" : "none",
                transition: "opacity 0.3s",
              }}
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          {back}
        </div>
      </motion.div>
    </div>
  );
}

function CardFlipFront({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardFlipBack({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      )}
      {...props}
    />
  );
}

function CardFlipHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      )}
      {...props}
    />
  );
}

function CardFlipTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
}

function CardFlipDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function CardFlipAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardFlipContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFlipFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

export {
  CardFlip,
  CardFlipFront,
  CardFlipBack,
  CardFlipHeader,
  CardFlipFooter,
  CardFlipTitle,
  CardFlipAction,
  CardFlipDescription,
  CardFlipContent,
};
