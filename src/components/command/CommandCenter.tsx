import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MOCK_PRIORITIES, 
  MOCK_TODAY, 
  MOCK_PULSE, 
  MOCK_UPCOMING, 
  MOCK_ACTIVITIES, 
  INITIAL_STATE 
} from "../../data/mockData";
import { 
  DEFAULT_APPEARANCE,
  DEFAULT_COMMAND_CENTER,
  ACCENT_COLOR_OPTIONS
} from "../../data/settingsMockData";
import { 
  MOCK_CALENDAR_EVENTS, 
  MOCK_MEETING_ATAS, 
  MOCK_MEETING_INVITES, 
  CalendarEvent, 
  MeetingAta, 
  MeetingInviteNotification 
} from "../../data/calendarMockData";
import { 
  PriorityItem, 
  TodayItem, 
  PulseIndicator, 
  UpcomingMeeting, 
  ActivityLog 
} from "../../types";
import { AppearanceSettings, CommandCenterConfig, LanguageRegionSettings } from "../../types/settings";
import { useLanguage } from "../../i18n/LanguageContext";
import AxionLogo from "../ui/AxionLogo";
import AivaStatus from "../aiva/AivaStatus";
import AivaOverviewScreen from "../aiva/AivaOverviewScreen";
import UserProfileScreen from "../profile/UserProfileScreen";
import DatabaseScreen from "../database/DatabaseScreen";
import DocumentRepositoryScreen from "../documents/DocumentRepositoryScreen";
import ClientsScreen from "../clients/ClientsScreen";
import CalendarMeetingsScreen from "../calendar/CalendarMeetingsScreen";
import PaymentsScreen from "../payments/PaymentsScreen";
import SidebarNav, { NavTabId } from "../navigation/SidebarNav";
import SettingsPage from "../settings/SettingsPage";
import MeetingInviteBanner from "./MeetingInviteBanner";
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  ShieldAlert, 
  Activity, 
  RotateCcw,
  Sparkles,
  Map,
  MapPin,
  PieChart
} from "lucide-react";

interface CommandCenterProps {
  onBackToWelcome?: () => void;
  appearance?: AppearanceSettings;
  onAppearanceChange?: (appearance: AppearanceSettings) => void;
  commandCenterConfig?: CommandCenterConfig;
  onCommandCenterConfigChange?: (config: CommandCenterConfig) => void;
  languageRegion?: LanguageRegionSettings;
  onLanguageRegionChange?: (settings: LanguageRegionSettings) => void;
}

