/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Search, 
  Plus, 
  Building2, 
  Briefcase, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar, 
  Clock, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  CreditCard, 
  ArrowLeft, 
  ExternalLink, 
  ChevronRight, 
  Filter, 
  Download, 
  Edit3, 
  UserCheck, 
  Layers, 
  MessageSquare, 
  TrendingUp, 
  Sparkles,
  X,
  Share2,
  Building,
  Zap,
  Activity,
  Check,
  FileCheck,
  BarChart3,
  Target,
  Megaphone,
  MousePointerClick,
  Workflow,
  LineChart,
  PieChart,
  Laptop,
  Gauge,
  Rocket
} from "lucide-react";
import { AccentColorOption } from "../../types/settings";

interface ClientsScreenProps {
  accentColor?: AccentColorOption;
  onBackToOverview?: () => void;
}

export interface ClientContact {
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary?: boolean;
}

export interface ClientInvoice {
  id: string;
  number: string;
  date: string;
  amount: string;
  status: "Pago" | "Pendente" | "Processamento";
}

export interface ClientProject {
  id: string;
  name: string;
  type: "Website & WebApp" | "CRM & Funis" | "SEO & Conteúdo" | "Performance Ads" | "Social Media" | "Automações & API";
  progress: number;
  status: "Em Curso" | "Concluído" | "Em Planeamento";
  budget: string;
  kpiHighlight?: string;
}

export interface DigitalEcosystemItem {
  name: string;
  category: "CRM & Vendas" | "Website & Plataforma" | "SEO & Orgânico" | "Tráfego Pago" | "Redes Sociais" | "Automações";
  tool: string;
  status: "Online" | "Em Otimização" | "Configuração";
  metric: string;
}

export interface ClientRecord {
  id: string;
  reference: string;
  name: string;
  legalName: string;
  vatNumber: string;
  segment: "Enterprise" | "Scaleup" | "E-Commerce" | "B2B Corporativo" | "Institucional";
  status: "Ativo" | "Em Onboarding" | "Em Otimização" | "Renovação";
  industry: string;
  website: string;
  generalEmail: string;
  generalPhone: string;
  headquarters: string;
  clientSince: string;
  accountManager: string;
  mrrValue: string;
  arrValue: string;
  adSpendManaged: string;
  contractType: string;
  contractRenewal: string;
  paymentTerms: string;
  ecosystemTags: string[];
  ecosystemHealth: number; // 0-100%
  monthlyLeads: number;
  monthlyOrganicTraffic: string;
  averageRoas: string;
  conversionRate: string;
  executiveSummary: string;
  brandColor: string;
  brandGradient: string;
  logoCode: string;
  contacts: ClientContact[];
  projects: ClientProject[];
  invoices: ClientInvoice[];
  ecosystemStack: DigitalEcosystemItem[];
  notes: Array<{ id: string; date: string; author: string; text: string }>;
  associatedDocs: Array<{ id: string; name: string; size: string; type: string }>;
}

