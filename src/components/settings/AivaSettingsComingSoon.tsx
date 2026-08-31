/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Bot, 
  Cpu, 
  Mic, 
  Sliders, 
  Check, 
  Bell, 
  Workflow, 
  ShieldCheck, 
  Radio, 
  Terminal,
  Zap
} from "lucide-react";
import { SettingsSection, SettingsRow, SettingsToggle, SettingsButton, SettingsSegmentedControl } from "./SettingsControls";

export default function AivaSettingsComingSoon() {
  const [notifyOnRelease, setNotifyOnRelease] = useState(true);
  const [voiceActivation, setVoiceActivation] = useState(true);
  const [proactiveSuggestions, setProactiveSuggestions] = useState(true);
  const [privacyMode, setPrivacyMode] = useState<"standard" | "strict">("strict");

  return (
    <div className="flex flex-col gap-6">
      {/* 1. AIVA INTEL HERO */}
      <SettingsSection
        id="section-aiva-hero"
        title="AIVA Intelligence Engine"
        description="Autonomous Intelligent Virtual Architect — O copiloto operacional inteligente da sua organização."
        badge="Brevemente"
      >
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1322] to-[#070b12] border border-[#00f0ff]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-start gap-4 z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] shadow-lg shrink-0">
              <Sparkles size={24} className="animate-pulse" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white font-sans">
                  AIVA Copilot v1.0 Preview
                </span>
                <span className="text-[9px] font-mono tracking-widest uppercase bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded-full border border-[#00f0ff]/30">
                  EM DESENVOLVIMENTO
                </span>
              </div>
              <p className="text-xs text-white/60 font-sans max-w-lg leading-relaxed">
                AIVA está a ser calibrada com modelos de inteligência multimodal para orquestrar tarefas, atas automáticas, controlo ambiental de salas e alertas preditivos de projetos.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 z-10 shrink-0">
            <button
              type="button"
              onClick={() => setNotifyOnRelease(!notifyOnRelease)}
              className={`px-4 py-2.5 rounded-xl font-sans text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                notifyOnRelease 
                  ? "bg-[#00f0ff] text-[#050609] shadow-lg shadow-[#00f0ff]/20" 
                  : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {notifyOnRelease ? <Check size={14} className="stroke-[3]" /> : <Bell size={14} />}
              <span>{notifyOnRelease ? "Notificação Ativa" : "Notificar no Lançamento"}</span>
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* 2. UPCOMING PREFERENCES & CAPABILITIES */}
      <SettingsSection
        id="section-aiva-prefs"
        title="Preferências Planeadas para a AIVA"
        description="Configure previamente como a AIVA irá interagir com o seu espaço de trabalho assim que o módulo for ativado."
      >
        <SettingsRow
          label="Voice Wake-Word («Hey AIVA»)"
          description="Permitir ativação mãos-livres quando o AXION OFFICE estiver em primeiro plano."
        >
          <SettingsToggle
            id="toggle-aiva-voice"
            checked={voiceActivation}
            onChange={setVoiceActivation}
          />
        </SettingsRow>

        <SettingsRow
          label="Sugestões Proativas & Alertas de Risco"
          description="AIVA analisa o estado dos projetos e notifica o gestor antes de prazos críticos expirarem."
        >
          <SettingsToggle
            id="toggle-aiva-proactive"
            checked={proactiveSuggestions}
            onChange={setProactiveSuggestions}
          />
        </SettingsRow>

        <SettingsRow
          label="Nível de Privacidade e Processamento de Dados"
          description="Controlo de processamento local estrito vs. modelos em nuvem de alta capacidade."
        >
          <SettingsSegmentedControl<"standard" | "strict">
            id="privacy-mode-select"
            value={privacyMode}
            onChange={setPrivacyMode}
            options={[
              { value: "strict", label: "Local Estrito (Zero Retenção)" },
              { value: "standard", label: "Híbrido Avançado" },
            ]}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
