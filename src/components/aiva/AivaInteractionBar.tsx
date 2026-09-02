import { ArrowUp, Mic, MonitorUp, Paperclip, RotateCcw, Settings2, Square, Volume2, VolumeX } from "lucide-react";
import { FormEvent, useState } from "react";
import type { AivaVisualState } from "./aivaVisual.types";

interface Props {
  state: AivaVisualState; accentColor: string; muted: boolean;
  onMutedChange: (muted: boolean) => void; onSubmit: (message: string) => void;
  onVoice: () => void; onStop: () => void; onNewSession: () => void;
}

export default function AivaInteractionBar({ state, accentColor, muted, onMutedChange, onSubmit, onVoice, onStop, onNewSession }: Props) {
  const [message, setMessage] = useState("");
  const [screenContext, setScreenContext] = useState(false);
  const [attachmentContext, setAttachmentContext] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const submit = (event: FormEvent) => { event.preventDefault(); if (!message.trim()) return; onSubmit(message); setMessage(""); };
  const active = state === "listening" || state === "speaking";
  return (
    <div className="flex w-full max-w-[680px] flex-col items-center gap-3">
      <form onSubmit={submit} className="aiva-input-shell flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] p-1.5 pl-5 backdrop-blur-xl transition-colors focus-within:border-white/25">
        <label htmlFor="aiva-message" className="sr-only">Perguntar à AIVA</label>
        <input id="aiva-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Perguntar à AIVA..." className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/30" />
        <button type="submit" disabled={!message.trim()} aria-label="Enviar mensagem" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#050609] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-25" style={{ backgroundColor: accentColor, boxShadow: message.trim() ? `0 0 22px ${accentColor}45` : "none" }}><ArrowUp size={17} strokeWidth={2.3} /></button>
      </form>
      <div className="flex items-center gap-2.5">
        <button type="button" onClick={() => setScreenContext((active) => !active)} className={`aiva-secondary-control ${screenContext ? "is-selected" : ""}`} aria-pressed={screenContext} aria-label="Ver ecrã" title={screenContext ? "Ecrã incluído na simulação" : "Ver ecrã"} style={screenContext ? { color: accentColor, borderColor: `${accentColor}70` } : undefined}><MonitorUp size={15} /></button>
        <button type="button" onClick={() => setAttachmentContext((active) => !active)} className={`aiva-secondary-control ${attachmentContext ? "is-selected" : ""}`} aria-pressed={attachmentContext} aria-label="Anexar contexto" title="Anexar contexto" style={attachmentContext ? { color: accentColor, borderColor: `${accentColor}70` } : undefined}><Paperclip size={15} /></button>
        <button type="button" onClick={onVoice} aria-label={state === "listening" ? "Terminar e processar voz" : state === "speaking" ? "Interromper e falar" : "Falar com a AIVA"} className={`aiva-voice-control ${active ? "is-active" : ""}`} style={{ color: accentColor, borderColor: active ? `${accentColor}80` : undefined, boxShadow: active ? `0 0 30px ${accentColor}25` : undefined }}>{state === "speaking" ? <Square size={17} fill="currentColor" /> : <Mic size={19} />}</button>
        <button type="button" onClick={() => onMutedChange(!muted)} className="aiva-secondary-control" aria-label={muted ? "Ativar som" : "Silenciar AIVA"} title={muted ? "Ativar som" : "Silenciar"}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}</button>
        <button type="button" onClick={onNewSession} className="aiva-secondary-control" aria-label="Nova sessão" title="Nova sessão"><RotateCcw size={15} /></button>
        <button type="button" onClick={() => setSettingsOpen((open) => !open)} className={`aiva-secondary-control ${settingsOpen ? "is-selected" : ""}`} aria-pressed={settingsOpen} aria-label="Definições da AIVA" title="Definições da AIVA" style={settingsOpen ? { color: accentColor, borderColor: `${accentColor}70` } : undefined}><Settings2 size={15} /></button>
      </div>
      <span className="min-h-4 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">{state === "listening" ? "A ouvir · toque para enviar" : state === "speaking" ? "Toque para interromper e falar" : screenContext ? "Contexto de ecrã simulado ativo" : settingsOpen ? "Preferências visuais ativas" : "Voz sintética · microfone sob controlo"}</span>
    </div>
  );
}
