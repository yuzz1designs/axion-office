/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AppearanceSettings,
  LanguageRegionSettings,
  CommandCenterConfig,
  NavigationSettings,
  AccessibilitySettings,
  NotificationChannelSetting,
  NotificationCategorySetting,
  QuietHoursSettings,
  FocusModeSettings,
  BriefingConfig,
  MeetingSettings,
  PersonalIntegrationItem,
  WorkPreferencesSettings,
  SecuritySettings,
  DeviceItem,
  PersonalActivityItem,
  OrgTeamMember,
  RolePermissionMatrixItem,
  OrgBrandingSettings,
  OrgModuleSetting,
  OrgIntegrationItem,
  OrgDataPrivacySettings,
  OrgAuditLogEvent,
  WorkspaceProfileItem,
  AccentColorOption,
  SettingsNavCategory
} from "../types/settings";

export const ACCENT_COLOR_OPTIONS: AccentColorOption[] = [
  { id: "axion-blue", name: "AXION Blue", hex: "#00f0ff", secondary: "#0284c7", glow: "rgba(0, 240, 255, 0.4)" },
  { id: "electric-blue", name: "Electric Blue", hex: "#3b82f6", secondary: "#1d4ed8", glow: "rgba(59, 130, 246, 0.4)" },
  { id: "violet", name: "Violet", hex: "#a855f7", secondary: "#7e22ce", glow: "rgba(168, 85, 247, 0.4)" },
  { id: "cyan", name: "Cyan", hex: "#06b6d4", secondary: "#0891b2", glow: "rgba(6, 182, 212, 0.4)" },
  { id: "silver", name: "Silver", hex: "#cbd5e1", secondary: "#64748b", glow: "rgba(203, 213, 225, 0.3)" },
  { id: "graphite", name: "Graphite", hex: "#64748b", secondary: "#334155", glow: "rgba(100, 116, 139, 0.3)" },
];

export const SETTINGS_NAV_CATEGORIES: SettingsNavCategory[] = [
  {
    id: "PERSONAL",
    label: "Personal",
    items: [
      { id: "appearance", label: "Appearance", description: "Tema, cores de destaque, densidade e efeitos", iconName: "Palette" },
      { id: "language", label: "Language & Region", description: "Língua, timezone, formato de hora e moeda", iconName: "Globe" },
      { id: "command-center", label: "Command Center", description: "Módulos visíveis e organização da dashboard", iconName: "LayoutGrid" },
      { id: "navigation", label: "Navigation", description: "Atalhos de teclado e preferências de menu", iconName: "Navigation" },
    ]
  },
  {
    id: "WORK",
    label: "Work & Workflow",
    items: [
      { id: "notifications", label: "Notifications", description: "Canais e prioridade granular de alertas", iconName: "Bell" },
      { id: "focus-quiet", label: "Focus & Quiet Hours", description: "Sessões de foco e período não incomodar", iconName: "Moon" },
      { id: "briefings", label: "Briefings", description: "Resumos diários (manhã, noite e semanal)", iconName: "FileText" },
      { id: "meetings", label: "Meetings", description: "Transcrição, decisões e integração de reuniões", iconName: "Video" },
      { id: "integrations", label: "Integrations", description: "Contas pessoais (Google, Discord, GitHub)", iconName: "Link" },
      { id: "work-preferences", label: "Work Preferences", description: "Horário de trabalho, almoço e regime", iconName: "Clock" },
    ]
  },
  {
    id: "ACCOUNT",
    label: "Account & Devices",
    items: [
      { id: "security", label: "Security", description: "2FA, chaves de acesso Passkey e credenciais", iconName: "Shield" },
      { id: "devices", label: "Devices", description: "Sessões ativas e gestão de dispositivos", iconName: "Laptop" },
      { id: "personal-activity", label: "Personal Activity", description: "Histórico de ações e segurança da conta", iconName: "Activity" },
    ]
  },
  {
    id: "ORGANIZATION",
    label: "Organization (Founder / Admin)",
    adminOnly: true,
    items: [
      { id: "org-team", label: "Team", description: "Membros, acessos e estados da equipa", iconName: "Users" },
      { id: "org-roles", label: "Roles & Permissions", description: "Matriz global de permissões por módulo", iconName: "Key" },
      { id: "org-branding", label: "Branding", description: "Logos, identidade e regras visuais globais", iconName: "Sparkles" },
      { id: "org-modules", label: "Modules", description: "Ativação global e restrição de módulos", iconName: "Layers" },
      { id: "org-integrations", label: "Org Integrations", description: "Integrações partilhadas da empresa", iconName: "Building" },
      { id: "org-data-privacy", label: "Data & Privacy", description: "Políticas de retenção e conformidade", iconName: "Lock" },
      { id: "org-audit-log", label: "Audit Log", description: "Registo central de auditoria da organização", iconName: "FileText", badge: "Audit" },
      { id: "workspace-profiles", label: "Workspace Profiles", description: "Perfis pré-configurados (Work, Focus, Meeting)", iconName: "SlidersHorizontal", badge: "Experimental" },
    ]
  }
];

