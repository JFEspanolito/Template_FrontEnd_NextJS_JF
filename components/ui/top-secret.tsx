"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useAnimation,
  PanInfo,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/libs/utils";

interface TopSecretContextValue {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contentProps: {
    height: string;
    className: string;
    closeThreshold: number;
    size: "50" | "80" | "100";
    direction: "top" | "bottom" | "left" | "right";
  };
}

const TopSecretContext = createContext<TopSecretContextValue | null>(null);

const useTopSecretContext = () => {
  const context = useContext(TopSecretContext);
  if (!context) {
    throw new Error(
      "TopSecret compound components must be used within TopSecret"
    );
  }
  return context;
};

interface TopSecretRootProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  className?: string;
  size?: "50" | "80" | "100";
  direction?: "top" | "bottom" | "left" | "right";
}

const TopSecretRoot = ({
  children,
  open,
  onOpenChange,
  defaultOpen,
  className,
  size = "80",
  direction = "top",
}: TopSecretRootProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen ?? false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      if (onOpenChange) {
        onOpenChange(newOpen);
      }
      if (!isControlled) {
        setInternalOpen(newOpen);
      }
    },
    [onOpenChange, isControlled]
  );

  const contentProps = {
    height: "55vh",
    className: className || "",
    closeThreshold: 0.3,
    size,
    direction,
  };

  return (
    <TopSecretContext.Provider
      value={{ isOpen, onOpenChange: handleOpenChange, contentProps }}
    >
      {children}
    </TopSecretContext.Provider>
  );
};

interface TopSecretPortalProps {
  children: React.ReactNode;
  container?: HTMLElement;
  className?: string;
}

const TopSecretPortal = ({
  children,
  container,
  className,
}: TopSecretPortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const portalContent = className ? (
    <div className={className}>{children}</div>
  ) : (
    children
  );

  return createPortal(portalContent, container || document.body);
};

interface TopSecretOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const TopSecretOverlay = forwardRef<HTMLDivElement, TopSecretOverlayProps>(
  ({ className, ...props }, ref) => {
    const { isOpen, onOpenChange } = useTopSecretContext();

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onOpenChange(false);
        }
      },
      [onOpenChange]
    );

    const {
      onDrag,
      onDragStart,
      onDragEnd,
      onAnimationStart,
      onAnimationEnd,
      onAnimationIteration,
      ...filteredProps
    } = props;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={handleClick}
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-sm",
          className
        )}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
        {...filteredProps}
      />
    );
  }
);
TopSecretOverlay.displayName = "TopSecretOverlay";

interface TopSecretTriggerProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const TopSecretTrigger = ({
  asChild,
  children,
  className,
}: TopSecretTriggerProps) => {
  const { onOpenChange } = useTopSecretContext();

  const handleClick = () => {
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...(children as React.ReactElement<any>).props,
      className: cn((children as React.ReactElement<any>).props.className, className),
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button onClick={handleClick} type="button" className={cn("", className)}>
      {children}
    </button>
  );
};

interface TopSecretContentProps {
  children?: React.ReactNode;
  height?: string;
  className?: string;
  closeThreshold?: number;
  size?: "50" | "80" | "100";
  direction?: "top" | "bottom" | "left" | "right";
}

