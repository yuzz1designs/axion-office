import { useCallback, useEffect, useRef, useState } from "react";
import type { AivaVisualState } from "./aivaVisual.types";

interface UseAivaOptions { muted: boolean; }

function getPreferredBrowserVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return voices.find((voice) => voice.lang.toLowerCase() === "pt-pt" && /female|joana|maria|helena/i.test(voice.name))
    ?? voices.find((voice) => voice.lang.toLowerCase() === "pt-pt")
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith("pt"));
}

export function useAivaVisualState({ muted }: UseAivaOptions) {
  const [state, setState] = useState<AivaVisualState>("idle");
  const [userMessage, setUserMessage] = useState("");
  const [response, setResponse] = useState("");
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [notice, setNotice] = useState("");
  const previousResponseId = useRef<string | null>(null);
  const requestController = useRef<AbortController | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const recordedChunks = useRef<Blob[]>([]);
  const discardRecording = useRef(false);
  const activeAudio = useRef<HTMLAudioElement | null>(null);
  const activeAudioUrl = useRef<string | null>(null);

  const releaseMicrophone = useCallback(() => {
    mediaStream.current?.getTracks().forEach((track) => track.stop());
    mediaStream.current = null;
    recorder.current = null;
  }, []);

  const stopPlayback = useCallback(() => {
    if (activeAudio.current) {
      activeAudio.current.pause();
      activeAudio.current.currentTime = 0;
      activeAudio.current = null;
    }
    if (activeAudioUrl.current) {
      URL.revokeObjectURL(activeAudioUrl.current);
      activeAudioUrl.current = null;
    }
    window.speechSynthesis?.cancel();
  }, []);

  const browserSpeechFallback = useCallback((text: string) => new Promise<void>((resolve) => {
    if (!("speechSynthesis" in window)) return resolve();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-PT";
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    const voice = getPreferredBrowserVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  }), []);

  const speak = useCallback(async (text: string, signal: AbortSignal) => {
    if (muted) return;
    setState("speaking");
    try {
      const result = await fetch("/api/aiva/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        signal,
      });
      if (!result.ok) throw new Error("TTS_UNAVAILABLE");
      const blob = await result.blob();
      const url = URL.createObjectURL(blob);
      activeAudioUrl.current = url;
      const audio = new Audio(url);
      activeAudio.current = audio;
      await new Promise<void>((resolve, reject) => {
        audio.onended = () => resolve();
        audio.onerror = () => reject(new Error("AUDIO_PLAYBACK_FAILED"));
        audio.play().catch(reject);
      });
    } catch (error) {
      if (signal.aborted) return;
      await browserSpeechFallback(text);
    } finally {
      stopPlayback();
    }
  }, [browserSpeechFallback, muted, stopPlayback]);

  useEffect(() => {
    fetch("/api/aiva/status")
      .then((result) => result.json())
      .then((data: { configured?: boolean }) => setConfigured(Boolean(data.configured)))
      .catch(() => setConfigured(false));
    return () => {
      requestController.current?.abort();
      if (recorder.current?.state === "recording") recorder.current.stop();
      releaseMicrophone();
      stopPlayback();
    };
  }, [releaseMicrophone, stopPlayback]);

  useEffect(() => {
    if (!muted) return;
    stopPlayback();
    setState((current) => current === "speaking" ? "idle" : current);
  }, [muted, stopPlayback]);

  const runInteraction = useCallback(async (message: string) => {
    const clean = message.trim();
    if (!clean) return;
    requestController.current?.abort();
    stopPlayback();
    const controller = new AbortController();
    requestController.current = controller;
    setUserMessage(clean);
    setResponse("");
    setNotice("");
    setState("thinking");

    try {
      const result = await fetch("/api/aiva/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: clean, previousResponseId: previousResponseId.current }),
        signal: controller.signal,
      });
      const data = await result.json() as { text?: string; responseId?: string; error?: string; code?: string };
      if (!result.ok) throw new Error(data.code || data.error || "AIVA_REQUEST_FAILED");
      const answer = data.text?.trim() || "Não consegui produzir uma resposta completa.";
      previousResponseId.current = data.responseId ?? previousResponseId.current;
      setResponse(answer);
      await speak(answer, controller.signal);
      if (!controller.signal.aborted) {
        setState("success");
        window.setTimeout(() => setState("idle"), 900);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      const notConfigured = error instanceof Error && error.message === "AIVA_NOT_CONFIGURED";
      setConfigured(notConfigured ? false : configured);
      setResponse(notConfigured
        ? "Estou pronta para assumir o meu papel, mas a ligação segura à OpenAI ainda não tem uma API key configurada no servidor."
        : "Não consegui estabelecer ligação ao meu núcleo de inteligência. Tente novamente dentro de instantes.");
      setNotice(notConfigured ? "Configuração necessária" : "Falha de ligação");
      setState(notConfigured ? "warning" : "error");
    }
  }, [configured, speak, stopPlayback]);

  const transcribeAndRespond = useCallback(async (audio: Blob) => {
    setState("thinking");
    try {
      const result = await fetch("/api/aiva/transcribe", { method: "POST", headers: { "Content-Type": audio.type || "audio/webm" }, body: audio });
      const data = await result.json() as { text?: string; code?: string; error?: string };
      if (!result.ok) throw new Error(data.code || data.error);
      if (data.text?.trim()) await runInteraction(data.text);
      else setState("idle");
    } catch (error) {
      setNotice(error instanceof Error && error.message === "AIVA_NOT_CONFIGURED" ? "Configure a API key para ativar a voz" : "Não consegui compreender o áudio");
      setState("warning");
    }
  }, [runInteraction]);

  const startListening = useCallback(async () => {
    requestController.current?.abort();
    stopPlayback();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
      mediaStream.current = stream;
      recordedChunks.current = [];
      discardRecording.current = false;
      const mediaRecorder = new MediaRecorder(stream);
      recorder.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => { if (event.data.size) recordedChunks.current.push(event.data); };
      mediaRecorder.onstop = () => {
        const audio = new Blob(recordedChunks.current, { type: mediaRecorder.mimeType || "audio/webm" });
        releaseMicrophone();
        if (!discardRecording.current && audio.size > 0) void transcribeAndRespond(audio);
        discardRecording.current = false;
      };
      mediaRecorder.start(250);
      setNotice("");
      setState("listening");
    } catch {
      setNotice("Autorize o microfone para falar com a AIVA");
      setState("warning");
    }
  }, [releaseMicrophone, stopPlayback, transcribeAndRespond]);

  const toggleListening = useCallback(() => {
    if (state === "listening" && recorder.current?.state === "recording") {
      recorder.current.stop();
      return;
    }
    // Barge-in: speaking is cancelled before the microphone opens.
    stopPlayback();
    void startListening();
  }, [startListening, state, stopPlayback]);

  const stop = useCallback(() => {
    requestController.current?.abort();
    stopPlayback();
    discardRecording.current = true;
    if (recorder.current?.state === "recording") recorder.current.stop();
    releaseMicrophone();
    setState("idle");
  }, [releaseMicrophone, stopPlayback]);

  const newSession = useCallback(() => {
    stop();
    previousResponseId.current = null;
    setUserMessage("");
    setResponse("");
    setNotice("");
  }, [stop]);

  return { state, userMessage, response, configured, notice, runInteraction, toggleListening, stop, newSession };
}
