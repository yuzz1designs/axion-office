import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  MessageSquare, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Send, 
  Play, 
  Pause, 
  Sparkles, 
  ArrowRight, 
  AlertCircle,
  Copy,
  CheckCheck,
  X,
  FileText,
  CalendarDays,
  Columns3,
  Search,
  SlidersHorizontal,
  Check,
  AlertTriangle,
  History,
  ShieldCheck
} from "lucide-react";
import { 
  CalendarEvent, 
  IntegratedTask, 
  MeetingAta, 
  DISCORD_CHANNELS, 
  MOCK_CALENDAR_EVENTS, 
  MOCK_INTEGRATED_TASKS, 
  MOCK_MEETING_ATAS,
  MeetingInviteNotification
} from "../../data/calendarMockData";
import { AccentColorOption } from "../../types/settings";
import PastMeetingsView from "./PastMeetingsView";

interface CalendarMeetingsScreenProps {
  accentColor?: AccentColorOption;
  onBackToOverview?: () => void;
  events?: CalendarEvent[];
  onEventsChange?: (events: CalendarEvent[]) => void;
  atas?: MeetingAta[];
  onAtasChange?: (atas: MeetingAta[]) => void;
  selectedMeetingId?: string;
  onSelectMeetingId?: (id: string) => void;
  onBroadcastMeetingInvite?: (invite: MeetingInviteNotification) => void;
  currentUserRole?: string;
  isLight?: boolean;
}

type MainCalendarTab = "calendar_view" | "past_meetings";
type CalendarViewMode = "month" | "week" | "day";

// Days in August/September 2026 for demonstration
interface MonthDayInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  dayOfWeek: number; // 0 = Mon, 6 = Sun
}

// Available team members to invite
const TEAM_MEMBERS_DIRECTORY = [
  { name: "João Silva", email: "joao.silva@axion.io", role: "Structural Engineer" },
  { name: "Clara Mendes", email: "clara.mendes@axion.io", role: "Project Manager" },
  { name: "Mariana Costa", email: "mariana.c@axion.io", role: "Design Systems" },
  { name: "Carlos Ferreira", email: "carlos.f@axion.io", role: "Finance Director" },
  { name: "Beatriz Lima", email: "beatriz@axion.io", role: "Account Lead" }
];