export const DEFAULT_APPEARANCE: AppearanceSettings = {
  theme: "dark",
  accentColor: "axion-blue",
  density: "comfortable",
  textSize: "default",
  interfaceScale: 100,
  visualEffects: {
    backgroundMotion: true,
    glassEffects: true,
    ambientLighting: true,
    blurTransitions: true,
    enhancedAnimations: true,
  },
  motion: "full",
  backgroundVariant: "deep-obsidian",
};

export const DEFAULT_LANGUAGE_REGION: LanguageRegionSettings = {
  language: "pt",
  timezone: "Europe/Lisbon (GMT+1)",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  firstDayOfWeek: "monday",
  currency: "EUR",
  decimalSeparator: ",",
  numberFormat: "standard",
};

export const DEFAULT_COMMAND_CENTER: CommandCenterConfig = {
  modules: [
    { id: "priorities", label: "Priorities", category: "Core", visible: true, isCore: true },
    { id: "today", label: "Today", category: "Core", visible: true, isCore: true },
    { id: "meetings", label: "Meetings", category: "Core", visible: true, isCore: true },
    { id: "my-tasks", label: "My Tasks", category: "Productivity", visible: true },
    { id: "projects", label: "Projects", category: "Operations", visible: true },
    { id: "briefing", label: "Briefing", category: "Operations", visible: true },
    { id: "sales", label: "Sales", category: "Business", visible: false },
    { id: "finance", label: "Finance", category: "Business", visible: false },
    { id: "team-activity", label: "Team Activity", category: "Collaboration", visible: false },
    { id: "recent-activity", label: "Recent Activity", category: "Audit", visible: false },
  ],
  primaryMetric: "priorities",
  recentItemsCount: 5,
  defaultLandingExperience: "standard",
};

export const DEFAULT_NAVIGATION: NavigationSettings = {
  defaultLandingPage: "overview",
  sidebarCollapsedDefault: false,
  pinnedModules: ["overview", "spaces", "calendar", "settings"],
  recentItemsShown: 4,
  openLinksInNewTab: false,
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  fontScaling: 100,
  highContrast: false,
  reducedMotionForced: false,
  keyboardNavigationOptimized: true,
  enhancedFocusIndicators: true,
  captionsDefault: true,
  transcriptionFont: "sans",
  soundCues: true,
  largerClickTargets: false,
  colorBlindFriendly: false,
};

export const NOTIFICATION_CHANNELS: NotificationChannelSetting[] = [
  { id: "in-app", name: "In App", description: "Notificações na barra lateral e centro de comandos", enabled: true },
  { id: "desktop", name: "Desktop", description: "Banners nativos do sistema operativo", enabled: true },
  { id: "email", name: "Email", description: "Envios para nelsonafonso@axion.pt", enabled: true },
  { id: "discord", name: "Discord", description: "Alertas privados via bot oficial AXION", enabled: true },
  { id: "mobile", name: "Mobile", description: "App nativa iOS & Android", enabled: false, statusText: "Coming Soon" },
];

