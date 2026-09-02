/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "founder" | "admin" | "employee" | "freelancer" | "client";

export type SettingsMainTab = 
  | "appearance"
  | "language"
  | "command-center"
  | "navigation"
  | "notifications"
  | "focus-quiet"
  | "briefings"
  | "meetings"
  | "integrations"
  | "work-preferences"
  | "security"
  | "devices"
  | "personal-activity"
  | "org-team"
  | "org-roles"
  | "org-branding"
  | "org-modules"
  | "org-integrations"
  | "org-data-privacy"
  | "org-audit-log"
  | "workspace-profiles";

export type SettingsCategory = "PERSONAL" | "WORK" | "ACCOUNT" | "ORGANIZATION";

export interface SettingsNavCategory {
  id: SettingsCategory;
  label: string;
  adminOnly?: boolean;
  items: {
    id: SettingsMainTab;
    label: string;
    description: string;
    iconName: string;
    badge?: string;
  }[];
}

// 1. APPEARANCE
export type ThemeMode = "dark" | "light" | "system";

export type AccentColorToken = "axion-blue" | "electric-blue" | "violet" | "red" | "silver" | "graphite";

export interface AccentColorOption {
  id: AccentColorToken;
  name: string;
  hex: string;
  secondary: string;
  glow: string;
}

export type InterfaceDensity = "compact" | "comfortable" | "spacious";
export type TextSizeOption = "small" | "default" | "large";
export type MotionOption = "full" | "reduced" | "minimal";
export type BackgroundVariant = "deep-obsidian" | "cyber-grid" | "starfield-ambient" | "clean-slate";

export interface AppearanceSettings {
  theme: ThemeMode;
  accentColor: AccentColorToken;
  density: InterfaceDensity;
  textSize: TextSizeOption;
  interfaceScale: number; // 90 to 115 %
  visualEffects: {
    backgroundMotion: boolean;
    glassEffects: boolean;
    ambientLighting: boolean;
    blurTransitions: boolean;
    enhancedAnimations: boolean;
  };
  motion: MotionOption;
  backgroundVariant: BackgroundVariant;
}

// 2. LANGUAGE & REGION
export interface LanguageRegionSettings {
  language: "pt" | "en";
  timezone: string;
  dateFormat: "DD/MM/YYYY" | "MM/DD/YYYY" | "YYYY-MM-DD" | "DD MMMM YYYY";
  timeFormat: "24h" | "12h";
  firstDayOfWeek: "monday" | "sunday";
  currency: "EUR" | "USD" | "GBP";
  decimalSeparator: "," | ".";
  numberFormat: "standard" | "compact";
}

// 3. COMMAND CENTER
export interface CommandCenterModuleItem {
  id: string;
  label: string;
  category: string;
  visible: boolean;
  isCore?: boolean;
}

export interface CommandCenterConfig {
  modules: CommandCenterModuleItem[];
  primaryMetric: "priorities" | "today" | "meetings" | "performance";
  recentItemsCount: number;
  defaultLandingExperience: "standard" | "focus" | "briefing";
}

// 4. NAVIGATION
export interface NavigationSettings {
  defaultLandingPage: "overview" | "spaces" | "locations" | "climate" | "calendar";
  sidebarCollapsedDefault: boolean;
  pinnedModules: string[];
  recentItemsShown: number;
  openLinksInNewTab: boolean;
}

// 5. ACCESSIBILITY
export interface AccessibilitySettings {
  fontScaling: number;
  highContrast: boolean;
  reducedMotionForced: boolean;
  keyboardNavigationOptimized: boolean;
  enhancedFocusIndicators: boolean;
  captionsDefault: boolean;
  transcriptionFont: "sans" | "mono" | "dyslexic";
  soundCues: boolean;
  largerClickTargets: boolean;
  colorBlindFriendly: boolean;
}

// 6. NOTIFICATIONS
export interface NotificationChannelSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  statusText?: string;
}

export type NotificationPriorityBehavior = "immediate" | "digest" | "silent" | "disabled";

export interface NotificationCategorySetting {
  id: string;
  name: string;
  description: string;
  channelInApp: boolean;
  channelDesktop: boolean;
  channelEmail: boolean;
  channelDiscord: boolean;
  priorityBehavior: NotificationPriorityBehavior;
  adminOnly?: boolean;
}

// 7 & 8. QUIET HOURS & FOCUS
export interface QuietHoursSettings {
  enabled: boolean;
  startTime: string;
  endTime: string;
  activeDays: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
  allowCriticalDuringQuiet: boolean;
}

export interface FocusModeSettings {
  defaultSessionMinutes: number;
  silenceNormalNotifications: boolean;
  hideActivityFeed: boolean;
  pauseDiscordAlerts: boolean;
  groupNotifications: boolean;
  allowCriticalInterruptions: boolean;
  showPostFocusSummary: boolean;
}

