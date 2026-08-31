/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { 
  Sun, 
  Moon, 
  Monitor, 
  Sparkles, 
  Layout, 
  Type, 
  Gauge, 
  Check, 
  Eye
} from "lucide-react";
import { 
  AppearanceSettings, 
  AccentColorToken, 
  ThemeMode, 
  InterfaceDensity, 
  TextSizeOption, 
  MotionOption, 
  BackgroundVariant 
} from "../../types/settings";
import { ACCENT_COLOR_OPTIONS } from "../../data/settingsMockData";
import { 
  SettingsSection, 
  SettingsRow, 
  SettingsToggle, 
  SettingsSegmentedControl, 
  SettingsColorPicker, 
  SettingsSlider 
} from "./SettingsControls";

interface PersonalAppearanceProps {
  settings: AppearanceSettings;
  onChange: (updated: AppearanceSettings) => void;
  allowedTokens?: AccentColorToken[];
}

export default function PersonalAppearance({
  settings,
  onChange,
  allowedTokens
}: PersonalAppearanceProps) {
  const currentAccent = ACCENT_COLOR_OPTIONS.find((c) => c.id === settings.accentColor) || ACCENT_COLOR_OPTIONS[0];

  const updateField = <K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const updateVisualEffect = (effectKey: keyof AppearanceSettings["visualEffects"], val: boolean) => {
    onChange({
      ...settings,
      visualEffects: {
        ...settings.visualEffects,
        [effectKey]: val,
      }
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. THEME & LIVE PREVIEW HERO */}
      <SettingsSection
        id="section-theme"
        title="Theme"
        description="Escolha a ambiência de iluminação do AXION OFFICE com transição de alta-fidelidade."
        badge="Live Switch"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: "dark" as ThemeMode, label: "Dark Canvas", desc: "Contraste profundo com brilho ciano", icon: Moon },
            { id: "light" as ThemeMode, label: "Light Canvas", desc: "Superfície clara de alta luminosidade", icon: Sun },
            { id: "system" as ThemeMode, label: "System Sync", desc: "Adaptação automática ao sistema", icon: Monitor },
          ].map((themeOpt) => {
            const isSelected = settings.theme === themeOpt.id;
            const Icon = themeOpt.icon;

            return (
              <button
                key={themeOpt.id}
                type="button"
                onClick={() => updateField("theme", themeOpt.id)}
                className={`relative p-4 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-3 group ${
                  isSelected
                    ? "bg-white/[0.08] border-white/30 shadow-xl"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15"
                }`}
              >
                {/* Mini Preview Card */}
                <div
                  className={`w-full h-20 rounded-xl p-2.5 flex flex-col justify-between border transition-all ${
                    themeOpt.id === "light"
                      ? "bg-[#eef2f6] border-[#cbd5e1] text-slate-900"
                      : "bg-[#080d16] border-white/10 text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: currentAccent.hex }}
                      />
                      <span className="text-[9px] font-mono tracking-wider font-semibold opacity-80 uppercase">
                        AXION
                      </span>
                    </div>
                    <span className="text-[8px] font-mono opacity-50">v4.2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center">
                      <Icon size={12} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <div className="w-14 h-1.5 rounded-full bg-white/20" />
                      <div className="w-8 h-1 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="text-xs font-semibold text-white tracking-wide font-sans">
                      {themeOpt.label}
                    </div>
                    <div className="text-[11px] text-white/40 font-sans">
                      {themeOpt.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentAccent.hex }}
                    >
                      <Check size={10} className="text-[#050609] stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </SettingsSection>

      {/* 2. ACCENT COLOR TOKENS */}
      <SettingsSection
        id="section-accent"
        title="Luzes de Destaque (Nav Bar & Home)"
        description="Personalize a tonalidade da luz e do indicador ativo ao lado dos ícones na barra lateral (Nav Bar) e a ambiência/brilho da Home."
        badge="Luz Ativa"
      >
        <SettingsColorPicker
          options={ACCENT_COLOR_OPTIONS}
          value={settings.accentColor}
          onChange={(token) => updateField("accentColor", token)}
          allowedTokens={allowedTokens}
        />

        {/* Live Swatch Feedback Bar */}
        <div className="mt-2 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-white/40 font-mono text-[11px]">LUZ ATIVA:</span>
            <span className="font-semibold text-white tracking-wide font-sans">
              {currentAccent.name}
            </span>
            <span className="font-mono text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded-md">
              {currentAccent.hex}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: currentAccent.hex }}
            />
            <span className="text-[11px] font-mono text-white/60">Luz Nav & Home</span>
          </div>
        </div>
      </SettingsSection>

      {/* 3. INTERFACE DENSITY & SCALE */}
      <SettingsSection
        id="section-density"
        title="Density & Typography"
        description="Ajuste a densidade de dados e o tamanho do texto para o seu fluxo de trabalho diário."
      >
        <SettingsRow
          label="Interface Density"
          description="Espaçamento entre cartões, listas e nós da dashboard."
        >
          <SettingsSegmentedControl<InterfaceDensity>
            id="density-control"
            value={settings.density}
            onChange={(d) => updateField("density", d)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfortable" },
              { value: "spacious", label: "Spacious" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Text Size"
          description="Escala base de leitura para títulos, descrições e tabelas."
        >
          <SettingsSegmentedControl<TextSizeOption>
            id="text-size-control"
            value={settings.textSize}
            onChange={(ts) => updateField("textSize", ts)}
            options={[
              { value: "small", label: "Small" },
              { value: "default", label: "Default" },
              { value: "large", label: "Large" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Interface Scale"
          description="Zoom proporcional da interface (90% a 115%)."
        >
          <SettingsSlider
            id="scale-slider"
            value={settings.interfaceScale}
            min={90}
            max={115}
            step={5}
            unit="%"
            onChange={(val) => updateField("interfaceScale", val)}
          />
        </SettingsRow>
      </SettingsSection>

      {/* 4. VISUAL EFFECTS & BACKGROUNDS */}
      <SettingsSection
        id="section-visual-effects"
        title="Visual Effects & Atmosphere"
        description="Efeitos de renderização gráfica, transições com desfoque e física de iluminação."
      >
        <SettingsRow
          label="Background Motion"
          description="Grelhas subtis e órbitas dinâmicas em movimento no fundo."
        >
          <SettingsToggle
            id="toggle-bg-motion"
            checked={settings.visualEffects.backgroundMotion}
            onChange={(val) => updateVisualEffect("backgroundMotion", val)}
          />
        </SettingsRow>

        <SettingsRow
          label="Glass Effects & Blurs"
          description="Superfícies de vidro fosco translúcidas com efeito backdrop-blur."
        >
          <SettingsToggle
            id="toggle-glass"
            checked={settings.visualEffects.glassEffects}
            onChange={(val) => updateVisualEffect("glassEffects", val)}
          />
        </SettingsRow>

        <SettingsRow
          label="Ambient Lighting Core"
          description="Focos de luz radial projetados a partir do logotipo central."
        >
          <SettingsToggle
            id="toggle-ambient"
            checked={settings.visualEffects.ambientLighting}
            onChange={(val) => updateVisualEffect("ambientLighting", val)}
          />
        </SettingsRow>

        <SettingsRow
          label="Blur Transitions"
          description="Transições suaves com desfoque cinemático entre ecrãs e modais."
        >
          <SettingsToggle
            id="toggle-blur-trans"
            checked={settings.visualEffects.blurTransitions}
            onChange={(val) => updateVisualEffect("blurTransitions", val)}
          />
        </SettingsRow>

        <SettingsRow
          label="Motion Preset"
          description="Respeita as tuas preferências de motricidade e acessibilidade."
        >
          <SettingsSegmentedControl<MotionOption>
            id="motion-preset"
            value={settings.motion}
            onChange={(m) => updateField("motion", m)}
            options={[
              { value: "full", label: "Full Motion" },
              { value: "reduced", label: "Reduced" },
              { value: "minimal", label: "Minimal" },
            ]}
          />
        </SettingsRow>

        <SettingsRow
          label="Background Variant"
          description="Padrões de fundo corporativos pré-desenhados pela AXION."
        >
          <SettingsSegmentedControl<BackgroundVariant>
            id="bg-variant"
            value={settings.backgroundVariant}
            onChange={(bv) => updateField("backgroundVariant", bv)}
            options={[
              { value: "deep-obsidian", label: "Deep Obsidian" },
              { value: "cyber-grid", label: "Tech Grid" },
              { value: "starfield-ambient", label: "Starfield" },
              { value: "clean-slate", label: "Clean Slate" },
            ]}
          />
        </SettingsRow>
      </SettingsSection>
    </div>
  );
}
