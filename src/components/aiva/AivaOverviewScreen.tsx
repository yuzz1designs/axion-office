import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import type { AccentColorOption } from "../../types/settings";
import AivaEntity from "./AivaEntity";
import AivaInteractionBar from "./AivaInteractionBar";
import { getAivaStatePresets } from "./aivaStatePresets";
import { useAivaVisualState } from "./useAivaVisualState";
import { useAudioSimulation } from "./useAudioSimulation";
import { useReducedMotion } from "./useReducedMotion";
import "./aiva.css";

interface Props { accentColor?: AccentColorOption; onBackToOverview?: () => void; }
const DEFAULT_ACCENT: AccentColorOption = { id: "axion-blue", name: "AXION Blue", hex: "#00f0ff", secondary: "#0284c7", glow: "rgba(0, 240, 255, 0.4)" };

export default function AivaOverviewScreen({ accentColor = DEFAULT_ACCENT, onBackToOverview }: Props) {
  const [muted, setMuted] = useState(false);
  const { state, userMessage, response, configured, notice, runInteraction, toggleListening, stop, newSession } = useAivaVisualState({ muted });
  const reducedMotion = useReducedMotion();
  const audioLevel = useAudioSimulation(muted ? "idle" : state);
  const presets = useMemo(() => getAivaStatePresets(accentColor.hex), [accentColor.hex]);
  const preset = presets[state];

  return (
    <section className="aiva-screen relative isolate flex min-h-[720px] w-full flex-col overflow-hidden rounded-[28px] border border-white/[0.055] bg-[#03050a] text-white md:h-full md:min-h-[650px]" aria-labelledby="aiva-title">
      <div className="aiva-atmosphere absolute inset-0" aria-hidden="true" />
      <div className="aiva-grid absolute inset-x-0 bottom-0 h-[44%]" aria-hidden="true" />
      <header className="relative z-20 flex items-start justify-between px-5 pt-5 md:px-8 md:pt-7">
        <div className="flex items-center gap-3">
          {onBackToOverview && <button type="button" onClick={onBackToOverview} className="aiva-secondary-control" aria-label="Voltar ao painel"><ChevronLeft size={17} /></button>}
          <div>
            <h1 id="aiva-title" className="font-display text-sm font-semibold tracking-[0.32em] text-white md:text-base">AIVA</h1>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-white/30">AXION Intelligent Virtual Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.07] bg-black/20 px-3 py-1.5 backdrop-blur-md" role="status" aria-live="polite">
          <span className={`aiva-status-dot ${state}`} style={{ backgroundColor: preset.color, boxShadow: `0 0 10px ${preset.color}` }} />
          <span className="font-mono text-[9px] tracking-[0.18em] text-white/55">{preset.label}</span>
        </div>
      </header>

      <main className="relative z-10 grid min-h-0 flex-1 grid-rows-[minmax(270px,1fr)_auto] items-center px-4 pb-5 pt-1 md:grid-rows-[minmax(300px,1fr)_auto] md:px-8 md:pb-7">
        <div className="relative mx-auto h-full w-full max-w-5xl">
          <AivaEntity state={state} accentColor={preset.color} audioLevel={audioLevel} reducedMotion={reducedMotion} />
          <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 items-center gap-3 xl:flex"><span className="h-px w-10 bg-gradient-to-r from-transparent to-white/20" /><span className="font-mono text-[8px] uppercase tracking-[0.25em] text-white/20">Neural presence / 01</span></div>
        </div>
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-3 text-center">
          <AnimatePresence mode="wait">
            <motion.div key={`${state}-${response}`} initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -5 }} transition={{ duration: reducedMotion ? 0.01 : 0.3 }} className="min-h-[70px]">
              {response ? <div className="mx-auto max-w-2xl">{userMessage && <p className="mb-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/30">{userMessage}</p>}<p className="text-sm leading-relaxed text-white/80 md:text-[15px]">{response}</p>{notice && <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: preset.color }}>{notice}</p>}</div> : <div><h2 className="text-xl font-medium tracking-tight text-white/95 md:text-2xl">Como posso ajudar?</h2><p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: `${preset.color}a8` }}>{notice || preset.description}</p></div>}
            </motion.div>
          </AnimatePresence>
          <AivaInteractionBar state={state} accentColor={preset.color} muted={muted} onMutedChange={setMuted} onSubmit={runInteraction} onVoice={toggleListening} onStop={stop} onNewSession={newSession} />
        </div>
      </main>

      <footer className="relative z-20 flex items-center border-t border-white/[0.045] px-5 py-3 md:px-8">
        <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/25"><ShieldCheck size={12} /><span>{configured === null ? "A verificar núcleo seguro" : configured ? "AIVA ligada · voz sintética OpenAI" : "Núcleo local · falta configurar API key"}</span></div>
      </footer>
    </section>
  );
}