export const NOTIFICATION_CATEGORIES: NotificationCategorySetting[] = [
  { id: "tasks", name: "Tasks", description: "Atribuições e atualizações de tarefas", channelInApp: true, channelDesktop: true, channelEmail: false, channelDiscord: true, priorityBehavior: "immediate" },
  { id: "deadlines", name: "Deadlines", description: "Prazos com aproximação de 24h/1h", channelInApp: true, channelDesktop: true, channelEmail: true, channelDiscord: true, priorityBehavior: "immediate" },
  { id: "mentions", name: "Mentions", description: "Menções diretas em notas e projetos", channelInApp: true, channelDesktop: true, channelEmail: false, channelDiscord: true, priorityBehavior: "immediate" },
  { id: "clients", name: "Clients", description: "Interações e mensagens de clientes", channelInApp: true, channelDesktop: true, channelEmail: true, channelDiscord: false, priorityBehavior: "immediate" },
  { id: "projects", name: "Projects", description: "Marcos atingidos e atualizações de estado", channelInApp: true, channelDesktop: false, channelEmail: false, channelDiscord: true, priorityBehavior: "digest" },
  { id: "meetings", name: "Meetings", description: "Convites, lembretes e transcrições prontas", channelInApp: true, channelDesktop: true, channelEmail: true, channelDiscord: true, priorityBehavior: "immediate" },
  { id: "sales", name: "Sales", description: "Novos leads e propostas aceites", channelInApp: true, channelDesktop: false, channelEmail: false, channelDiscord: false, priorityBehavior: "digest" },
  { id: "automations", name: "Automations", description: "Gatilhos de rotinas e alertas de erro", channelInApp: true, channelDesktop: false, channelEmail: false, channelDiscord: false, priorityBehavior: "silent" },
  { id: "system", name: "System", description: "Atualizações de versão e segurança AXION", channelInApp: true, channelDesktop: true, channelEmail: true, channelDiscord: false, priorityBehavior: "immediate" },
  { id: "finance", name: "Finance", description: "Faturação e pagamentos", channelInApp: true, channelDesktop: false, channelEmail: true, channelDiscord: false, priorityBehavior: "digest", adminOnly: true },
];

export const DEFAULT_QUIET_HOURS: QuietHoursSettings = {
  enabled: true,
  startTime: "23:00",
  endTime: "08:00",
  activeDays: ["mon", "tue", "wed", "thu", "fri"],
  allowCriticalDuringQuiet: true,
};

export const DEFAULT_FOCUS_MODE: FocusModeSettings = {
  defaultSessionMinutes: 90,
  silenceNormalNotifications: true,
  hideActivityFeed: true,
  pauseDiscordAlerts: true,
  groupNotifications: true,
  allowCriticalInterruptions: true,
  showPostFocusSummary: true,
};

export const DEFAULT_BRIEFINGS: BriefingConfig = {
  morning: {
    enabled: true,
    time: "08:30",
    includeTasks: true,
    includeMeetings: true,
    includeDeadlines: true,
    includeProjectChanges: true,
    includeSales: false,
    includeFinance: false,
    includeTeamActivity: true,
    delivery: {
      axionOffice: true,
      desktop: true,
      discord: true,
      audio: false,
    }
  },
  evening: {
    enabled: true,
    time: "19:00",
    includeCompletedToday: true,
    includePendingTasks: true,
    includeTomorrowPreview: true,
    includeImportantUpdates: true,
  },
  weekly: {
    enabled: true,
    day: "monday",
    time: "08:30",
    includeWeeklyGoals: true,
    includeProjectRoadmaps: true,
    includeKpiReview: false,
  }
};

export const DEFAULT_MEETINGS: MeetingSettings = {
  transcriptionDefault: true,
  meetingSummaryDefault: true,
  detectDecisions: true,
  detectActionItems: true,
  detectDeadlines: true,
  speakerIdentification: true,
  createSuggestedTasks: true,
  meetingLanguage: "auto",
  transcriptRetentionDays: 90,
  discordBot: {
    joinWhenInvited: true,
    transcribeMeetings: true,
    createMeetingSummary: true,
    detectTasks: true,
    detectDecisions: true,
    sendOutputToAxion: true,
  }
};

