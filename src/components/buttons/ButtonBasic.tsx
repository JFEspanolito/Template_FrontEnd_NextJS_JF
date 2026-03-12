"use client";

import React from "react";
import { cn } from "@/libs/utils";
import { btn } from "./buttonStyles";

interface ButtonBasicProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  onClick?: () => void;
  typeButton?: 1 | 2 | 3; // 1=Primary, 2=Secondary, 3=Tertiary
  enable?: boolean;
  icon?: React.ReactNode;
  shape?: 1 | 2; // 1=Circular (Icono), 2=Rectangular (Normal)
  size?: 1 | 2 | 3 | 4; // 1=Chico, 2=Mediano, 3=Grande, 4=Extra Grande
}

const ButtonBasic = ({
  title,
  onClick,
  typeButton = 1,
  enable = true,
  icon,
  shape = 2,
  size = 1,
  className,
  ...props
}: ButtonBasicProps) => {
  // Variant map
  const variantMap = {
    1: "primary" as const,
    2: "secondary" as const,
    3: "tertiary" as const,
  };

  // Lógica de Formas
  const shapeStyles = {
    // 1: Circular - Quitamos el padding de aquí para controlarlo en sizeStyles
    1: "rounded-full",
    // 2: Rectangular
    2: "rounded-lg",
  };

  // Lógica de Tamaños
  const sizeStyles = {
    // Tamaño 1 (Chico)
    1:
      shape === 1
        ? "h-10 w-10"
        : "px-6 py-2 text-sm",

    // Tamaño 2 (Mediano)
    2:
      shape === 1
        ? "h-14 w-14"
        : "px-8 py-3 text-lg",

    // Tamaño 3 (Grande)
    3:
      shape === 1
        ? "h-20 w-20"
        : "px-8 py-3 text-lg",
        
    // Tamaño 4 (Extra Grande)
    4:
      shape === 1
        ? "h-30 w-30"
        : "px-8 py-3 text-lg",
  };

  return (
    <button
      disabled={!enable}
      onClick={onClick}
      className={cn(btn(variantMap[typeButton]), "transition-all duration-300 flex items-center justify-center", shapeStyles[shape], sizeStyles[size], className)}
      {...props}
    >
      {/* Contenedor del Icono */}
      {icon && (
        <span className={cn(title && shape === 2 ? "mr-2" : "", "flex items-center justify-center pointer-events-none")}>{icon}</span>
      )}

      {title && <span>{title}</span>}
    </button>
  );
};

export default ButtonBasic;
