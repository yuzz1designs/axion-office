/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Globe, 
  Mail, 
  Calendar, 
  FileText, 
  MessageSquare, 
  Code, 
  Clock, 
  Building2, 
  Check, 
  X, 
  RefreshCw, 
  Unlink 
} from "lucide-react";
import { 
  PersonalIntegrationItem, 
  WorkPreferencesSettings, 
  IntegrationStatus 
} from "../../types/settings";
import { 
  PERSONAL_INTEGRATIONS_MOCK, 
  DEFAULT_WORK_PREFERENCES 
} from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsSegmentedControl, 
  SettingsButton 
} from "./SettingsControls";

export default function WorkIntegrationsAndPrefs() {
  const [integrations, setIntegrations] = useState<PersonalIntegrationItem[]>(PERSONAL_INTEGRATIONS_MOCK);
  const [workPrefs, setWorkPrefs] = useState<WorkPreferencesSettings>(DEFAULT_WORK_PREFERENCES);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const triggerMockAction = (msg: string) => {
    setActionFeedback(msg);
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const getStatusBadge = (status: IntegrationStatus) => {
    switch (status) {
      case "connected":
        return (
          <span className="text-[10px] font-mono tracking-wider text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            CONNECTED
          </span>
        );
      case "admin_required":
        return (
          <span className="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
            ADMIN REQUIRED
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono tracking-wider text-white/40 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
            NOT CONNECTED
          </span>
        );
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Mail":
        return Mail;
      case "Calendar":
        return Calendar;
      case "FileText":
        return FileText;
      case "MessageSquare":
        return MessageSquare;
      case "Code":
        return Code;
      default:
        return Globe;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {actionFeedback && (
        <div className="p-3 rounded-2xl bg-[var(--axion-accent)]/10 border border-[var(--axion-accent)]/30 text-xs font-mono text-[var(--axion-accent)] flex items-center justify-between animate-fadeIn">
          <span>{actionFeedback}</span>
          <span className="text-white/40 text-[10px]">Mock State Atualizado</span>
        </div>
      )}

      {/* 1. PERSONAL INTEGRATIONS */}
      <SettingsSection
        id="section-personal-integrations"
        title="Personal Connected Accounts"
        description="Ligue as suas contas de ferramentas diárias para sincronizar eventos, mensagens e tarefas com o AXION OFFICE."
        badge="OAuth Hub"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((item) => {
            const Icon = getIcon(item.iconName);

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 flex flex-col justify-between gap-4 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-sans font-semibold text-white tracking-wide">
                        {item.name}
                      </span>
                      <span className="text-xs font-mono text-white/50">
                        {item.connectedAccount || "Nenhuma conta vinculada"}
                      </span>
                    </div>
                  </div>

                  {getStatusBadge(item.status)}
                </div>

                {/* Permissions bullets */}
                <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.01] border border-white/[0.04]">
                  <span className="text-[10px] font-mono text-white/30 uppercase">PERMISSÕES CONCEDIDAS:</span>
                  {item.permissions.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-white/70">
                      {p.granted ? (
                        <Check size={12} className="text-emerald-400" />
                      ) : (
                        <X size={12} className="text-white/20" />
                      )}
                      <span className={p.granted ? "text-white/80" : "text-white/40 line-through"}>
                        {p.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                  <span className="text-[11px] font-mono text-white/40">
                    Sincronizado: {item.lastSync || "—"}
                  </span>

                  <div className="flex items-center gap-2">
                    <SettingsButton
                      variant="secondary"
                      size="sm"
                      icon={RefreshCw}
                      onClick={() => triggerMockAction(`Sincronização forçada iniciada para ${item.name}`)}
                    >
                      Sync
                    </SettingsButton>

                    <SettingsButton
                      variant="ghost"
                      size="sm"
                      icon={Unlink}
                      onClick={() => triggerMockAction(`Sessão de ${item.name} desligada com sucesso.`)}
                    >
                      Desconectar
                    </SettingsButton>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      {/* 2. WORK PREFERENCES & SCHEDULE */}
      <SettingsSection
        id="section-work-preferences"
        title="Work Routine & Availability"
        description="Defina o seu horário de trabalho normal, preferências de reuniões e regime presencial/remoto."
        badge="Rotina"
      >
        <SettingsRow
          label="Work Location Regime"
          description="Indica a sua localização de trabalho padrão para agendamentos presenciais."
        >
          <SettingsSegmentedControl<WorkPreferencesSettings["workLocation"]>
            value={workPrefs.workLocation}
            onChange={(loc) => setWorkPrefs({ ...workPrefs, workLocation: loc })}
            options={[
              { value: "office", label: "Office (AXION HQ)" },
              { value: "remote", label: "Remote (100%)" },
              { value: "hybrid", label: "Hybrid" },
            ]}
          />
        </SettingsRow>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-2">
          {/* Lunch Time */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <span className="text-xs font-semibold text-white font-sans">Intervalo de Almoço</span>
            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
              <input
                type="time"
                value={workPrefs.lunchTime.start}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    lunchTime: { ...workPrefs.lunchTime, start: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
              <span className="text-white/40">até</span>
              <input
                type="time"
                value={workPrefs.lunchTime.end}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    lunchTime: { ...workPrefs.lunchTime, end: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
            </div>
            <span className="text-[10px] text-white/40">Bloqueia convites durante este período</span>
          </div>

          {/* Preferred Focus Hours */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <span className="text-xs font-semibold text-white font-sans">Horário Preferido de Foco</span>
            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
              <input
                type="time"
                value={workPrefs.preferredFocusHours.start}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    preferredFocusHours: { ...workPrefs.preferredFocusHours, start: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
              <span className="text-white/40">até</span>
              <input
                type="time"
                value={workPrefs.preferredFocusHours.end}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    preferredFocusHours: { ...workPrefs.preferredFocusHours, end: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
            </div>
            <span className="text-[10px] text-white/40">Protege o início da manhã de reuniões</span>
          </div>

          {/* Preferred Meeting Hours */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <span className="text-xs font-semibold text-white font-sans">Janela Aberta para Reuniões</span>
            <div className="flex items-center gap-2 text-xs font-mono text-white/80">
              <input
                type="time"
                value={workPrefs.preferredMeetingHours.start}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    preferredMeetingHours: { ...workPrefs.preferredMeetingHours, start: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
              <span className="text-white/40">até</span>
              <input
                type="time"
                value={workPrefs.preferredMeetingHours.end}
                onChange={(e) =>
                  setWorkPrefs({
                    ...workPrefs,
                    preferredMeetingHours: { ...workPrefs.preferredMeetingHours, end: e.target.value }
                  })
                }
                className="bg-[#121824] border border-white/15 rounded-lg px-2 py-1 outline-none text-white"
              />
            </div>
            <span className="text-[10px] text-white/40">Sugerido nos links de agendamento</span>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
