/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette, 
  Globe, 
  LayoutGrid, 
  Command as CommandIcon, 
  Bell, 
  FileText, 
  Link2, 
  ShieldCheck, 
  Users, 
  Building2, 
  Database, 
  Layers, 
  Search, 
  Check, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  AlertCircle,
  Undo2,
  Key
} from "lucide-react";
import { 
  SettingsCategory, 
  UserRole, 
  AppearanceSettings, 
  LanguageRegionSettings, 
  CommandCenterConfig, 
  NavigationSettings, 
  OrgBrandingSettings 
} from "../../types/settings";
import { 
  DEFAULT_APPEARANCE, 
  DEFAULT_LANGUAGE_REGION, 
  DEFAULT_COMMAND_CENTER, 
  DEFAULT_NAVIGATION, 
  DEFAULT_ORG_BRANDING,
  ACCENT_COLOR_OPTIONS
} from "../../data/settingsMockData";

// Sub-components
import PersonalAppearance from "./PersonalAppearance";
import PersonalLanguageRegion from "./PersonalLanguageRegion";
import PersonalCommandCenter from "./PersonalCommandCenter";
import PersonalNavigation from "./PersonalNavigation";
import WorkNotifications from "./WorkNotifications";
import WorkBriefingsAndMeetings from "./WorkBriefingsAndMeetings";
import WorkIntegrationsAndPrefs from "./WorkIntegrationsAndPrefs";
import AccountSecurityDevices from "./AccountSecurityDevices";
import OrgTeamAndRoles from "./OrgTeamAndRoles";
import OrgBrandingAndModules from "./OrgBrandingAndModules";
import OrgDataIntegrationsAudit from "./OrgDataIntegrationsAudit";
import WorkspaceProfilesExperimental from "./WorkspaceProfilesExperimental";
import AivaSettingsComingSoon from "./AivaSettingsComingSoon";
import { useLanguage } from "../../i18n/LanguageContext";

interface SettingsPageProps {
  initialAppearance?: AppearanceSettings;
  onAppearanceChange?: (appearance: AppearanceSettings) => void;
  initialCommandCenter?: CommandCenterConfig;
  onCommandCenterChange?: (config: CommandCenterConfig) => void;
  initialLanguageRegion?: LanguageRegionSettings;
  onLanguageRegionChange?: (settings: LanguageRegionSettings) => void;
}

