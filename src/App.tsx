/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import WelcomeScreen from "./components/welcome/WelcomeScreen";
import CommandCenter from "./components/command/CommandCenter";
import { AppearanceSettings } from "./types/settings";
import { DEFAULT_APPEARANCE } from "./data/settingsMockData";

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

  const handleAppearanceChange = (updated: AppearanceSettings) => {
    setAppearance(updated);
    try {
      localStorage.setItem("axion_office_appearance", JSON.stringify(updated));
    } catch (e) {}
  };

  return (
    <div 
      id="axion-office-application-root" 
      data-theme={isLight ? "light" : "dark"}
      className={`relative w-screen h-screen overflow-hidden select-none transition-colors duration-500 ${
        isLight ? "bg-[#ffffff] text-slate-900 theme-light" : "bg-[#050609] text-white"
      }`}
    >
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
              onBackToWelcome={() => setScreen("welcome")} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
