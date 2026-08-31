/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, Briefcase, Zap, Video, Check } from "lucide-react";
import { WorkspaceProfileItem } from "../../types/settings";
import { WORKSPACE_PROFILES_MOCK } from "../../data/settingsMockData";
import { SettingsSection, SettingsButton } from "./SettingsControls";

export default function WorkspaceProfilesExperimental() {
  const [activeProfileId, setActiveProfileId] = useState<string>("prof-work");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const getProfileIcon = (id: string) => {
    if (id.includes("focus")) return Zap;
    if (id.includes("meeting")) return Video;
    return Briefcase;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] flex items-center justify-between animate-fadeIn">
          <span>{toastMsg}</span>
          <span className="text-white/40 text-[10px]">Workspace Profile Switcher</span>
        </div>
      )}

      <SettingsSection
        id="section-workspace-profiles"
        title="Workspace Profiles (Experimental)"
        description="Perfis de layout de um clique que reconfiguram instantaneamente toda a sua interface para o contexto atual."
        badge="Em Breve / V2"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {WORKSPACE_PROFILES_MOCK.map((profile) => {
            const isSelected = activeProfileId === profile.id;
            const Icon = getProfileIcon(profile.id);

            return (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  setActiveProfileId(profile.id);
                  showToast(`Perfil alterado para: ${profile.name}`);
                }}
                className={`p-5 rounded-2xl border text-left flex flex-col justify-between gap-4 transition-all duration-300 cursor-pointer group ${
                  isSelected
                    ? "bg-white/[0.08] border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#00f0ff] text-[#050609]"
                        : "bg-white/5 text-white/70 group-hover:text-white"
                    }`}
                  >
                    <Icon size={20} />
                  </div>

                  {isSelected && (
                    <span className="text-[10px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check size={10} className="stroke-[3]" />
                      ATIVO
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-sans font-semibold text-white tracking-wide">
                      {profile.name}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
                      {profile.badge}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 font-sans leading-relaxed">
                    {profile.description}
                  </span>
                </div>

                {/* Attributes pill list */}
                <div className="flex flex-col gap-1 pt-2 border-t border-white/5 text-[11px] font-mono text-white/40">
                  <div>Notificações: <strong className="text-white/70">{profile.notifications}</strong></div>
                  <div>Módulos: <strong className="text-white/70">{profile.homeModules}</strong></div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-3">
          <Sparkles size={16} className="text-[#00f0ff] shrink-0" />
          <span className="text-xs text-white/60 font-sans">
            Os perfis permitem guardar presets personalizados e partilhá-los entre equipas de design, engenharia e gestão.
          </span>
        </div>
      </SettingsSection>
    </div>
  );
}
