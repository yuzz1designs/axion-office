/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Bot, 
  Terminal, 
  Mic, 
  Radio, 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Check, 
  MessageSquare,
  Activity,
  Workflow
} from "lucide-react";
import { AccentColorOption } from "../../types/settings";

interface AivaOverviewScreenProps {
  accentColor?: AccentColorOption;
  onBackToOverview?: () => void;
}

const UPCOMING_CAPABILITIES = [
  {
    icon: Mic,
    title: "Voice Command & Telemetry Engine",
    tag: "LIVE PROTOCOL",
    desc: "Controlo do escritório em tempo real por voz natural. Ajuste de iluminação, climatização e salas em milissegundos."
  },
  {
    icon: Workflow,
    title: "Orquestração Autónoma de Projetos",
    tag: "MULTI-AGENT",
    desc: "Deteção preditiva de atrasos, triagem de prioridades críticas e distribuição inteligente de recursos de equipa."
  },
  {
    icon: MessageSquare,
    title: "Atas & Resumos de Reuniões em Tempo Real",
    tag: "COGNITIVE CORE",
    desc: "Transcrição com identificação de oradores, extração de tarefas imediatas e sincronização instantânea com a agenda."
  },
  {
    icon: ShieldCheck,
    title: "Auditoria & Conformidade Local",
    tag: "ON-PREM & CLOUD",
    desc: "Processamento seguro com encriptação de ponta a ponta e zero partilha de dados proprietários."
  }
];

const SIMULATED_PROMPTS = [
  "«AIVA, prepara a Sala de Conselho para a reunião das 16:30 com 21°C e luz de apresentação.»",
  "«AIVA, quais são os projetos em estado 'At Risk' que requerem intervenção antes do fim do dia?»",
  "«AIVA, gera a ata da reunião com o cliente e agenda as entregas para a próxima quinta-feira.»",
];

