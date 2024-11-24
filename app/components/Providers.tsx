/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext, useRef, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WaveSurferProvider } from "./WaveSurferProvider";

interface LanguageContextProps {
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
}
export const LanguageContext = createContext<LanguageContextProps | null>(null);
export function Providers({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const [language, setLanguage] = useState("english");
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delayDuration={0}>
        <LanguageContext.Provider value={{ language, setLanguage }}>
          <WaveSurferProvider>{children}</WaveSurferProvider>
        </LanguageContext.Provider>
      </TooltipProvider>
    </NextThemesProvider>
  );
}