export default function CalendarMeetingsScreen({
  accentColor = {
    id: "axion-blue",
    name: "AXION Blue",
    hex: "#00f0ff",
    secondary: "#0284c7",
    glow: "rgba(0, 240, 255, 0.4)"
  },
  onBackToOverview,
  events: propEvents,
  onEventsChange,
  atas: propAtas,
  onAtasChange,
  selectedMeetingId: propSelectedMeetingId,
  onSelectMeetingId,
  onBroadcastMeetingInvite,
  currentUserRole = "Senior Partner & Brand Architect",
  isLight = false
}: CalendarMeetingsScreenProps) {
  // Main Sub-Tab: Interactive Calendar vs Past Meetings History
  const [mainTab, setMainTab] = useState<MainCalendarTab>("calendar_view");

  // Calendar View Mode: Month, Week, Day
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  
  // Current Selected Year/Month Cursor
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 7 = August (0-indexed)
  
  // Internal State Collections with sync to parent if provided
  const [internalEvents, setInternalEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [internalAtas, setInternalAtas] = useState<MeetingAta[]>(MOCK_MEETING_ATAS);
  const [tasks, setTasks] = useState<IntegratedTask[]>(MOCK_INTEGRATED_TASKS);

  const events = propEvents || internalEvents;
  const setEvents = (newEvents: CalendarEvent[]) => {
    setInternalEvents(newEvents);
    if (onEventsChange) onEventsChange(newEvents);
  };

  const atas = propAtas || internalAtas;
  const setAtas = (newAtas: MeetingAta[]) => {
    setInternalAtas(newAtas);
    if (onAtasChange) onAtasChange(newAtas);
  };
  
  // Selection States
  const [selectedDate, setSelectedDate] = useState<string>("2026-08-31");
  const [internalSelectedEventId, setInternalSelectedEventId] = useState<string>("evt-1");
  
  const selectedEventId = propSelectedMeetingId || internalSelectedEventId;
  const setSelectedEventId = (id: string) => {
    setInternalSelectedEventId(id);
    if (onSelectMeetingId) onSelectMeetingId(id);
  };

  const [selectedDiscordChannel, setSelectedDiscordChannel] = useState<string>("atas-executivas");

  // Filter for tasks
  const [taskCategoryFilter, setTaskCategoryFilter] = useState<"all" | "pending" | "completed">("all");

  // Syncing & Notifications
  const [isSyncingGCal, setIsSyncingGCal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<{ title: string; message: string; type?: "success" | "warning" } | null>(null);
  const [isDispatchingDiscord, setIsDispatchingDiscord] = useState(false);

  // Audio Playback
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSpeed, setAudioPlaybackSpeed] = useState<number>(1);
  const [audioProgress, setAudioProgress] = useState<number>(24);

  // Modals & Inline Inputs
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [quickTaskInput, setQuickTaskInput] = useState("");
  const [quickTaskPriority, setQuickTaskPriority] = useState<"high" | "medium" | "low">("medium");

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventClient, setNewEventClient] = useState("Casas do Beco");
  const [newEventDate, setNewEventDate] = useState(selectedDate);
  const [newEventTime, setNewEventTime] = useState("17:00");
  const [newEventDuration, setNewEventDuration] = useState("60");
  const [newEventDesc, setNewEventDesc] = useState("");
  const [selectedInvitedUsers, setSelectedInvitedUsers] = useState<string[]>([
    "João Silva",
    "Clara Mendes"
  ]);

  // Check if current user has high role / leadership privileges to create meetings
  const canCreateMeeting = useMemo(() => {
    const roleLower = (currentUserRole || "").toLowerCase();
    return (
      roleLower.includes("partner") ||
      roleLower.includes("lead") ||
      roleLower.includes("architect") ||
      roleLower.includes("manager") ||
      roleLower.includes("director") ||
      roleLower.includes("admin") ||
      roleLower.includes("direção")
    );
  }, [currentUserRole]);

  // Audio Waveform Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 1));
      }, 350 / audioPlaybackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, audioPlaybackSpeed]);

  // Auto-sync date if selectedEventId changes
  useEffect(() => {
    if (selectedEventId) {
      const match = events.find(e => e.id === selectedEventId);
      if (match && match.date) {
        setSelectedDate(match.date);
      }
    }
  }, [selectedEventId, events]);

  // Selected Event Object
  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId) || events[0] || null;
  }, [events, selectedEventId]);

  // Linked ATA
  const linkedAta = useMemo(() => {
    if (!selectedEvent) return null;
    return atas.find((a) => a.eventId === selectedEvent.id || a.id === selectedEvent.discordAtaId) || null;
  }, [selectedEvent, atas]);

  // Tasks for Selected Date
  const tasksForSelectedDate = useMemo(() => {
    return tasks
      .filter((t) => t.dueDate === selectedDate)
      .filter((t) => {
        if (taskCategoryFilter === "pending") return !t.completed;
        if (taskCategoryFilter === "completed") return t.completed;
        return true;
      });
  }, [tasks, selectedDate, taskCategoryFilter]);

  // Calendar Days Calculation (August 2026 / September 2026 grid)
  const calendarDays = useMemo<MonthDayInfo[]>(() => {
    const days: MonthDayInfo[] = [];
    const prevMonthDays = [27, 28, 29, 30, 31];
    prevMonthDays.forEach((dayNum, idx) => {
      const dateStr = `2026-07-${dayNum}`;
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: false,
        dayOfWeek: idx
      });
    });

    for (let day = 1; day <= 31; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `2026-08-${dayStr}`;
      const isToday = dateStr === "2026-08-31";
      const dateObj = new Date(2026, 7, day);
      const dayOfWeek = (dateObj.getDay() + 6) % 7;

      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        isToday,
        dayOfWeek
      });
    }

    for (let day = 1; day <= 6; day++) {
      const dayStr = `0${day}`;
      const dateStr = `2026-09-${dayStr}`;
      const dateObj = new Date(2026, 8, day);
      const dayOfWeek = (dateObj.getDay() + 6) % 7;

      days.push({
        dateStr,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: false,
        dayOfWeek
      });
    }

    return days;
  }, []);

  // Events map by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    events.forEach((evt) => {
      if (!map[evt.date]) map[evt.date] = [];
      map[evt.date].push(evt);
    });
    return map;
  }, [events]);

  // Handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleSyncGoogleCalendar = () => {
    setIsSyncingGCal(true);
    setTimeout(() => {
      setIsSyncingGCal(false);
      setFeedbackToast({
        title: "Workspace Sincronizado",
        message: "Google Calendar, Meet & Tasks 100% atualizados via Cloud API.",
        type: "success"
      });
      setTimeout(() => setFeedbackToast(null), 3500);
    }, 1200);
  };

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskInput.trim()) return;

    const newTask: IntegratedTask = {
      id: `task-${Date.now()}`,
      title: quickTaskInput.trim(),
      eventId: selectedEvent ? selectedEvent.id : undefined,
      eventTitle: selectedEvent ? selectedEvent.title : undefined,
      clientName: selectedEvent?.clientName || "AXION Workspace",
      clientRef: selectedEvent?.clientRef || "ECO-001",
      priority: quickTaskPriority,
      dueDate: selectedDate,
      dueTime: "18:00",
      completed: false,
      assignee: { name: "Nelson Afonso" },
      estimatedTime: "30m",
      syncedWithGCal: true,
      fromDiscordAta: false
    };

    setTasks([newTask, ...tasks]);
    setQuickTaskInput("");
  };

  // Create Event by Leadership User
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const meetHash = Math.random().toString(36).substring(7);
    const meetUrl = `https://meet.google.com/axion-${meetHash}`;

    const attendeesList = [
      { name: "Nelson Afonso", email: "nelson@axion.io", role: currentUserRole, status: "accepted" as const },
      ...selectedInvitedUsers.map(name => {
        const found = TEAM_MEMBERS_DIRECTORY.find(m => m.name === name);
        return {
          name,
          email: found ? found.email : `${name.toLowerCase().replace(" ", ".")}@axion.io`,
          role: found ? found.role : "Convidado",
          status: "accepted" as const
        };
      })
    ];

    const created: CalendarEvent = {
      id: `evt-${Date.now()}`,
      title: newEventTitle.trim(),
      clientName: newEventClient,
      clientRef: newEventClient.includes("Santos") ? "ECO-001" : newEventClient.includes("Beco") ? "ECO-004" : "ECO-003",
      date: newEventDate,
      startTime: newEventTime,
      endTime: "18:00",
      durationMinutes: parseInt(newEventDuration, 10) || 60,
      locationType: "google_meet",
      locationUrl: meetUrl,
      status: "scheduled",
      category: "client_sync",
      description: newEventDesc || "Reunião de alinhamento e coordenação com a equipa.",
      attendees: attendeesList,
      tasksCount: 0,
      completedTasksCount: 0,
      hasDiscordAta: false,
      discordChannelTarget: "atas-executivas",
      gcalSynced: true,
      gcalEventId: `gcal_${Date.now()}`
    };

    const updatedEvents = [...events, created];
    setEvents(updatedEvents);
    setSelectedEventId(created.id);
    setSelectedDate(created.date);
    setShowNewEventModal(false);

    // Broadcast Meeting Invite Notification for all invited team members (shows on Home)
    if (onBroadcastMeetingInvite) {
      const inviteNotification: MeetingInviteNotification = {
        id: `inv-${Date.now()}`,
        eventId: created.id,
        meetingTitle: created.title,
        clientName: created.clientName,
        date: created.date === "2026-08-31" ? "Hoje • 31 Ago" : created.date,
        time: `${created.startTime} (${created.durationMinutes} min)`,
        createdBy: {
          name: "Nelson Afonso",
          role: currentUserRole,
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
        },
        invitedUsers: selectedInvitedUsers,
        locationUrl: created.locationUrl,
        timestamp: "Agora mesmo",
        status: "pending"
      };
      onBroadcastMeetingInvite(inviteNotification);
    }

    setFeedbackToast({
      title: "Reunião Agendada com Sucesso",
      message: `Link Google Meet gerado e notificação de convite enviada aos ${selectedInvitedUsers.length} membros convidados.`,
      type: "success"
    });
    setTimeout(() => setFeedbackToast(null), 4000);

    setNewEventTitle("");
    setNewEventDesc("");
  };

  // Publish Meeting ATA (Confirming AI generated minute and publishing to platform & Discord)
  const handlePublishAta = (ataId: string) => {
    setIsDispatchingDiscord(true);
    setTimeout(() => {
      setIsDispatchingDiscord(false);
      setAtas(
        atas.map((a) =>
          a.id === ataId
            ? {
                ...a,
                platformStatus: "published",
                discordStatus: "published",
                discordChannel: selectedDiscordChannel,
                reviewedBy: "Nelson Afonso (Senior Partner)",
                discordPublishedAt: "Hoje, 17:15"
              }
            : a
        )
      );

      setFeedbackToast({
        title: "Ata Publicada Oficialmente",
        message: `Minuta da IA confirmada e publicada no ecossistema e canal #${selectedDiscordChannel}!`,
        type: "success"
      });
      setTimeout(() => setFeedbackToast(null), 4000);
    }, 900);
  };

  // Copy Meet Link
  const handleCopyMeet = (url?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const pendingAtasCount = useMemo(() => {
    return atas.filter(a => a.platformStatus === "pending_review" || a.discordStatus === "draft").length;
  }, [atas]);

  return (
    <div className="w-full max-w-[1600px] mx-auto flex flex-col gap-8 relative z-10 pb-20 px-2 sm:px-4">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER WITH SLIDE + FADE-IN ANIMATION */}
      {/* ========================================================================= */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-white/[0.08] pb-6">
        
        {/* Animated Title (from left to right with fade in) */}
        <motion.div 
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-1.5"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight uppercase">
              REUNIÕES & CALENDÁRIO, <span className="text-white/70 font-normal">WORKSPACE & ATAS IA</span>
            </h1>
          </div>

          <p className="text-xs md:text-sm text-white/55 font-sans max-w-3xl">
            Gestão unificada de sessões Google Meet, consulta de atas preliminares geradas por IA, aprovação humana e distribuição automática.
          </p>
        </motion.div>

        {/* Action Controls & Master Sub-View Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          
          {/* Main Sub-Tab Switcher: Calendário vs Últimas Reuniões */}
          <div className="flex items-center bg-[#0a0e17] border border-white/10 p-1 rounded-2xl shadow-inner">
            <button
              onClick={() => setMainTab("calendar_view")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer ${
                mainTab === "calendar_view"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <CalendarDays size={13} />
              <span>Agenda & Calendário</span>
            </button>

            <button
              onClick={() => setMainTab("past_meetings")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-sans font-semibold transition-all cursor-pointer relative ${
                mainTab === "past_meetings"
                  ? "bg-white text-black font-bold shadow-md"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <History size={13} />
              <span>Últimas Reuniões</span>
              {pendingAtasCount > 0 && (
                <span 
                  className="w-2 h-2 rounded-full animate-pulse ml-0.5" 
                  style={{ backgroundColor: accentColor.hex }}
                />
              )}
            </button>
          </div>

          {/* Sync Button */}
          <button
            onClick={handleSyncGoogleCalendar}
            disabled={isSyncingGCal}
            className="flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-3.5 py-2.5 rounded-2xl text-xs font-mono text-white/80 transition-all cursor-pointer"
            title="Sincronizar agora com Google Workspace"
          >
            <RefreshCw size={13} className={isSyncingGCal ? "animate-spin text-brand-accent" : ""} />
            <span className="hidden sm:inline">{isSyncingGCal ? "A sincronizar..." : "Sync"}</span>
          </button>

          {/* New Event / Meeting Button - Restricted to High Role Users */}
          {canCreateMeeting ? (
            <button
              onClick={() => {
                setNewEventDate(selectedDate);
                setShowNewEventModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-sans font-bold text-black shadow-xl hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              style={{ backgroundColor: accentColor.hex }}
              title="Agendar Reunião e Convocar Membros"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>Agendar Reunião</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-mono text-white/40">
              <ShieldCheck size={13} />
              <span>Criação reservada à liderança</span>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-VIEW: PAST MEETINGS / HISTÓRICO OU CALENDÁRIO */}
      {/* ========================================================================= */}
      {mainTab === "past_meetings" ? (
        <PastMeetingsView
          events={events}
          atas={atas}
          accentColor={accentColor}
          onSelectMeeting={(eventId) => {
            setSelectedEventId(eventId);
            setMainTab("calendar_view");
          }}
          onPublishAta={handlePublishAta}
          isLight={isLight}
        />
      ) : (
        <>
          {/* ========================================================================= */}
          {/* 3. GRANDE CALENDÁRIO INTEGRADO (CARDLESS, FLAT ARCHITECTURAL) */}
          {/* ========================================================================= */}
          <div className="flex flex-col bg-[#0b0f19]/90 border border-white/[0.1] rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden">
            
            {/* Calendar Sub-Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-white/[0.08] bg-[#0d1322]/60">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectedDate("2026-08-31")}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title="Mês Anterior"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    onClick={() => setSelectedDate("2026-09-01")}
                    className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    title="Próximo Mês"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-sans font-bold text-white tracking-wider uppercase">
                    AGOSTO / SETEMBRO 2026
                  </span>
                  <span className="text-[11px] font-mono text-white/40">
                    Data ativa: <span className="text-white font-medium">{selectedDate}</span>
                  </span>
                </div>
              </div>

              {/* View Switcher: Mês / Semana / Dia */}
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#070a12] border border-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode("month")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      viewMode === "month" ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Mês
                  </button>
                  <button
                    onClick={() => setViewMode("week")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      viewMode === "week" ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Semana
                  </button>
                  <button
                    onClick={() => setViewMode("day")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      viewMode === "day" ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Dia
                  </button>
                </div>

                <button
                  onClick={() => setSelectedDate("2026-08-31")}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono rounded-xl transition-colors"
                >
                  Hoje
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-white/[0.08] bg-[#070b14]/80 text-[11px] font-mono text-white/40 text-center py-2.5">
              <span>SEG</span>
              <span>TER</span>
              <span>QUA</span>
              <span>QUI</span>
              <span>SEX</span>
              <span className="text-white/20">SÁB</span>
              <span className="text-white/20">DOM</span>
            </div>

            {/* Month Days Matrix */}
            <div className="grid grid-cols-7 divide-x divide-y divide-white/[0.06] bg-[#090d18]/40">
              {calendarDays.map((day) => {
                const dayEvents = eventsByDate[day.dateStr] || [];
                const isSelected = selectedDate === day.dateStr;

                return (
                  <div
                    key={day.dateStr}
                    onClick={() => {
                      setSelectedDate(day.dateStr);
                      if (dayEvents.length > 0) {
                        setSelectedEventId(dayEvents[0].id);
                      }
                    }}
                    className={`min-h-[105px] p-2 sm:p-2.5 transition-all cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? "bg-white/[0.06] shadow-inner"
                        : "hover:bg-white/[0.02]"
                    } ${!day.isCurrentMonth ? "opacity-35" : ""}`}
                  >
                    {/* Day Number Header */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-medium rounded-full w-6 h-6 flex items-center justify-center transition-all ${
                          day.isToday
                            ? "bg-white text-black font-bold shadow-md"
                            : isSelected
                            ? "text-white font-bold"
                            : "text-white/60 group-hover:text-white"
                        }`}
                        style={{
                          backgroundColor: day.isToday ? accentColor.hex : undefined,
                          color: day.isToday ? "#000000" : undefined
                        }}
                      >
                        {day.dayNumber}
                      </span>

                      {dayEvents.length > 0 && (
                        <span className="text-[10px] font-mono text-white/30">
                          {dayEvents.length} {dayEvents.length === 1 ? "reunião" : "reuniões"}
                        </span>
                      )}
                    </div>

                    {/* Events Mini Lines */}
                    <div className="flex flex-col gap-1 mt-1">
                      {dayEvents.slice(0, 2).map((evt) => {
                        const isEvtSelected = selectedEventId === evt.id;
                        const evtAta = atas.find(a => a.eventId === evt.id || a.id === evt.discordAtaId);
                        const isPending = evtAta?.platformStatus === "pending_review";

                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(day.dateStr);
                              setSelectedEventId(evt.id);
                            }}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-sans truncate transition-all flex items-center gap-1 ${
                              isEvtSelected
                                ? "bg-white text-black font-bold"
                                : isPending
                                ? "bg-white/10 text-white border border-white/20 font-medium"
                                : "bg-white/[0.06] text-white/80 hover:bg-white/15"
                            }`}
                          >
                            <span className="font-mono text-[9px] opacity-75">{evt.startTime}</span>
                            <span className="truncate">{evt.clientName}</span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <span className="text-[9px] font-mono text-white/40 pl-1">
                          +{dayEvents.length - 2} mais
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. WORKSPACE MASTER CONTROL SPLIT: TAREFAS (5 COLS) + REUNIÃO & ATA (7 COLS) */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            
            {/* ==================== LEFT COLUMN: TAREFAS INTEGRADAS (5 COLS) ==================== */}
            <div className="lg:col-span-5 flex flex-col gap-5 border-r border-white/[0.08] lg:pr-8">
              
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} style={{ color: accentColor.hex }} />
                  <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
                    Tarefas do Dia
                  </h3>
                  <span className="text-[11px] font-mono text-white/40">
                    ({selectedDate})
                  </span>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-1 border-b border-white/10 pb-0.5">
                  <button
                    onClick={() => setTaskCategoryFilter("all")}
                    className={`px-2 py-1 text-[11px] font-mono transition-all ${
                      taskCategoryFilter === "all" ? "text-white font-bold border-b border-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Todas ({tasksForSelectedDate.length})
                  </button>
                  <button
                    onClick={() => setTaskCategoryFilter("pending")}
                    className={`px-2 py-1 text-[11px] font-mono transition-all ${
                      taskCategoryFilter === "pending" ? "text-white font-bold border-b border-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Pendentes
                  </button>
                  <button
                    onClick={() => setTaskCategoryFilter("completed")}
                    className={`px-2 py-1 text-[11px] font-mono transition-all ${
                      taskCategoryFilter === "completed" ? "text-white font-bold border-b border-white" : "text-white/40 hover:text-white"
                    }`}
                  >
                    Feitas
                  </button>
                </div>
              </div>

              {/* Quick Add Form */}
              <form onSubmit={handleAddQuickTask} className="flex items-center gap-3 py-2 border-b border-white/[0.08] focus-within:border-white/40 transition-colors">
                <Plus size={16} className="text-white/40 shrink-0" />
                <input
                  type="text"
                  placeholder={`Nova tarefa para ${selectedDate}...`}
                  value={quickTaskInput}
                  onChange={(e) => setQuickTaskInput(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-white placeholder-white/30 focus:outline-none font-sans"
                />
                
                <select
                  value={quickTaskPriority}
                  onChange={(e) => setQuickTaskPriority(e.target.value as any)}
                  className="bg-transparent text-[10px] font-mono uppercase text-white/60 focus:outline-none border-b border-white/20 pb-0.5 cursor-pointer"
                >
                  <option value="high" className="bg-[#101424] text-red-400">Alta</option>
                  <option value="medium" className="bg-[#101424] text-sky-400">Média</option>
                  <option value="low" className="bg-[#101424] text-emerald-400">Baixa</option>
                </select>

                <button
                  type="submit"
                  disabled={!quickTaskInput.trim()}
                  className="px-3 py-1 bg-white hover:bg-white/90 disabled:opacity-30 text-black text-[11px] font-sans font-bold transition-all cursor-pointer rounded-sm"
                >
                  Adicionar
                </button>
              </form>

              {/* Flat Cardless Tasks List */}
              <div className="flex flex-col divide-y divide-white/[0.06] max-h-[460px] overflow-y-auto pr-1">
                {tasksForSelectedDate.map((task) => (
                  <motion.div
                    key={task.id}
                    layout
                    onClick={() => handleToggleTask(task.id)}
                    className={`group flex items-start justify-between gap-4 py-3.5 px-2 hover:bg-white/[0.02] transition-colors cursor-pointer select-none ${
                      task.completed ? "opacity-45" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <button className="mt-0.5 text-white/40 group-hover:text-white transition-colors shrink-0">
                        {task.completed ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : (
                          <Circle size={16} className="group-hover:border-white" />
                        )}
                      </button>

                      <div className="flex flex-col gap-1 min-w-0">
                        <span className={`text-xs font-sans font-medium leading-snug tracking-tight ${
                          task.completed ? "line-through text-white/40" : "text-white"
                        }`}>
                          {task.title}
                        </span>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-white/40">
                          <span className="font-semibold" style={{ color: accentColor.hex }}>{task.clientName}</span>
                          <span>•</span>
                          <span>{task.assignee.name}</span>
                          {task.fromDiscordAta && (
                            <>
                              <span>•</span>
                              <span className="text-[#8ea1e1] flex items-center gap-1">
                                <MessageSquare size={10} /> Ata Discord
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        task.priority === "high" 
                          ? "bg-red-400 shadow-[0_0_6px_rgba(248,113,113,0.6)]" 
                          : task.priority === "medium" 
                          ? "bg-sky-400" 
                          : "bg-emerald-400"
                      }`} />
                      <span className="text-[9px] font-mono uppercase tracking-wider text-white/50">
                        {task.priority}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {tasksForSelectedDate.length === 0 && (
                  <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-white/30 text-xs font-sans">
                    <CheckCheck size={20} className="opacity-30" />
                    <span>Nenhuma tarefa agendada para {selectedDate}.</span>
                  </div>
                )}
              </div>

            </div>

            {/* ==================== RIGHT COLUMN: REUNIÃO SELECIONADA & ATA IA (7 COLS) ==================== */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {selectedEvent ? (
                <div className="flex flex-col gap-7">
                  
                  {/* Meeting Header & Meet Launcher */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                    
                    {/* Left: Date Stamp Block & Info */}
                    <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                      {/* Architectural Date Block */}
                      {(() => {
                        const parts = selectedEvent.date.split("-");
                        const monthIdx = parseInt(parts[1] || "8", 10) - 1;
                        const monthNames = ["JAN.", "FEV.", "MAR.", "ABR.", "MAI.", "JUN.", "JUL.", "AGO.", "SET.", "OUT.", "NOV.", "DEZ."];
                        const monthLabel = monthNames[monthIdx] || "SET.";
                        const dayNum = parts[2] || "01";

                        return (
                          <div className="flex flex-col items-center justify-center shrink-0 pr-4 sm:pr-5 border-r border-white/10 text-center select-none min-w-[50px]">
                            <span className="text-[10px] font-mono font-medium tracking-wider text-white/40 uppercase">
                              {monthLabel}
                            </span>
                            <span className="text-2xl font-mono font-bold text-white tracking-tight leading-none my-0.5">
                              {dayNum}
                            </span>
                            <span className="text-[10px] font-mono text-white/40">
                              {selectedEvent.startTime}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Header Main Texts */}
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span 
                            className="text-xs font-mono font-bold uppercase tracking-wider" 
                            style={{ color: accentColor.hex }}
                          >
                            {selectedEvent.clientName}
                          </span>
                          <span className="text-white/20">•</span>
                          <span className="text-[11px] font-mono text-white/50">
                            {selectedEvent.durationMinutes} min ({selectedEvent.startTime} – {selectedEvent.endTime})
                          </span>
                          <span 
                            className="text-[9px] font-mono font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${accentColor.hex}15`,
                              border: `1px solid ${accentColor.hex}30`,
                              color: accentColor.hex
                            }}
                          >
                            {selectedEvent.status === "completed" || Boolean(linkedAta) || selectedEvent.hasDiscordAta ? "CONCLUÍDA" : selectedEvent.status === "scheduled" ? "AGENDADA" : "REUNIÃO"}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-2xl font-sans font-bold text-white tracking-tight leading-snug">
                          {selectedEvent.title}
                        </h3>
                      </div>
                    </div>

                    {/* Google Meet Action Group */}
                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        onClick={() => handleCopyMeet(selectedEvent.locationUrl)}
                        className="p-2 border border-white/10 hover:border-white/30 text-white/70 hover:text-white transition-colors rounded-sm"
                        title="Copiar Link Google Meet"
                      >
                        {copiedLink ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>

                      <a
                        href={selectedEvent.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-black font-sans font-bold text-xs hover:bg-white/90 transition-all rounded-sm shadow-sm"
                      >
                        <Video size={13} />
                        <span>Entrar no Google Meet</span>
                        <ExternalLink size={11} className="opacity-60 ml-0.5" />
                      </a>
                    </div>
                  </div>

                  {/* Meeting Description & Pauta */}
                  {selectedEvent.description && (
                    <div className="flex flex-col gap-1.5 pb-2">
                      <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                        PAUTA & OBJETIVOS DA SESSÃO
                      </span>
                      <p className="text-xs text-white/80 font-sans leading-relaxed">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  {/* Participants Bar (Cardless) */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                      PARTICIPANTES CONFIRMADOS ({selectedEvent.attendees.length})
                    </span>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2">
                      {selectedEvent.attendees.map((att) => (
                        <div 
                          key={att.email}
                          className="flex items-center gap-2 text-xs font-sans"
                        >
                          <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-mono text-[9px] text-white">
                            {att.name.charAt(0)}
                          </div>
                          <span className="font-medium text-white/90">{att.name}</span>
                          <span className="text-[10px] font-mono text-white/40">({att.role})</span>
                          <span className="text-[9px] font-mono text-emerald-400">✓</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ========================================================================= */}
                  {/* PENDING PUBLICATION BANNER (A REUNIÃO ACABOU E AINDA NÃO FOI PUBLICADA) */}
                  {/* ========================================================================= */}
                  {linkedAta && (linkedAta.platformStatus === "pending_review" || linkedAta.discordStatus === "draft") && (
                    <div 
                      className="py-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y"
                      style={{
                        backgroundColor: `${accentColor.hex}0f`,
                        borderColor: `${accentColor.hex}35`
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" style={{ color: accentColor.hex }} />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-sans font-bold uppercase tracking-wide text-white">
                            ATA NÃO PUBLICADA NA PLATAFORMA (AGUARDA CONFIRMAÇÃO)
                          </span>
                          <p className="text-[11px] text-white/75 font-sans leading-relaxed">
                            A AIVA Neural Voice Engine preparou a minuta, transcrição e decisões a partir do áudio. Esta ata ainda <strong>não foi publicada</strong> na plataforma oficial nem despachada para o Discord, aguardando aprovação humana da liderança.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePublishAta(linkedAta.id)}
                        disabled={isDispatchingDiscord}
                        className="flex items-center gap-2 px-4 py-2 text-black font-sans font-bold text-xs transition-all rounded-sm shadow-md cursor-pointer shrink-0 hover:opacity-90 active:scale-95"
                        style={{ backgroundColor: accentColor.hex }}
                      >
                        {isDispatchingDiscord ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <Check size={13} className="stroke-[3]" />
                        )}
                        <span>Confirmar & Publicar Ata</span>
                      </button>
                    </div>
                  )}

                  {/* ========================================================================= */}
                  {/* PUBLISHED BANNER (SE JÁ FOI PUBLICADA) */}
                  {/* ========================================================================= */}
                  {linkedAta && linkedAta.platformStatus === "published" && (
                    <div className="bg-emerald-500/10 border-y border-emerald-500/20 py-2.5 px-4 flex items-center justify-between text-xs font-mono text-emerald-300">
                      <div className="flex items-center gap-2">
                        <Check size={14} className="text-emerald-400" />
                        <span>Ata publicada e aprovada no ecossistema</span>
                        {linkedAta.reviewedBy && (
                          <span className="text-emerald-400/60">• Aprovada por {linkedAta.reviewedBy}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-400/50">
                        {linkedAta.discordPublishedAt || "Hoje"}
                      </span>
                    </div>
                  )}

                  {/* ATA DETAIL & TRANSCRIPTION (CARDLESS, EDITORIAL) */}
                  {linkedAta ? (
                    <div className="flex flex-col gap-5 pt-3 border-t border-white/[0.08]">
                      
                      {/* Discord Header & Channel Selector */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <MessageSquare size={16} className="text-[#5865F2]" />
                          <span className="text-xs font-sans font-bold text-white uppercase tracking-wide">
                            Ata Executiva & Transcrição
                          </span>
                          <span className="text-[10px] font-mono text-white/40">
                            • {linkedAta.recordedBy}
                          </span>
                        </div>

                        {/* Channel Selector */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-white/40">Canal:</span>
                          <select
                            value={selectedDiscordChannel}
                            onChange={(e) => setSelectedDiscordChannel(e.target.value)}
                            className="bg-transparent border-b border-white/20 pb-0.5 text-[11px] font-mono text-white/80 focus:outline-none cursor-pointer"
                          >
                            {DISCORD_CHANNELS.map(ch => (
                              <option key={ch.id} value={ch.id} className="bg-[#121729]">#{ch.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Audio Waveform Stream */}
                      <div className="flex flex-col gap-3 py-3 px-4 border border-white/[0.08] rounded-sm bg-white/[0.01]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                              className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                            >
                              {isPlayingAudio ? <Pause size={12} /> : <Play size={12} className="ml-0.5" />}
                            </button>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-mono font-medium text-white">Gravação de Voz (AIVA Sync)</span>
                              <span className="text-[10px] font-mono text-white/40">{linkedAta.duration}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[10px] font-mono">
                            {[1, 1.25, 1.5].map((spd) => (
                              <button
                                key={spd}
                                onClick={() => setAudioPlaybackSpeed(spd)}
                                className={`px-1.5 py-0.5 rounded-sm ${
                                  audioPlaybackSpeed === spd ? "bg-white text-black font-bold" : "text-white/40 hover:text-white"
                                }`}
                              >
                                {spd}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Waveform Visualization Bars */}
                        <div className="flex items-center gap-1 h-5 px-1">
                          {Array.from({ length: 44 }).map((_, idx) => {
                            const isActive = (idx / 44) * 100 <= audioProgress;
                            const h = Math.sin(idx * 0.45) * 10 + 6;
                            return (
                              <div
                                key={idx}
                                className="flex-1 rounded-full transition-all duration-150"
                                style={{
                                  height: `${h}px`,
                                  backgroundColor: isActive ? accentColor.hex : "rgba(255, 255, 255, 0.15)"
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>

                      {/* Executive Summary */}
                      <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                          SUMÁRIO EXECUTIVO
                        </span>
                        <p className="text-xs text-white/80 font-sans leading-relaxed">
                          {linkedAta.executiveSummary}
                        </p>
                      </div>

                      {/* Key Decisions */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                          DECISÕES PRINCIPAIS DELIBERADAS
                        </span>
                        <div className="flex flex-col gap-2 text-xs text-white/80 font-sans">
                          {linkedAta.keyDecisions.map((dec, idx) => (
                            <div key={idx} className="flex items-start gap-2.5">
                              <Check size={13} className="text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{dec}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                          AÇÕES & TAREFAS EXTRAÍDAS PELA IA
                        </span>
                        <div className="flex flex-col divide-y divide-white/[0.06]">
                          {linkedAta.actionItems.map((act, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs font-sans">
                              <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                                <span className="text-white/90">{act.task}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] font-mono text-white/40">
                                <span>{act.owner}</span>
                                <span>•</span>
                                <span className="text-amber-300">{act.deadline}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Transcript Segments */}
                      {linkedAta.transcriptSegments && (
                        <div className="flex flex-col gap-3 pt-3 border-t border-white/[0.06]">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-white/40">
                            TRANSCRIÇÃO DE ÁUDIO SINCRONIZADA
                          </span>
                          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 text-xs font-sans">
                            {linkedAta.transcriptSegments.map((seg) => (
                              <div key={seg.id} className="flex flex-col gap-1 bg-white/[0.015] p-2.5 rounded-sm border-l border-white/10">
                                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                                  <span className="font-bold text-white/80">{seg.speaker} <span className="font-normal opacity-60">({seg.role})</span></span>
                                  <span>{seg.timestamp}</span>
                                </div>
                                <p className="text-white/70 leading-relaxed text-[11px]">
                                  "{seg.text}"
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  ) : (
                    <div className="py-8 text-center border-t border-white/[0.08] text-xs text-white/40 font-sans flex flex-col items-center gap-2">
                      <MessageSquare size={18} className="text-white/20" />
                      <span>Nenhuma ata gravada para esta sessão.</span>
                      <button
                        onClick={() => {
                          const newAta: MeetingAta = {
                            id: `ata-${Date.now()}`,
                            eventId: selectedEvent.id,
                            meetingTitle: selectedEvent.title,
                            clientName: selectedEvent.clientName || "AXION Client",
                            date: selectedEvent.date,
                            time: `${selectedEvent.startTime} - ${selectedEvent.endTime}`,
                            duration: `${selectedEvent.durationMinutes} minutos`,
                            recordedBy: "AIVA Meeting Bot",
                            audioDurationSeconds: 1800,
                            discordChannel: selectedDiscordChannel,
                            discordStatus: "draft",
                            platformStatus: "pending_review",
                            executiveSummary: "A reunião concluiu a revisão técnica com deliberações em fase de validação.",
                            keyDecisions: ["Aprovada a fase seguinte do projeto", "Agendada entrega técnica"],
                            actionItems: [{ task: "Enviar minuta final", owner: "Nelson Afonso", deadline: "Hoje", syncedAsTask: true }],
                            transcriptSegments: [{ id: "tr-1", speaker: "Nelson Afonso", role: "Lead", timestamp: "00:01:00", text: "Início da gravação." }],
                            tags: ["GCal Synced", "Aguardando Publicação"]
                          };
                          setAtas([...atas, newAta]);
                        }}
                        className="text-xs font-mono text-brand-accent hover:underline mt-1 cursor-pointer"
                      >
                        + Gerar proposta preliminar de ata via AIVA
                      </button>
                    </div>
                  )}

                </div>
              ) : (
                <div className="py-16 text-center text-xs text-white/40 font-sans border-t border-white/[0.08]">
                  Selecione uma reunião no calendário acima para visualizar os detalhes completos.
                </div>
              )}

            </div>

          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* 5. FEEDBACK TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 right-8 z-50 flex items-center gap-3 bg-[#13182b] border border-white/20 text-white px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl"
          >
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white font-sans">{feedbackToast.title}</span>
              <span className="text-[11px] text-white/70 font-sans">{feedbackToast.message}</span>
            </div>
            <button 
              onClick={() => setFeedbackToast(null)}
              className="text-white/40 hover:text-white p-1 ml-2"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. MODAL: AGENDAR REUNIÃO & CONVOCAR EQUIPA (LIDERANÇA) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showNewEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-[#0e1322] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={18} style={{ color: accentColor.hex }} />
                  <div className="flex flex-col">
                    <h3 className="text-base font-sans font-bold text-white tracking-tight uppercase">
                      AGENDAR REUNIÃO & CONVOCAR EQUIPA
                    </h3>
                    <span className="text-[10px] font-mono text-white/40">
                      Convocada por: <strong className="text-white">Nelson Afonso</strong> ({currentUserRole})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewEventModal(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/50">Título da Reunião</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Project Sync • Casas do Beco"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-accent font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/50">Cliente / Ecossistema</label>
                    <select
                      value={newEventClient}
                      onChange={(e) => setNewEventClient(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-sans"
                    >
                      <option value="Casas do Beco" className="bg-[#0e1322]">Casas do Beco (ECO-004)</option>
                      <option value="Casa Santos" className="bg-[#0e1322]">Casa Santos (ECO-001)</option>
                      <option value="Quinta do Sol" className="bg-[#0e1322]">Quinta do Sol (ECO-003)</option>
                      <option value="Herdade da Foz" className="bg-[#0e1322]">Herdade da Foz (ECO-002)</option>
                      <option value="AXION Core" className="bg-[#0e1322]">AXION Core (Interno)</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/50">Data</label>
                    <input
                      type="date"
                      value={newEventDate}
                      onChange={(e) => setNewEventDate(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/50">Hora de Início</label>
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono uppercase text-white/50">Duração (minutos)</label>
                    <input
                      type="number"
                      value={newEventDuration}
                      onChange={(e) => setNewEventDuration(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>

                {/* Team Members Invite Selector (triggers popup on Home) */}
                <div className="flex flex-col gap-2 pt-1 border-t border-white/[0.08]">
                  <label className="text-[10px] font-mono uppercase text-white/50 flex items-center justify-between">
                    <span>Convocar Membros da Equipa (Receberão alerta na Home)</span>
                    <span className="text-brand-accent">{selectedInvitedUsers.length} selecionados</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TEAM_MEMBERS_DIRECTORY.map((member) => {
                      const isInvited = selectedInvitedUsers.includes(member.name);
                      return (
                        <div
                          key={member.email}
                          onClick={() => {
                            if (isInvited) {
                              setSelectedInvitedUsers(selectedInvitedUsers.filter(n => n !== member.name));
                            } else {
                              setSelectedInvitedUsers([...selectedInvitedUsers, member.name]);
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-sans transition-all cursor-pointer flex items-center justify-between ${
                            isInvited
                              ? "bg-white/10 border-white/40 text-white font-medium"
                              : "bg-black/20 border-white/5 text-white/50 hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span>{member.name}</span>
                            <span className="text-[10px] font-mono text-white/40">{member.role}</span>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isInvited ? "bg-white text-black border-white" : "border-white/20"
                          }`}>
                            {isInvited && <Check size={10} className="stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono uppercase text-white/50">Descrição / Pauta da Reunião</label>
                  <textarea
                    rows={2}
                    placeholder="Tópicos a abordar na reunião..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-brand-accent font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowNewEventModal(false)}
                    className="px-4 py-2 text-xs font-sans text-white/60 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-sans font-bold text-xs hover:opacity-90 transition-all cursor-pointer shadow-lg"
                  >
                    Criar Reunião & Disparar Alertas
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