const INITIAL_CLIENTS: ClientRecord[] = [
  {
    id: "cli-001",
    reference: "CLI-ECO-2026-001",
    name: "NovaTech Solutions S.A.",
    legalName: "NovaTech Solutions Engenharia e Sistemas S.A.",
    vatNumber: "PT 509 881 234",
    segment: "Enterprise",
    status: "Ativo",
    industry: "SaaS Enterprise & Inteligência Artificial",
    website: "https://novatech-solutions.pt",
    generalEmail: "marketing@novatech-solutions.pt",
    generalPhone: "+351 210 998 800",
    headquarters: "Avenida da Liberdade 245, Lisboa",
    clientSince: "Março 2024",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 5.800,00 / mês",
    arrValue: "€ 69.600,00 / ano",
    adSpendManaged: "€ 14.500,00 / mês",
    contractType: "Ecossistema Digital Completo 360º",
    contractRenewal: "15 Março 2027",
    paymentTerms: "30 Dias • Débito Direto SEPA",
    ecosystemTags: ["CRM HubSpot", "Next.js WebApp", "SEO Internacional", "Google Ads", "Automações N8N"],
    ecosystemHealth: 98,
    monthlyLeads: 385,
    monthlyOrganicTraffic: "42.8K / mês",
    averageRoas: "5.4x ROAS",
    conversionRate: "4.6%",
    executiveSummary: "Desenvolvimento e gestão de ecossistema digital B2B de ponta: WebApp em Next.js com integração nativa ao HubSpot CRM, campanhas globais de captação de leads corporativas no Google Ads e LinkedIn Ads, além de estratégia contínua de SEO técnico multilingue.",
    brandColor: "#00f0ff",
    brandGradient: "from-cyan-500/20 via-blue-600/20 to-indigo-900/30",
    logoCode: "NT",
    contacts: [
      {
        name: "Dr. Alexandre Barreto",
        role: "Chief Marketing Officer (CMO)",
        email: "a.barreto@novatech-solutions.pt",
        phone: "+351 919 112 233",
        isPrimary: true
      },
      {
        name: "Eng.ª Sofia Valadas",
        role: "Head of Digital Growth",
        email: "sofia.valadas@novatech-solutions.pt",
        phone: "+351 934 556 778"
      }
    ],
    projects: [
      {
        id: "proj-01",
        name: "Redesign do Portal Global B2B em Next.js",
        type: "Website & WebApp",
        progress: 100,
        status: "Concluído",
        budget: "€ 18.500,00",
        kpiHighlight: "Carregamento em 0.8s (Core Web Vitals 99/100)"
      },
      {
        id: "proj-02",
        name: "Campanha de Lead Gen EMEA (Google Ads & LinkedIn)",
        type: "Performance Ads",
        progress: 85,
        status: "Em Curso",
        budget: "€ 8.500,00",
        kpiHighlight: "385 leads qualificadas no último mês"
      },
      {
        id: "proj-03",
        name: "Otimização de SEO Semântico & Clusters de IA",
        type: "SEO & Conteúdo",
        progress: 60,
        status: "Em Curso",
        budget: "€ 4.200,00",
        kpiHighlight: "+38% tráfego orgânico MoM"
      }
    ],
    ecosystemStack: [
      { name: "Portal Institucional & Blog", category: "Website & Plataforma", tool: "Next.js 15 + Tailwind CSS", status: "Online", metric: "42.8K visitas/mês" },
      { name: "Gestão Comercial & Pipeline", category: "CRM & Vendas", tool: "HubSpot Enterprise", status: "Online", metric: "385 leads/mês" },
      { name: "Estratégia SEO & Clusters", category: "SEO & Orgânico", tool: "Semrush / Ahrefs", status: "Online", metric: "DR 58 • Top 3 em 140 keywords" },
      { name: "Campanhas de Aquisição Paga", category: "Tráfego Pago", tool: "Google Ads & LinkedIn Ads", status: "Online", metric: "5.4x ROAS" },
      { name: "Nutrição & Lead Scoring", category: "Automações", tool: "Make.com + Webhooks", status: "Online", metric: "99.8% taxa entrega" }
    ],
    invoices: [
      { id: "inv-101", number: "FT-2026/0891", date: "01 Ago 2026", amount: "€ 5.800,00", status: "Pago" },
      { id: "inv-102", number: "FT-2026/0774", date: "01 Jul 2026", amount: "€ 5.800,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-01",
        date: "26 Ago 2026",
        author: "Nelson Afonso",
        text: "Reunião de alinhamento de ROI. As novas landing pages interativas aumentaram a conversão de MQL para SQL em 22.4%."
      }
    ],
    associatedDocs: [
      { id: "doc-c1", name: "Relatorio_Performance_Marketing_Julho_2026.pdf", size: "3.4 MB", type: "PDF" },
      { id: "doc-c2", name: "Contrato_Gestao_Ecossistema_Digital.pdf", size: "2.1 MB", type: "PDF" }
    ]
  },
  {
    id: "cli-002",
    reference: "CLI-ECO-2026-002",
    name: "Lumina Energy Group",
    legalName: "Lumina Transição Energética & Renováveis Lda.",
    vatNumber: "PT 514 229 801",
    segment: "B2B Corporativo",
    status: "Ativo",
    industry: "Energia Solar & Sustentabilidade",
    website: "https://lumina-energy.eu",
    generalEmail: "comunicacao@lumina-energy.eu",
    generalPhone: "+351 220 445 100",
    headquarters: "Rua de Gonçalo Cristóvão 180, Porto",
    clientSince: "Janeiro 2025",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 4.200,00 / mês",
    arrValue: "€ 50.400,00 / ano",
    adSpendManaged: "€ 12.000,00 / mês",
    contractType: "Lead Gen & Social Media Performance",
    contractRenewal: "31 Dezembro 2027",
    paymentTerms: "15 Dias • SEPA",
    ecosystemTags: ["CRM Pipedrive", "Simulador Solar Web", "Meta Ads", "Instagram & LinkedIn", "Automações WhatsApp"],
    ecosystemHealth: 96,
    monthlyLeads: 610,
    monthlyOrganicTraffic: "28.5K / mês",
    averageRoas: "4.8x ROAS",
    conversionRate: "5.2%",
    executiveSummary: "Ecossistema de aquisição e conversão para o setor de energia solar: simulador interativo de poupança no website, campanhas de Meta Ads direcionadas a proprietários residenciais e PMEs, com nutrição direta via WhatsApp e CRM Pipedrive.",
    brandColor: "#10b981",
    brandGradient: "from-emerald-500/20 via-teal-600/20 to-amber-900/30",
    logoCode: "LE",
    contacts: [
      {
        name: "Eng. Pedro Alvelos",
        role: "Diretor Comercial e Marketing",
        email: "p.alvelos@lumina-energy.eu",
        phone: "+351 961 889 004",
        isPrimary: true
      },
      {
        name: "Marta Figueiredo",
        role: "Gestora de Marca & Redes Sociais",
        email: "m.figueiredo@lumina-energy.eu",
        phone: "+351 912 884 112"
      }
    ],
    projects: [
      {
        id: "proj-lum-1",
        name: "Simulador Solar Interativo 3D com Captura de Lead",
        type: "Website & WebApp",
        progress: 100,
        status: "Concluído",
        budget: "€ 7.500,00",
        kpiHighlight: "Taxa de conclusão do simulador de 68%"
      },
      {
        id: "proj-lum-2",
        name: "Campanha Meta Ads (Instagram Reels + Facebook)",
        type: "Performance Ads",
        progress: 90,
        status: "Em Curso",
        budget: "€ 6.000,00",
        kpiHighlight: "Custo por Lead qualificada a € 9,40"
      },
      {
        id: "proj-lum-3",
        name: "Produção de Conteúdo para Redes Sociais & Vídeo",
        type: "Social Media",
        progress: 75,
        status: "Em Curso",
        budget: "€ 2.500,00",
        kpiHighlight: "+12.4K seguidores no Instagram"
      }
    ],
    ecosystemStack: [
      { name: "Website com Simulador", category: "Website & Plataforma", tool: "React / Vite Jamstack", status: "Online", metric: "28.5K visitas/mês" },
      { name: "Funil Comercial & Pipeline", category: "CRM & Vendas", tool: "Pipedrive Pro", status: "Online", metric: "610 propostas geradas" },
      { name: "Aquisição em Redes Sociais", category: "Tráfego Pago", tool: "Meta Ads Manager", status: "Online", metric: "4.8x ROAS" },
      { name: "Gestão Redes Sociais", category: "Redes Sociais", tool: "Instagram / LinkedIn / TikTok", status: "Online", metric: "+180K impressões/mês" },
      { name: "Automação WhatsApp & Agendamento", category: "Automações", tool: "Twilio API / Make", status: "Online", metric: "84% resposta em <5 min" }
    ],
    invoices: [
      { id: "inv-lum-01", number: "FT-2026/0880", date: "05 Ago 2026", amount: "€ 4.200,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-lum-1",
        date: "20 Ago 2026",
        author: "Nelson Afonso",
        text: "O simulador solar integrado gerou um recorde de 610 leads este mês, com taxa de conversão final de vendas em 18%."
      }
    ],
    associatedDocs: [
      { id: "doc-lum-1", name: "Dashboard_ROI_MetaAds_Lumina.pdf", size: "2.8 MB", type: "PDF" }
    ]
  },
  {
    id: "cli-003",
    reference: "CLI-ECO-2026-003",
    name: "Horizon BioPharma Labs",
    legalName: "Horizon Investigação Farmacêutica e Biotecnologia S.A.",
    vatNumber: "PT 503 118 990",
    segment: "Enterprise",
    status: "Ativo",
    industry: "Biotecnologia & Ensaios Clínicos",
    website: "https://horizon-biopharma.com",
    generalEmail: "digital@horizon-biopharma.com",
    generalPhone: "+351 218 700 900",
    headquarters: "Parque de Ciência e Tecnologia Oeiras, Lisboa",
    clientSince: "Novembro 2024",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 6.500,00 / mês",
    arrValue: "€ 78.000,00 / ano",
    adSpendManaged: "€ 8.000,00 / mês",
    contractType: "SEO Internacional & Autoridade B2B",
    contractRenewal: "30 Novembro 2028",
    paymentTerms: "45 Dias • Transferência Bancária",
    ecosystemTags: ["Portal Científico", "SEO Multilingue", "LinkedIn Thought Leadership", "HubSpot CRM", "Hub de Publicações"],
    ecosystemHealth: 99,
    monthlyLeads: 142,
    monthlyOrganicTraffic: "31.4K / mês",
    averageRoas: "N/A (B2B Authority)",
    conversionRate: "3.8%",
    executiveSummary: "Posicionamento global para centro de biotecnologia farmacêutica. Estratégia de SEO médico e biológico em 4 idiomas (EN, DE, FR, PT), hub de artigos clínicos com indexação acelerada e gestão de Thought Leadership executivo no LinkedIn.",
    brandColor: "#ec4899",
    brandGradient: "from-pink-500/20 via-rose-600/20 to-purple-900/30",
    logoCode: "HB",
    contacts: [
      {
        name: "Dr.ª Beatriz Castelo Branco",
        role: "Chief Communications Officer (CCO)",
        email: "b.castelobranco@horizon-biopharma.com",
        phone: "+351 933 441 900",
        isPrimary: true
      }
    ],
    projects: [
      {
        id: "proj-bio-1",
        name: "Portal Científico Multilingue com Repositório de Papers",
        type: "Website & WebApp",
        progress: 100,
        status: "Concluído",
        budget: "€ 22.000,00",
        kpiHighlight: "100% páginas com rich snippets no Google"
      },
      {
        id: "proj-bio-2",
        name: "Estratégia SEO Médico Internacional (EUA e Alemanha)",
        type: "SEO & Conteúdo",
        progress: 90,
        status: "Em Curso",
        budget: "€ 9.500,00",
        kpiHighlight: "Autoridade de Domínio subiu de 41 para 62"
      }
    ],
    ecosystemStack: [
      { name: "Portal Global de Ensaios", category: "Website & Plataforma", tool: "Next.js Multilingue", status: "Online", metric: "31.4K visitas/mês" },
      { name: "Gestão de Parceiros Médicos", category: "CRM & Vendas", tool: "HubSpot CRM Pro", status: "Online", metric: "142 contactos MQL" },
      { name: "SEO Médico Internacional", category: "SEO & Orgânico", tool: "Ahrefs Enterprise", status: "Online", metric: "DR 62 • 85% tráfego orgânico" },
      { name: "LinkedIn Thought Leadership", category: "Redes Sociais", tool: "LinkedIn Executivo", status: "Online", metric: "+45K impressões por post" }
    ],
    invoices: [
      { id: "inv-bio-01", number: "FT-2026/0875", date: "01 Ago 2026", amount: "€ 6.500,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-bio-1",
        date: "28 Ago 2026",
        author: "Nelson Afonso",
        text: "O tráfego orgânico proveniente da Alemanha e EUA aumentou 44% após o lançamento do novo cluster de artigos científicos."
      }
    ],
    associatedDocs: [
      { id: "doc-bio-1", name: "Auditoria_SEO_Tecnico_Internacional.pdf", size: "4.5 MB", type: "PDF" }
    ]
  },
  {
    id: "cli-004",
    reference: "CLI-ECO-2026-004",
    name: "Apex Capital Partners",
    legalName: "Apex Gestão de Ativos & Private Equity Lda.",
    vatNumber: "PT 511 405 672",
    segment: "B2B Corporativo",
    status: "Renovação",
    industry: "Venture Capital & Private Equity",
    website: "https://apex-capital.pt",
    generalEmail: "investors@apex-capital.pt",
    generalPhone: "+351 213 220 110",
    headquarters: "Avenida Fontes Pereira de Melo 14, Lisboa",
    clientSince: "Setembro 2023",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 3.900,00 / mês",
    arrValue: "€ 46.800,00 / ano",
    adSpendManaged: "€ 4.500,00 / mês",
    contractType: "Branding Digital & Relações com Investidores",
    contractRenewal: "30 Setembro 2026",
    paymentTerms: "30 Dias • SEPA",
    ecosystemTags: ["Website Minimalista", "Portal de Investidores", "Newsletter VIP", "LinkedIn Executivo", "CRM Custom"],
    ecosystemHealth: 95,
    monthlyLeads: 58,
    monthlyOrganicTraffic: "12.2K / mês",
    averageRoas: "N/A (Deal Flow)",
    conversionRate: "6.8%",
    executiveSummary: "Ecossistema digital exclusivo para fundo de capital de risco. Plataforma restrita para Limited Partners (LP Portal), newsletter com 94.5% de taxa de abertura e curadoria de conteúdos para captação de startups e co-investidores.",
    brandColor: "#f59e0b",
    brandGradient: "from-amber-500/20 via-orange-600/20 to-yellow-900/30",
    logoCode: "AC",
    contacts: [
      {
        name: "Dr. Rodrigo Salgado",
        role: "Managing Partner",
        email: "r.salgado@apex-capital.pt",
        phone: "+351 917 882 300",
        isPrimary: true
      }
    ],
    projects: [
      {
        id: "proj-apx-1",
        name: "Relatório Anual Interativo & Portal de Investidores",
        type: "Website & WebApp",
        progress: 80,
        status: "Em Curso",
        budget: "€ 9.000,00",
        kpiHighlight: "100% de adesão dos investidores institucionais"
      }
    ],
    ecosystemStack: [
      { name: "Website Institucional Minimalista", category: "Website & Plataforma", tool: "Astro / Tailwind", status: "Online", metric: "12.2K visitas/mês" },
      { name: "Portal Seguro de LPs", category: "CRM & Vendas", tool: "Auth0 + Custom Database", status: "Online", metric: "140 investidores ativos" },
      { name: "Newsletter Executiva VIP", category: "Automações", tool: "Resend / Custom API", status: "Online", metric: "94.5% taxa de abertura" },
      { name: "Gestão LinkedIn dos Partners", category: "Redes Sociais", tool: "LinkedIn B2B", status: "Online", metric: "+35K impressões/mês" }
    ],
    invoices: [
      { id: "inv-apx-01", number: "FT-2026/0862", date: "01 Ago 2026", amount: "€ 3.900,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-apx-1",
        date: "25 Ago 2026",
        author: "Nelson Afonso",
        text: "Proposta de renovação com inclusão de produção de podcast em vídeo para founders de scaleups."
      }
    ],
    associatedDocs: [
      { id: "doc-apx-1", name: "Proposta_Renovacao_Digital_2026_2027.pdf", size: "2.4 MB", type: "PDF" }
    ]
  },
  {
    id: "cli-005",
    reference: "CLI-ECO-2026-005",
    name: "Instituto de Cibersegurança & Criptografia",
    legalName: "Associação Nacional para a Investigação Criptográfica",
    vatNumber: "PT 508 190 442",
    segment: "Institucional",
    status: "Ativo",
    industry: "Educação Tecnológica & Formação",
    website: "https://icc-portugal.org",
    generalEmail: "geral@icc-portugal.org",
    generalPhone: "+351 217 550 400",
    headquarters: "Campus Universitário de Lisboa, Edifício C6",
    clientSince: "Fevereiro 2025",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 3.200,00 / mês",
    arrValue: "€ 38.400,00 / ano",
    adSpendManaged: "€ 6.000,00 / mês (Google Grants)",
    contractType: "Academia Digital & Gestão de Campanhas",
    contractRenewal: "28 Fevereiro 2028",
    paymentTerms: "60 Dias • Faturação Pública",
    ecosystemTags: ["Academia E-Learning", "Google Ads Grants", "SEO Educacional", "Email Marketing", "Inscrições Online"],
    ecosystemHealth: 97,
    monthlyLeads: 480,
    monthlyOrganicTraffic: "65.0K / mês",
    averageRoas: "6.2x ROI em inscrições",
    conversionRate: "4.1%",
    executiveSummary: "Plataforma de ensino e academia online para pós-graduações e certificações de cibersegurança. Gestão integral do funil de matrículas com pagamentos automáticos Stripe e nutrição de candidatos por email marketing.",
    brandColor: "#3b82f6",
    brandGradient: "from-blue-500/20 via-indigo-600/20 to-slate-900/30",
    logoCode: "ICC",
    contacts: [
      {
        name: "Prof. Doutor Manuel Antunes",
        role: "Diretor da Academia Digital",
        email: "m.antunes@icc-portugal.org",
        phone: "+351 965 221 009",
        isPrimary: true
      }
    ],
    projects: [
      {
        id: "proj-icc-1",
        name: "Lançamento da Campanha de Candidaturas 2026/2027",
        type: "Performance Ads",
        progress: 95,
        status: "Em Curso",
        budget: "€ 5.500,00",
        kpiHighlight: "1.250 candidaturas recebidas (meta superada)"
      }
    ],
    ecosystemStack: [
      { name: "Portal da Academia & Matrículas", category: "Website & Plataforma", tool: "React / LMS Integrado", status: "Online", metric: "65.0K visitas/mês" },
      { name: "Funil de Candidaturas & Alunos", category: "CRM & Vendas", tool: "ActiveCampaign + Stripe", status: "Online", metric: "480 alunos inscritos/mês" },
      { name: "Google Ads Grants & Search", category: "Tráfego Pago", tool: "Google Ads Grants", status: "Online", metric: "100% verba aproveitada" },
      { name: "SEO de Cursos & Artigos", category: "SEO & Orgânico", tool: "SEO On-Page & Schema", status: "Online", metric: "Top 1 em 'Cursos Cibersegurança'" }
    ],
    invoices: [
      { id: "inv-icc-01", number: "FT-2026/0850", date: "15 Jul 2026", amount: "€ 3.200,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-icc-1",
        date: "22 Ago 2026",
        author: "Nelson Afonso",
        text: "Matrículas do curso intensivo de Criptografia esgotadas em 72 horas após disparo da automação de email."
      }
    ],
    associatedDocs: [
      { id: "doc-icc-1", name: "Relatorio_Matriculas_Academia_2026.pdf", size: "3.1 MB", type: "PDF" }
    ]
  },
  {
    id: "cli-006",
    reference: "CLI-ECO-2026-006",
    name: "Krypton Robotics & Drones",
    legalName: "Krypton Sistemas Autónomos e Robótica Lda.",
    vatNumber: "PT 515 908 123",
    segment: "Scaleup",
    status: "Em Onboarding",
    industry: "Robótica, Drones & Hardware",
    website: "https://krypton-robotics.io",
    generalEmail: "growth@krypton-robotics.io",
    generalPhone: "+351 229 110 880",
    headquarters: "Zona Industrial da Maia, Porto",
    clientSince: "Agosto 2026",
    accountManager: "Nelson Afonso",
    mrrValue: "€ 4.800,00 / mês",
    arrValue: "€ 57.600,00 / ano",
    adSpendManaged: "€ 10.000,00 / mês",
    contractType: "Lançamento de Produto & Ecossistema Global",
    contractRenewal: "31 Julho 2027",
    paymentTerms: "30 Dias • Transferência Bancária",
    ecosystemTags: ["Website 3D Interativo", "YouTube & Meta Ads", "HubSpot Setup", "Discord Community", "Vídeos 3D"],
    ecosystemHealth: 92,
    monthlyLeads: 215,
    monthlyOrganicTraffic: "18.6K / mês",
    averageRoas: "6.1x ROAS",
    conversionRate: "3.4%",
    executiveSummary: "Scaleup de robótica autónoma e drones industriais. Criação de website com renderizadores 3D WebGL, funil de pré-encomendas internacionais, campanhas em vídeo de alta produção no YouTube e TikTok, com automação completa de demonstrações comerciais no CRM.",
    brandColor: "#a855f7",
    brandGradient: "from-purple-500/20 via-fuchsia-600/20 to-violet-950/30",
    logoCode: "KR",
    contacts: [
      {
        name: "Eng. Gonçalo Pires",
        role: "Chief Commercial Officer (CCO)",
        email: "g.pires@krypton-robotics.io",
        phone: "+351 928 334 110",
        isPrimary: true
      }
    ],
    projects: [
      {
        id: "proj-kry-1",
        name: "Website 3D WebGL com Demonstração Virtual do Drone",
        type: "Website & WebApp",
        progress: 75,
        status: "Em Curso",
        budget: "€ 14.000,00",
        kpiHighlight: "Tempo médio na página de 3m40s"
      },
      {
        id: "proj-kry-2",
        name: "Configuração do Funil de Vendas no HubSpot",
        type: "CRM & Funis",
        progress: 90,
        status: "Em Curso",
        budget: "€ 4.500,00",
        kpiHighlight: "Integração total com pedidos de demo"
      }
    ],
    ecosystemStack: [
      { name: "Website Interativo 3D", category: "Website & Plataforma", tool: "Three.js / React", status: "Em Otimização", metric: "18.6K visitas" },
      { name: "Pipeline de Demos Comerciais", category: "CRM & Vendas", tool: "HubSpot Starter", status: "Online", metric: "215 pedidos de demo" },
      { name: "Campanhas Vídeo YouTube & Meta", category: "Tráfego Pago", tool: "YouTube Ads / Meta", status: "Online", metric: "6.1x ROAS" },
      { name: "Comunidade & Redes Sociais", category: "Redes Sociais", tool: "LinkedIn & YouTube", status: "Online", metric: "+95K visualizações de vídeo" }
    ],
    invoices: [
      { id: "inv-kry-01", number: "FT-2026/0899", date: "15 Ago 2026", amount: "€ 4.800,00", status: "Pago" }
    ],
    notes: [
      {
        id: "nt-kry-1",
        date: "27 Ago 2026",
        author: "Nelson Afonso",
        text: "Setup do pixel Meta e Conversion API (CAPI) validado com 100% de precisão de eventos."
      }
    ],
    associatedDocs: [
      { id: "doc-kry-1", name: "Plano_Estrategico_Lancamento_Krypton_2026.pdf", size: "5.2 MB", type: "PDF" }
    ]
  }
];