export default function AivaOverviewScreen({
  accentColor = {
    id: "axion-blue",
    name: "AXION Blue",
    hex: "#00f0ff",
    secondary: "#0284c7",
    glow: "rgba(0, 240, 255, 0.4)"
  },
  onBackToOverview
}: AivaOverviewScreenProps) {
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [isJoinedWaitlist, setIsJoinedWaitlist] = useState(false);
  const [isListeningSim, setIsListeningSim] = useState(false);

  const handleToggleListening = () => {
    setIsListeningSim(true);
    setTimeout(() => {
      setIsListeningSim(false);
      setActivePromptIndex((prev) => (prev + 1) % SIMULATED_PROMPTS.length);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-full flex flex-col justify-between py-2 pb-16 relative z-10 gap-6 overflow-y-auto pr-2 select-none">
      
      {/* Top Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-[#090d16]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Glow halo behind header */}
        <div 
          className="absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-700"
          style={{ backgroundColor: accentColor.hex }}
        />

        <div className="flex items-start gap-4 z-10">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-xl relative shrink-0"
            style={{
              backgroundColor: `${accentColor.hex}15`,
              borderColor: `${accentColor.hex}40`,
              boxShadow: `0 0 25px ${accentColor.glow}`
            }}
          >
            <Sparkles className="w-7 h-7" style={{ color: accentColor.hex }} />
            <span 
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
              style={{ backgroundColor: accentColor.hex }}
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-1"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight uppercase">
                AIVA INTELLIGENCE, <span className="text-white/70 font-normal">NEURAL COPILOT</span>
              </h1>
              <span 
                className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 rounded-full font-bold border animate-pulse"
                style={{
                  color: accentColor.hex,
                  backgroundColor: `${accentColor.hex}18`,
                  borderColor: `${accentColor.hex}45`,
                  boxShadow: `0 0 15px ${accentColor.glow}`
                }}
              >
                BREVEMENTE
              </span>
              <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                v1.0 BETA PREVIEW
              </span>
            </div>
            
            <p className="text-xs md:text-sm text-white/60 font-sans max-w-2xl leading-relaxed mt-1">
              <strong>Autonomous Intelligent Virtual Architect</strong> — O copiloto operacional e decisional desenhado especificamente para o ecossistema AXION OFFICE.
            </p>
          </motion.div>
        </div>

        {/* Action / Early Access Button */}
        <div className="flex items-center gap-3 z-10 shrink-0">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-sans border border-white/10 transition-colors cursor-pointer"
            >
              Voltar ao Painel
            </button>
          )}

          <button
            onClick={() => setIsJoinedWaitlist(true)}
            style={{
              backgroundColor: isJoinedWaitlist ? "#10b981" : accentColor.hex,
              color: "#050609",
              boxShadow: `0 0 20px ${isJoinedWaitlist ? "rgba(16, 185, 129, 0.4)" : accentColor.glow}`
            }}
            className="px-5 py-2.5 rounded-xl font-bold text-xs font-sans transition-all cursor-pointer hover:brightness-110 flex items-center gap-2"
          >
            {isJoinedWaitlist ? (
              <>
                <Check size={14} className="stroke-[3]" />
                <span>Acesso Beta Registado</span>
              </>
            ) : (
              <>
                <Zap size={14} />
                <span>Pedir Acesso Antecipado</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Interactive Interactive Showcase Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Interactive Neural Simulator (5 cols) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-5 bg-[#080d16]/90 border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[380px]"
        >
          {/* Top terminal badge */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Terminal size={14} style={{ color: accentColor.hex }} />
              <span className="text-[10px] font-mono tracking-wider text-white/70 uppercase">
                AIVA NEURAL CONVERSATION SIMULATOR
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              STANDBY
            </span>
          </div>

          {/* Central Neural Pulse / Equalizer Visual */}
          <div className="flex flex-col items-center justify-center my-6 gap-5">
            <div className="relative flex items-center justify-center">
              {/* Outer pulsing ring */}
              <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 rounded-full border border-dashed"
                style={{ borderColor: accentColor.hex }}
              />
              
              {/* Inner glowing core */}
              <div 
                className="absolute w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  backgroundColor: `${accentColor.hex}15`,
                  border: `1px solid ${accentColor.hex}40`,
                  boxShadow: `0 0 35px ${accentColor.glow}`
                }}
              >
                <Bot size={36} style={{ color: accentColor.hex }} />
              </div>
            </div>

            {/* Simulated Live Equalizer wave */}
            <div className="flex items-center gap-1 h-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bar) => (
                <motion.span
                  key={bar}
                  animate={{
                    height: isListeningSim ? ["20%", "100%", "30%", "85%", "15%"] : ["20%", "50%", "20%"],
                  }}
                  transition={{
                    duration: 0.8 + (bar % 4) * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-1 rounded-full transition-colors"
                  style={{
                    backgroundColor: isListeningSim ? accentColor.hex : "rgba(255, 255, 255, 0.25)",
                    height: `${25 + (bar % 5) * 12}%`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Prompt card & trigger */}
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5">
              <span className="text-[9px] font-mono text-white/40 tracking-wider uppercase">
                EXEMPLO DE COMANDO CONTEXTUAL
              </span>
              <p className="text-xs text-white/90 font-sans italic leading-relaxed">
                {SIMULATED_PROMPTS[activePromptIndex]}
              </p>
            </div>

            <button
              onClick={handleToggleListening}
              disabled={isListeningSim}
              className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Mic size={14} style={{ color: accentColor.hex }} />
              <span>{isListeningSim ? "A processar comando..." : "Testar Próximo Prompt de Simulação"}</span>
            </button>
          </div>
        </motion.div>

        {/* Right Feature Breakdown Grid (7 cols) */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UPCOMING_CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className="p-5 rounded-3xl bg-[#090d16]/70 border border-white/[0.08] hover:border-white/20 flex flex-col justify-between gap-4 transition-all duration-300 group hover:bg-[#0c121e]"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all"
                      style={{
                        backgroundColor: `${accentColor.hex}10`,
                        borderColor: `${accentColor.hex}30`
                      }}
                    >
                      <Icon size={18} style={{ color: accentColor.hex }} />
                    </div>

                    <span className="text-[9px] font-mono tracking-widest text-white/40 uppercase bg-white/5 px-2 py-0.5 rounded-md">
                      {cap.tag}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-sans font-bold text-white tracking-tight group-hover:text-white">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-white/50 leading-relaxed font-sans mt-0.5">
                      {cap.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/40 pt-2 border-t border-white/5">
                  <Clock size={11} style={{ color: accentColor.hex }} />
                  <span>DISPONÍVEL NO Q4 2026</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Technical Spec Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/50"
      >
        <div className="flex items-center gap-3">
          <Radio size={15} style={{ color: accentColor.hex }} className="animate-pulse" />
          <span>AIVA Neural Architecture — Modelos multimodais integrados diretamente no hardware do edifício.</span>
        </div>
        <div className="font-mono text-[10px] text-white/40 tracking-wider">
          STATUS: IN ACTIVE LAB TESTING (STAGE 3)
        </div>
      </motion.div>

    </div>
  );
}