export default function CommandCenter({ 
  onBackToWelcome,
  appearance: initialAppearance,
  onAppearanceChange,
  commandCenterConfig = DEFAULT_COMMAND_CENTER,
  onCommandCenterConfigChange,
  languageRegion,
  onLanguageRegionChange,
}: CommandCenterProps) {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<NavTabId>("overview");
  const [priorities, setPriorities] = useState<PriorityItem[]>(MOCK_PRIORITIES);
  const [todayTasks, setTodayTasks] = useState<TodayItem[]>(MOCK_TODAY);
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());
  const [sessionStartedAt] = useState(() => Date.now());
  const [sessionDurationSeconds, setSessionDurationSeconds] = useState(0);
  const [activePulse, setActivePulse] = useState<string | null>(null);
  const [systemBooted, setSystemBooted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Shared Global Meeting & Calendar States
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
  const [atas, setAtas] = useState<MeetingAta[]>(MOCK_MEETING_ATAS);
  const [meetingInvites, setMeetingInvites] = useState<MeetingInviteNotification[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("evt-1");

  // Handler for new meeting invite notifications broadcasted by leadership
  const handleBroadcastMeetingInvite = (invite: MeetingInviteNotification) => {
    setMeetingInvites(prev => [invite, ...prev]);
  };

  const handleDismissInvite = (inviteId: string) => {
    setMeetingInvites(prev => prev.filter(inv => inv.id !== inviteId));
  };

  const handleAcceptInviteAndOpen = (eventId: string) => {
    setSelectedMeetingId(eventId);
    setActiveTab("calendar");
  };

  // Appearance & Customizable Accent Light State
  const [appearance, setAppearance] = useState<AppearanceSettings>(() => {
    if (initialAppearance) return initialAppearance;
    try {
      const cached = localStorage.getItem("axion_office_appearance");
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return DEFAULT_APPEARANCE;
  });

  useEffect(() => {
    if (initialAppearance) {
      setAppearance(initialAppearance);
    }
  }, [initialAppearance]);

  const handleAppearanceUpdate = (updated: AppearanceSettings) => {
    setAppearance(updated);
    if (onAppearanceChange) {
      onAppearanceChange(updated);
    }
  };

  const isLight = appearance.theme === "light";
  const currentAccent = ACCENT_COLOR_OPTIONS.find(c => c.id === appearance.accentColor) || ACCENT_COLOR_OPTIONS[0];
  const visibleModuleIds = new Set(
    commandCenterConfig.modules.filter((module) => module.visible).map((module) => module.id),
  );
  const isModuleVisible = (moduleId: string) => visibleModuleIds.has(moduleId);
  const moduleOrder = (moduleId: string) => {
    const index = commandCenterConfig.modules.findIndex((module) => module.id === moduleId);
    return index === -1 ? commandCenterConfig.modules.length : index;
  };
  const showLeftColumn = isModuleVisible("projects") || isModuleVisible("priorities") || isModuleVisible("my-tasks");
  const showRightColumn = isModuleVisible("today") || isModuleVisible("meetings");
  const showBottomRow = isModuleVisible("recent-activity") || isModuleVisible("briefing") ||
    isModuleVisible("sales") || isModuleVisible("finance") || isModuleVisible("team-activity");
  const leftColumnWidth = commandCenterConfig.primaryMetric === "priorities"
    ? "lg:w-[350px] xl:w-[390px]"
    : "lg:w-[290px] xl:w-[330px]";
  const rightColumnWidth = ["today", "meetings"].includes(commandCenterConfig.primaryMetric)
    ? "lg:w-[350px] xl:w-[390px]"
    : "lg:w-[290px] xl:w-[330px]";

  // Synchronize document theme attribute and class for full app-wide light/dark propagation
  useEffect(() => {
    const themeVal = appearance.theme === "light" ? "light" : "dark";
    document.body.setAttribute("data-theme", themeVal);
    document.documentElement.setAttribute("data-theme", themeVal);
    if (themeVal === "light") {
      document.body.classList.add("theme-light");
    } else {
      document.body.classList.remove("theme-light");
    }
  }, [appearance.theme]);

  // Keep the real clock and the current Office session duration synchronized.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentTime(new Date(now));
      setSessionDurationSeconds(Math.floor((now - sessionStartedAt) / 1000));
    }, 1000);
    
    // Simulate initial system boot sequence delay
    const bootTimer = setTimeout(() => {
      setSystemBooted(true);
    }, 400);

    return () => {
      clearInterval(timer);
      clearTimeout(bootTimer);
    };
  }, [sessionStartedAt]);

  const formatSessionDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  };

  // Track mouse coordinates to provide subtle parallax on the central Core logo
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientWidth, clientHeight } = e.currentTarget;
    const x = (e.clientX - clientWidth / 2) / 45;
    const y = (e.clientY - clientHeight / 2) / 45;
    setMousePos({ x, y });
  };

  // Toggle tasks as a neat micro-interaction
  const handleToggleTask = (taskId: string) => {
    setTodayTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  // Dynamic greeting based on time (Hour is 22 based on seed)
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12 && hour >= 6) return t("home.goodMorning");
    if (hour < 18 && hour >= 12) return t("home.goodAfternoon");
    return t("home.goodEvening");
  };

  // Formatting date in Portuguese locale to align with elegant editorial
  const formatDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: "long", 
      day: "numeric", 
      month: "long" 
    };
    return currentTime.toLocaleDateString(language === "pt" ? "pt-PT" : "en-US", options).toUpperCase();
  };

  // Pulse bullet colors
  const getPulseColor = (status: string) => {
    switch(status) {
      case "Healthy": return "bg-emerald-400 text-emerald-400 shadow-emerald-500/20";
      case "Stable": return "bg-blue-400 text-blue-400 shadow-blue-500/20";
      case "Normal": return "bg-zinc-400 text-zinc-400 shadow-zinc-500/10";
      case "At Risk": return "bg-rose-500 text-rose-500 shadow-rose-500/30";
      default: return "bg-zinc-400 text-zinc-400";
    }
  };

  // Transition variants for staggered boots
  const itemVariants = {
    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: 0.2 + custom * 0.15,
        duration: 1.0,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`relative w-screen h-screen overflow-hidden flex flex-col justify-between pl-20 md:pl-28 pr-6 md:pr-10 py-6 md:py-8 select-none transition-colors duration-500 ${
        isLight ? "bg-[#ffffff] text-slate-900" : "bg-brand-bg text-white/90"
      }`}
    >
      {/* Floating Left Navigation Bar (Rounded capsule floating with customizable light) */}
      <SidebarNav 
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        onOpenProfile={() => setActiveTab("profile")}
        accentColor={currentAccent}
        isLight={isLight}
      />

      {/* Background Grid & Radial Core Light */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
        isLight ? "tech-grid-light opacity-50" : "tech-grid opacity-20"
      }`} />
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
        isLight ? "tech-radial-light opacity-70" : "tech-radial"
      }`} />
      
      {/* Soft central gradient orb reacting to mouse - Powered by customizable home light */}
      <motion.div 
        animate={{
          x: mousePos.x * 0.5,
          y: mousePos.y * 0.5
        }}
        transition={{ type: "spring", stiffness: 30, damping: 25 }}
        className="absolute w-[650px] h-[650px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700"
        style={{
          background: currentAccent.glow,
          filter: "blur(140px)",
          opacity: isLight ? 0.14 : 0.22
        }}
      />

      {/* Top atmospheric radiant ambient light flare */}
      <div 
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[350px] pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at center top, ${currentAccent.hex}${isLight ? "10" : "18"} 0%, transparent 70%)`
        }}
      />

      {/* Persistent Ambient Background Watermark Logo for secondary tabs */}
      <AnimatePresence>
        {activeTab !== "overview" && (
          <motion.div
            key="ambient-background-watermark"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 select-none overflow-hidden pl-16 md:pl-28"
          >
            {/* Concentric Precision Orbital Rings */}
            <div className={`relative flex items-center justify-center transition-opacity duration-700 ${
              isLight ? "opacity-[0.07]" : "opacity-[0.045]"
            }`}>
              {/* Inner Orbit */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className={`absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-dashed ${
                  isLight ? "border-slate-900" : "border-white"
                }`}
              />
              {/* Outer Orbit */}
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                className={`absolute w-[520px] h-[520px] md:w-[700px] md:h-[700px] rounded-full border ${
                  isLight ? "border-slate-900/40" : "border-white/50"
                }`}
              />
              {/* Central Logo Group identical to Home */}
              <div className="flex flex-col items-center justify-center gap-2 transform scale-110 md:scale-135">
                <AxionLogo 
                  size="xl" 
                  variant="full" 
                  pulse={false}
                  isLight={isLight}
                />
                <div className={`font-sans text-[11px] md:text-xs font-semibold uppercase text-center tracking-[0.55em] ml-[0.55em] mt-2 ${
                  isLight ? "text-slate-900" : "text-white/80"
                }`}>
                  OFFICE OPERATING SYSTEM
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== SCREEN CONTENT CONTAINER ==================== */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" ? (
          <motion.div
            key="profile-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <UserProfileScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
            />
          </motion.div>
        ) : activeTab === "clients" ? (
          <motion.div
            key="clients-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <ClientsScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
            />
          </motion.div>
        ) : activeTab === "database" ? (
          <motion.div
            key="database-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <DatabaseScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
            />
          </motion.div>
        ) : activeTab === "documents" ? (
          <motion.div
            key="documents-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <DocumentRepositoryScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
            />
          </motion.div>
        ) : activeTab === "calendar" ? (
          <motion.div
            key="calendar-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <CalendarMeetingsScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
              events={events}
              onEventsChange={setEvents}
              atas={atas}
              onAtasChange={setAtas}
              selectedMeetingId={selectedMeetingId}
              onSelectMeetingId={setSelectedMeetingId}
              onBroadcastMeetingInvite={handleBroadcastMeetingInvite}
              currentUserRole="Senior Partner & Brand Architect"
              isLight={isLight}
            />
          </motion.div>
        ) : activeTab === "payments" ? (
          <motion.div
            key="payments-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <PaymentsScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
              isLight={isLight}
            />
          </motion.div>
        ) : activeTab === "settings" ? (
          <motion.div
            key="settings-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
              <SettingsPage 
                initialAppearance={appearance}
                onAppearanceChange={handleAppearanceUpdate}
                initialCommandCenter={commandCenterConfig}
                onCommandCenterChange={onCommandCenterConfigChange}
                initialLanguageRegion={languageRegion}
                onLanguageRegionChange={onLanguageRegionChange}
              />
          </motion.div>
        ) : activeTab === "aiva" ? (
          <motion.div
            key="aiva-tab-view"
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full overflow-y-auto pr-2 relative z-10"
          >
            <AivaOverviewScreen 
              accentColor={currentAccent}
              onBackToOverview={() => setActiveTab("overview")}
            />
          </motion.div>
        ) : activeTab !== "overview" ? (
          <motion.div
            key={`placeholder-${activeTab}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-6 relative z-10 my-auto"
          >
            <div className="w-16 h-16 rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/70 shadow-2xl">
              <Sparkles size={28} style={{ color: currentAccent.hex }} />
            </div>

            <motion.div 
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-2 max-w-md"
            >
              <span 
                className="text-xs font-mono tracking-widest uppercase"
                style={{ color: currentAccent.hex }}
              >
                AXION OPERATING MODULE
              </span>
              <h2 className="text-2xl font-sans font-bold text-white tracking-tight uppercase">
                MÓDULO AXION, <span className="text-white/70 font-normal">EM SINCRONIZAÇÃO</span>
              </h2>
              <p className="text-xs text-white/50 leading-relaxed font-sans">
                Módulo em sincronização de telemetria. Aceda às definições para configurar permissões ou regresse ao painel principal.
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("overview")}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-sans border border-white/10 transition-colors cursor-pointer"
              >
                Voltar ao Painel Principal
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                style={{
                  backgroundColor: currentAccent.hex,
                  color: "#050609",
                  boxShadow: `0 0 15px ${currentAccent.glow}`
                }}
                className="px-4 py-2 rounded-xl font-semibold text-xs font-sans transition-all cursor-pointer hover:brightness-110"
              >
                Abrir Definições
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="overview-tab-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full max-w-[1580px] mx-auto flex flex-col justify-between relative z-10 gap-3 md:gap-5 px-2 sm:px-4"
          >
            {/* Pop-up / Alerta de Reunião Convocada pela Liderança */}
            {meetingInvites.length > 0 && (
              <MeetingInviteBanner
                invite={meetingInvites[0]}
                onAcceptAndOpen={handleAcceptInviteAndOpen}
                onDismiss={handleDismissInvite}
                accentColor={currentAccent}
                isLight={isLight}
              />
            )}
        
        {/* ==================== TOP ROW (HEADER & DATE) ==================== */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          
          {/* Top-Left: Greeting & User identity */}
          <motion.div 
            custom={0}
            initial="hidden"
            animate={systemBooted ? "visible" : "hidden"}
            variants={itemVariants}
            className="flex flex-col"
          >
            <div className="flex items-center gap-3">
              <span 
                className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border"
                style={{
                  color: currentAccent.hex,
                  backgroundColor: `${currentAccent.hex}15`,
                  borderColor: `${currentAccent.hex}30`
                }}
              >
                {t("home.access")}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-sans font-bold tracking-tight text-white mt-2 leading-none">
              {getGreeting()}, <span className="text-white/80 font-normal">{INITIAL_STATE.user.name.toUpperCase()}</span>
            </h1>
            
            <span className="text-xs text-white/40 font-mono tracking-wider mt-1.5 flex items-center gap-2">
              <span 
                className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" 
                style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.hex}` }}
              />
              {formatDate()}
            </span>
          </motion.div>

          {/* Top-Right: Office session duration & exit */}
          <motion.div 
            custom={1}
            initial="hidden"
            animate={systemBooted ? "visible" : "hidden"}
            variants={itemVariants}
            className="flex items-center gap-6 self-end md:self-start"
          >
            {/* Time elapsed since the user entered AXION OFFICE */}
            <div className="text-right flex flex-col">
              <div className="text-xs font-mono tracking-widest text-white/30 uppercase">{t("home.session")}</div>
              <div className="text-2xl font-mono font-medium text-white flex items-center gap-2.5 mt-1 justify-end">
                <Clock size={16} style={{ color: currentAccent.hex }} className="animate-pulse" />
                <span>{formatSessionDuration(sessionDurationSeconds)}</span>
              </div>
            </div>

            {/* Back button to simulated welcome for demonstration */}
            {onBackToWelcome && (
              <button 
                onClick={onBackToWelcome}
                title="Sair do sistema"
                className="group flex items-center justify-center w-10 h-10 rounded-sm bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all duration-300 cursor-pointer"
              >
                <RotateCcw size={16} className="text-white/50 group-hover:text-white transition-colors" />
              </button>
            )}
          </motion.div>

        </div>

        {/* ==================== MIDDLE ROW (CENTRAL CORE & REFINED SPACIOUS LAYOUT) ==================== */}
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 my-2 relative w-full">
          
          {/* LEFT SIDE DATA COLUMN - Firmly anchored to the left */}
          {showLeftColumn && (
          <motion.div
            layout
            className={`w-full ${leftColumnWidth} shrink-0 flex flex-col justify-center gap-7 self-center z-20 transition-[width] duration-500`}
          >
            
            {/* AXION Pulse Section */}
            {isModuleVisible("projects") && <motion.div 
              custom={2}
              initial="hidden"
              animate={systemBooted ? "visible" : "hidden"}
              variants={itemVariants}
              className="flex flex-col gap-3.5 text-left"
              style={{ order: moduleOrder("projects") }}
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-ping" 
                  style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 10px ${currentAccent.hex}` }}
                />
                <h3 className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">{t("home.pulse")}</h3>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {MOCK_PULSE.map((pulse) => (
                  <div 
                    key={pulse.label}
                    onMouseEnter={() => setActivePulse(pulse.label)}
                    onMouseLeave={() => setActivePulse(null)}
                    className="group relative flex items-center justify-between py-1.5 px-2.5 hover:bg-white/[0.02] border border-transparent hover:border-white/5 rounded-sm transition-all duration-300 cursor-default"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${getPulseColor(pulse.status)}`} />
                      <span className="text-xs text-white/70 group-hover:text-white font-sans tracking-wide transition-colors">
                        {pulse.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[10px]">
                      <span className="text-white/40 group-hover:text-brand-accent transition-colors">
                        {pulse.status.toUpperCase()}
                      </span>
                      {pulse.trend === "up" && <TrendingUp size={11} className="text-emerald-400" />}
                      {pulse.trend === "down" && <TrendingDown size={11} className="text-rose-500" />}
                      {pulse.trend === "stable" && <span className="text-white/20">•</span>}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>}

            {/* Priorities Panel */}
            {isModuleVisible("priorities") && <motion.div 
              custom={3}
              initial="hidden"
              animate={systemBooted ? "visible" : "hidden"}
              variants={itemVariants}
              className="flex flex-col gap-3.5"
              style={{ order: moduleOrder("priorities") }}
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">{t("home.priorities")}</h3>
                <span className="font-mono text-[9px] text-rose-500/80 ml-auto bg-rose-500/10 px-1.5 py-0.5 rounded">ACT</span>
              </div>
              
              <div className="flex flex-col gap-3.5">
                {priorities.slice(0, commandCenterConfig.recentItemsCount).map((item) => (
                  <div 
                    key={item.id} 
                    className="group flex flex-col gap-1 pl-3.5 border-l-2 border-white/10 hover:border-brand-accent transition-colors duration-500 py-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-sans tracking-wider text-white group-hover:text-brand-accent transition-colors duration-300">
                        {item.project}
                      </span>
                      <span className="text-[9px] font-mono tracking-wider text-white/30 uppercase">
                        {item.statusText}
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-white/50 group-hover:text-white/80 transition-colors leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>}

            {isModuleVisible("my-tasks") && (
              <motion.div
                layout
                custom={3}
                initial="hidden"
                animate={systemBooted ? "visible" : "hidden"}
                variants={itemVariants}
                style={{ order: moduleOrder("my-tasks") }}
                className="flex items-center justify-between rounded-sm border border-white/5 bg-white/[0.015] px-3.5 py-3"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono tracking-[0.2em] text-white/35 uppercase">{t("home.myTasks")}</span>
                  <span className="text-xs text-white/70">{t("home.pendingTasks")}</span>
                </div>
                <span className="text-2xl font-light" style={{ color: currentAccent.hex }}>
                  {todayTasks.filter((task) => !task.completed).length}
                </span>
              </motion.div>
            )}

          </motion.div>
          )}

          {/* CENTRAL CORE HERO LOGO (Centered with calibrated orbital rings & ample margin) */}
          <div className="flex-1 flex flex-col items-center justify-center relative py-6 lg:py-0 self-center min-w-0">
            
            {/* Central Core Emblem & Concentric Orbits Group */}
            <div className="relative flex flex-col items-center justify-center my-auto">
              
              {/* Visual Concentric Tech Rings (Proportionally scaled to avoid text collisions) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Radiant Center Glow Core in selected accent */}
                <div 
                  className="absolute w-[240px] h-[240px] rounded-full blur-2xl transition-all duration-700 pointer-events-none"
                  style={{
                    backgroundColor: currentAccent.hex,
                    opacity: 0.16
                  }}
                />

                {/* Inner Ring 1 (Dashed Precision Orbit) */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[230px] h-[230px] rounded-full border border-dashed transition-all duration-500"
                  style={{
                    borderColor: `${currentAccent.hex}25`
                  }}
                />
                
                {/* Mid Ring 2 (Radar Track with Orbital Node Markers) */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[300px] h-[300px] rounded-full border transition-all duration-500"
                  style={{
                    borderColor: `${currentAccent.hex}15`
                  }}
                >
                  <span 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.hex}` }}
                  />
                  <span 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.hex}` }}
                  />
                  <span 
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.hex}` }}
                  />
                  <span 
                    className="absolute right-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-all duration-500"
                    style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.hex}` }}
                  />
                </motion.div>

                {/* Outer Ring 3 (Wide Atmospheric Orbit - safely bounded) */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                  className="absolute w-[370px] h-[370px] rounded-full border border-dotted border-white/[0.05]"
                />
              </div>

              {/* Central Logo Group */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 py-4">
                <AxionLogo 
                  size="xl" 
                  variant="full" 
                  animate={true} 
                  pulse={false} 
                  isLight={isLight}
                  className="z-10" 
                />
                
                <div className={`font-sans text-[11px] md:text-xs font-semibold uppercase text-center tracking-[0.5em] ml-[0.5em] mt-1 ${
                  isLight ? "text-slate-900" : "text-white/50"
                }`}>
                  OFFICE OPERATING SYSTEM
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE DATA COLUMN - Firmly anchored to the right */}
          {showRightColumn && (
          <motion.div
            layout
            className={`w-full ${rightColumnWidth} shrink-0 flex flex-col justify-center gap-7 self-center z-20 transition-[width] duration-500`}
          >
            
            {/* Today's Agenda Checklist */}
            {isModuleVisible("today") && <motion.div 
              custom={4}
              initial="hidden"
              animate={systemBooted ? "visible" : "hidden"}
              variants={itemVariants}
              className="flex flex-col gap-3.5 text-left"
              style={{ order: moduleOrder("today") }}
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <h3 
                  onClick={() => setActiveTab("calendar")}
                  className="text-xs font-mono tracking-[0.2em] text-white/60 uppercase hover:text-white cursor-pointer transition-colors"
                >
                  {t("home.today")}
                </h3>
                <button
                  onClick={() => setActiveTab("calendar")}
                  className="text-[10px] font-mono ml-auto flex items-center gap-1 transition-all cursor-pointer opacity-60 hover:opacity-100"
                  style={{ color: currentAccent.hex }}
                >
                  <Calendar size={11} />
                  <span>3 {t("home.scheduled")}</span>
                </button>
              </div>
              
              <div className="flex flex-col gap-2.5">
                {todayTasks.slice(0, commandCenterConfig.recentItemsCount).map((task) => (
                  <div 
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className="group flex items-start gap-2.5 p-2 hover:bg-white/[0.015] border border-transparent hover:border-white/5 rounded-sm transition-all duration-300 cursor-pointer"
                  >
                    {/* Tick box toggle */}
                    <button className="text-white/40 group-hover:text-brand-accent transition-colors duration-300 mt-0.5 outline-none">
                      {task.completed ? (
                        <CheckCircle2 size={14} style={{ color: currentAccent.hex }} />
                      ) : (
                        <Circle size={14} className="text-white/20 group-hover:text-brand-accent/50" />
                      )}
                    </button>

                    <div className="flex flex-col gap-0.5">
                      <span className={`text-xs font-sans font-medium transition-all duration-300 ${
                        task.completed ? "text-white/30 line-through decoration-brand-accent/45" : "text-white/90 group-hover:text-white"
                      }`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-white/30">
                        <span style={{ color: currentAccent.hex }}>{task.time}</span>
                        <span>•</span>
                        <span>{task.meta}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>}

            {/* Upcoming Event Module */}
            {isModuleVisible("meetings") && <motion.div 
              custom={5}
              initial="hidden"
              animate={systemBooted ? "visible" : "hidden"}
              variants={itemVariants}
              className="flex flex-col gap-3.5"
              style={{ order: moduleOrder("meetings") }}
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                <h3 className="text-xs font-mono tracking-[0.2em] text-white/60 uppercase">{t("home.meeting")}</h3>
              </div>
              
              <div 
                onClick={() => {
                  setSelectedMeetingId("evt-1");
                  setActiveTab("calendar");
                }}
                className="group relative p-3.5 bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-brand-accent/20 rounded-sm transition-all duration-500 flex flex-col gap-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: currentAccent.hex }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: currentAccent.hex, boxShadow: `0 0 8px ${currentAccent.glow}` }} />
                  <span>{MOCK_UPCOMING.timeText.toUpperCase()}</span>
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">
                    {MOCK_UPCOMING.project}
                  </span>
                  <span className="text-xs font-sans font-bold text-white group-hover:text-brand-accent transition-colors duration-300">
                    {MOCK_UPCOMING.title}
                  </span>
                </div>
                
                <span className="text-[9px] font-mono text-white/30 tracking-wide mt-0.5 flex items-center gap-1 group-hover:text-white/50 transition-colors">
                  <span>{t("home.openMeeting")}</span>
                  <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </motion.div>}

          </motion.div>
          )}

        </div>

        {/* ==================== BOTTOM ROW (ACTIVITY & AIVA) ==================== */}
        {showBottomRow && <motion.div
          layout
          className="flex flex-col md:flex-row justify-between items-end gap-5 border-t border-white/5 pt-5 relative z-10"
        >
          
          {/* Bottom-Left: Activity Logs */}
          {isModuleVisible("recent-activity") && <motion.div 
            custom={6}
            initial="hidden"
            animate={systemBooted ? "visible" : "hidden"}
            variants={itemVariants}
            className="w-full md:w-3/5 flex flex-col gap-3 text-left"
          >
            <div className="flex items-center gap-2.5">
              <Activity size={12} className="text-white/30 animate-pulse" />
              <h3 className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase">{t("home.activity")}</h3>
            </div>
            
            <div className="flex flex-col gap-2">
              {MOCK_ACTIVITIES.slice(0, commandCenterConfig.recentItemsCount).map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-[10px] font-mono text-white/50 hover:text-white/80 transition-colors py-0.5">
                  <span className="text-brand-accent/70 w-10">{log.timestamp}</span>
                  <span className="text-white/20">•</span>
                  <span className="text-white/40">{log.user.toUpperCase()}</span>
                  <span className="text-white/20">—</span>
                  <span className="text-white/60 truncate">{log.action}</span>
                </div>
              ))}
            </div>
          </motion.div>}

          {(isModuleVisible("sales") || isModuleVisible("finance") || isModuleVisible("team-activity")) && (
            <motion.div layout className="flex flex-1 flex-wrap gap-3">
              {[
                { id: "sales", label: t("home.sales"), value: "12", meta: t("home.activeOpportunities") },
                { id: "finance", label: t("home.finance"), value: "€24.8K", meta: t("home.trackedMonth") },
                { id: "team-activity", label: t("home.team"), value: "3", meta: t("home.partnersActive") },
              ].filter((item) => isModuleVisible(item.id)).sort((a, b) => moduleOrder(a.id) - moduleOrder(b.id)).map((item) => (
                <div key={item.id} className="min-w-[150px] flex-1 border border-white/5 bg-white/[0.015] rounded-sm px-3.5 py-3">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-white/30">{item.label}</span>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-lg font-light text-white/90">{item.value}</span>
                    <span className="text-[9px] text-white/30">{item.meta}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Bottom-Right: AIVA daemon status module */}
          {isModuleVisible("briefing") && <motion.div 
            custom={7}
            initial="hidden"
            animate={systemBooted ? "visible" : "hidden"}
            variants={itemVariants}
            className="w-full md:w-auto self-end"
          >
            <AivaStatus isLight={isLight} onOpenAiva={() => setActiveTab("aiva")} />
          </motion.div>}

        </motion.div>}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
