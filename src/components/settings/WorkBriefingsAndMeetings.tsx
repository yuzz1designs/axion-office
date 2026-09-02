/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, 
  Video, 
  Clock, 
  MessageSquare, 
  Headphones, 
  Check, 
  Sparkles, 
  Bot 
} from "lucide-react";
import { BriefingConfig, MeetingSettings } from "../../types/settings";
import { DEFAULT_BRIEFINGS, DEFAULT_MEETINGS } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsSelect 
} from "./SettingsControls";

export default function WorkBriefingsAndMeetings() {
  const [briefings, setBriefings] = useState<BriefingConfig>(DEFAULT_BRIEFINGS);
  const [meetings, setMeetings] = useState<MeetingSettings>(DEFAULT_MEETINGS);

  const updateMorning = <K extends keyof BriefingConfig["morning"]>(key: K, val: BriefingConfig["morning"][K]) => {
    setBriefings({
      ...briefings,
      morning: { ...briefings.morning, [key]: val }
    });
  };

  const updateMorningDelivery = (key: keyof BriefingConfig["morning"]["delivery"]) => {
    setBriefings({
      ...briefings,
      morning: {
        ...briefings.morning,
        delivery: {
          ...briefings.morning.delivery,
          [key]: !briefings.morning.delivery[key]
        }
      }
    });
  };

  const updateEvening = <K extends keyof BriefingConfig["evening"]>(key: K, val: BriefingConfig["evening"][K]) => {
    setBriefings({
      ...briefings,
      evening: { ...briefings.evening, [key]: val }
    });
  };

  const updateWeekly = <K extends keyof BriefingConfig["weekly"]>(key: K, val: BriefingConfig["weekly"][K]) => {
    setBriefings({
      ...briefings,
      weekly: { ...briefings.weekly, [key]: val }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. BRIEFINGS SYSTEM */}
      <SettingsSection
        id="section-briefings"
        title="Personalized Briefings"
        description="Resumos inteligentes automatizados entregues nos seus horários chave de rotina."
        badge="Automação"
      >
        {/* Morning Briefing */}
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--axion-accent)]/10 text-[var(--axion-accent)] flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <span className="text-sm font-sans font-semibold text-white">Morning Briefing</span>
                <span className="text-xs text-white/40 block">Panorama operacional para arrancar o dia</span>
              </div>
            </div>
            <SettingsToggle
              checked={briefings.morning.enabled}
              onChange={(val) => updateMorning("enabled", val)}
              size="sm"
            />
          </div>

          {briefings.morning.enabled && (
            <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Horário de Entrega:</span>
                <input
                  type="time"
                  value={briefings.morning.time}
                  onChange={(e) => updateMorning("time", e.target.value)}
                  className="bg-[#121824] border border-white/15 rounded-lg px-2.5 py-1 text-white font-mono text-xs outline-none"
                />
              </div>

              {/* Inclusions */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-mono text-white/40 uppercase">CONTEÚDO INCLUÍDO:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: "includeTasks", label: "Today's Tasks" },
                    { key: "includeMeetings", label: "Meetings" },
                    { key: "includeDeadlines", label: "Deadlines" },
                    { key: "includeProjectChanges", label: "Project Changes" },
                    { key: "includeSales", label: "Sales Pipeline" },
                    { key: "includeTeamActivity", label: "Team Activity" },
                  ].map((inc) => (
                    <label
                      key={inc.key}
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs text-white/80 cursor-pointer hover:bg-white/5"
                    >
                      <input
                        type="checkbox"
                        checked={(briefings.morning as any)[inc.key]}
                        onChange={(e) => updateMorning(inc.key as any, e.target.checked)}
                        className="rounded border-white/20 bg-white/5 text-[var(--axion-accent)] accent-[var(--axion-accent)]"
                      />
                      <span>{inc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="flex flex-col gap-1.5 pt-2">
                <span className="text-[11px] font-mono text-white/40 uppercase">CANAIS DE ENTREGA:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "axionOffice", label: "AXION OFFICE" },
                    { key: "desktop", label: "Desktop Banner" },
                    { key: "discord", label: "Discord DM" },
                    { key: "audio", label: "Audio Pod (Mock)", badge: "Voice" },
                  ].map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => updateMorningDelivery(ch.key as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all cursor-pointer flex items-center gap-1.5 ${
                        (briefings.morning.delivery as any)[ch.key]
                          ? "bg-[var(--axion-accent)] text-[#050609] font-semibold"
                          : "bg-white/5 text-white/40 hover:text-white"
                      }`}
                    >
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Evening & Weekly Briefings Mini Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Evening Briefing (19:00)</span>
              <SettingsToggle
                checked={briefings.evening.enabled}
                onChange={(val) => updateEvening("enabled", val)}
                size="sm"
              />
            </div>
            <span className="text-[11px] text-white/40 font-sans">
              Resumo de tarefas concluídas, pendentes e antevisão do dia seguinte.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Weekly Briefing (Segunda 08:30)</span>
              <SettingsToggle
                checked={briefings.weekly.enabled}
                onChange={(val) => updateWeekly("enabled", val)}
                size="sm"
              />
            </div>
            <span className="text-[11px] text-white/40 font-sans">
              Metas estratégicas da semana, roadmaps de projetos e marcos da equipa.
            </span>
          </div>
        </div>
      </SettingsSection>

      {/* 2. MEETINGS INTELLIGENCE & DISCORD BOT */}
      <SettingsSection
        id="section-meetings"
        title="Meetings & Transcription Intelligence"
        description="Configuração de transcrição de chamadas, deteção de decisões e actas automáticas."
        badge="Reuniões"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: "transcriptionDefault", label: "Transcription by Default", desc: "Transcreve áudio com distinção de interlocutores" },
            { key: "meetingSummaryDefault", label: "Generate Smart Executive Summary", desc: "Cria um resumo executivo de 1 página por reunião" },
            { key: "detectDecisions", label: "Detect Strategic Decisions", desc: "Destaca decisões tomadas e acordadas pela equipa" },
            { key: "detectActionItems", label: "Detect Action Items & Assignees", desc: "Identifica compromissos e atribui tarefas sugeridas" },
            { key: "detectDeadlines", label: "Detect Mentioned Deadlines", desc: "Vincula datas ditas verbalmente ao calendário" },
            { key: "speakerIdentification", label: "Speaker Voiceprint Identification", desc: "Reconhece o nome de quem está a falar" },
          ].map((m) => (
            <div
              key={m.key}
              className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-3"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white/90 font-sans tracking-wide">
                  {m.label}
                </span>
                <span className="text-[11px] text-white/40 font-sans">{m.desc}</span>
              </div>
              <SettingsToggle
                checked={(meetings as any)[m.key]}
                onChange={(val) => setMeetings({ ...meetings, [m.key]: val })}
                size="sm"
              />
            </div>
          ))}
        </div>

        <SettingsRow
          label="Meeting Audio Primary Language"
          description="Idioma otimizado para reconhecimento de fala corporativo."
        >
          <SettingsSegmentedControl<MeetingSettings["meetingLanguage"]>
            value={meetings.meetingLanguage}
            onChange={(val) => setMeetings({ ...meetings, meetingLanguage: val })}
            options={[
              { value: "auto", label: "Auto-Detect" },
              { value: "pt", label: "Português" },
              { value: "en", label: "English" },
            ]}
          />
        </SettingsRow>

        {/* Discord Meeting Bot Integration Box */}
        <div className="p-4 rounded-2xl bg-[#5865F2]/[0.05] border border-[#5865F2]/20 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-[#5865F2]" />
              <span className="text-xs font-semibold text-white font-sans">
                Discord Voice Meeting Bot
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#5865F2] bg-[#5865F2]/10 px-2 py-0.5 rounded-full">
              Sincronizado
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 text-white/80">
              <input
                type="checkbox"
                checked={meetings.discordBot.joinWhenInvited}
                onChange={(e) =>
                  setMeetings({
                    ...meetings,
                    discordBot: { ...meetings.discordBot, joinWhenInvited: e.target.checked }
                  })
                }
                className="rounded text-[#5865F2] accent-[#5865F2]"
              />
              <span>Entrar no canal de voz quando convidado</span>
            </label>

            <label className="flex items-center gap-2 text-white/80">
              <input
                type="checkbox"
                checked={meetings.discordBot.sendOutputToAxion}
                onChange={(e) =>
                  setMeetings({
                    ...meetings,
                    discordBot: { ...meetings.discordBot, sendOutputToAxion: e.target.checked }
                  })
                }
                className="rounded text-[#5865F2] accent-[#5865F2]"
              />
              <span>Enviar atas para o AXION OFFICE</span>
            </label>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
