/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Moon, Zap, Sparkles, Check, Clock, AlertCircle } from "lucide-react";
import { QuietHoursSettings, FocusModeSettings } from "../../types/settings";
import { DEFAULT_QUIET_HOURS, DEFAULT_FOCUS_MODE } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsSlider,
  SettingsSelect
} from "./SettingsControls";

export default function WorkFocusAndQuiet() {
  const [quiet, setQuiet] = useState<QuietHoursSettings>(DEFAULT_QUIET_HOURS);
  const [focus, setFocus] = useState<FocusModeSettings>(DEFAULT_FOCUS_MODE);

  const toggleDay = (day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun") => {
    setQuiet((prev) => {
      const exists = prev.activeDays.includes(day);
      return {
        ...prev,
        activeDays: exists
          ? prev.activeDays.filter((d) => d !== day)
          : [...prev.activeDays, day],
      };
    });
  };

  const daysList: { id: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"; label: string }[] = [
    { id: "mon", label: "Seg" },
    { id: "tue", label: "Ter" },
    { id: "wed", label: "Qua" },
    { id: "thu", label: "Qui" },
    { id: "fri", label: "Sex" },
    { id: "sat", label: "Sáb" },
    { id: "sun", label: "Dom" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. QUIET HOURS / DO NOT DISTURB */}
      <SettingsSection
        id="section-quiet-hours"
        title="Quiet Hours (Do Not Disturb)"
        description="Silencia notificações fora do horário normal de trabalho, protegendo o teu tempo pessoal."
        badge="Bem-estar"
      >
        <SettingsRow
          label="Enable Quiet Hours"
          description="Ativa o bloqueio de notificações não urgentes no período noturno."
        >
          <SettingsToggle
            checked={quiet.enabled}
            onChange={(val) => setQuiet({ ...quiet, enabled: val })}
          />
        </SettingsRow>

        {quiet.enabled && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-white/60 font-sans">Início do Período de Silêncio</span>
                <input
                  type="time"
                  value={quiet.startTime}
                  onChange={(e) => setQuiet({ ...quiet, startTime: e.target.value })}
                  className="bg-[#121824] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-[var(--axion-accent)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-white/60 font-sans">Fim do Período de Silêncio</span>
                <input
                  type="time"
                  value={quiet.endTime}
                  onChange={(e) => setQuiet({ ...quiet, endTime: e.target.value })}
                  className="bg-[#121824] border border-white/15 rounded-xl px-3.5 py-2 text-sm text-white font-mono outline-none focus:border-[var(--axion-accent)]"
                />
              </div>
            </div>

            <SettingsRow
              label="Active Days"
              description="Dias da semana em que o período de silêncio é imposto automaticamente."
            >
              <div className="flex flex-wrap gap-1.5">
                {daysList.map((d) => {
                  const isActive = quiet.activeDays.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => toggleDay(d.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-[var(--axion-accent)] text-[#050609] font-semibold shadow-[0_0_10px_color-mix(in_srgb,var(--axion-accent)_30%,transparent)]"
                          : "bg-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </SettingsRow>

            <SettingsRow
              label="Allow Critical Notifications"
              description="Alertas de segurança e prazos com menos de 1 hora furam o período de silêncio."
            >
              <SettingsToggle
                checked={quiet.allowCriticalDuringQuiet}
                onChange={(val) => setQuiet({ ...quiet, allowCriticalDuringQuiet: val })}
              />
            </SettingsRow>
          </>
        )}
      </SettingsSection>

      {/* 2. FOCUS MODE */}
      <SettingsSection
        id="section-focus-mode"
        title="Focus Mode Engine"
        description="Sessões de imersão profunda (Deep Work). Reduz o ruído visual e sonoro para máxima produtividade."
        badge="Deep Work"
      >
        <SettingsRow
          label="Default Session Duration"
          description="Duração padrão ao iniciar uma sessão de foco rápido no Command Center."
        >
          <SettingsSegmentedControl<number>
            value={focus.defaultSessionMinutes}
            onChange={(m) => setFocus({ ...focus, defaultSessionMinutes: Number(m) })}
            options={[
              { value: 45, label: "45 min" },
              { value: 60, label: "60 min" },
              { value: 90, label: "90 min (Padrão AXION)" },
              { value: 120, label: "120 min" },
            ]}
          />
        </SettingsRow>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
          {[
            { key: "silenceNormalNotifications", label: "Silence Normal Notifications", desc: "Suprime popups e badges sonoros" },
            { key: "hideActivityFeed", label: "Hide Activity Feed", desc: "Oculta feeds dinâmicos e logs em direto" },
            { key: "pauseDiscordAlerts", label: "Pause Discord Alerts", desc: "Coloca o estado do Discord em modo 'Não Incomodar'" },
            { key: "groupNotifications", label: "Group Notifications in Background", desc: "Empacota todas as mensagens num único resumo" },
            { key: "allowCriticalInterruptions", label: "Allow Critical Interruptions", desc: "Apenas alertas de alta prioridade de Founders" },
            { key: "showPostFocusSummary", label: "Show Activity Summary After Focus", desc: "Apresenta um relatório resumido no final do bloco" },
          ].map((item) => (
            <div
              key={item.key}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white/90 font-sans tracking-wide">
                  {item.label}
                </span>
                <span className="text-[11px] text-white/40 font-sans">{item.desc}</span>
              </div>

              <SettingsToggle
                checked={(focus as any)[item.key]}
                onChange={(val) => setFocus({ ...focus, [item.key]: val })}
                size="sm"
              />
            </div>
          ))}
        </div>

        {/* Post Focus Summary Preview */}
        {focus.showPostFocusSummary && (
          <div className="mt-3 p-4 rounded-2xl bg-[var(--axion-accent)]/[0.03] border border-[var(--axion-accent)]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--axion-accent)]/10 flex items-center justify-center text-[var(--axion-accent)]">
                <Zap size={16} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-[var(--axion-accent)] uppercase tracking-wider">
                  PREVIEW DE RELATÓRIO PÓS-FOCO
                </span>
                <span className="text-xs text-white/80 font-sans">
                  "Enquanto esteve focado durante 90 min, ocorreram 4 eventos relevantes da equipa."
                </span>
              </div>
            </div>
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
