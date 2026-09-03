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

interface AuthProfile {
  email: string;
  name: string;
  role: string;
  phone: string;
  initials: string;
  accentColor: string;
}

interface AuthStatus {
  configured: boolean;
  authenticated: boolean;
  email?: string;
  profile?: AuthProfile | null;
  profileRequired: boolean;
  missingJoaoEmail?: boolean;
}

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "command-center">("welcome");
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [authError, setAuthError] = useState("");
  const [profileForm, setProfileForm] = useState({ name: "", role: "", phone: "", initials: "" });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

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

  useEffect(() => {
    fetch("/api/auth/status")
      .then((response) => response.json())
      .then((status: AuthStatus) => {
        setAuthStatus(status);
        if (status.profile) {
          setProfileForm({
            name: status.profile.name || "",
            role: status.profile.role || "",
            phone: status.profile.phone || "",
            initials: status.profile.initials || "",
          });
        }
      })
      .catch(() => setAuthError("Não foi possível verificar o login."));
  }, []);

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

  const handleProfileSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSavingProfile(true);
    setAuthError("");
    try {
      const response = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "PROFILE_FAILED");
      setAuthStatus((current) => current ? { ...current, profile: result.profile, profileRequired: false } : current);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : "Não foi possível guardar o perfil.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const authShell = (children: React.ReactNode) => (
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
        {children}
      </div>
    </LanguageProvider>
  );

  if (!authStatus) {
    return authShell(<div className="grid h-full place-items-center text-sm text-white/60">A verificar acesso AXION...</div>);
  }

  if (!authStatus.authenticated) {
    const params = new URLSearchParams(window.location.search);
    const authReason = params.get("auth");
    return authShell(
      <div className="grid h-full place-items-center px-6">
        <div className="w-full max-w-md rounded border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">AXION OFFICE</p>
          <h1 className="mt-4 text-3xl font-bold text-white">Acesso autorizado</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Entra com uma das contas Google autorizadas para usar o dashboard.</p>
          {authReason === "unauthorized" && <p className="mt-4 rounded border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">Esta conta Google não está autorizada.</p>}
          {!authStatus.configured && <p className="mt-4 rounded border border-amber-400/30 bg-amber-500/10 p-3 text-sm text-amber-100">Login ainda não configurado no servidor.</p>}
          {authError && <p className="mt-4 text-sm text-red-200">{authError}</p>}
          <a
            href="/api/auth/start"
            className="mt-6 flex h-11 items-center justify-center rounded bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200"
          >
            Entrar com Google
          </a>
          <p className="mt-4 text-xs text-white/40">Falta adicionar o email do João à lista de contas autorizadas.</p>
        </div>
      </div>
    );
  }

  if (authStatus.profileRequired) {
    return authShell(
      <div className="grid h-full place-items-center px-6">
        <form onSubmit={handleProfileSubmit} className="w-full max-w-lg rounded border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/70">{authStatus.email}</p>
          <h1 className="mt-4 text-3xl font-bold text-white">Criar perfil</h1>
          <div className="mt-6 grid gap-4">
            <input className="rounded border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Nome" value={profileForm.name} onChange={(event) => setProfileForm({ ...profileForm, name: event.target.value })} />
            <input className="rounded border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Função / cargo" value={profileForm.role} onChange={(event) => setProfileForm({ ...profileForm, role: event.target.value })} />
            <input className="rounded border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Telefone opcional" value={profileForm.phone} onChange={(event) => setProfileForm({ ...profileForm, phone: event.target.value })} />
            <input className="rounded border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-amber-300" placeholder="Iniciais" value={profileForm.initials} onChange={(event) => setProfileForm({ ...profileForm, initials: event.target.value })} />
          </div>
          {authError && <p className="mt-4 text-sm text-red-200">{authError}</p>}
          <button type="submit" disabled={isSavingProfile} className="mt-6 h-11 w-full rounded bg-amber-300 px-4 text-sm font-bold text-black transition hover:bg-amber-200 disabled:opacity-60">
            {isSavingProfile ? "A guardar..." : "Guardar e entrar"}
          </button>
        </form>
      </div>
    );
  }

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
