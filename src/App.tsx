/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import CommandCenter from "./components/command/CommandCenter";
import { AppearanceSettings, CommandCenterConfig, LanguageRegionSettings } from "./types/settings";
import { ACCENT_COLOR_OPTIONS, DEFAULT_APPEARANCE, DEFAULT_COMMAND_CENTER, DEFAULT_LANGUAGE_REGION } from "./data/settingsMockData";
import { LanguageProvider } from "./i18n/LanguageContext";

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "command-center">("welcome");

  // Global Appearance State initialized from LocalStorage or Defaults
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    try {
      const cached = localStorage.getItem("axion_office_appearance");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      // Storage unavailable fallback
    }
    return DEFAULT_APPEARANCE;
  });

  const isLight = appearance.theme === "light";
  const activeAccent = ACCENT_COLOR_OPTIONS.find((option) => option.id === appearance.accentColor) ?? ACCENT_COLOR_OPTIONS[0];

  const [commandCenterConfig, setCommandCenterConfig] = useState<CommandCenterConfig>(() => {
    try {
      const cached = localStorage.getItem("axion_office_command");
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // Storage unavailable fallback
    }
    return DEFAULT_COMMAND_CENTER;
  });
  const [languageRegion, setLanguageRegion] = useState<LanguageRegionSettings>(() => {
    try {
      const cached = localStorage.getItem("axion_office_language");
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // Storage unavailable fallback
    }
    return DEFAULT_LANGUAGE_REGION;
  });
  const [isLanguageTransitioning, setIsLanguageTransitioning] = useState(false);

  // Sync data-theme attribute with document body and root element
  useEffect(() => {
    const themeValue = isLight ? "light" : "dark";
    document.body.setAttribute("data-theme", themeValue);
    if (isLight) {
      document.documentElement.classList.add("theme-light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("theme-light");
      document.documentElement.classList.add("dark");
    }
  }, [isLight]);

  useEffect(() => {
    document.documentElement.lang = languageRegion.language === "pt" ? "pt-PT" : "en-US";
  }, [languageRegion.language]);

  const handleAppearanceChange = (updated: AppearanceSettings) => {
    setAppearance(updated);
    try {
      localStorage.setItem("axion_office_appearance", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleLanguageRegionChange = (updated: LanguageRegionSettings) => {
    if (updated.language !== languageRegion.language) {
      setIsLanguageTransitioning(true);
      window.setTimeout(() => setIsLanguageTransitioning(false), 520);
    }
    setLanguageRegion(updated);
    try {
      localStorage.setItem("axion_office_language", JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <LanguageProvider language={languageRegion.language}>
    <div 
      id="axion-office-application-root" 
      data-theme={isLight ? "light" : "dark"}
      style={{
        "--axion-accent": activeAccent.hex,
        "--axion-accent-secondary": activeAccent.secondary,
        "--axion-accent-glow": activeAccent.glow,
        "--axion-accent-hover": `color-mix(in srgb, ${activeAccent.hex} 82%, white)`,
      } as CSSProperties}
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-500 ${
        isLight ? "bg-[#ffffff] text-slate-900 theme-light" : "bg-[#050609] text-white"
      }`}
    >
      <AnimatePresence>
        {isLanguageTransitioning && (
          <motion.div
            key={`language-transition-${languageRegion.language}`}
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: [0, 1, 0], backdropFilter: ["blur(0px)", "blur(10px)", "blur(0px)"] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[10000] pointer-events-none bg-[#050609]/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {screen === "welcome" ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <WelcomeScreen onEnter={() => setScreen("command-center")} />
          </motion.div>
        ) : (
          <motion.div
            key="command-center"
            initial={{ opacity: 0, filter: "blur(15px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(15px)" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full"
          >
            <CommandCenter 
              appearance={appearance}
              onAppearanceChange={handleAppearanceChange}
              commandCenterConfig={commandCenterConfig}
              onCommandCenterConfigChange={setCommandCenterConfig}
              languageRegion={languageRegion}
              onLanguageRegionChange={handleLanguageRegionChange}
              onBackToWelcome={() => setScreen("welcome")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </LanguageProvider>
  );
}
