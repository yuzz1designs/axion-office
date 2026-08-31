/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Check } from "lucide-react";
import { AccentColorOption, AccentColorToken } from "../../types/settings";

// ================= SECTION WRAPPER =================
interface SettingsSectionProps {
  id?: string;
  title: string;
  description?: string;
  badge?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SettingsSection({
  id,
  title,
  description,
  badge,
  action,
  children,
  className = ""
}: SettingsSectionProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`relative bg-[#0d121c]/70 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-xl ${className}`}
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h2 className="text-lg md:text-xl font-sans font-semibold tracking-tight text-white">
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] font-mono tracking-widest text-[#00f0ff] uppercase bg-[#00f0ff]/10 border border-[#00f0ff]/20 px-2.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-2xl font-sans">
              {description}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      {/* Section Body */}
      <div className="flex flex-col gap-5">{children}</div>
    </motion.section>
  );
}

// ================= ROW WRAPPER =================
interface SettingsRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  alignTop?: boolean;
}

export function SettingsRow({
  label,
  description,
  children,
  className = "",
  alignTop = false,
}: SettingsRowProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-white/[0.04] last:border-0 ${
        alignTop ? "sm:items-start" : ""
      } ${className}`}
    >
      <div className="flex flex-col gap-0.5 max-w-md">
        <span className="text-sm font-medium text-white/90 font-sans tracking-wide">
          {label}
        </span>
        {description && (
          <span className="text-xs text-white/40 font-sans leading-normal">
            {description}
          </span>
        )}
      </div>
      <div className="shrink-0 flex items-center">{children}</div>
    </div>
  );
}

// ================= ANIMATED TOGGLE =================
interface SettingsToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  size?: "sm" | "md";
}

export function SettingsToggle({
  checked,
  onChange,
  disabled = false,
  id,
  size = "md"
}: SettingsToggleProps) {
  const isSm = size === "sm";

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-300 ease-in-out focus:outline-none ${
        isSm ? "h-5 w-9" : "h-6 w-11"
      } ${
        checked ? "bg-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.4)]" : "bg-white/10 hover:bg-white/15"
      } ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
          isSm ? "h-4 w-4 mt-0.5" : "h-5 w-5 mt-0.5"
        } ${
          checked 
            ? isSm ? "translate-x-4 bg-[#0a101d]" : "translate-x-5 bg-[#080d16]" 
            : isSm ? "translate-x-0.5 text-white/40" : "translate-x-0.5 text-white/40"
        }`}
      />
    </button>
  );
}

// ================= SEGMENTED CONTROL =================
export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

interface SettingsSegmentedControlProps<T extends string | number> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  id?: string;
  className?: string;
}

export function SettingsSegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  id,
  className = ""
}: SettingsSegmentedControlProps<T>) {
  return (
    <div
      id={id}
      className={`inline-flex p-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl gap-1 ${className}`}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={`relative px-3.5 py-1.5 rounded-xl text-xs font-sans font-medium transition-colors duration-200 outline-none flex items-center gap-1.5 cursor-pointer select-none ${
              isSelected ? "text-white" : "text-white/40 hover:text-white/80"
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId={`segmentIndicator-${id || "default"}`}
                className="absolute inset-0 bg-white/[0.12] border border-white/10 rounded-xl shadow-inner"
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
              />
            )}
            {Icon && <Icon size={14} className="relative z-10" />}
            <span className="relative z-10 tracking-wide">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ================= ACCENT COLOR PICKER =================
interface SettingsColorPickerProps {
  options: AccentColorOption[];
  value: AccentColorToken;
  onChange: (value: AccentColorToken) => void;
  allowedTokens?: AccentColorToken[];
}

export function SettingsColorPicker({
  options,
  value,
  onChange,
  allowedTokens,
}: SettingsColorPickerProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {options.map((option) => {
        const isSelected = value === option.id;
        const isAllowed = !allowedTokens || allowedTokens.includes(option.id);

        if (!isAllowed) return null;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-2xl border transition-all duration-300 cursor-pointer outline-none ${
              isSelected
                ? "bg-white/[0.08] border-white/30 shadow-lg"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/15"
            }`}
            title={option.name}
          >
            {/* Color Swatch Circle with Glow */}
            <div
              className="w-4 h-4 rounded-full relative flex items-center justify-center transition-transform group-hover:scale-110"
              style={{
                backgroundColor: option.hex,
                boxShadow: isSelected ? `0 0 10px ${option.hex}` : "none"
              }}
            >
              {isSelected && <Check size={10} className="text-[#050609] stroke-[3]" />}
            </div>

            <span
              className={`text-xs font-sans font-medium tracking-wide ${
                isSelected ? "text-white font-semibold" : "text-white/60 group-hover:text-white"
              }`}
            >
              {option.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ================= CUSTOM SLIDER =================
interface SettingsSliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  id?: string;
}

export function SettingsSlider({
  value,
  min,
  max,
  step = 1,
  unit = "%",
  onChange,
  id
}: SettingsSliderProps) {
  return (
    <div className="flex items-center gap-3 min-w-[200px]">
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff] outline-none"
      />
      <span className="font-mono text-xs text-white/70 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md min-w-[48px] text-center">
        {value}{unit}
      </span>
    </div>
  );
}

// ================= STANDARDIZED BUTTONS =================
export interface SettingsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function SettingsButton({
  variant = "secondary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  disabled,
  ...props
}: SettingsButtonProps) {
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-4 py-2 text-xs md:text-sm rounded-xl gap-2",
    lg: "px-5 py-2.5 text-sm rounded-2xl gap-2.5",
  }[size];

  const variantClasses = {
    primary: "bg-[#00f0ff] hover:bg-[#38f4ff] text-[#050609] font-semibold shadow-[0_0_15px_rgba(0,240,255,0.3)] active:scale-[0.98]",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 active:scale-[0.98]",
    danger: "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 active:scale-[0.98]",
    ghost: "text-white/60 hover:text-white hover:bg-white/5",
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      className={`inline-flex items-center justify-center font-sans tracking-wide transition-all duration-200 cursor-pointer outline-none ${sizeClasses} ${variantClasses} ${
        disabled ? "opacity-40 cursor-not-allowed" : ""
      } ${className}`}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      <span>{children}</span>
    </button>
  );
}

// ================= CUSTOM SELECT / DROPDOWN =================
interface SettingsSelectProps<T extends string | number> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  id?: string;
  className?: string;
}

export function SettingsSelect<T extends string | number>({
  value,
  options,
  onChange,
  id,
  className = ""
}: SettingsSelectProps<T>) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="bg-[#121824] text-white/90 border border-white/15 rounded-xl px-3.5 py-1.5 text-xs md:text-sm font-sans tracking-wide outline-none focus:border-[#00f0ff] transition-colors cursor-pointer appearance-none pr-8"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value} className="bg-[#121824] text-white">
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-white/40">
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