export const PERSONAL_INTEGRATIONS_MOCK: PersonalIntegrationItem[] = [
  {
    id: "google-workspace",
    name: "Google Workspace",
    iconName: "Globe",
    connectedAccount: "nelson.afonso@axion.pt",
    status: "connected",
    lastSync: "Há 12 min",
    permissions: [
      { label: "Ler perfil e contactos da empresa", granted: true },
      { label: "Sincronização de documentos vinculados", granted: true },
    ]
  },
  {
    id: "gmail",
    name: "Gmail",
    iconName: "Mail",
    connectedAccount: "nelson.afonso@axion.pt",
    status: "connected",
    lastSync: "Há 4 min",
    permissions: [
      { label: "Visualizar emails relacionados com clientes", granted: true },
      { label: "Criar rascunhos automáticos", granted: true },
      { label: "Eliminar mensagens", granted: false },
    ]
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    iconName: "Calendar",
    connectedAccount: "nelson.afonso@axion.pt",
    status: "connected",
    lastSync: "Há 2 min",
    permissions: [
      { label: "Read events", granted: true },
      { label: "Create events", granted: true },
      { label: "Delete events", granted: false },
    ]
  },
  {
    id: "google-drive",
    name: "Google Drive",
    iconName: "FileText",
    connectedAccount: "nelson.afonso@axion.pt",
    status: "connected",
    lastSync: "Há 1 hora",
    permissions: [
      { label: "Ler ficheiros das pastas de projetos AXION", granted: true },
      { label: "Guardar relatórios gerados", granted: true },
    ]
  },
  {
    id: "discord",
    name: "Discord",
    iconName: "MessageSquare",
    connectedAccount: "nelson_axion#4920",
    status: "connected",
    lastSync: "Tempo Real",
    permissions: [
      { label: "Receber notificações de canais privados", granted: true },
      { label: "Sincronização de reuniões por voz", granted: true },
    ]
  },
  {
    id: "github",
    name: "GitHub",
    iconName: "Code",
    connectedAccount: "nelsonafonso-axion",
    status: "connected",
    lastSync: "Há 25 min",
    permissions: [
      { label: "Aceder a commits e pull requests da organização", granted: true },
      { label: "Vincular issues a tarefas do AXION OFFICE", granted: true },
    ]
  }
];

export const DEFAULT_WORK_PREFERENCES: WorkPreferencesSettings = {
  schedule: {
    mon: { active: true, start: "09:00", end: "18:00" },
    tue: { active: true, start: "09:00", end: "18:00" },
    wed: { active: true, start: "09:00", end: "18:00" },
    thu: { active: true, start: "09:00", end: "18:00" },
    fri: { active: true, start: "09:00", end: "18:00" },
    sat: { active: false, start: "10:00", end: "14:00" },
    sun: { active: false, start: "10:00", end: "14:00" },
  },
  lunchTime: { start: "13:00", end: "14:00" },
  preferredMeetingHours: { start: "14:30", end: "17:30" },
  preferredFocusHours: { start: "09:30", end: "12:30" },
  availabilityStatus: "available",
  workLocation: "office",
};

export const DEFAULT_SECURITY: SecuritySettings = {
  email: "nelson.afonso@axion.pt",
  twoFactorEnabled: true,
  passkeysConfigured: false,
  ssoConnected: true,
  ssoProvider: "Google Workspace Enterprise",
  lastPasswordChange: "14 Julho 2026",
};

export const CONNECTED_DEVICES_MOCK: DeviceItem[] = [
  {
    id: "dev-1",
    name: "MacBook Pro 16\" (M3 Max)",
    deviceType: "desktop",
    location: "Lisbon, Portugal",
    lastActive: "Active now",
    isCurrent: true,
    ipAddress: "194.38.12.89",
  },
  {
    id: "dev-2",
    name: "iPhone 15 Pro",
    deviceType: "mobile",
    location: "Lisbon, Portugal",
    lastActive: "Last active 2h ago",
    isCurrent: false,
    ipAddress: "194.38.12.92",
  },
  {
    id: "dev-3",
    name: "iPad Pro 12.9\"",
    deviceType: "tablet",
    location: "Porto, Portugal",
    lastActive: "3 days ago",
    isCurrent: false,
    ipAddress: "85.240.11.45",
  },
];

export const PERSONAL_ACTIVITY_MOCK: PersonalActivityItem[] = [
  { id: "act-1", time: "23:41", action: "Meeting settings changed (Transcription ON)", category: "Preferences", device: "MacBook Pro" },
  { id: "act-2", time: "22:18", action: "Google account connected and synced", category: "Integrations", device: "MacBook Pro" },
  { id: "act-3", time: "19:44", action: "Login from MacBook Pro (M3 Max)", category: "Security", device: "MacBook Pro" },
  { id: "act-4", time: "14:10", action: "Updated Quiet Hours schedule to 23:00-08:00", category: "Preferences", device: "iPhone 15 Pro" },
  { id: "act-5", time: "09:15", action: "Password confirmation for SSO session", category: "Security", device: "MacBook Pro" },
];

