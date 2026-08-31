/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  ShieldCheck, 
  Download, 
  Search, 
  HardDrive, 
  CheckCircle2, 
  FileSpreadsheet, 
  Clock, 
  Globe, 
  Lock 
} from "lucide-react";
import { 
  OrgIntegrationItem, 
  OrgDataPrivacySettings, 
  OrgAuditLogEvent 
} from "../../types/settings";
import { 
  ORG_INTEGRATIONS_MOCK, 
  DEFAULT_DATA_PRIVACY, 
  ORG_AUDIT_LOG_MOCK 
} from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsButton, 
  SettingsSelect, 
  SettingsToggle 
} from "./SettingsControls";

export default function OrgDataIntegrationsAudit() {
  const [orgIntegrations, setOrgIntegrations] = useState<OrgIntegrationItem[]>(ORG_INTEGRATIONS_MOCK);
  const [privacy, setPrivacy] = useState<OrgDataPrivacySettings>(DEFAULT_DATA_PRIVACY);
  const [auditLogs, setAuditLogs] = useState<OrgAuditLogEvent[]>(ORG_AUDIT_LOG_MOCK);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleExportData = () => {
    showToast("Exportação segura de dados corporativos iniciada (Pacote ZIP gerado).");
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesCat = categoryFilter === "All" || log.category === categoryFilter;
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetResource && log.targetResource.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-xs font-mono text-[#00f0ff] flex items-center justify-between animate-fadeIn">
          <span>{toastMsg}</span>
          <span className="text-white/40 text-[10px]">Segurança & Auditoria</span>
        </div>
      )}

      {/* 1. ORGANIZATION-WIDE INTEGRATIONS */}
      <SettingsSection
        id="section-org-integrations"
        title="Organization-Wide Integrations"
        description="Serviços partilhados configurados ao nível de infraestrutura da empresa."
        badge="Infraestrutura"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgIntegrations.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white font-sans tracking-wide">
                    {item.name}
                  </span>
                  <span className="text-xs text-white/40 font-sans mt-0.5">
                    {item.description}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full uppercase">
                  {item.status}
                </span>
              </div>

              {item.details && (
                <div className="text-xs font-mono text-white/60 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  {item.details}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-[11px] font-mono text-white/40">
                  Gerido por: {item.configuredBy}
                </span>
                <SettingsButton
                  variant="ghost"
                  size="sm"
                  onClick={() => showToast(`Definições de ${item.name}`)}
                >
                  Configurar
                </SettingsButton>
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>

      {/* 2. DATA RETENTION & PRIVACY POLICIES */}
      <SettingsSection
        id="section-data-privacy"
        title="Data Retention & Privacy Governance"
        description="Políticas de retenção de gravações, logs e exportação de arquivo corporativo."
        badge="RGPD / GDPR"
        action={
          <SettingsButton
            variant="secondary"
            size="sm"
            icon={Download}
            onClick={handleExportData}
          >
            Export All Data (ZIP/JSON)
          </SettingsButton>
        }
      >
        <SettingsRow
          label="Meeting Transcripts Retention Period"
          description="Tempo de conservação de transcrições e gravações áudio brutas nos servidores."
        >
          <SettingsSelect<number>
            value={privacy.transcriptsRetentionDays}
            onChange={(val) => setPrivacy({ ...privacy, transcriptsRetentionDays: Number(val) })}
            options={[
              { value: 30, label: "30 dias" },
              { value: 90, label: "90 dias" },
              { value: 180, label: "180 dias" },
              { value: 365, label: "365 dias (1 Ano)" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Activity & Security Logs Retention"
          description="Período de auditoria mantido para conformidade regulatória e investigações."
        >
          <SettingsSelect<number>
            value={privacy.activityLogsRetentionDays}
            onChange={(val) => setPrivacy({ ...privacy, activityLogsRetentionDays: Number(val) })}
            options={[
              { value: 90, label: "90 dias" },
              { value: 180, label: "180 dias" },
              { value: 365, label: "365 dias (Recomendado)" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Strict AI Data Isolation Guard"
          description="Garante que nenhum dado confidencial ou transcrição é utilizado no treino de modelos públicos."
        >
          <SettingsToggle
            checked={privacy.aiDataProcessingStrict}
            onChange={(val) => setPrivacy({ ...privacy, aiDataProcessingStrict: val })}
          />
        </SettingsRow>
      </SettingsSection>

      {/* 3. ORGANIZATION AUDIT LOG */}
      <SettingsSection
        id="section-org-audit-log"
        title="Organization Audit Trail"
        description="Registo centralizado de todas as ações administrativas, alterações de permissões e eventos de segurança."
        badge="Auditoria Completa"
      >
        {/* Filter Chips & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2">
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {["All", "Security", "Team", "Integrations", "Billing", "System"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? "bg-white/15 text-white shadow-inner"
                    : "bg-white/[0.03] text-white/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Filtrar logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121824] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono tracking-wider text-white/40 uppercase">
                <th className="pb-3 pr-4">TIMESTAMP</th>
                <th className="pb-3 px-3">UTILIZADOR</th>
                <th className="pb-3 px-3">AÇÃO EXECUTADA</th>
                <th className="pb-3 px-3">CATEGORIA</th>
                <th className="pb-3 pl-3 text-right">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3 pr-4 text-xs font-mono text-[#00f0ff]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-3 text-xs font-semibold text-white/90 font-sans">
                    {log.user}
                  </td>
                  <td className="py-3 px-3 text-xs text-white/80 font-sans">
                    {log.action}
                    {log.targetResource && (
                      <span className="text-[11px] font-mono text-white/40 ml-1.5">
                        ({log.targetResource})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[9px] font-mono uppercase bg-white/5 border border-white/10 px-2 py-0.5 rounded text-white/60">
                      {log.category}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right text-[11px] font-mono text-white/40">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}
