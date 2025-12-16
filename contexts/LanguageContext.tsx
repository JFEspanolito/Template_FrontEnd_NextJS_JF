"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ES" | "EN";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const translations = {
  ES: {
    // Header
    menu1: "Menú 1",
    menu2: "Menú 2",
    menu3: "Menú 3",
    SendMail: "Envíanos un correo a",
    Copyright: "Todos los derechos reservados.",
    logIn: "Ingresar",
    // Auth / Sign In
    signIn: "Iniciar Sesión",
    signInDescription: "Inicia sesión con email/contraseña o uno de los siguientes proveedores:",
    email: "Correo",
    password: "Contraseña",
    signingIn: "Iniciando sesión...",
    continueWithEmail: "Continuar con Correo",
    or: "O",
    continueWith: "Continuar con",
    pleaseEnterEmailPassword: "Por favor ingresa correo y contraseña.",
    emailPasswordTemplateMode: "Inicio de sesión con correo/contraseña está en modo template. Recibido:",
    providerNotAvailable: "Este método de inicio de sesión no está disponible en este momento.",
    errorVerifyingConfig: "Error verificando configuración. Intenta nuevamente.",
    errorSigningIn: "Error al intentar iniciar sesión. Intenta nuevamente.",
    bySigningInAgree: "Al iniciar sesión aceptas los términos y la privacidad del sitio.",
    emailPlaceholder: "correo@ejemplo.com",
  },
  EN: {
    // Header
    menu1: "Menu 1",
    menu2: "Menu 2",
    menu3: "Menu 3",
    SendMail: "Send us an email at",
    Copyright: "All rights reserved.",
    logIn: "Log In",
    // Auth / Sign In
    signIn: "Sign in",
    signInDescription: "Sign in with email/password or one of the following providers:",
    email: "Email",
    password: "Password",
    signingIn: "Signing in...",
    continueWithEmail: "Continue with Email",
    or: "OR",
    continueWith: "Continue with",
    pleaseEnterEmailPassword: "Please enter email and password.",
    emailPasswordTemplateMode: "Email/Password sign-in is running in template mode. Received:",
    providerNotAvailable: "This sign-in method is not available at this time.",
    errorVerifyingConfig: "Error verifying configuration. Please try again.",
    errorSigningIn: "Error signing in. Please try again.",
    bySigningInAgree: "By signing in you agree to the terms and privacy of the site.",
    emailPlaceholder: "email@provider.com",
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ES");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "ES" || saved === "EN")) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("language", lang);
    }
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.ES] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