// ORGANIZATION MOCK DATA
export const ORG_TEAM_MEMBERS_MOCK: OrgTeamMember[] = [
  { id: "usr-1", name: "Nelson Afonso", email: "nelson.afonso@axion.pt", role: "founder", team: "Executive / Product", status: "active", permissionsSummary: "Full Corporate Access", lastActive: "Active now" },
  { id: "usr-2", name: "João Silva", email: "joao.silva@axion.pt", role: "admin", team: "Operations & Tech", status: "active", permissionsSummary: "Admin Modules & Security", lastActive: "Há 15 min" },
  { id: "usr-3", name: "Marta Sousa", email: "marta.sousa@axion.pt", role: "employee", team: "Design & UX", status: "active", permissionsSummary: "Projects, Tasks, Documents", lastActive: "Há 45 min" },
  { id: "usr-4", name: "Pedro Costa", email: "pedro.costa@axion.pt", role: "employee", team: "Engineering", status: "active", permissionsSummary: "Projects, Tasks, Automations", lastActive: "Há 2 horas" },
  { id: "usr-5", name: "Beatriz Lima", email: "beatriz.lima@axion.pt", role: "freelancer", team: "Content & Copy", status: "active", permissionsSummary: "Assigned Tasks & Docs", lastActive: "Ontem" },
  { id: "usr-6", name: "Ricardo Rocha", email: "ricardo@enterprise-partner.com", role: "client", team: "Strategic Client", status: "invited", permissionsSummary: "Client Portal (View Only)", lastActive: "Pendente" },
];

export const ROLE_PERMISSION_MATRIX_MOCK: RolePermissionMatrixItem[] = [
  { module: "Sales", founder: "full", admin: "full", employee: "view", freelancer: "none", client: "none" },
  { module: "Clients", founder: "full", admin: "full", employee: "full", freelancer: "view", client: "none" },
  { module: "Projects", founder: "full", admin: "full", employee: "full", freelancer: "view", client: "view" },
  { module: "Tasks", founder: "full", admin: "full", employee: "full", freelancer: "view", client: "view" },
  { module: "Meetings", founder: "full", admin: "full", employee: "full", freelancer: "view", client: "view" },
  { module: "Documents", founder: "full", admin: "full", employee: "full", freelancer: "view", client: "view" },
  { module: "Finance", founder: "full", admin: "view", employee: "none", freelancer: "none", client: "none" },
  { module: "Automations", founder: "full", admin: "full", employee: "view", freelancer: "none", client: "none" },
  { module: "Admin & Settings", founder: "full", admin: "view", employee: "none", freelancer: "none", client: "none" },
];

export const DEFAULT_ORG_BRANDING: OrgBrandingSettings = {
  companyName: "AXION",
  workspaceName: "AXION HQ Global",
  defaultTheme: "dark",
  defaultAccent: "axion-blue",
  allowedAccentColors: ["axion-blue", "electric-blue", "violet", "cyan", "silver", "graphite"],
  customFavicon: true,
  workspaceLogoVariant: "standard",
  defaultBackgroundTreatment: "deep-obsidian",
};

export const ORG_MODULES_MOCK: OrgModuleSetting[] = [
  { id: "sales", name: "Sales", description: "Pipeline comercial, negócios e propostas", enabled: true, accessLevel: "restricted", dataCountInfo: "48 propostas ativas" },
  { id: "clients", name: "Clients", description: "Gestão de contactos, empresas e CRM interno", enabled: true, accessLevel: "all", dataCountInfo: "124 clientes cadastrados" },
  { id: "projects", name: "Projects", description: "Roadmaps, sprints e entregas", enabled: true, accessLevel: "all", dataCountInfo: "18 projetos em curso" },
  { id: "meetings", name: "Meetings", description: "Transcrição inteligente e actas", enabled: true, accessLevel: "all", dataCountInfo: "340 gravações guardadas" },
  { id: "finance", name: "Finance", description: "Faturação, contas bancárias e métricas de receita", enabled: true, accessLevel: "admin_only", dataCountInfo: "Apenas Founders & Admins" },
  { id: "automations", name: "Automations", description: "Workflows assíncronos e webhooks corporativos", enabled: true, accessLevel: "restricted", dataCountInfo: "12 fluxos ativos" },
  { id: "client-portal", name: "Client Portal", description: "Acesso externo seguro para clientes da AXION", enabled: false, accessLevel: "restricted", dataCountInfo: "Desativado temporariamente" },
];