// 9. BRIEFINGS
export interface BriefingConfig {
  morning: {
    enabled: boolean;
    time: string;
    includeTasks: boolean;
    includeMeetings: boolean;
    includeDeadlines: boolean;
    includeProjectChanges: boolean;
    includeSales: boolean;
    includeFinance: boolean;
    includeTeamActivity: boolean;
    delivery: {
      axionOffice: boolean;
      desktop: boolean;
      discord: boolean;
      audio: boolean;
    };
  };
  evening: {
    enabled: boolean;
    time: string;
    includeCompletedToday: boolean;
    includePendingTasks: boolean;
    includeTomorrowPreview: boolean;
    includeImportantUpdates: boolean;
  };
  weekly: {
    enabled: boolean;
    day: "monday" | "friday" | "sunday";
    time: string;
    includeWeeklyGoals: boolean;
    includeProjectRoadmaps: boolean;
    includeKpiReview: boolean;
  };
}

// 10. MEETINGS
export interface MeetingSettings {
  transcriptionDefault: boolean;
  meetingSummaryDefault: boolean;
  detectDecisions: boolean;
  detectActionItems: boolean;
  detectDeadlines: boolean;
  speakerIdentification: boolean;
  createSuggestedTasks: boolean;
  meetingLanguage: "auto" | "pt" | "en";
  transcriptRetentionDays: number;
  discordBot: {
    joinWhenInvited: boolean;
    transcribeMeetings: boolean;
    createMeetingSummary: boolean;
    detectTasks: boolean;
    detectDecisions: boolean;
    sendOutputToAxion: boolean;
  };
}

// 11. INTEGRATIONS (Personal)
export type IntegrationStatus = "connected" | "not_connected" | "admin_required";

export interface PersonalIntegrationItem {
  id: string;
  name: string;
  iconName: string;
  connectedAccount?: string;
  status: IntegrationStatus;
  lastSync?: string;
  permissions: {
    label: string;
    granted: boolean;
  }[];
}

// 12. WORK PREFERENCES
export interface WorkPreferencesSettings {
  schedule: {
    [key in "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun"]: {
      active: boolean;
      start: string;
      end: string;
    };
  };
  lunchTime: {
    start: string;
    end: string;
  };
  preferredMeetingHours: {
    start: string;
    end: string;
  };
  preferredFocusHours: {
    start: string;
    end: string;
  };
  availabilityStatus: "available" | "busy" | "focus" | "out_of_office";
  workLocation: "office" | "remote" | "hybrid";
}

// 13, 14, 15. ACCOUNT: SECURITY, DEVICES, PERSONAL ACTIVITY
export interface SecuritySettings {
  email: string;
  twoFactorEnabled: boolean;
  passkeysConfigured: boolean;
  ssoConnected: boolean;
  ssoProvider?: string;
  lastPasswordChange: string;
}

export interface DeviceItem {
  id: string;
  name: string;
  deviceType: "desktop" | "mobile" | "tablet";
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ipAddress: string;
}

export interface PersonalActivityItem {
  id: string;
  time: string;
  action: string;
  category: "Security" | "Integrations" | "Account" | "Preferences";
  device?: string;
}

// ORGANIZATION SETTINGS (Founder/Admin Only)
export interface OrgTeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  status: "active" | "invited" | "suspended";
  permissionsSummary: string;
  lastActive: string;
  avatarUrl?: string;
}

export interface RolePermissionMatrixItem {
  module: string;
  founder: "full" | "view" | "none";
  admin: "full" | "view" | "none";
  employee: "full" | "view" | "none";
  freelancer: "full" | "view" | "none";
  client: "full" | "view" | "none";
}

export interface OrgBrandingSettings {
  companyName: string;
  workspaceName: string;
  defaultTheme: ThemeMode;
  defaultAccent: AccentColorToken;
  allowedAccentColors: AccentColorToken[];
  customFavicon: boolean;
  workspaceLogoVariant: "standard" | "minimal" | "monochrome";
  defaultBackgroundTreatment: BackgroundVariant;
}

export interface OrgModuleSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  accessLevel: "all" | "restricted" | "admin_only";
  dataCountInfo?: string;
}

export interface OrgIntegrationItem {
  id: string;
  name: string;
  account: string;
  status: "healthy" | "warning" | "error" | "not_configured";
  scopes: string[];
  lastSync: string;
}

export interface OrgDataPrivacySettings {
  meetingTranscriptRetentionDays: number;
  audioRecordingRetentionDays: number;
  screenshotRetentionDays: number;
  conversationHistoryRetentionMonths: number;
  actionLogsRetentionMonths: number;
  auditLogsRetentionMonths: number;
  automaticDataExportEnabled: boolean;
  gdprCompliantPurge: boolean;
}

export interface OrgAuditLogEvent {
  id: string;
  timestamp: string;
  user: string;
  userRole: UserRole;
  action: string;
  details: string;
  category: "User" | "Security" | "Data" | "Integrations" | "Projects" | "Finance" | "System";
}

export interface WorkspaceProfileItem {
  id: string;
  name: string;
  badge: string;
  description: string;
  theme: ThemeMode;
  notifications: "Normal" | "Critical Only" | "Muted";
  homeModules: string;
  effects: string;
}
