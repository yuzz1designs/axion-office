/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  ShieldCheck, 
  UserPlus, 
  Search, 
  MoreVertical, 
  Check, 
  Lock, 
  AlertCircle 
} from "lucide-react";
import { OrgTeamMember, RolePermissionMatrixItem, UserRole } from "../../types/settings";
import { ORG_TEAM_MEMBERS_MOCK, ROLE_PERMISSION_MATRIX_MOCK } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsButton, 
  SettingsSelect 
} from "./SettingsControls";

export default function OrgTeamAndRoles() {
  const [members, setMembers] = useState<OrgTeamMember[]>(ORG_TEAM_MEMBERS_MOCK);
  const [permissions, setPermissions] = useState<RolePermissionMatrixItem[]>(ROLE_PERMISSION_MATRIX_MOCK);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleRoleChange = (memberId: string, newRole: UserRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
    showToast("Permissão de membro atualizada com sucesso.");
  };

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {toastMsg && (
        <div className="p-3 rounded-2xl bg-[var(--axion-accent)]/10 border border-[var(--axion-accent)]/30 text-xs font-mono text-[var(--axion-accent)] flex items-center justify-between animate-fadeIn">
          <span>{toastMsg}</span>
          <span className="text-white/40 text-[10px]">Administração AXION</span>
        </div>
      )}

      {/* 1. TEAM MEMBERS DIRECTORY */}
      <SettingsSection
        id="section-org-team"
        title="Team & Member Directory"
        description="Gestão de utilizadores corporativos, atribuição de cargos e controlo de estados de conta."
        badge="Admin"
        action={
          <SettingsButton
            variant="primary"
            size="sm"
            icon={UserPlus}
            onClick={() => showToast("Modal de convite rápido aberto (Simulação).")}
          >
            Convidar Membro
          </SettingsButton>
        }
      >
        {/* Search & Filter bar */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
            />
            <input
              type="text"
              placeholder="Pesquisar por nome, email ou cargo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121824] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-white placeholder-white/30 outline-none focus:border-[var(--axion-accent)] transition-colors"
            />
          </div>
        </div>

        {/* Members Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono tracking-wider text-white/40 uppercase">
                <th className="pb-3 pr-4">MEMBRO</th>
                <th className="pb-3 px-3">CARGO</th>
                <th className="pb-3 px-3">ESTADO</th>
                <th className="pb-3 px-3">ÚLTIMO ACESSO</th>
                <th className="pb-3 pl-3 text-right">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredMembers.map((mem) => {
                const isFounder = mem.role === "founder";

                return (
                  <tr key={mem.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* User info */}
                    <td className="py-3.5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-mono text-xs text-[var(--axion-accent)] font-semibold">
                          {mem.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white font-sans tracking-wide">
                            {mem.name}
                          </span>
                          <span className="text-[11px] font-mono text-white/40">
                            {mem.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role selector */}
                    <td className="py-3.5 px-3">
                      <SettingsSelect<UserRole>
                        value={mem.role}
                        onChange={(r) => handleRoleChange(mem.id, r)}
                        options={[
                          { value: "founder", label: "Founder" },
                          { value: "admin", label: "Admin" },
                          { value: "employee", label: "Employee" },
                          { value: "freelancer", label: "Freelancer" },
                          { value: "client", label: "Client" },
                        ]}
                      />
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          mem.status === "active"
                            ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                            : mem.status === "invited"
                            ? "text-amber-400 bg-amber-400/10 border border-amber-400/20"
                            : "text-rose-400 bg-rose-400/10 border border-rose-400/20"
                        }`}
                      >
                        {mem.status}
                      </span>
                    </td>

                    {/* Last active */}
                    <td className="py-3.5 px-3 text-[11px] font-mono text-white/40">
                      {mem.lastActive}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 pl-3 text-right">
                      {!isFounder ? (
                        <SettingsButton
                          variant="ghost"
                          size="sm"
                          onClick={() => showToast(`Ações para ${mem.name}`)}
                        >
                          Gerir
                        </SettingsButton>
                      ) : (
                        <span className="text-[10px] font-mono text-white/30 italic">
                          Proprietário
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SettingsSection>

      {/* 2. ROLES & PERMISSIONS MATRIX */}
      <SettingsSection
        id="section-roles-matrix"
        title="Roles & Permissions Matrix"
        description="Matriz global de níveis de autorização por módulo do AXION OFFICE."
        badge="Segurança Global"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] font-mono tracking-wider text-white/40 uppercase">
                <th className="pb-3 pr-4">MÓDULO</th>
                <th className="pb-3 px-3 text-center">FOUNDER</th>
                <th className="pb-3 px-3 text-center">ADMIN</th>
                <th className="pb-3 px-3 text-center">MANAGER</th>
                <th className="pb-3 px-3 text-center">MEMBER</th>
                <th className="pb-3 pl-3 text-center">GUEST</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {permissions.map((perm) => (
                <tr key={perm.module} className="hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 pr-4 text-xs font-semibold text-white/90 font-sans tracking-wide">
                    {perm.module}
                  </td>
                  {["founder", "admin", "manager", "member", "guest"].map((r) => {
                    const level = (perm as any)[r];
                    const isFull = level === "full";
                    const isEdit = level === "edit";
                    const isView = level === "view";
                    const isNone = level === "none";

                    return (
                      <td key={r} className="py-3.5 px-3 text-center">
                        <span
                          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                            isFull
                              ? "text-emerald-400 bg-emerald-400/10 border border-emerald-400/20"
                              : isEdit
                              ? "text-blue-400 bg-blue-400/10 border border-blue-400/20"
                              : isView
                              ? "text-white/60 bg-white/5 border border-white/10"
                              : "text-white/20 bg-transparent"
                          }`}
                        >
                          {level}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsSection>
    </div>
  );
}
