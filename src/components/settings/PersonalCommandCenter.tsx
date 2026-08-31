/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Check, 
  ArrowUp, 
  ArrowDown, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Layers,
  Sparkles,
  LayoutGrid
} from "lucide-react";
import { CommandCenterConfig, CommandCenterModuleItem } from "../../types/settings";
import { DEFAULT_COMMAND_CENTER } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsButton,
  SettingsSelect
} from "./SettingsControls";

interface PersonalCommandCenterProps {
  settings: CommandCenterConfig;
  onChange: (updated: CommandCenterConfig) => void;
}

export default function PersonalCommandCenter({
  settings,
  onChange,
}: PersonalCommandCenterProps) {
  const handleToggleModule = (moduleId: string) => {
    const updated = settings.modules.map((m) => {
      if (m.id === moduleId) {
        return { ...m, visible: !m.visible };
      }
      return m;
    });
    onChange({ ...settings, modules: updated });
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= settings.modules.length) return;

    const newModules = [...settings.modules];
    const item = newModules[index];
    newModules[index] = newModules[targetIndex];
    newModules[targetIndex] = item;

    onChange({ ...settings, modules: newModules });
  };

  const handleResetDefault = () => {
    onChange(JSON.parse(JSON.stringify(DEFAULT_COMMAND_CENTER)));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. MODULES REORDER & VISIBILITY */}
      <SettingsSection
        id="section-my-command-center"
        title="My Command Center"
        description="Escolha quais os módulos que aparecem na sua tela inicial e ordene-os por prioridade de fluxo de trabalho."
        badge="Personalizável"
        action={
          <SettingsButton
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={handleResetDefault}
          >
            Reset to AXION Default
          </SettingsButton>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Module List Manager (Left 7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <span className="text-[11px] font-mono tracking-wider text-white/50 uppercase mb-1">
              MÓDULOS DISPONÍVEIS & ORDENAÇÃO
            </span>

            {settings.modules.map((mod, index) => {
              const isFirst = index === 0;
              const isLast = index === settings.modules.length - 1;

              return (
                <motion.div
                  key={mod.id}
                  layout
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    mod.visible
                      ? "bg-white/[0.04] border-white/10 hover:border-white/20"
                      : "bg-white/[0.01] border-white/[0.04] opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Visibility Toggle Checkbox */}
                    <button
                      type="button"
                      onClick={() => handleToggleModule(mod.id)}
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all cursor-pointer ${
                        mod.visible
                          ? "bg-[#00f0ff] border-[#00f0ff] text-[#050609]"
                          : "border-white/20 hover:border-white/40"
                      }`}
                    >
                      {mod.visible && <Check size={13} className="stroke-[3]" />}
                    </button>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-sans font-medium text-white tracking-wide">
                          {mod.label}
                        </span>
                        {mod.isCore && (
                          <span className="text-[9px] font-mono text-white/40 bg-white/5 px-1.5 py-0.2 rounded">
                            CORE
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-white/40">
                        Categoria: {mod.category}
                      </span>
                    </div>
                  </div>

                  {/* Move Up / Down Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => handleMove(index, "up")}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      title="Mover para cima"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => handleMove(index, "down")}
                      className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                      title="Mover para baixo"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Live Mini Preview of Command Center Layout (Right 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <span className="text-[11px] font-mono tracking-wider text-[#00f0ff] uppercase">
              PREVIEW DA DASHBOARD
            </span>

            <div className="w-full bg-[#080d16] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl relative overflow-hidden min-h-[300px]">
              {/* Header simulator */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
                  <span className="text-[9px] font-mono text-white/70">AXION OFFICE</span>
                </div>
                <span className="text-[9px] font-mono text-white/40">23:45</span>
              </div>

              {/* Modules grid layout simulator */}
              <div className="grid grid-cols-2 gap-2 flex-1">
                {settings.modules
                  .filter((m) => m.visible)
                  .slice(0, 6)
                  .map((m, idx) => (
                    <motion.div
                      key={m.id}
                      layout
                      className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-sans font-semibold text-white/90 truncate">
                          {m.label}
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      </div>
                      <div className="flex flex-col gap-1 mt-2">
                        <div className="w-full h-1 bg-white/10 rounded" />
                        <div className="w-2/3 h-1 bg-white/5 rounded" />
                      </div>
                    </motion.div>
                  ))}
              </div>

              {settings.modules.filter((m) => m.visible).length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-white/40 text-xs">
                  Nenhum módulo ativo. Selecione módulos na lista ao lado.
                </div>
              )}

              {/* Status footer */}
              <div className="text-[9px] font-mono text-center text-white/30 pt-1 border-t border-white/5">
                {settings.modules.filter((m) => m.visible).length} módulos selecionados para exibição
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