export const ORG_INTEGRATIONS_MOCK: OrgIntegrationItem[] = [
  { id: "google-org", name: "Google Workspace Enterprise", account: "axion.pt (Tenant ID: 9021)", status: "healthy", scopes: ["Directory.Read", "Docs.All", "Drive.Enterprise"], lastSync: "Há 1 min" },
  { id: "discord-org", name: "Discord Server (AXION HQ)", account: "AXION Office Bot (Guild #7829)", status: "healthy", scopes: ["Voice.Transcribe", "Channels.Manage", "Webhooks"], lastSync: "Tempo Real" },
  { id: "github-org", name: "GitHub Organization", account: "github.com/axion-technologies", status: "healthy", scopes: ["Repo.Full", "Security.Audit", "Actions.Deploy"], lastSync: "Há 10 min" },
  { id: "storage-org", name: "Enterprise Cloud Storage", account: "eu-west-secure-storage-01", status: "healthy", scopes: ["S3.Compatible", "AES-256.Encrypted"], lastSync: "Contínuo" },
];

export const DEFAULT_DATA_PRIVACY: OrgDataPrivacySettings = {
  meetingTranscriptRetentionDays: 180,
  audioRecordingRetentionDays: 90,
  screenshotRetentionDays: 30,
  conversationHistoryRetentionMonths: 24,
  actionLogsRetentionMonths: 36,
  auditLogsRetentionMonths: 84, // 7 years regulatory
  automaticDataExportEnabled: true,
  gdprCompliantPurge: true,
};

export const ORG_AUDIT_LOG_MOCK: OrgAuditLogEvent[] = [
  { id: "aud-1", timestamp: "23:32", user: "João Silva", userRole: "admin", action: "Completed task", details: "Fechou tarefa crítica #4092 em 'Q3 Infrastructure'", category: "Projects" },
  { id: "aud-2", timestamp: "22:18", user: "Nelson Afonso", userRole: "founder", action: "Changed organization policy", details: "Atualizou retenção de transcrições para 180 dias", category: "Security" },
  { id: "aud-3", timestamp: "21:14", user: "Marta Sousa", userRole: "employee", action: "Connected Google Calendar", details: "OAuth Token concedido com sucesso", category: "Integrations" },
  { id: "aud-4", timestamp: "20:48", user: "System", userRole: "admin", action: "Integration synchronization completed", details: "Google Workspace Tenant synched (64 users)", category: "System" },
  { id: "aud-5", timestamp: "18:20", user: "Nelson Afonso", userRole: "founder", action: "Role modification", details: "Promoveu 'João Silva' para Admin", category: "User" },
  { id: "aud-6", timestamp: "16:05", user: "Pedro Costa", userRole: "employee", action: "Triggered automation", details: "Executou pipeline 'Sync Figma Tokens'", category: "Data" },
  { id: "aud-7", timestamp: "11:30", user: "System", userRole: "admin", action: "Security verification pass", details: "0 vulnerabilidades detetadas em nós de acesso", category: "Security" },
];

export const WORKSPACE_PROFILES_MOCK: WorkspaceProfileItem[] = [
  {
    id: "prof-work",
    name: "WORK",
    badge: "Default Daily",
    description: "Configuração padrão para trabalho colaborativo diário com a equipa.",
    theme: "dark",
    notifications: "Normal",
    homeModules: "Projects + Tasks + Meetings",
    effects: "Full ambient lighting & smooth motion",
  },
  {
    id: "prof-focus",
    name: "FOCUS",
    badge: "Deep Work",
    description: "Modo focado para desenvolvimento, estratégia e escrita sem interrupções.",
    theme: "dark",
    notifications: "Critical Only",
    homeModules: "Current Project & Dedicated Tasks",
    effects: "Minimal background effects & muted alerts",
  },
  {
    id: "prof-meeting",
    name: "MEETING",
    badge: "Live Session",
    description: "Otimizado para chamadas e reuniões executivas com ferramentas de notas em tempo real.",
    theme: "dark",
    notifications: "Muted",
    homeModules: "Meeting Agenda, Live Transcription & Action Items",
    effects: "Reduced distractions & active speaker highlight",
  }
];