const SEGMENTS = [
  "Todos os Segmentos",
  "Enterprise",
  "Scaleup",
  "E-Commerce",
  "B2B Corporativo",
  "Institucional"
];

// Corporate real vector brand logos
function CompanyBrandLogo({ client, size = "md" }: { client: ClientRecord; size?: "sm" | "md" | "lg" | "xl" }) {
  const dims = 
    size === "xl" ? "w-20 h-20 rounded-2xl p-2.5" :
    size === "lg" ? "w-14 h-14 rounded-xl p-2" :
    size === "md" ? "w-11 h-11 rounded-xl p-1.5" : 
    "w-8 h-8 rounded-lg p-1";

  const renderRealisticBrandLogo = () => {
    switch (client.id) {
      case "cli-001":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="nt-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="50%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="nt-g2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0369a1" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path d="M32 6L54 18.5V45.5L32 58L10 45.5V18.5L32 6Z" fill="#040e1f" stroke="url(#nt-g1)" strokeWidth="2" />
            <path d="M32 6L54 18.5L32 31L10 18.5L32 6Z" fill="url(#nt-g2)" />
            <path d="M10 18.5L32 31V58L10 45.5V18.5Z" fill="#031633" fillOpacity="0.8" />
            <path d="M54 18.5L32 31V58L54 45.5V18.5Z" fill="#082859" fillOpacity="0.9" />
            <path d="M22 41V23L32 31L42 23V41" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="32" cy="31" r="3" fill="#ffffff" />
            <circle cx="22" cy="23" r="2" fill="#00f0ff" />
            <circle cx="42" cy="23" r="2" fill="#00f0ff" />
          </svg>
        );

      case "cli-002":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="lum-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#047857" />
              </linearGradient>
              <linearGradient id="lum-g2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="52" height="52" rx="16" fill="#042017" stroke="url(#lum-g1)" strokeWidth="1.5" />
            <path 
              d="M32 14C39.7 14 46 20.3 46 28C46 38 32 48 32 48C32 48 18 38 18 28C18 20.3 24.3 14 32 14Z" 
              fill="url(#lum-g1)" 
              fillOpacity="0.25"
              stroke="url(#lum-g1)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path 
              d="M32 20C36.4 20 40 23.6 40 28C40 34 32 41 32 41C32 41 24 34 24 28C24 23.6 27.6 20 32 20Z" 
              fill="url(#lum-g2)"
              fillOpacity="0.85"
            />
            <circle cx="32" cy="28" r="3.5" fill="#ffffff" />
            <path d="M32 10V13M44 16L42 18M20 16L22 18" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case "cli-003":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="bio-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" />
                <stop offset="50%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#e11d48" />
              </linearGradient>
              <linearGradient id="bio-g2" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="52" height="52" rx="16" fill="#200615" stroke="url(#bio-g1)" strokeWidth="1.5" />
            <path 
              d="M17 24C23 24 27 40 37 40C43 40 47 36 47 32C47 28 43 24 37 24C27 24 23 40 17 40C11 40 7 36 7 32C7 28 11 24 17 24Z" 
              stroke="url(#bio-g1)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M21 28L25 36M39 28L43 36M30 31L34 33" 
              stroke="url(#bio-g2)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
            />
            <circle cx="17" cy="24" r="3.5" fill="#fb7185" />
            <circle cx="37" cy="40" r="3.5" fill="#c084fc" />
            <circle cx="32" cy="32" r="2.5" fill="#ffffff" />
          </svg>
        );

      case "cli-004":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="apx-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>
              <linearGradient id="apx-g2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="52" height="52" rx="16" fill="#1c1203" stroke="url(#apx-g1)" strokeWidth="1.5" />
            <path d="M32 12L50 48H14L32 12Z" fill="#120b02" />
            <path d="M32 12L42 48H32V12Z" fill="url(#apx-g1)" />
            <path d="M32 12L22 48H32V12Z" fill="url(#apx-g2)" />
            <path d="M32 23L47 48H39L32 34L25 48H17L32 23Z" fill="url(#apx-g1)" />
            <polygon points="32,23 35,34 29,34" fill="#ffffff" />
          </svg>
        );

      case "cli-005":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="icc-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="icc-g2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#93c5fd" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
            </defs>
            <path 
              d="M32 8L52 16V32C52 44.5 43.5 53.5 32 57C20.5 53.5 12 44.5 12 32V16L32 8Z" 
              fill="#061226" 
              stroke="url(#icc-g1)" 
              strokeWidth="2" 
            />
            <path 
              d="M32 18L44 24V34C44 41 39 46.5 32 49C25 46.5 20 41 20 34V24L32 18Z" 
              fill="url(#icc-g1)" 
              fillOpacity="0.2" 
              stroke="url(#icc-g2)" 
              strokeWidth="1.5" 
            />
            <circle cx="32" cy="30" r="4.5" fill="#60a5fa" />
            <path d="M30 32L28 41H36L34 32" fill="#60a5fa" />
            <circle cx="32" cy="30" r="2" fill="#ffffff" />
          </svg>
        );

      case "cli-006":
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <defs>
              <linearGradient id="kry-g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e879f9" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#7e22ce" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="52" height="52" rx="16" fill="#180424" stroke="url(#kry-g1)" strokeWidth="1.5" />
            <path d="M32 13L50 45H39L32 31L25 45H14L32 13Z" fill="url(#kry-g1)" fillOpacity="0.9" />
            <path d="M32 23L42 45H22L32 23Z" fill="#180424" />
            <circle cx="32" cy="13" r="3" fill="#f472b6" />
            <circle cx="14" cy="45" r="3" fill="#e879f9" />
            <circle cx="50" cy="45" r="3" fill="#e879f9" />
            <circle cx="32" cy="31" r="2.5" fill="#ffffff" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-md" fill="none">
            <rect x="6" y="6" width="52" height="52" rx="16" fill="#0b1120" stroke={client.brandColor} strokeWidth="1.5" />
            <polygon points="32,12 48,22 48,42 32,52 16,42 16,22" fill={client.brandColor} fillOpacity="0.15" stroke={client.brandColor} strokeWidth="1" />
            <text 
              x="32" 
              y="38" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="20" 
              fontWeight="900" 
              fontFamily="system-ui, -apple-system, sans-serif"
              letterSpacing="1"
            >
              {client.logoCode || client.name.slice(0, 2).toUpperCase()}
            </text>
          </svg>
        );
    }
  };

  return (
    <div className={`${dims} flex items-center justify-center shrink-0 relative transition-transform duration-300 group-hover:scale-105`}>
      {renderRealisticBrandLogo()}
    </div>
  );
}

