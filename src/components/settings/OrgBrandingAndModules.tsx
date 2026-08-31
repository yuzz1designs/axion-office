/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building, 
  Layers, 
  Lock, 
  Check, 
  ShieldAlert, 
  Sparkles, 
  Globe, 
  Palette 
} from "lucide-react";
import { 
  OrgBrandingSettings, 
  OrgModuleSetting, 
  AccentColorToken 
} from "../../types/settings";
import { 
  DEFAULT_ORG_BRANDING, 
  ORG_MODULES_MOCK, 
  ACCENT_COLOR_OPTIONS 
} from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsButton 
} from "./SettingsControls";

export default function OrgBrandingAndModules() {
  const [branding, setBranding] = useState<OrgBrandingSettings>(DEFAULT_ORG_BRANDING);
  const [modules, setModules] = useState<OrgModuleSetting[]>(ORG_MODULES_MOCK);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const toggleAccentAllowed = (token: AccentColorToken) => {
    setBranding((prev) => {
      const exists = prev.allowedAccentColors.includes(token);
      if (exists && prev.allowedAccentColors.length <= 1) {
        showToast("Pelo menos um tom de cor deve permanecer aprovado.");
        return prev;
      }
      const updated = exists
        ? prev.allowedAccentColors.filter((t) => t !== token)
        : [...prev.allowedAccentColors, token];
      return { ...prev, allowedAccentColors: updated };
    });
  };

  const toggleModuleActive = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, enabled: !m.enabled } : m))
    );
    showToast("Estado de ativação de módulo global atualizado.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] flex items-center justify-between animate-fadeIn">
          <span>{toastMsg}</span>
          <span className="text-white/40 text-[10px]">Configuração Global</span>
        </div>
      )}

      {/* 1. WORKSPACE BRANDING & IDENTITY GUARDRAILS */}
      <SettingsSection
        id="section-org-branding"
        title="Workspace Identity & Brand Guardrails"
        description="Definições de marca corporativa que se aplicam a toda a organização AXION."
        badge="Identidade"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-white/90 font-sans">Workspace Display Name</span>
            <input
              type="text"
              value={branding.workspaceName}
              onChange={(e) => setBranding({ ...branding, workspaceName: e.target.value })}
              className="bg-[#121824] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-sans outline-none focus:border-[#00f0ff]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-white/90 font-sans">Company Name</span>
            <input
              type="text"
              value={branding.companyName}
              onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
              className="bg-[#121824] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-sans outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        <SettingsRow
          label="Corporate Theme Default"
          description="Padrão inicial atribuído a novos membros ao acederem pela primeira vez."
        >
          <SettingsSegmentedControl<OrgBrandingSettings["defaultTheme"]>
            value={branding.defaultTheme}
            onChange={(val) => setBranding({ ...branding, defaultTheme: val })}
            options={[
              { value: "dark", label: "Dark (Default)" },
              { value: "light", label: "Light" },
              { value: "system", label: "System Sync" },
            ]}
          />
        </SettingsRow>

        {/* Allowed Accent Color Tokens Palette Manager */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-white font-sans tracking-wide">
              Paleta Corporativa de Cores Permitidas
            </span>
            <span className="text-[11px] text-white/40 font-sans">
              Os colaboradores apenas poderão escolher os tons de destaque aprovados aqui pelos Founders.
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {ACCENT_COLOR_OPTIONS.map((opt) => {
              const isAllowed = branding.allowedAccentColors.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleAccentAllowed(opt.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-all cursor-pointer ${
                    isAllowed
                      ? "bg-white/[0.08] border-white/30 text-white"
                      : "bg-white/[0.01] border-white/[0.04] text-white/30 hover:text-white/60"
                  }`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: opt.hex }}
                  >
                    {isAllowed && <Check size={9} className="text-[#050609] stroke-[3]" />}
                  </div>
                  <span className="text-xs font-sans font-medium">{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Guardrail Callout */}
        <div className="p-4 rounded-2xl bg-amber-400/[0.03] border border-amber-400/20 flex items-center gap-3">
          <ShieldAlert size={18} className="text-amber-400 shrink-0" />
          <p className="text-xs text-white/70 font-sans leading-relaxed">
            <strong className="text-amber-300 font-medium">Regra de Ouro AXION:</strong> A personalização individual nunca substitui nem desvirtua a identidade visual global, as regras de segurança ou as restrições de confidencialidade estabelecidas pela organização.
          </p>
        </div>
      </SettingsSection>

      {/* 2. GLOBAL MODULES ACTIVATION */}
      <SettingsSection
        id="section-org-modules"
        title="Global Modules & Capabilities"
        description="Ative ou desative módulos funcionais para todo o tenant da organização."
        badge="Módulos"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <div
              key={mod.id}
              className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                mod.enabled
                  ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                  : "bg-white/[0.01] border-white/[0.04] opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white font-sans tracking-wide">
                      {mod.name}
                    </span>
                    {mod.dataCountInfo && (
                      <span className="text-[9px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-1.5 py-0.2 rounded">
                        {mod.dataCountInfo}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/40 font-sans mt-0.5">
                    {mod.description}
                  </span>
                </div>

                <SettingsToggle
                  checked={mod.enabled}
                  onChange={() => toggleModuleActive(mod.id)}
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 pt-2 border-t border-white/5">
                <span>Acesso: {mod.accessLevel.toUpperCase()}</span>
                <span>{mod.enabled ? "Ativo" : "Desativado"}</span>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