export default function SettingsPage({
  initialAppearance = DEFAULT_APPEARANCE,
  onAppearanceChange,
  initialCommandCenter = DEFAULT_COMMAND_CENTER,
  onCommandCenterChange,
  initialLanguageRegion = DEFAULT_LANGUAGE_REGION,
  onLanguageRegionChange,
}: SettingsPageProps) {
  const { language, t } = useLanguage();
  const isPortuguese = language === "pt";
  // Navigation State
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>("appearance");
  const [searchQuery, setSearchQuery] = useState("");
  
  // User Role Switcher for testing Admin vs Employee views
  const [currentRole, setCurrentRole] = useState<UserRole>("founder");

  // Committed / Saved state snapshots
  const [savedAppearance, setSavedAppearance] = useState<AppearanceSettings>(initialAppearance);
  const [savedLanguageRegion, setSavedLanguageRegion] = useState<LanguageRegionSettings>(initialLanguageRegion);
  const [savedCommandCenter, setSavedCommandCenter] = useState<CommandCenterConfig>(initialCommandCenter);
  const [savedNavigation, setSavedNavigation] = useState<NavigationSettings>(DEFAULT_NAVIGATION);
  const [savedOrgBranding, setSavedOrgBranding] = useState<OrgBrandingSettings>(DEFAULT_ORG_BRANDING);

  // Live Draft Settings State (being actively edited)
  const [appearance, setAppearance] = useState<AppearanceSettings>(initialAppearance);
  const [languageRegion, setLanguageRegion] = useState<LanguageRegionSettings>(initialLanguageRegion);
  const [commandCenter, setCommandCenter] = useState<CommandCenterConfig>(initialCommandCenter);
  const [navigation, setNavigation] = useState<NavigationSettings>(DEFAULT_NAVIGATION);
  const [orgBranding, setOrgBranding] = useState<OrgBrandingSettings>(DEFAULT_ORG_BRANDING);

  // Toast / Notification
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // Check if any draft setting differs from its saved snapshot
  const hasUnsavedChanges = 
    JSON.stringify(appearance) !== JSON.stringify(savedAppearance) ||
    JSON.stringify(languageRegion) !== JSON.stringify(savedLanguageRegion) ||
    JSON.stringify(commandCenter) !== JSON.stringify(savedCommandCenter) ||
    JSON.stringify(navigation) !== JSON.stringify(savedNavigation) ||
    JSON.stringify(orgBranding) !== JSON.stringify(savedOrgBranding);

  // Active accent color details
  const currentAccentOption = ACCENT_COLOR_OPTIONS.find((c) => c.id === appearance.accentColor) || ACCENT_COLOR_OPTIONS[0];

  const handleAppearanceUpdate = (updated: AppearanceSettings) => {
    setAppearance(updated);
    if (onAppearanceChange) {
      onAppearanceChange(updated);
    }
  };

  const showToast = (msg: string) => {
    setSavedNotification(msg);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  const handleSaveChanges = () => {
    setSavedAppearance(appearance);
    setSavedLanguageRegion(languageRegion);
    setSavedCommandCenter(commandCenter);
    setSavedNavigation(navigation);
    setSavedOrgBranding(orgBranding);

    try {
      localStorage.setItem("axion_office_appearance", JSON.stringify(appearance));
      localStorage.setItem("axion_office_language", JSON.stringify(languageRegion));
      localStorage.setItem("axion_office_command", JSON.stringify(commandCenter));
      localStorage.setItem("axion_office_nav", JSON.stringify(navigation));
    } catch (e) {
      // Storage unavailable fallback
    }

    if (onAppearanceChange) {
      onAppearanceChange(appearance);
    }
    if (onCommandCenterChange) {
      onCommandCenterChange(commandCenter);
    }
    if (onLanguageRegionChange) {
      onLanguageRegionChange(languageRegion);
    }

    showToast("Preferências guardadas com sucesso no AXION OFFICE.");
  };

  const handleDiscardChanges = () => {
    setAppearance(savedAppearance);
    setLanguageRegion(savedLanguageRegion);
    setCommandCenter(savedCommandCenter);
    setNavigation(savedNavigation);
    setOrgBranding(savedOrgBranding);

    if (onAppearanceChange) {
      onAppearanceChange(savedAppearance);
    }
    if (onLanguageRegionChange) {
      onLanguageRegionChange(savedLanguageRegion);
    }

    showToast("Alterações descartadas.");
  };

  const isOrgAdmin = currentRole === "founder" || currentRole === "admin";

  // Category navigation structure (without accessibility)
  const navSections = [
    {
      group: isPortuguese ? "PESSOAL" : "PERSONAL",
      items: [
        { id: "appearance" as SettingsCategory, label: isPortuguese ? "Aspeto" : "Appearance", desc: isPortuguese ? "Tema, luz e ambiente visual" : "Theme, lighting and visual atmosphere", icon: Palette },
        { id: "language" as SettingsCategory, label: t("settings.language"), desc: t("settings.languageDesc"), icon: Globe },
        { id: "command-center" as SettingsCategory, label: isPortuguese ? "O meu Command Center" : "My Command Center", desc: isPortuguese ? "Módulos da Home e respetiva ordem" : "Home modules and display order", icon: LayoutGrid },
        { id: "navigation" as SettingsCategory, label: isPortuguese ? "Atalhos" : "Shortcuts", desc: isPortuguese ? "Atalhos rápidos e comandos de teclado" : "Quick navigation and keyboard commands", icon: CommandIcon },
      ],
    },
    {
      group: isPortuguese ? "TRABALHO" : "WORK",
      items: [
        { id: "notifications" as SettingsCategory, label: isPortuguese ? "Notificações" : "Notifications", desc: isPortuguese ? "Canais e prioridades" : "Channels and priorities", icon: Bell },
        { id: "briefings" as SettingsCategory, label: isPortuguese ? "Briefings e Reuniões" : "Briefings and Meetings", desc: isPortuguese ? "Resumos e atas inteligentes" : "Intelligent summaries and minutes", icon: FileText },
        { id: "integrations" as SettingsCategory, label: isPortuguese ? "Integrações e Horário" : "Integrations and Schedule", desc: isPortuguese ? "Contas ligadas e disponibilidade" : "Connected accounts and availability", icon: Link2 },
        { id: "aiva" as SettingsCategory, label: "AIVA Intelligence", desc: isPortuguese ? "Copiloto operacional inteligente" : "Intelligent operational copilot", icon: Sparkles, badge: isPortuguese ? "BREVEMENTE" : "COMING SOON" },
      ],
    },
    {
      group: isPortuguese ? "CONTA" : "ACCOUNT",
      items: [
        { id: "security" as SettingsCategory, label: isPortuguese ? "Segurança e Dispositivos" : "Security and Devices", desc: isPortuguese ? "2FA, passkeys e sessões ativas" : "2FA, passkeys and active sessions", icon: ShieldCheck },
      ],
    },
    ...(isOrgAdmin
      ? [
          {
            group: isPortuguese ? "ORGANIZAÇÃO" : "ORGANIZATION",
            badge: isPortuguese ? "APENAS ADMIN" : "ADMIN ONLY",
            items: [
              { id: "org-team" as SettingsCategory, label: isPortuguese ? "Equipa e Cargos" : "Team and Roles", desc: isPortuguese ? "Diretório de equipa e permissões" : "Team directory and permissions", icon: Users },
              { id: "org-branding" as SettingsCategory, label: isPortuguese ? "Marca e Módulos" : "Branding and Modules", desc: isPortuguese ? "Identidade global e capacidades" : "Global identity and capabilities", icon: Building2 },
              { id: "org-data" as SettingsCategory, label: isPortuguese ? "Dados, Integrações e Auditoria" : "Data, Integrations and Audit", desc: isPortuguese ? "Retenção, RGPD e registos globais" : "Retention, GDPR and global logs", icon: Database },
            ],
          },
        ]
      : []),
    {
      group: isPortuguese ? "PERFIS" : "PROFILES",
      badge: isPortuguese ? "EXPERIMENTAL" : "EXPERIMENTAL",
      items: [
        { id: "workspace-profiles" as SettingsCategory, label: isPortuguese ? "Perfis do Workspace" : "Workspace Profiles", desc: isPortuguese ? "Predefinições de trabalho, foco e reunião" : "Work, focus and meeting presets", icon: Layers },
      ],
    },
  ];

  // Render the active sub-component
  const renderSubComponent = () => {
    switch (activeCategory) {
      case "appearance":
        return (
          <PersonalAppearance
            settings={appearance}
            onChange={handleAppearanceUpdate}
            allowedTokens={orgBranding.allowedAccentTokens}
          />
        );
      case "language":
        return (
          <PersonalLanguageRegion
            settings={languageRegion}
            onChange={(updated) => {
              setLanguageRegion(updated);
              onLanguageRegionChange?.(updated);
            }}
          />
        );
      case "command-center":
        return (
          <PersonalCommandCenter
            settings={commandCenter}
            onChange={setCommandCenter}
          />
        );
      case "navigation":
        return (
          <PersonalNavigation
            settings={navigation}
            onChange={setNavigation}
          />
        );
      case "notifications":
        return <WorkNotifications userRole={currentRole} />;
      case "briefings":
        return <WorkBriefingsAndMeetings />;
      case "integrations":
        return <WorkIntegrationsAndPrefs />;
      case "aiva":
        return <AivaSettingsComingSoon />;
      case "security":
        return <AccountSecurityDevices />;
      case "org-team":
        return <OrgTeamAndRoles />;
      case "org-branding":
        return <OrgBrandingAndModules />;
      case "org-data":
        return <OrgDataIntegrationsAudit />;
      case "workspace-profiles":
        return <WorkspaceProfilesExperimental />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 py-4 pb-28 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {savedNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 font-sans font-semibold text-xs px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2"
            style={{
              backgroundColor: currentAccentOption.hex,
              color: "#050609",
              boxShadow: `0 0 25px ${currentAccentOption.glow}`
            }}
          >
            <Check size={14} className="stroke-[3]" />
            <span>{savedNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d121c]/80 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 shadow-2xl">
        <motion.div 
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1"
        >
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white uppercase">
              DEFINIÇÕES, <span className="text-white/70 font-normal">AXION CORE CONFIG</span>
            </h1>
            <span 
              className="text-[11px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
              style={{
                color: currentAccentOption.hex,
                backgroundColor: `${currentAccentOption.hex}18`,
                borderColor: `${currentAccentOption.hex}30`
              }}
            >
              AXION OPERATING SYSTEM
            </span>
          </div>
          <p className="text-xs md:text-sm text-white/50 font-sans max-w-xl">
            Personalize a sua experiência no AXION OFFICE mantendo a integridade visual, segurança e regras da organização.
          </p>
        </motion.div>

        {/* Role Simulator Switcher & Status Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mock Role Switcher Pill */}
          <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-2xl">
            <UserCheck size={14} style={{ color: currentAccentOption.hex }} />
            <span className="text-[11px] font-mono text-white/50 uppercase">CARGO SIMULADO:</span>
            <select
              value={currentRole}
              onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentRole(newRole);
                if (newRole !== "founder" && newRole !== "admin" && activeCategory.startsWith("org-")) {
                  setActiveCategory("appearance");
                }
                showToast(`Visualização alternada para cargo: ${newRole.toUpperCase()}`);
              }}
              style={{ color: currentAccentOption.hex }}
              className="bg-transparent text-xs font-mono font-semibold outline-none cursor-pointer"
            >
              <option value="founder" className="bg-[#121824] text-white">Founder (Acesso Total)</option>
              <option value="admin" className="bg-[#121824] text-white">Admin</option>
              <option value="employee" className="bg-[#121824] text-white">Employee (Sem Admin)</option>
            </select>
          </div>

          {/* Quick Save button if user wants to save directly */}
          {hasUnsavedChanges && (
            <button
              type="button"
              onClick={handleSaveChanges}
              style={{
                backgroundColor: currentAccentOption.hex,
                color: "#050609",
                boxShadow: `0 0 15px ${currentAccentOption.glow}`
              }}
              className="px-4 py-1.5 rounded-2xl text-xs font-sans font-semibold transition-all cursor-pointer flex items-center gap-1.5 hover:brightness-110 active:scale-95"
            >
              <Check size={13} className="stroke-[3]" />
              <span>Guardar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Settings Grid Layout: 2 Columns (Navigation / Content) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sub-Navigation (4 Cols) */}
        <div className="lg:col-span-4 bg-[#0d121c]/70 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-4 md:p-5 flex flex-col gap-6 shadow-xl sticky top-6">
          {/* Search Box */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Pesquisar definições..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121824] border border-white/10 rounded-2xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 outline-none transition-colors"
              style={{
                borderColor: searchQuery ? currentAccentOption.hex : undefined
              }}
            />
          </div>

          {/* Navigation Categories Groups */}
          <div className="flex flex-col gap-5">
            {navSections.map((sec, secIdx) => {
              const visibleItems = sec.items.filter(
                (item) =>
                  item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.desc.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (visibleItems.length === 0) return null;

              return (
                <div key={secIdx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between px-2 pb-1">
                    <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">
                      {sec.group}
                    </span>
                    {sec.badge && (
                      <span 
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded border"
                        style={{
                          color: currentAccentOption.hex,
                          backgroundColor: `${currentAccentOption.hex}18`,
                          borderColor: `${currentAccentOption.hex}30`
                        }}
                      >
                        {sec.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {visibleItems.map((item) => {
                      const isSelected = activeCategory === item.id;
                      const Icon = item.icon;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setActiveCategory(item.id)}
                          className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer text-left ${
                            isSelected
                              ? "bg-white/[0.1] border border-white/20 text-white shadow-md"
                              : "hover:bg-white/[0.04] text-white/60 hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-7 h-7 rounded-xl flex items-center justify-center transition-colors"
                              style={{
                                backgroundColor: isSelected ? currentAccentOption.hex : "rgba(255,255,255,0.05)",
                                color: isSelected ? "#050609" : "rgba(255,255,255,0.6)"
                              }}
                            >
                              <Icon size={14} />
                            </div>

                            <div className="flex flex-col">
                              <span className="text-xs font-sans font-medium tracking-wide">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-white/35 font-sans truncate max-w-[170px]">
                                {item.desc}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={14}
                            style={{
                              color: isSelected ? currentAccentOption.hex : undefined
                            }}
                            className={`transition-transform duration-200 ${
                              isSelected
                                ? "translate-x-0.5"
                                : "text-white/20 group-hover:text-white/40"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Dynamic Content Area (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderSubComponent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* FLOATING BOTTOM POPUP / BAR FOR UNSAVED CHANGES (AS REQUESTED BY USER) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {hasUnsavedChanges && (
          <motion.div
            id="unsaved-changes-bottom-popup"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-2xl bg-[#0b101c]/95 border border-white/20 backdrop-blur-2xl rounded-2xl md:rounded-3xl p-4 md:px-6 md:py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col sm:flex-row items-center justify-between gap-4 select-none"
          >
            {/* Left side info */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border"
                style={{
                  backgroundColor: `${currentAccentOption.hex}18`,
                  borderColor: `${currentAccentOption.hex}30`,
                  color: currentAccentOption.hex
                }}
              >
                <AlertCircle size={18} />
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs font-sans font-semibold text-white tracking-wide flex items-center gap-2">
                  Foram feitas alterações
                  <span 
                    className="inline-block w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: currentAccentOption.hex }}
                  />
                </span>
                <span className="text-[11px] text-white/55 font-sans">
                  Pretende guardar as alterações ou descartar?
                </span>
              </div>
            </div>

            {/* Right side actions (Descartar / Guardar) */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                id="btn-discard-settings-changes"
                type="button"
                onClick={handleDiscardChanges}
                className="px-4 py-2 rounded-xl text-xs font-sans font-medium text-white/70 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <Undo2 size={13} />
                <span>Descartar</span>
              </button>

              <button
                id="btn-save-settings-changes"
                type="button"
                onClick={handleSaveChanges}
                style={{
                  backgroundColor: currentAccentOption.hex,
                  color: "#050609",
                  boxShadow: `0 0 20px ${currentAccentOption.glow}`
                }}
                className="px-5 py-2 rounded-xl text-xs font-sans font-bold transition-all cursor-pointer flex items-center gap-1.5 hover:brightness-110 active:scale-95"
              >
                <Check size={14} className="stroke-[3]" />
                <span>Guardar Alterações</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
