/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Bell, Monitor, Mail, MessageSquare, Smartphone, Zap, Check } from "lucide-react";
import { 
  NotificationChannelSetting, 
  NotificationCategorySetting, 
  NotificationPriorityBehavior,
  UserRole 
} from "../../types/settings";
import { NOTIFICATION_CHANNELS, NOTIFICATION_CATEGORIES } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSelect 
} from "./SettingsControls";

interface WorkNotificationsProps {
  userRole?: UserRole;
}

export default function WorkNotifications({ userRole = "founder" }: WorkNotificationsProps) {
  const [channels, setChannels] = useState<NotificationChannelSetting[]>(NOTIFICATION_CHANNELS);
  const [categories, setCategories] = useState<NotificationCategorySetting[]>(NOTIFICATION_CATEGORIES);

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const updateCategoryPriority = (id: string, behavior: NotificationPriorityBehavior) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, priorityBehavior: behavior } : cat))
    );
  };

  const toggleCategoryChannel = (
    catId: string,
    channelKey: "channelInApp" | "channelDesktop" | "channelEmail" | "channelDiscord"
  ) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === catId ? { ...cat, [channelKey]: !cat[channelKey] } : cat
      )
    );
  };

  const isFinanceAllowed = userRole === "founder" || userRole === "admin";

  return (
    <div className="flex flex-col gap-6">
      {/* 1. NOTIFICATION CHANNELS */}
      <SettingsSection
        id="section-channels"
        title="Delivery Channels"
        description="Ative ou silencie canais inteiros de entrega de notificações corporativas."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {channels.map((ch) => {
            const isMobile = ch.id === "mobile";

            return (
              <div
                key={ch.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/80">
                      {ch.id === "in-app" && <Bell size={16} />}
                      {ch.id === "desktop" && <Monitor size={16} />}
                      {ch.id === "email" && <Mail size={16} />}
                      {ch.id === "discord" && <MessageSquare size={16} />}
                      {ch.id === "mobile" && <Smartphone size={16} />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white tracking-wide font-sans flex items-center gap-2">
                        {ch.name}
                        {ch.statusText && (
                          <span className="text-[9px] font-mono text-amber-400/90 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                            {ch.statusText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {!isMobile ? (
                    <SettingsToggle
                      checked={ch.enabled}
                      onChange={() => toggleChannel(ch.id)}
                      size="sm"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-white/30">V2</span>
                  )}
                </div>

                <p className="text-[11px] text-white/40 leading-relaxed font-sans">
                  {ch.description}
                </p>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      {/* 2. GRANULAR CATEGORIES & BEHAVIOR */}
      <SettingsSection
        id="section-categories"
        title="Category Routing & Priorities"
        description="Defina se cada tipo de alerta gera notificação imediata, agrupamento diário (Digest) ou silêncio total."
        badge="Granular"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono tracking-wider text-white/40 uppercase">
                <th className="pb-3 pr-4">CATEGORIA</th>
                <th className="pb-3 px-3 text-center">IN-APP</th>
                <th className="pb-3 px-3 text-center">DESKTOP</th>
                <th className="pb-3 px-3 text-center">EMAIL</th>
                <th className="pb-3 px-3 text-center">DISCORD</th>
                <th className="pb-3 pl-4 text-right">COMPORTAMENTO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {categories.map((cat) => {
                if (cat.adminOnly && !isFinanceAllowed) return null;

                return (
                  <tr key={cat.id} className="hover:bg-white/[0.01] transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white/90 font-sans tracking-wide">
                          {cat.name}
                        </span>
                        <span className="text-[11px] text-white/40 font-sans">
                          {cat.description}
                        </span>
                      </div>
                    </td>

                    {/* In-App */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={cat.channelInApp}
                        onChange={() => toggleCategoryChannel(cat.id, "channelInApp")}
                        className="rounded border-white/20 bg-white/5 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                      />
                    </td>

                    {/* Desktop */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={cat.channelDesktop}
                        onChange={() => toggleCategoryChannel(cat.id, "channelDesktop")}
                        className="rounded border-white/20 bg-white/5 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                      />
                    </td>

                    {/* Email */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={cat.channelEmail}
                        onChange={() => toggleCategoryChannel(cat.id, "channelEmail")}
                        className="rounded border-white/20 bg-white/5 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                      />
                    </td>

                    {/* Discord */}
                    <td className="py-3.5 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={cat.channelDiscord}
                        onChange={() => toggleCategoryChannel(cat.id, "channelDiscord")}
                        className="rounded border-white/20 bg-white/5 text-[#00f0ff] focus:ring-0 cursor-pointer accent-[#00f0ff]"
                      />
                    </td>

                    {/* Priority Behavior Select */}
                    <td className="py-3.5 pl-4 text-right">
                      <SettingsSelect<NotificationPriorityBehavior>
                        value={cat.priorityBehavior}
                        onChange={(b) => updateCategoryPriority(cat.id, b)}
                        options={[
                          { value: "immediate", label: "Immediate (Real-time)" },
                          { value: "digest", label: "Digest (Resumo)" },
                          { value: "silent", label: "Silent (Silencioso)" },
                          { value: "disabled", label: "Disabled (Desativado)" },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}
