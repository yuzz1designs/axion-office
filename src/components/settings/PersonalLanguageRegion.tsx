/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Globe, Clock, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { LanguageRegionSettings } from "../../types/settings";
import { useLanguage } from "../../i18n/LanguageContext";
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
  const { t } = useLanguage();
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
        title={t("language.title")}
        description={t("language.description")}
      >
        <SettingsRow
          label={t("language.interface")}
          description={t("language.interfaceDesc")}
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
          label={t("language.timezone")}
          description={t("language.timezoneDesc")}
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
        title={t("language.currencyTitle")}
        description={t("language.currencyDesc")}
      >
        <SettingsRow
          label={t("language.primaryCurrency")}
          description={t("language.primaryCurrencyDesc")}
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
          label={t("language.decimal")}
          description={t("language.decimalDesc")}
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
        <div className="mt-4 p-5 rounded-2xl bg-white/[0.03] border border-[var(--axion-accent)]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono tracking-widest text-[var(--axion-accent)] uppercase">
              {t("language.preview")}
            </span>
            <span className="text-xs text-white/50">
              {t("language.previewDesc")}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <CalendarIcon size={14} className="text-[var(--axion-accent)]" />
              <span>{getFormattedDate()}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <Clock size={14} className="text-[var(--axion-accent)]" />
              <span>{getFormattedTime()}</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-white">
              <DollarSign size={14} className="text-[var(--axion-accent)]" />
              <span className="font-semibold text-[var(--axion-accent)]">{getFormattedCurrency()}</span>
            </div>
          </div>
        </div>
      </SettingsSection>
    </div>
  );
}
