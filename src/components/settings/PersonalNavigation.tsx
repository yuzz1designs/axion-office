/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Command, Key, Sparkles, Zap, Search, LayoutGrid, Sliders } from "lucide-react";
import { NavigationSettings } from "../../types/settings";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsSelect 
} from "./SettingsControls";

interface PersonalNavigationProps {
  settings: NavigationSettings;
  onChange: (updated: NavigationSettings) => void;
}

const SHORTCUT_CATEGORIES = [
  {
    category: "GLOBAL & SPOTLIGHT",
    items: [
      { keys: ["⌘", "K"], label: "Global Search / Spotlight", desc: "Pesquisa rápida de projetos, clientes, nós e comandos" },
      { keys: ["⌘", "/"], label: "Command Palette", desc: "Abrir catálogo de ações rápidas do sistema" },
      { keys: ["⌘", ","], label: "Open Settings", desc: "Aceder às definições do AXION OFFICE" },
    ]
  },
  {
    category: "AÇÕES DE PRODUTIVIDADE",
    items: [
      { keys: ["⌘", "T"], label: "New Task", desc: "Criar nova tarefa imediata com prioridade" },
      { keys: ["⌘", "M"], label: "New Meeting", desc: "Agendar reunião rápida ou convidar equipa" },
      { keys: ["⌘", "N"], label: "Quick Note", desc: "Registar nota rápida no espaço de trabalho" },
    ]
  },
  {
    category: "INTELIGÊNCIA & AIVA",
    items: [
      { keys: ["⌘", "J"], label: "AIVA Voice Assistant", desc: "Ativar escuta e comando vocal da AIVA" },
      { keys: ["⌘", "I"], label: "Instant Telemetry Brief", desc: "Gerar resumo inteligente do estado do escritório" },
      { keys: ["⌘", "F"], label: "Toggle Focus Mode", desc: "Iniciar sessão de foco imersivo de 90 min" },
    ]
  },
  {
    category: "NAVEGAÇÃO RÁPIDA",
    items: [
      { keys: ["⌘", "1"], label: "Home / Overview", desc: "Ir para o Painel Principal" },
      { keys: ["⌘", "2"], label: "Spaces & Zones", desc: "Ver plantas físicas e salas" },
      { keys: ["⌘", "3"], label: "Climate & Telemetry", desc: "Ver sensores e eficiência energética" },
    ]
  }
];

export default function PersonalNavigation({
  settings,
  onChange,
}: PersonalNavigationProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* KEYBOARD SHORTCUTS PALETTE */}
      <SettingsSection
        id="section-shortcuts"
        title="Keyboard Shortcuts"
        description="Atalhos globais de produtividade para navegação ultrarrápida no AXION OFFICE."
        badge="Atalhos Rápidos"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHORTCUT_CATEGORIES.map((cat, ci) => (
            <div key={ci} className="flex flex-col gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] font-mono tracking-widest text-[var(--axion-accent)] uppercase">
                {cat.category}
              </span>
              
              <div className="flex flex-col gap-2 mt-1">
                {cat.items.map((sc, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-white/10 flex items-center justify-between transition-colors"
                  >
                    <div className="flex flex-col gap-0.5 pr-2">
                      <span className="text-xs font-semibold text-white tracking-wide font-sans">
                        {sc.label}
                      </span>
                      <span className="text-[11px] text-white/40 font-sans line-clamp-1">
                        {sc.desc}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {sc.keys.map((k, ki) => (
                        <kbd
                          key={ki}
                          className="min-w-[22px] h-5 px-1.5 rounded-md bg-white/10 border border-white/20 text-white font-mono text-[10px] font-semibold flex items-center justify-center shadow-sm"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs text-white/40">
          <span>Pressione <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-white">/</kbd> em qualquer ecrã para abrir os atalhos.</span>
          <span className="text-[var(--axion-accent)]/70 font-mono text-[10px]">AXION KEYMAP v2.4</span>
        </div>
      </SettingsSection>
    </div>
  );
}
