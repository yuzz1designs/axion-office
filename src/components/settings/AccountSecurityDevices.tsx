/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Shield, 
  Key, 
  Laptop, 
  Smartphone, 
  Tablet, 
  Activity, 
  Lock, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { 
  SecuritySettings, 
  DeviceItem, 
  PersonalActivityItem 
} from "../../types/settings";
import { 
  DEFAULT_SECURITY, 
  CONNECTED_DEVICES_MOCK, 
  PERSONAL_ACTIVITY_MOCK 
} from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsButton, 
  SettingsToggle 
} from "./SettingsControls";

export default function AccountSecurityDevices() {
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY);
  const [devices, setDevices] = useState<DeviceItem[]>(CONNECTED_DEVICES_MOCK);
  const [activities, setActivities] = useState<PersonalActivityItem[]>(PERSONAL_ACTIVITY_MOCK);
  const [activityFilter, setActivityFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRevokeDevice = (deviceId: string, deviceName: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
    showToast(`Sessão terminada com sucesso em: ${deviceName}`);
  };

  const handleRevokeAllOtherDevices = () => {
    setDevices((prev) => prev.filter((d) => d.isCurrent));
    showToast("Todas as outras sessões foram encerradas.");
  };

  const filteredActivity = activities.filter((act) => {
    if (activityFilter === "All") return true;
    return act.category === activityFilter;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-2xl bg-emerald-400/10 border border-emerald-400/30 text-xs font-mono text-emerald-400 flex items-center justify-between animate-fadeIn">
          <span>{toastMessage}</span>
          <span className="text-white/40 text-[10px]">Segurança AXION</span>
        </div>
      )}

      {/* 1. SECURITY & AUTHENTICATION */}
      <SettingsSection
        id="section-security"
        title="Security & Access Credentials"
        description="Controlo de autenticação multi-fator (2FA), chaves biométricas Passkey e SSO corporativo."
        badge="Protegido"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Two-Factor Authentication (2FA) */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center">
                  <Shield size={16} />
                </div>
                <span className="text-xs font-semibold text-white font-sans">
                  Two-Factor Authentication (2FA)
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                Ativo
              </span>
            </div>
            <p className="text-[11px] text-white/40 font-sans">
              Autenticação por código TOTP via Authenticator corporativo AXION.
            </p>
            <div className="pt-1">
              <SettingsButton
                variant="secondary"
                size="sm"
                onClick={() => showToast("Chaves de backup TOTP re-geradas.")}
              >
                Gerir Códigos de Backup
              </SettingsButton>
            </div>
          </div>

          {/* Passkeys Biometric */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/5 text-white/70 flex items-center justify-center">
                  <Key size={16} />
                </div>
                <span className="text-xs font-semibold text-white font-sans">
                  Passkey (FIDO2 / Touch ID)
                </span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                Não Configurado
              </span>
            </div>
            <p className="text-[11px] text-white/40 font-sans">
              Inicie sessão instantaneamente com Touch ID ou Face ID sem digitar passwords.
            </p>
            <div className="pt-1">
              <SettingsButton
                variant="primary"
                size="sm"
                onClick={() => {
                  setSecurity({ ...security, passkeysConfigured: true });
                  showToast("Passkey biométrica vinculada ao dispositivo atual.");
                }}
              >
                Configurar Passkey
              </SettingsButton>
            </div>
          </div>
        </div>

        <SettingsRow
          label="Corporate Single Sign-On (SSO)"
          description="Sessão gerida pelo tenant Google Workspace Enterprise da AXION."
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/70 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              {security.ssoProvider}
            </span>
          </div>
        </SettingsRow>
      </SettingsSection>

      {/* 2. ACTIVE DEVICES */}
      <SettingsSection
        id="section-devices"
        title="Active Devices & Sessions"
        description="Dispositivos atualmente autorizados a aceder à sua conta no AXION OFFICE."
        action={
          devices.length > 1 ? (
            <SettingsButton
              variant="danger"
              size="sm"
              icon={LogOut}
              onClick={handleRevokeAllOtherDevices}
            >
              Terminar Todas as Outras Sessões
            </SettingsButton>
          ) : undefined
        }
      >
        <div className="flex flex-col gap-3">
          {devices.map((dev) => {
            const isDesktop = dev.deviceType === "desktop";
            const isMobile = dev.deviceType === "mobile";

            return (
              <div
                key={dev.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  dev.isCurrent
                    ? "bg-[var(--axion-accent)]/[0.03] border-[var(--axion-accent)]/20"
                    : "bg-white/[0.02] border-white/[0.06]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    {isDesktop && <Laptop size={20} />}
                    {isMobile && <Smartphone size={20} />}
                    {!isDesktop && !isMobile && <Tablet size={20} />}
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white font-sans tracking-wide">
                        {dev.name}
                      </span>
                      {dev.isCurrent && (
                        <span className="text-[9px] font-mono text-[var(--axion-accent)] bg-[var(--axion-accent)]/10 px-2 py-0.2 rounded-full border border-[var(--axion-accent)]/30">
                          Este Dispositivo
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-white/40 font-mono">
                      <span>{dev.location}</span>
                      <span>•</span>
                      <span>IP: {dev.ipAddress}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="text-[11px] font-mono text-white/50">{dev.lastActive}</span>

                  {!dev.isCurrent && (
                    <SettingsButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevokeDevice(dev.id, dev.name)}
                    >
                      Terminar Sessão
                    </SettingsButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SettingsSection>

      {/* 3. PERSONAL ACTIVITY & SECURITY LOG */}
      <SettingsSection
        id="section-personal-activity"
        title="Personal Activity & Security History"
        description="Registo cronológico de acessos, alterações de preferências e conexões na sua conta."
        badge="Auditoria"
      >
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          {["All", "Security", "Integrations", "Account", "Preferences"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActivityFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all cursor-pointer ${
                activityFilter === cat
                  ? "bg-white/15 text-white shadow-inner"
                  : "bg-white/[0.03] text-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-white/[0.04]">
          {filteredActivity.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--axion-accent)] font-semibold min-w-[44px]">
                  {act.time}
                </span>
                <span className="text-xs text-white/80 font-sans tracking-wide">
                  {act.action}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                  {act.category}
                </span>
                {act.device && (
                  <span className="text-[10px] font-mono text-white/30 hidden sm:inline">
                    {act.device}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </SettingsSection>
    </div>
  );
}
