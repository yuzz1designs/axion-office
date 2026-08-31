/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Globe, Clock, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { LanguageRegionSettings } from "../../types/settings";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsSegmentedControl, 
  SettingsSelect 
} from "./SettingsControls";

interface PersonalLanguageRegionProps {
  settings: LanguageRegionSettings;
  onChange: (updated: LanguageRegionSettings) => void;
}

export default function PersonalLanguageRegion({
  settings,
  onChange,
}: PersonalLanguageRegionProps) {
  const updateField = <K extends keyof LanguageRegionSettings>(
    key: K,
    value: LanguageRegionSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  };

  // Generate live formatted date preview based on current selections
  const getFormattedDate = () => {
    switch (settings.dateFormat) {
      case "DD MMMM YYYY":
        return settings.language === "pt" ? "31 de Agosto de 2026" : "31 August 2026";
      case "MM/DD/YYYY":
        return "08/31/2026";
      case "YYYY-MM-DD":
        return "2026-08-31";
      case "DD/MM/YYYY":
      default:
        return "31/08/2026";
    }
  };

  const getFormattedTime = () => {
    return settings.timeFormat === "12h" ? "11:45 PM" : "23:45";
  };

  const getFormattedCurrency = () => {
    const symbol = settings.currency === "EUR" ? "€" : settings.currency === "USD" ? "$" : "£";
    const dec = settings.decimalSeparator;
    const thou = dec === "," ? "." : ",";
    return `${symbol}1${thou}250${dec}00`;
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. LANGUAGE & TIMEZONE */}
      <SettingsSection
        id="section-language-timezone"
        title="Language & Timezone"
        description="Defina o idioma principal da interface e o fuso horário para sincronização de reuniões e prazos."
      >
        <SettingsRow
          label="Interface Language"
          description="Idioma de todos os menus, botões e relatórios automáticos."
        >
          <SettingsSegmentedControl<"pt" | "en">
            id="lang-select"
            value={settings.language}
            onChange={(val) => updateField("language", val)}
            options={[
              { value: "pt", label: "Português (PT)" },
              { value: "en", label: "English (US)" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Primary Timezone"
          description="Utilizado para prazos de projetos, logs e horários de equipa."
        >
          <SettingsSelect
            id="timezone-select"
            value={settings.timezone}
            onChange={(val) => updateField("timezone", String(val))}
            options={[
              { value: "Europe/Lisbon (GMT+1)", label: "Lisboa / Londres (GMT+1 / WET)" },
              { value: "Europe/Madrid (GMT+2)", label: "Madrid / Paris / Berlim (GMT+2 / CET)" },
              { value: "America/Sao_Paulo (GMT-3)", label: "São Paulo / Brasília (GMT-3 / BRT)" },
              { value: "America/New_York (GMT-4)", label: "New York / Miami (GMT-4 / EDT)" },
              { value: "America/Los_Angeles (GMT-7)", label: "Los Angeles / S. Francisco (GMT-7 / PDT)" },
              { value: "UTC", label: "Universal Coordinated Time (UTC)" },
            ]}
          />
        </SettingsRow>
      </SettingsSection>

      {/* 2. CURRENCY & NUMBER FORMAT */}
      <SettingsSection
        id="section-currency-number"
        title="Currency & Numerics"
        description="Símbolo monetário e convenções de casas decimais."
      >
        <SettingsRow
          label="Primary Currency"
          description="Moeda base em orçamentos, propostas e métricas financeiras."
        >
          <SettingsSegmentedControl<"EUR" | "USD" | "GBP">
            id="currency-select"
            value={settings.currency}
            onChange={(val) => updateField("currency", val)}
            options={[
              { value: "EUR", label: "EUR (€)" },
              { value: "USD", label: "USD ($)" },
              { value: "GBP", label: "GBP (£)" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Decimal Separator"
          description="Símbolo para separação de cêntimos e frações numéricas."
        >
          <SettingsSegmentedControl<"," | ".">
            id="decimal-sep"
            value={settings.decimalSeparator}
            onChange={(val) => updateField("decimalSeparator", val)}
            options={[
              { value: ",", label: "Vírgula (1.250,00)" },
              { value: ".", label: "Ponto (1,250.00)" },
            ]}
          />
        </SettingsRow>

        {/* LIVE REGIONAL PREVIEW PANEL */}
        <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-[#00f0ff]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase">
              PREVIEW REGIONAL EM TEMPO REAL
            </span>
            <span className="text-xs text-white/50">
              É assim que as datas, horas e valores serão apresentados no seu workspace:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <CalendarIcon size={14} className="text-[#00f0ff]" />
              <span>{getFormattedDate()}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <Clock size={14} className="text-[#00f0ff]" />
              <span>{getFormattedTime()}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <DollarSign size={14} className="text-[#00f0ff]" />
              <span className="font-semibold text-[#00f0ff]">{getFormattedCurrency()}</span>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
