"use client";

import React from "react";
import { cn } from "@/libs/utils";

interface ButtonBasicProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  onClick?: () => void;
  typeButton?: 1 | 2 | 3; // 1=Primary, 2=Secondary, 3=Ghost
  enable?: boolean;
  icon?: React.ReactNode;
  shape?: 1 | 2; // 1=Circular (Icono), 2=Rectangular (Normal)
  size?: 1 | 2 | 3; // 1=Normal, 2=Grande, 3=Custom
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
  // Lógica de Estilos Base
  const baseStyles =
    "btn transition-all duration-300 flex items-center justify-center";

  // Lógica de Tipos (Colores)
  const typeStyles = {
    1: "btn-primary",
    2: "btn-secondary",
    3: "btn-ghost",
  };

  // Lógica de Formas
  const shapeStyles = {
    // 1: Circular - Quitamos el padding de aquí para controlarlo en sizeStyles
    1: "rounded-full aspect-square hover:scale-110",
    // 2: Rectangular
    2: "rounded-lg",
  };

  // Lógica de Tamaños
  const sizeStyles = {
    // Tamaño 1 (Normal)
    1:
      shape === 1
        ? "h-10 w-10" // Círculo de 40px
        : "px-6 py-2 text-sm",

    // Tamaño 2 (Grande)
    2:
      shape === 1
        ? "h-14 w-14" // Círculo de 56px (Fijo, no importa el icono)
        : "px-8 py-3 text-lg",

    // Tamaño 3 (Custom - permite control manual vía className)
    3:
      shape === 1
        ? "h-5 w-5" // Círculo de 20px
        : "px-3 py-1 text-sm",
  };

  return (
    <button
      disabled={!enable}
      onClick={onClick}
      className={cn(
        baseStyles,
        typeStyles[typeButton],
        shapeStyles[shape],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {/* Contenedor del Icono */}
      {icon && (
        <span
          className={cn(
            title && shape === 2 ? "mr-2" : "",
            "flex items-center justify-center pointer-events-none"
          )}
        >
          {icon}
        </span>
      )}

      {title && <span>{title}</span>}
    </button>
  );
};

export default ButtonBasic;