const TopSecretContent = ({
  children,
  height = "55vh",
  className = "",
  closeThreshold = 0.3,
  size,
  direction,
}: TopSecretContentProps) => {
  const { isOpen, onOpenChange, contentProps } = useTopSecretContext();
  
  const finalSize = size ?? contentProps.size;
  const finalDirection = direction ?? contentProps.direction;
  
  const controls = useAnimation();
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  useTransform(y, [-100, 0], [0, 1]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [sheetSize, setSheetSize] = useState({ width: 0, height: 0 });

  const onClose = useCallback(() => onOpenChange(false), [onOpenChange]);

  const calculateSize = useCallback(() => {
    if (typeof window !== "undefined") {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const sizePercent = parseInt(finalSize) / 100;

      let calculatedWidth = vw;
      let calculatedHeight = vh;

      if (finalDirection === "top" || finalDirection === "bottom") {
        calculatedHeight = vh * sizePercent;
      } else {
        calculatedWidth = vw * sizePercent;
      }

      return { width: calculatedWidth, height: calculatedHeight };
    }
    return { width: 0, height: 0 };
  }, [finalSize, finalDirection]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const updateSize = () => {
      setSheetSize(calculateSize());
    };

    updateSize();
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, [calculateSize]);

  const getInitialPosition = () => {
    switch (finalDirection) {
      case "top":
        return { y: -(sheetSize.height + 50), x: 0 };
      case "bottom":
        return { y: sheetSize.height + 50, x: 0 };
      case "left":
        return { x: -(sheetSize.width + 50), y: 0 };
      case "right":
        return { x: sheetSize.width + 50, y: 0 };
    }
  };

  const getAnimatedPosition = () => {
    return { y: 0, x: 0 };
  };

  const getDragAxis = () => {
    return finalDirection === "top" || finalDirection === "bottom" ? "y" : "x";
  };

  const getDragConstraints = () => {
    switch (finalDirection) {
      case "top":
        return { top: -sheetSize.height, bottom: 0 };
      case "bottom":
        return { top: 0, bottom: sheetSize.height };
      case "left":
        return { left: -sheetSize.width, right: 0 };
      case "right":
        return { left: 0, right: sheetSize.width };
    }
  };

  const getPositionStyles = () => {
    const base: React.CSSProperties = {
      display: "flex",
      flexDirection: "column",
    };

    switch (finalDirection) {
      case "top":
        return {
          ...base,
          top: 0,
          left: 0,
          right: 0,
          height: sheetSize.height,
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px",
        };
      case "bottom":
        return {
          ...base,
          bottom: 0,
          left: 0,
          right: 0,
          height: sheetSize.height,
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        };
      case "left":
        return {
          ...base,
          top: 0,
          left: 0,
          bottom: 0,
          width: sheetSize.width,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px",
        };
      case "right":
        return {
          ...base,
          top: 0,
          right: 0,
          bottom: 0,
          width: sheetSize.width,
          borderTopLeftRadius: "16px",
          borderBottomLeftRadius: "16px",
        };
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    
    if (isOpen) {
      document.body.style.overflow = "hidden";
      controls.start({
        ...getAnimatedPosition(),
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 40,
          mass: 0.8,
        },
      });
    } else {
      document.body.style.overflow = "";
      controls.start({
        ...getInitialPosition(),
        transition: {
          type: "tween",
          ease: [0.25, 0.46, 0.45, 0.94],
          duration: 0.3,
        },
      });
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, controls, sheetSize]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleDragEnd = useCallback(
    (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const axis = getDragAxis();
      const size = axis === "y" ? sheetSize.height : sheetSize.width;
      const offset = axis === "y" ? info.offset.y : info.offset.x;
      const velocity = axis === "y" ? info.velocity.y : info.velocity.x;
      
      let shouldClose = false;
      
      switch (finalDirection) {
        case "top":
          shouldClose = offset < -(size * closeThreshold) || velocity < -800;
          break;
        case "bottom":
          shouldClose = offset > size * closeThreshold || velocity > 800;
          break;
        case "left":
          shouldClose = offset < -(size * closeThreshold) || velocity < -800;
          break;
        case "right":
          shouldClose = offset > size * closeThreshold || velocity > 800;
          break;
      }
      
      if (shouldClose) {
        onClose();
      } else {
        controls.start({
          y: 0,
          x: 0,
          transition: {
            type: "spring",
            stiffness: 500,
            damping: 40,
          },
        });
      }
    },
    [controls, onClose, closeThreshold, sheetSize, finalDirection]
  );

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (sheetSize.height === 0 && sheetSize.width === 0) return null;

  return (
    <TopSecretPortal>
      <div
        className={cn(
          "fixed inset-0 z-999",
          !isOpen && "pointer-events-none"
        )}
      >
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={handleOverlayClick}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
        />
        <motion.div
          drag={getDragAxis()}
          dragConstraints={getDragConstraints()}
          dragElastic={{ top: 0.1, bottom: 0, left: 0.1, right: 0 }}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={getInitialPosition()}
          className={cn(
            "absolute w-full bg-white dark:bg-[#0A0A0A] shadow-2xl",
            className
          )}
          style={getPositionStyles()}
        >
          <div className="flex-1 overflow-hidden">
            <div
              className="h-full overflow-y-auto px-4 pt-6 pb-10 scrollbar-hide"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {children}
            </div>
          </div>

          <div className="flex justify-center pb-4 pt-1">
            <div className="h-2 w-16 rounded-full bg-gray-300 dark:bg-gray-600 cursor-grab active:cursor-grabbing" />
          </div>
        </motion.div>
      </div>
    </TopSecretPortal>
  );
};

interface TopSecretHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TopSecretHeader = ({ children, className }: TopSecretHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col space-y-1.5 text-center sm:text-center pb-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TopSecretTitleProps {
  children: React.ReactNode;
  className?: string;
}

const TopSecretTitle = ({ children, className }: TopSecretTitleProps) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
};

interface TopSecretDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const TopSecretDescription = ({
  children,
  className,
}: TopSecretDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>
      {children}
    </p>
  );
};

interface TopSecretFooterProps {
  children: React.ReactNode;
  className?: string;
}

const TopSecretFooter = ({ children, className }: TopSecretFooterProps) => {
  return (
    <div
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2 pt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

interface TopSecretCloseProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

const TopSecretClose = ({
  asChild,
  children,
  className,
}: TopSecretCloseProps) => {
  const { onOpenChange } = useTopSecretContext();

  const handleClick = () => {
    onOpenChange(false);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ...(children as React.ReactElement<any>).props,
      className: cn((children as React.ReactElement<any>).props.className, className),
      onClick: (e: React.MouseEvent) => {
        (children as React.ReactElement<any>).props.onClick?.(e);
        handleClick();
      },
    });
  }

  return (
    <button onClick={handleClick} type="button" className={cn("", className)}>
      {children}
    </button>
  );
};

const TopSecret = TopSecretRoot;

export {
  TopSecret,
  TopSecretPortal,
  TopSecretOverlay,
  TopSecretTrigger,
  TopSecretClose,
  TopSecretContent,
  TopSecretHeader,
  TopSecretFooter,
  TopSecretTitle,
  TopSecretDescription,
};