export default function ClientsScreen({
  accentColor = {
    id: "axion-blue",
    name: "AXION Blue",
    hex: "#00f0ff",
    secondary: "#0284c7",
    glow: "rgba(0, 240, 255, 0.4)"
  },
  onBackToOverview
}: ClientsScreenProps) {
  const [clients, setClients] = useState<ClientRecord[]>(INITIAL_CLIENTS);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("Todos os Segmentos");
  const [activeDetailTab, setActiveDetailTab] = useState<"geral" | "metricas" | "stack" | "contactos" | "contratos" | "projetos" | "notas">("geral");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  // New Client Form State
  const [newClientName, setNewClientName] = useState("");
  const [newClientVat, setNewClientVat] = useState("");
  const [newClientIndustry, setNewClientIndustry] = useState("");
  const [newClientSegment, setNewClientSegment] = useState<ClientRecord["segment"]>("Enterprise");
  const [newClientEmail, setNewClientEmail] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [newClientContactName, setNewClientContactName] = useState("");
  const [newClientMrr, setNewClientMrr] = useState("");
  const [newClientTags, setNewClientTags] = useState("CRM HubSpot, Website Next.js, SEO");

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.vatNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ecosystemTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        c.contacts.some(cnt => cnt.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSegment = selectedSegment === "Todos os Segmentos" || c.segment === selectedSegment;

      return matchesSearch && matchesSegment;
    });
  }, [clients, searchQuery, selectedSegment]);

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find(c => c.id === selectedClientId) || null;
  }, [clients, selectedClientId]);

  // Agency Global Metrics
  const totalMRR = useMemo(() => {
    return "€ 28.400,00 / mês";
  }, []);

  const totalARR = useMemo(() => {
    return "€ 340.800,00 / ano";
  }, []);

  const totalLeadsMonthly = useMemo(() => {
    return clients.reduce((acc, c) => acc + c.monthlyLeads, 0);
  }, [clients]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim() || !selectedClient) return;

    const newNote = {
      id: `nt-${Date.now()}`,
      date: "Hoje, " + new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
      author: "Nelson Afonso",
      text: newNoteText.trim()
    };

    const updated = clients.map(c => {
      if (c.id === selectedClient.id) {
        return {
          ...c,
          notes: [newNote, ...c.notes]
        };
      }
      return c;
    });

    setClients(updated);
    setNewNoteText("");
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    const mrrNum = parseFloat(newClientMrr.replace(/[^0-9.]/g, "")) || 3500;
    const arrVal = `€ ${(mrrNum * 12).toLocaleString("pt-PT")},00 / ano`;
    const mrrVal = `€ ${mrrNum.toLocaleString("pt-PT")},00 / mês`;

    const newRec: ClientRecord = {
      id: `cli-${Date.now()}`,
      reference: `CLI-ECO-2026-${String(clients.length + 1).padStart(3, "0")}`,
      name: newClientName.trim(),
      legalName: newClientName.trim() + " S.A.",
      vatNumber: newClientVat.trim() || "PT 509 000 000",
      segment: newClientSegment,
      status: "Em Onboarding",
      industry: newClientIndustry.trim() || "Tecnologia & Serviços Digitais",
      website: "https://empresa.pt",
      generalEmail: newClientEmail.trim() || "marketing@empresa.pt",
      generalPhone: newClientPhone.trim() || "+351 210 000 000",
      headquarters: "Avenida da República 50, Lisboa",
      clientSince: "Agosto 2026",
      accountManager: "Nelson Afonso",
      mrrValue: mrrVal,
      arrValue: arrVal,
      adSpendManaged: "€ 5.000,00 / mês",
      contractType: "Ecossistema Digital & Growth Marketing",
      contractRenewal: "31 Agosto 2027",
      paymentTerms: "30 Dias • SEPA",
      ecosystemTags: newClientTags.split(",").map(t => t.trim()).filter(Boolean),
      ecosystemHealth: 90,
      monthlyLeads: 120,
      monthlyOrganicTraffic: "15.0K / mês",
      averageRoas: "4.5x ROAS",
      conversionRate: "3.5%",
      executiveSummary: `Gestão e desenvolvimento do ecossistema digital de ${newClientName.trim()}, integrando CRM, website de alta velocidade, automações de captação e campanhas de growth.`,
      brandColor: "#00f0ff",
      brandGradient: "from-cyan-500/20 via-blue-600/20 to-slate-900/30",
      logoCode: newClientName.trim().slice(0, 2).toUpperCase(),
      contacts: [
        {
          name: newClientContactName.trim() || "Responsável de Marketing",
          role: "Diretor de Marketing & Growth",
          email: newClientEmail.trim() || "contacto@empresa.pt",
          phone: newClientPhone.trim() || "+351 910 000 000",
          isPrimary: true
        }
      ],
      projects: [
        {
          id: `proj-${Date.now()}`,
          name: "Onboarding & Auditoria de Ecossistema Digital",
          type: "Website & WebApp",
          progress: 25,
          status: "Em Curso",
          budget: "€ 4.500,00",
          kpiHighlight: "Mapeamento de funis e tags de conversão"
        }
      ],
      ecosystemStack: [
        { name: "Website Principal", category: "Website & Plataforma", tool: "Next.js Jamstack", status: "Configuração", metric: "Em implementação" },
        { name: "CRM de Vendas", category: "CRM & Vendas", tool: "HubSpot CRM", status: "Configuração", metric: "Setup de funis" },
        { name: "Campanhas Google/Meta", category: "Tráfego Pago", tool: "Meta & Google Ads", status: "Configuração", metric: "Pixel CAPI configurado" }
      ],
      invoices: [],
      notes: [
        {
          id: `nt-${Date.now()}`,
          date: "Hoje, " + new Date().toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit" }),
          author: "Nelson Afonso",
          text: "Início do onboarding do cliente, auditoria de tags de rastreio e plano de ecossistema digital aprovado."
        }
      ],
      associatedDocs: []
    };

    setClients([newRec, ...clients]);
    setSelectedClientId(newRec.id);
    setIsNewClientModalOpen(false);

    // Reset fields
    setNewClientName("");
    setNewClientVat("");
    setNewClientIndustry("");
    setNewClientEmail("");
    setNewClientPhone("");
    setNewClientContactName("");
    setNewClientMrr("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col py-6 pb-28 relative z-10 select-none">
      
      {/* ========================================================================= */}
      {/* VIEW A: DIRETÓRIO DE CLIENTES & ECOSSISTEMAS DIGITAIS                     */}
      {/* ========================================================================= */}
      {!selectedClient ? (
        <motion.div
          key="client-directory-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-8"
        >
          {/* Header Superior da Agência */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <motion.div 
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1.5"
            >
              <div className="flex items-center gap-3">
                {onBackToOverview && (
                  <button
                    type="button"
                    onClick={onBackToOverview}
                    className="p-2 -ml-2 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2 text-xs"
                  >
                    <ArrowLeft size={16} />
                    <span className="hidden sm:inline">Painel Geral</span>
                  </button>
                )}
                <span className="text-[11px] font-mono tracking-widest text-[#00f0ff] uppercase flex items-center gap-1.5">
                  <Workflow size={13} />
                  ECOSSISTEMAS DIGITAIS & CLIENTES
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight uppercase">
                CLIENTES, <span className="text-white/70 font-normal">ECOSSISTEMAS DIGITAIS</span>
              </h1>
              <p className="text-xs md:text-sm text-white/60 font-sans">
                Gestão centralizada de CRMs, websites, SEO, tráfego pago, redes sociais e performance digital por empresa.
              </p>
            </motion.div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsNewClientModalOpen(true)}
                style={{
                  backgroundColor: accentColor.hex,
                  color: "#050609",
                  boxShadow: `0 0 20px ${accentColor.glow}`
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs font-sans transition-all cursor-pointer hover:brightness-110 flex items-center gap-2 shadow-lg"
              >
                <Plus size={16} />
                <span>Novo Ecossistema</span>
              </button>
            </div>
          </div>

          {/* Barra de Pesquisa e Filtros Rápidos */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Pesquisar por empresa, CRM, SEO, stack ou NIF..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-sans placeholder:text-white/30 focus:outline-none focus:border-[#00f0ff] transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Segment Filter Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SEGMENTS.map((seg) => {
                const isSel = selectedSegment === seg;
                return (
                  <button
                    key={seg}
                    type="button"
                    onClick={() => setSelectedSegment(seg)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                      isSel 
                        ? "bg-white/15 text-white font-semibold border border-white/20" 
                        : "text-white/40 hover:text-white hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    {seg}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grelha de Empresas / Ecossistemas Digitais com Logotipos Reais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.length === 0 ? (
              <div className="col-span-full py-16 text-center text-white/40 text-xs bg-white/[0.01] border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-3">
                <Building2 size={32} className="text-white/20" />
                <span>Nenhum ecossistema encontrado com os termos de pesquisa atuais.</span>
              </div>
            ) : (
              filteredClients.map((client) => {
                return (
                  <div
                    key={client.id}
                    onClick={() => {
                      setSelectedClientId(client.id);
                      setActiveDetailTab("geral");
                    }}
                    className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/25 transition-all duration-300 cursor-pointer flex flex-col justify-between gap-5 relative overflow-hidden"
                  >
                    {/* Top Row: Brand Logo + Company Info + Status */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <CompanyBrandLogo client={client} size="lg" />

                        <div className="flex flex-col gap-0.5">
                          <h2 className="text-base font-bold text-white font-sans tracking-tight group-hover:text-[#00f0ff] transition-colors">
                            {client.name}
                          </h2>
                          <span className="text-xs text-white/50 font-sans">
                            {client.industry}
                          </span>
                          <span className="text-[10px] font-mono text-white/35">
                            NIF: {client.vatNumber}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                          client.status === "Ativo"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : client.status === "Renovação"
                            ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                            : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
                        }`}>
                          {client.status}
                        </span>

                        <span className="text-[10px] font-mono text-white/40">
                          {client.segment}
                        </span>
                      </div>
                    </div>

                    {/* Stack & Ecosystem Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {client.ecosystemTags.map((tag, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/5 text-[10px] font-sans text-white/70"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Marketing & Digital Performance KPIs */}
                    <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-white/40 uppercase flex items-center gap-1">
                          <MousePointerClick size={10} className="text-[#00f0ff]" />
                          Leads / Mês
                        </span>
                        <span className="font-mono font-bold text-white text-xs sm:text-sm">
                          {client.monthlyLeads}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-white/40 uppercase flex items-center gap-1">
                          <LineChart size={10} className="text-emerald-400" />
                          Tráfego SEO
                        </span>
                        <span className="font-mono font-bold text-emerald-400 text-xs sm:text-sm">
                          {client.monthlyOrganicTraffic}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-white/40 uppercase flex items-center gap-1">
                          <BarChart3 size={10} className="text-amber-400" />
                          Retainer MRR
                        </span>
                        <span className="font-mono font-bold text-white text-xs sm:text-sm">
                          {client.mrrValue.split("/")[0]}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Retainer + Ver Ficha Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-white/60">
                      <div className="flex items-center gap-2 text-[11px] font-sans">
                        <span className="flex items-center gap-1 text-emerald-400 font-mono">
                          <Activity size={12} />
                          Health: {client.ecosystemHealth}%
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-white/50">
                          {client.projects.length} projetos ativos
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all">
                        <span>Ver Ecossistema</span>
                        <ChevronRight size={14} style={{ color: accentColor.hex }} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Resumo Consolidado de Agência Digital */}
          <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50 font-sans">
            <div className="flex items-center gap-6">
              <span><strong>{clients.length}</strong> ecossistemas digitais ativos</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Target size={13} />
                <strong>{totalLeadsMonthly.toLocaleString("pt-PT")}</strong> leads geradas / mês
              </span>
            </div>
            <div className="font-mono text-white/70">
              MRR Total Sob Gestão: <span className="text-white font-bold">{totalMRR}</span>
            </div>
          </div>
        </motion.div>
      ) : (

        /* ========================================================================= */
        /* VIEW B: FICHA COMPLETA DO ECOSSISTEMA DIGITAL (Ao clicar na empresa)     */
        /* ========================================================================= */
        <motion.div
          key="client-detail-view"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {/* Top Bar: Voltar + Exportar */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <button
              type="button"
              onClick={() => setSelectedClientId(null)}
              className="px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white text-xs font-sans border border-white/10 transition-all cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft size={15} />
              <span>← Voltar à Lista de Clientes</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href={selectedClient.website}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white text-xs font-sans border border-white/10 transition-all cursor-pointer flex items-center gap-2"
              >
                <Globe size={14} className="text-[#00f0ff]" />
                <span className="hidden sm:inline">Visitar Website</span>
                <ExternalLink size={12} className="text-white/40" />
              </a>

              <button
                type="button"
                onClick={() => alert(`A exportar relatório completo de ecossistema digital de ${selectedClient.name}...`)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white/80 hover:text-white text-xs font-sans border border-white/10 transition-all cursor-pointer flex items-center gap-2"
              >
                <Download size={14} className="text-white/60" />
                <span>Exportar Relatório</span>
              </button>
            </div>
          </div>

          {/* Hero Header do Ecossistema */}
          <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden backdrop-blur-md">
            
            {/* Ambient Glow */}
            <div 
              className="absolute -top-12 -right-12 w-72 h-72 rounded-full pointer-events-none opacity-20"
              style={{
                background: `radial-gradient(circle, ${selectedClient.brandColor} 0%, transparent 70%)`,
                filter: "blur(50px)"
              }}
            />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              
              <div className="flex items-start gap-5">
                <CompanyBrandLogo client={selectedClient} size="xl" />

                <motion.div 
                  initial={{ opacity: 0, x: -28 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-sans tracking-tight uppercase">
                      {selectedClient.name}, <span className="text-white/70 font-normal">FICHA EXECUTIVA</span>
                    </h1>
                    <span className="text-[10px] font-mono text-white/50 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full">
                      {selectedClient.reference}
                    </span>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                      selectedClient.status === "Ativo"
                        ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                        : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                    }`}>
                      {selectedClient.status}
                    </span>
                  </div>

                  <span className="text-xs text-white/60 font-sans">
                    {selectedClient.legalName} • <span className="font-mono text-white/40">NIF: {selectedClient.vatNumber}</span>
                  </span>

                  <div className="flex items-center gap-4 text-xs text-white/50 font-sans mt-2 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Globe size={13} className="text-[#00f0ff]" />
                      {selectedClient.website.replace("https://", "")}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} className="text-emerald-400" />
                      Cliente desde {selectedClient.clientSince}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <UserCheck size={13} className="text-purple-400" />
                      Account: {selectedClient.accountManager}
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* KPIs de Retainer e Investimento em Ads */}
              <div className="flex items-center gap-4 shrink-0 bg-white/[0.02] border border-white/5 p-3.5 rounded-2xl">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 uppercase">MRR Retainer</span>
                  <span className="text-sm md:text-base font-bold text-white font-mono">{selectedClient.mrrValue.split("/")[0]}</span>
                </div>
                <div className="w-[1px] h-8 bg-white/10" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Media Spend</span>
                  <span className="text-sm md:text-base font-bold text-[#00f0ff] font-mono">{selectedClient.adSpendManaged.split("/")[0]}</span>
                </div>
              </div>
            </div>

            {/* Sub-Navegação por Separadores */}
            <div className="flex items-center gap-2 overflow-x-auto pt-6 mt-6 border-t border-white/10 no-scrollbar">
              {[
                { id: "geral", label: "Visão Geral do Ecossistema", icon: Workflow },
                { id: "metricas", label: "Performance & Métricas Digitais", icon: BarChart3 },
                { id: "stack", label: `Stack & Canais (${selectedClient.ecosystemStack.length})`, icon: Laptop },
                { id: "projetos", label: `Projetos & Sprints (${selectedClient.projects.length})`, icon: Rocket },
                { id: "contactos", label: `Interlocutores (${selectedClient.contacts.length})`, icon: Users },
                { id: "contratos", label: "Contratos & Faturação", icon: DollarSign },
                { id: "notas", label: `Timeline & Notas (${selectedClient.notes.length})`, icon: MessageSquare },
              ].map((tab) => {
                const isSel = activeDetailTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                      isSel
                        ? "bg-white/15 text-white font-bold border border-white/20 shadow-md"
                        : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={14} style={{ color: isSel ? accentColor.hex : undefined }} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conteúdo Dinâmico do Separador Selecionado */}
          <div className="flex flex-col gap-6">

            {/* TAB 1: VISÃO GERAL DO ECOSSISTEMA */}
            {activeDetailTab === "geral" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
                
                {/* Resumo Estratégico & Escopo */}
                <div className="md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                  <span className="text-[11px] font-mono tracking-wider text-white/40 uppercase font-semibold flex items-center gap-2">
                    <Sparkles size={14} className="text-[#00f0ff]" />
                    Estratégia Digital & Posicionamento
                  </span>
                  
                  <p className="text-white/90 text-sm leading-relaxed">
                    {selectedClient.executiveSummary}
                  </p>

                  {/* Componentes Ativos */}
                  <div className="flex flex-col gap-2 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Componentes Integrados do Ecossistema:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {selectedClient.ecosystemTags.map((tag, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-white/90 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 text-[11px]">Setor de Atividade</span>
                      <span className="text-white font-medium">{selectedClient.industry}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 text-[11px]">Segmento Comercial</span>
                      <span className="text-white font-medium">{selectedClient.segment}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 text-[11px]">Contacto Comercial de Marketing</span>
                      <span className="text-white font-medium">{selectedClient.generalEmail}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-white/40 text-[11px]">Telefone Direto</span>
                      <span className="text-white font-medium">{selectedClient.generalPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Documentos & Relatórios no Vault */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                  <span className="text-[11px] font-mono text-white/40 uppercase font-semibold flex items-center gap-2">
                    <FileCheck size={14} className="text-emerald-400" />
                    Relatórios & Documentação
                  </span>

                  <div className="flex flex-col gap-2 pt-2">
                    {selectedClient.associatedDocs.length === 0 ? (
                      <span className="text-white/30 text-xs py-4 text-center">Sem relatórios anexados.</span>
                    ) : (
                      selectedClient.associatedDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3 hover:bg-white/[0.05] transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <FileText size={15} className="text-[#00f0ff] shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs text-white font-medium truncate">{doc.name}</span>
                              <span className="text-[10px] font-mono text-white/40">{doc.size}</span>
                            </div>
                          </div>
                          <Download size={13} className="text-white/40 hover:text-white cursor-pointer shrink-0" />
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: PERFORMANCE & MÉTRICAS DIGITAIS */}
            {activeDetailTab === "metricas" && (
              <div className="flex flex-col gap-6">
                
                {/* 4 Cards de Métricas de Alta Conversão */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Metric 1: Leads Mensais */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-sans">Leads Geradas</span>
                      <MousePointerClick size={16} className="text-[#00f0ff]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold font-mono text-white">
                        {selectedClient.monthlyLeads}
                      </span>
                      <span className="text-[11px] text-emerald-400 font-sans mt-0.5">
                        ↑ +18.4% vs mês anterior
                      </span>
                    </div>
                  </div>

                  {/* Metric 2: Tráfego Orgânico (SEO) */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-sans">Tráfego Orgânico (SEO)</span>
                      <LineChart size={16} className="text-emerald-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
                        {selectedClient.monthlyOrganicTraffic}
                      </span>
                      <span className="text-[11px] text-white/40 font-sans mt-0.5">
                        Google Search & Bing
                      </span>
                    </div>
                  </div>

                  {/* Metric 3: ROAS Médio em Ads */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-sans">Retorno em Ads (ROAS)</span>
                      <BarChart3 size={16} className="text-amber-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold font-mono text-amber-400">
                        {selectedClient.averageRoas}
                      </span>
                      <span className="text-[11px] text-white/40 font-sans mt-0.5">
                        Meta & Google Ads
                      </span>
                    </div>
                  </div>

                  {/* Metric 4: Taxa de Conversão */}
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 font-sans">Taxa de Conversão (CVR)</span>
                      <Target size={16} className="text-purple-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl md:text-3xl font-bold font-mono text-white">
                        {selectedClient.conversionRate}
                      </span>
                      <span className="text-[11px] text-purple-400 font-sans mt-0.5">
                        Funil de Aquisição
                      </span>
                    </div>
                  </div>

                </div>

                {/* Detalhe de Canais de Tráfego e Conversão */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
                    <Gauge size={14} className="text-[#00f0ff]" />
                    Distribuição dos Canais de Aquisição & Conversão
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Globe size={14} className="text-[#00f0ff]" />
                        SEO & Busca Orgânica
                      </span>
                      <p className="text-xs text-white/60">
                        Palavras-chave em Top 3 no Google gerando tráfego qualificado com intenção de compra comercial.
                      </p>
                      <span className="text-xs font-mono text-emerald-400 font-bold mt-auto">
                        48% do volume de leads
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Megaphone size={14} className="text-amber-400" />
                        Tráfego Pago (PPC & Social Ads)
                      </span>
                      <p className="text-xs text-white/60">
                        Campanhas de Google Search, Meta Ads (Instagram/Facebook) e LinkedIn Ads com tracking CAPI direto.
                      </p>
                      <span className="text-xs font-mono text-amber-400 font-bold mt-auto">
                        36% do volume de leads
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Share2 size={14} className="text-purple-400" />
                        Redes Sociais & Referral
                      </span>
                      <p className="text-xs text-white/60">
                        Conteúdos de autoridade, Thought Leadership executivo, newsletters e parcerias digitais.
                      </p>
                      <span className="text-xs font-mono text-purple-400 font-bold mt-auto">
                        16% do volume de leads
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 3: STACK & CANAIS DO ECOSSISTEMA */}
            {activeDetailTab === "stack" && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedClient.ecosystemStack.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white font-sans">{item.name}</span>
                          <span className="text-xs text-white/50">{item.category}</span>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono border ${
                          item.status === "Online"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                        <div className="flex items-center gap-2 text-white/70">
                          <Laptop size={13} className="text-[#00f0ff]" />
                          <span className="font-mono">{item.tool}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{item.metric}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: PROJETOS & ROADMAP */}
            {activeDetailTab === "projetos" && (
              <div className="flex flex-col gap-4">
                {selectedClient.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white font-sans">{proj.name}</span>
                        <span className="text-xs text-white/50">{proj.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-white">{proj.budget}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                          proj.status === "Concluído"
                            ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                            : "text-cyan-400 bg-cyan-400/10 border-cyan-400/20"
                        }`}>
                          {proj.status}
                        </span>
                      </div>
                    </div>

                    {proj.kpiHighlight && (
                      <div className="text-xs text-[#00f0ff] font-sans flex items-center gap-1.5">
                        <CheckCircle2 size={13} />
                        <span>{proj.kpiHighlight}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                          style={{ width: `${proj.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-white/70">{proj.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 5: INTERLOCUTORES & CONTACTOS */}
            {activeDetailTab === "contactos" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedClient.contacts.map((contact, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-between gap-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-white font-sans">{contact.name}</span>
                        <span className="text-xs text-white/50">{contact.role}</span>
                      </div>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                          Principal
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-3 border-t border-white/5 text-xs text-white/70">
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 hover:text-[#00f0ff] transition-colors">
                        <Mail size={13} className="text-white/40" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 hover:text-[#00f0ff] transition-colors">
                        <Phone size={13} className="text-white/40" />
                        <span>{contact.phone}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 6: CONTRATOS & FINANCEIRO */}
            {activeDetailTab === "contratos" && (
              <div className="flex flex-col gap-6">
                
                {/* Condições Contratuais */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[11px] font-mono uppercase">Modelo de Retainer</span>
                    <span className="text-sm font-bold text-white">{selectedClient.contractType}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[11px] font-mono uppercase">Próxima Renovação</span>
                    <span className="text-sm font-bold text-emerald-400">{selectedClient.contractRenewal}</span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-white/40 text-[11px] font-mono uppercase">Condições de Pagamento</span>
                    <span className="text-sm font-bold text-white">{selectedClient.paymentTerms}</span>
                  </div>
                </div>

                {/* Histórico de Faturas Emitidas */}
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-4">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold">
                    Faturas de Retainer & Media Spend
                  </span>

                  <div className="flex flex-col gap-2">
                    {selectedClient.invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard size={15} className="text-white/40" />
                          <span className="font-mono text-white font-medium">{inv.number}</span>
                          <span className="text-white/40">• {inv.date}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white">{inv.amount}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 7: NOTAS & TIMELINE */}
            {activeDetailTab === "notas" && (
              <div className="flex flex-col gap-6">
                
                {/* Form para Adicionar Nota */}
                <form onSubmit={handleAddNote} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40 font-semibold flex items-center gap-2">
                    <Edit3 size={14} className="text-[#00f0ff]" />
                    Adicionar Registo de Alinhamento / Reunião
                  </span>
                  
                  <textarea
                    rows={3}
                    placeholder="Registar nota estratégica, insights de campanhas, testes A/B ou pontos de reunião..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="w-full p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-sans placeholder:text-white/30 focus:outline-none focus:border-[#00f0ff] transition-all resize-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-4 py-2 rounded-xl bg-[#00f0ff] text-slate-950 font-bold text-xs font-sans hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer shadow-md"
                    >
                      Guardar Registo
                    </button>
                  </div>
                </form>

                {/* Lista Cronológica de Notas */}
                <div className="flex flex-col gap-3">
                  {selectedClient.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col gap-2 text-xs"
                    >
                      <div className="flex items-center justify-between text-[11px] text-white/40">
                        <span className="font-bold text-white/80">{note.author}</span>
                        <span className="font-mono">{note.date}</span>
                      </div>
                      <p className="text-white/85 leading-relaxed font-sans">{note.text}</p>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REGISTAR NOVO CLIENTE / ECOSSISTEMA DIGITAL                        */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isNewClientModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-xl p-6 md:p-8 rounded-3xl bg-[#0b0f19] border border-white/15 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <Workflow size={20} className="text-[#00f0ff]" />
                  <h3 className="text-lg font-bold text-white font-sans tracking-tight uppercase">
                    NOVO ECOSSISTEMA, <span className="text-white/70 font-normal">REGISTO DE CLIENTE</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="flex flex-col gap-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Nome da Empresa *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Solaris Tech Lda."
                      value={newClientName}
                      onChange={(e) => setNewClientName(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">NIF / VAT</label>
                    <input
                      type="text"
                      placeholder="Ex: PT 512 345 678"
                      value={newClientVat}
                      onChange={(e) => setNewClientVat(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Segmento</label>
                    <select
                      value={newClientSegment}
                      onChange={(e) => setNewClientSegment(e.target.value as any)}
                      className="p-3 rounded-xl bg-[#0e1424] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    >
                      <option value="Enterprise">Enterprise</option>
                      <option value="Scaleup">Scaleup</option>
                      <option value="E-Commerce">E-Commerce</option>
                      <option value="B2B Corporativo">B2B Corporativo</option>
                      <option value="Institucional">Institucional</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Setor / Indústria</label>
                    <input
                      type="text"
                      placeholder="Ex: E-Commerce & Retalho"
                      value={newClientIndustry}
                      onChange={(e) => setNewClientIndustry(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Retainer Mensal (MRR em €)</label>
                    <input
                      type="text"
                      placeholder="Ex: 4500"
                      value={newClientMrr}
                      onChange={(e) => setNewClientMrr(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Stack & Canais (separados por vírgula)</label>
                    <input
                      type="text"
                      placeholder="CRM HubSpot, Website Next.js, SEO, Meta Ads"
                      value={newClientTags}
                      onChange={(e) => setNewClientTags(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">Contacto Principal</label>
                    <input
                      type="text"
                      placeholder="Nome do Diretor / CMO"
                      value={newClientContactName}
                      onChange={(e) => setNewClientContactName(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 font-sans">E-mail Comercial</label>
                    <input
                      type="email"
                      placeholder="marketing@empresa.pt"
                      value={newClientEmail}
                      onChange={(e) => setNewClientEmail(e.target.value)}
                      className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-white font-sans focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewClientModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-sans transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00f0ff] text-slate-950 font-bold text-xs font-sans hover:brightness-110 transition-all shadow-lg"
                  >
                    Criar Ecossistema
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
