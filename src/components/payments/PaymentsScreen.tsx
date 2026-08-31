/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Plus, 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  Building, 
  Bot, 
  X, 
  Check,
  TrendingUp,
  CreditCard,
  Clock
} from "lucide-react";
import { AccentColorOption } from "../../types/settings";
import { SaaSSubscription, ClientPayment, PaymentStatus, SaaSCategory } from "../../types/payments";
import { MOCK_SAAS_SUBSCRIPTIONS, MOCK_CLIENT_PAYMENTS } from "../../data/paymentsMockData";

interface PaymentsScreenProps {
  accentColor?: AccentColorOption;
  onBackToOverview?: () => void;
  isLight?: boolean;
}

export type PaymentRowItem = {
  id: string;
  sourceType: "saas" | "client";
  title: string;
  subtitle: string;
  dueDate: string;
  amount: number;
  taxAmount?: number;
  totalAmount: number;
  status: PaymentStatus;
  roleOrContact: string;
  method: string;
  notes?: string;
  paidDate?: string;
  receiptNumber?: string;
};

export default function PaymentsScreen({
  accentColor = {
    id: "axion-blue",
    name: "AXION Blue",
    hex: "#00f0ff",
    secondary: "#0284c7",
    glow: "rgba(0, 240, 255, 0.4)"
  },
  onBackToOverview,
  isLight = false
}: PaymentsScreenProps) {
  // Main Data States
  const [saasList, setSaasList] = useState<SaaSSubscription[]>(MOCK_SAAS_SUBSCRIPTIONS);
  const [clientsList, setClientsList] = useState<ClientPayment[]>(MOCK_CLIENT_PAYMENTS);

  // Filters & Tabs
  const [selectedTab, setSelectedTab] = useState<"all" | "saas" | "clients">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "scheduled" | "paid">("all");

  // Selected Detail Item / Modal
  const [selectedRow, setSelectedRow] = useState<PaymentRowItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Form State for New Entry
  const [newType, setNewType] = useState<"saas" | "client">("saas");
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<string>("AI Tools");
  const [formAmount, setFormAmount] = useState("");
  const [formDueDate, setFormDueDate] = useState("2026-09-10");
  const [formPaymentMethod, setFormPaymentMethod] = useState("Cartão Corporativo AXION Black (•• 8821)");
  const [formRole, setFormRole] = useState("Senior Partner & Brand Architect");
  const [formNotes, setFormNotes] = useState("");

  const triggerToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Mark an item as paid
  const handleMarkAsPaid = (item: PaymentRowItem) => {
    const today = "2026-08-31";
    if (item.sourceType === "saas") {
      setSaasList(prev => prev.map(s => s.id === item.id ? { ...s, status: "paid", paidDate: today } : s));
      triggerToast(`Serviço de AI ${item.title} liquidado com sucesso.`);
    } else {
      const generatedRc = `RC AX-2026/${Math.floor(100 + Math.random() * 900)}`;
      setClientsList(prev => prev.map(c => c.id === item.id ? { 
        ...c, 
        status: "paid", 
        paidDate: today, 
        hasReceipt: true, 
        receiptNumber: generatedRc 
      } : c));
      triggerToast(`Fatura de ${item.title} marcada como recebida.`);
    }
    if (selectedRow?.id === item.id) {
      setSelectedRow(prev => prev ? { ...prev, status: "paid", paidDate: today } : null);
    }
  };

  // Add new payment record
  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formAmount) return;
    const parsedAmount = parseFloat(formAmount.replace(",", "."));
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (newType === "saas") {
      const newSaas: SaaSSubscription = {
        id: `saas-${Date.now()}`,
        serviceName: formName,
        provider: formName,
        category: "AI Tools",
        iconName: "Bot",
        amount: parsedAmount,
        currency: "EUR",
        dueDate: formDueDate,
        billingCycle: "monthly",
        paymentMethod: formPaymentMethod,
        status: "pending",
        executiveRole: formRole,
        assignedUser: {
          name: "Nelson Afonso",
          role: "Senior Partner & Brand Architect"
        },
        autoRenew: true,
        notes: formNotes || "Serviço de Inteligência Artificial para a equipa executiva."
      };
      setSaasList([newSaas, ...saasList]);
      triggerToast(`Serviço de AI ${formName} registado (€ ${parsedAmount.toLocaleString("pt-PT")}).`);
    } else {
      const tax = parsedAmount * 0.23;
      const newClient: ClientPayment = {
        id: `cl-pay-${Date.now()}`,
        invoiceNumber: `FT AX-2026/${Math.floor(100 + Math.random() * 900)}`,
        clientName: formName,
        projectName: `Projeto ${formName}`,
        description: formNotes || "Honorários Profissionais de Arquitetura & Branding",
        amount: parsedAmount,
        taxRate: 0.23,
        totalAmount: parsedAmount + tax,
        currency: "EUR",
        issueDate: "2026-08-31",
        dueDate: formDueDate,
        status: "pending",
        paymentMethod: formPaymentMethod,
        milestone: "Tranche Registada",
        contactPerson: {
          name: formRole || "Contacto de Faturação",
          email: "finance@cliente.pt"
        },
        hasReceipt: false,
        notes: formNotes
      };
      setClientsList([newClient, ...clientsList]);
      triggerToast(`Fatura para ${formName} adicionada com sucesso.`);
    }

    setIsAddModalOpen(false);
    setFormName("");
    setFormAmount("");
    setFormNotes("");
  };

  // Convert all items into a single unified ledger list
  const unifiedLedger = useMemo<PaymentRowItem[]>(() => {
    const list: PaymentRowItem[] = [];

    // AI SaaS entries
    saasList.forEach(s => {
      list.push({
        id: s.id,
        sourceType: "saas",
        title: s.serviceName,
        subtitle: `${s.provider} • AI Tooling`,
        dueDate: s.dueDate,
        amount: s.amount,
        totalAmount: s.amount,
        status: s.status,
        roleOrContact: s.executiveRole,
        method: s.paymentMethod,
        notes: s.notes,
        paidDate: s.paidDate
      });
    });

    // Client Invoices entries
    clientsList.forEach(c => {
      list.push({
        id: c.id,
        sourceType: "client",
        title: c.clientName,
        subtitle: `${c.invoiceNumber} • ${c.projectName}`,
        dueDate: c.dueDate,
        amount: c.amount,
        taxAmount: c.amount * c.taxRate,
        totalAmount: c.totalAmount,
        status: c.status,
        roleOrContact: `${c.contactPerson.name} (${c.milestone})`,
        method: c.paymentMethod,
        notes: c.notes,
        paidDate: c.paidDate,
        receiptNumber: c.receiptNumber
      });
    });

    // Sort by Due Date ascending
    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [saasList, clientsList]);

  // Filtered Ledger
  const filteredLedger = useMemo(() => {
    return unifiedLedger.filter(item => {
      if (selectedTab === "saas" && item.sourceType !== "saas") return false;
      if (selectedTab === "clients" && item.sourceType !== "client") return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchSub = item.subtitle.toLowerCase().includes(q);
        const matchRole = item.roleOrContact.toLowerCase().includes(q);
        const matchMethod = item.method.toLowerCase().includes(q);
        if (!matchTitle && !matchSub && !matchRole && !matchMethod) return false;
      }

      return true;
    });
  }, [unifiedLedger, selectedTab, statusFilter, searchQuery]);

  // Financial calculations requested explicitly by the user:
  // 1. O montante que fizemos este mês (Total faturado dos clientes no mês corrente)
  // 2. Quanto temos a pagar a serviços de AI (Total pendente/agendado de ferramentas de IA)
  // 3. Quanto nos falta receber de clientes (Total pendente de clientes)
  const financialOverview = useMemo(() => {
    // 1. Total faturado/feito este mês em projetos de clientes
    const totalClientsBilledMonth = clientsList.reduce((acc, curr) => acc + curr.amount, 0);

    // 2. Total a pagar em serviços de AI (pendentes / agendados)
    const pendingAi = saasList.filter(s => s.status === "pending" || s.status === "scheduled");
    const totalAiToPay = pendingAi.reduce((acc, curr) => acc + curr.amount, 0);

    // 3. Quanto falta receber de clientes (faturas pendentes)
    const pendingClients = clientsList.filter(c => c.status === "pending" || c.status === "scheduled");
    const totalClientsPending = pendingClients.reduce((acc, curr) => acc + curr.amount, 0);

    // Já recebido este mês
    const totalReceived = clientsList.filter(c => c.status === "paid").reduce((acc, curr) => acc + curr.amount, 0);

    return {
      totalClientsBilledMonth,
      totalAiToPay,
      aiCount: pendingAi.length,
      totalClientsPending,
      clientsPendingCount: pendingClients.length,
      totalReceived
    };
  }, [saasList, clientsList]);

  // Format Architectural Date Block helper
  const parseDate = (dateStr: string) => {
    const parts = dateStr.split("-");
    const monthIdx = parseInt(parts[1] || "9", 10) - 1;
    const monthNames = ["JAN.", "FEV.", "MAR.", "ABR.", "MAI.", "JUN.", "JUL.", "AGO.", "SET.", "OUT.", "NOV.", "DEZ."];
    const monthLabel = monthNames[monthIdx] || "SET.";
    const dayNum = parts[2] || "01";
    return { monthLabel, dayNum };
  };

  return (
    <div className="w-full h-full max-w-[1580px] mx-auto flex flex-col gap-6 relative z-10 px-2 sm:px-4 pb-12">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-[#0d121d] border border-white/20 rounded-xl shadow-2xl backdrop-blur-xl text-white font-sans text-xs"
            style={{ borderColor: `${accentColor.hex}50` }}
          >
            <CheckCircle2 size={16} style={{ color: accentColor.hex }} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. HEADER & GLOBAL ACTIONS */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-1">
        <div className="flex items-center gap-3">
          {onBackToOverview && (
            <button
              onClick={onBackToOverview}
              className="group flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
              title="Voltar ao Painel Principal"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-sm"
                style={{
                  backgroundColor: `${accentColor.hex}15`,
                  color: accentColor.hex,
                  border: `1px solid ${accentColor.hex}30`
                }}
              >
                TESOURARIA
              </span>
              <h1 className="text-xl md:text-2xl font-sans font-bold text-white tracking-tight uppercase">
                PAGAMENTOS & CONTROLO FINANCEIRO
              </h1>
            </div>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 self-stretch md:self-auto">
          <button
            onClick={() => triggerToast("Relatório de tesouraria exportado em CSV/PDF.")}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/75 hover:text-white text-xs font-sans border border-white/10 transition-all cursor-pointer"
          >
            <Download size={13} />
            <span>Exportar</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            style={{
              backgroundColor: accentColor.hex,
              color: "#050609",
              boxShadow: `0 0 14px ${accentColor.glow}`
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs font-sans transition-all cursor-pointer hover:brightness-110 active:scale-95 shadow-md"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>Novo Pagamento</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PAINEL GERAL (EXACT 3 EXECUTIVE METRICS REQUESTED BY USER) */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        
        {/* Metric 1: Montante que fizemos este mês */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              Montante que fizemos este mês
            </span>
            <TrendingUp size={15} className="text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
              € {financialOverview.totalClientsBilledMonth.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-white/40 flex items-center justify-between">
            <span>Já liquidado: € {financialOverview.totalReceived.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}</span>
            <span className="text-emerald-400/80">Faturado em Ago/Set</span>
          </div>
        </div>

        {/* Metric 2: Quanto temos a pagar a estes serviços de AI */}
        <div 
          className="flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] border"
          style={{ borderColor: `${accentColor.hex}30` }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: accentColor.hex }}>
              A Pagar em Serviços de AI
            </span>
            <Bot size={15} style={{ color: accentColor.hex }} />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-white tracking-tight">
              € {financialOverview.totalAiToPay.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-white/40 flex items-center justify-between">
            <span>{financialOverview.aiCount} ferramentas de IA ativas</span>
            <span className="text-white/60">ChatGPT, Midjourney, Claude...</span>
          </div>
        </div>

        {/* Metric 3: Quanto nos falta receber de clientes */}
        <div className="flex flex-col justify-between p-4 rounded-xl bg-white/[0.02] border border-amber-500/25">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400/90 uppercase tracking-wider">
              Falta Receber de Clientes
            </span>
            <Clock size={15} className="text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl lg:text-3xl font-mono font-bold text-amber-300 tracking-tight">
              € {financialOverview.totalClientsPending.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-white/40 flex items-center justify-between">
            <span>{financialOverview.clientsPendingCount} faturas pendentes de liquidação</span>
            <span className="text-amber-400/80">A receber até 15 Set</span>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. TABS & SEARCH CONTROLS */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-white/[0.03] p-1 rounded-xl border border-white/5 self-start">
          <button
            onClick={() => setSelectedTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
              selectedTab === "all"
                ? "bg-white/10 text-white font-bold"
                : "text-white/50 hover:text-white"
            }`}
          >
            Todos ({unifiedLedger.length})
          </button>

          <button
            onClick={() => setSelectedTab("saas")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
              selectedTab === "saas"
                ? "bg-white/10 text-white font-bold"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Bot size={13} style={{ color: accentColor.hex }} />
            <span>Serviços de AI ({saasList.length})</span>
          </button>

          <button
            onClick={() => setSelectedTab("clients")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${
              selectedTab === "clients"
                ? "bg-white/10 text-white font-bold"
                : "text-white/50 hover:text-white"
            }`}
          >
            <Building size={13} className="text-emerald-400" />
            <span>Faturas de Clientes ({clientsList.length})</span>
          </button>
        </div>

        {/* Search & Status Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Filtrar por nome, serviço de AI..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-white/30 text-xs font-sans focus:outline-none focus:border-white/25"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={11} />
              </button>
            )}
          </div>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-sans focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-[#0e1320]">Todos os Estados</option>
            <option value="pending" className="bg-[#0e1320]">Pendentes</option>
            <option value="scheduled" className="bg-[#0e1320]">Agendados</option>
            <option value="paid" className="bg-[#0e1320]">Liquidados / Recebidos</option>
          </select>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. DATE-FIRST ARCHITECTURAL LEDGER TABLE */}
      {/* ========================================================================= */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.01] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans border-collapse">
            
            {/* Table Header */}
            <thead className="bg-white/[0.03] border-b border-white/[0.08] text-white/50 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4 w-[110px]">Data Venc.</th>
                <th className="py-3 px-4 w-[120px]">Tipo</th>
                <th className="py-3 px-4">Serviço de AI / Cliente</th>
                <th className="py-3 px-4">Cargo / Responsável</th>
                <th className="py-3 px-4">Método de Pagamento</th>
                <th className="py-3 px-4 text-right">Montante</th>
                <th className="py-3 px-4 text-center w-[120px]">Estado</th>
                <th className="py-3 px-4 text-right w-[110px]">Ação</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/40 font-mono text-xs">
                    Nenhum registo encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredLedger.map(item => {
                  const isSaas = item.sourceType === "saas";
                  const isPending = item.status === "pending" || item.status === "scheduled";
                  const dateInfo = parseDate(item.paidDate || item.dueDate);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedRow(item)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      {/* 1. Date Stamp Block */}
                      <td className="py-3.5 px-4 font-mono select-none">
                        <div className="flex items-center gap-2.5">
                          <div className="flex flex-col items-center justify-center pr-2.5 border-r border-white/10 min-w-[36px] text-center">
                            <span className="text-[9px] font-mono text-white/40 leading-none uppercase">
                              {dateInfo.monthLabel}
                            </span>
                            <span className="text-base font-mono font-bold text-white leading-tight">
                              {dateInfo.dayNum}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Type Pill */}
                      <td className="py-3.5 px-4">
                        <span 
                          className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold"
                          style={{
                            backgroundColor: isSaas ? `${accentColor.hex}15` : "rgba(16, 185, 129, 0.15)",
                            color: isSaas ? accentColor.hex : "#34d399",
                            border: `1px solid ${isSaas ? `${accentColor.hex}30` : "rgba(16, 185, 129, 0.3)"}`
                          }}
                        >
                          {isSaas ? <Bot size={10} /> : <Building size={10} />}
                          <span>{isSaas ? "SERVIÇO AI" : "CLIENTE"}</span>
                        </span>
                      </td>

                      {/* 3. Title & Subtitle */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col min-w-0 max-w-sm">
                          <span className="font-bold text-white group-hover:text-white text-xs">
                            {item.title}
                          </span>
                          <span className="text-[11px] text-white/40 truncate">
                            {item.subtitle}
                          </span>
                        </div>
                      </td>

                      {/* 4. Role / Contact */}
                      <td className="py-3.5 px-4">
                        <span className="text-white/70 text-[11px] font-sans truncate max-w-[200px] block" title={item.roleOrContact}>
                          {item.roleOrContact}
                        </span>
                      </td>

                      {/* 5. Payment Method */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-white/50">
                        {item.method}
                      </td>

                      {/* 6. Amount */}
                      <td className="py-3.5 px-4 text-right font-mono">
                        <span className="text-sm font-bold text-white">
                          € {item.amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                        </span>
                        {item.taxAmount ? (
                          <span className="block text-[10px] text-white/35">
                            c/ IVA: € {item.totalAmount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                          </span>
                        ) : null}
                      </td>

                      {/* 7. Status Pill */}
                      <td className="py-3.5 px-4 text-center">
                        <span 
                          className={`inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold ${
                            item.status === "paid"
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
                              : item.status === "pending"
                              ? "bg-white/10 border border-white/20 text-white"
                              : "bg-sky-500/15 border border-sky-500/30 text-sky-300"
                          }`}
                        >
                          {item.status === "paid" && <CheckCircle2 size={10} />}
                          {item.status === "paid" ? "LIQUIDADO" : item.status === "pending" ? "PENDENTE" : "AGENDADO"}
                        </span>
                      </td>

                      {/* 8. Action Button */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        {isPending ? (
                          <button
                            onClick={() => handleMarkAsPaid(item)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer hover:brightness-110 active:scale-95"
                            style={{
                              backgroundColor: accentColor.hex,
                              color: "#050609"
                            }}
                          >
                            {isSaas ? "Liquidar" : "Recebido"}
                          </button>
                        ) : (
                          <span className="text-[10px] font-mono text-emerald-400 inline-flex items-center gap-1">
                            <Check size={11} />
                            Concluído
                          </span>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MODAL: REGISTAR NOVO PAGAMENTO */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-2xl bg-[#0e1320] border border-white/15 p-6 shadow-2xl flex flex-col gap-4 text-white"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} style={{ color: accentColor.hex }} />
                  <h3 className="text-base font-sans font-bold text-white">Registar Pagamento</h3>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-white/50 hover:text-white cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setNewType("saas")}
                  className={`py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                    newType === "saas" ? "bg-white/15 text-white font-bold" : "text-white/50 hover:text-white"
                  }`}
                >
                  Serviço de AI
                </button>
                <button
                  type="button"
                  onClick={() => setNewType("client")}
                  className={`py-1.5 rounded-lg text-xs font-sans font-semibold transition-all cursor-pointer ${
                    newType === "client" ? "bg-white/15 text-white font-bold" : "text-white/50 hover:text-white"
                  }`}
                >
                  Fatura de Cliente
                </button>
              </div>

              <form onSubmit={handleAddPayment} className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-white/60 uppercase">
                    {newType === "saas" ? "Nome da Ferramenta de AI (ex: ChatGPT, Claude, Higgsfield)" : "Nome do Cliente (ex: Vivenda Miramar)"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={newType === "saas" ? "ex: Claude Enterprise AI" : "ex: Vivenda Miramar"}
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono text-white/60 uppercase">Valor (€ EUR)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="180.00"
                      value={formAmount}
                      onChange={e => setFormAmount(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-mono text-white/60 uppercase">Data Vencimento</label>
                    <input
                      type="date"
                      required
                      value={formDueDate}
                      onChange={e => setFormDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-white/60 uppercase">
                    {newType === "saas" ? "Cargo Executivo / Acesso" : "Contacto / Marco"}
                  </label>
                  <input
                    type="text"
                    placeholder={newType === "saas" ? "Senior Partner & Brand Architect" : "Dr. Rodrigo Bettencourt (Tranche 2)"}
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-mono text-white/60 uppercase">Método de Pagamento</label>
                  <input
                    type="text"
                    value={formPaymentMethod}
                    onChange={e => setFormPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-sans focus:outline-none focus:border-white/30"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-sans cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: accentColor.hex, color: "#050609" }}
                    className="px-4 py-2 rounded-xl font-bold text-xs font-sans cursor-pointer hover:brightness-110"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. SLIDE-OVER DETAIL DRAWER */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRow(null)}>
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md h-full bg-[#0a0e17] border-l border-white/15 p-6 shadow-2xl flex flex-col justify-between text-white overflow-y-auto"
            >
              <div className="flex flex-col gap-5">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <span 
                      className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm font-semibold"
                      style={{
                        backgroundColor: selectedRow.sourceType === "saas" ? `${accentColor.hex}15` : "rgba(16, 185, 129, 0.15)",
                        color: selectedRow.sourceType === "saas" ? accentColor.hex : "#34d399",
                        border: `1px solid ${selectedRow.sourceType === "saas" ? `${accentColor.hex}30` : "rgba(16, 185, 129, 0.3)"}`
                      }}
                    >
                      {selectedRow.sourceType === "saas" ? "SERVIÇO DE AI" : "FATURA DE CLIENTE"}
                    </span>
                    <h3 className="text-xl font-sans font-bold text-white mt-1.5">{selectedRow.title}</h3>
                    <p className="text-xs text-white/50 font-sans">{selectedRow.subtitle}</p>
                  </div>
                  <button onClick={() => setSelectedRow(null)} className="p-1 text-white/40 hover:text-white cursor-pointer">
                    <X size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-3 text-xs font-sans">
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 font-mono">Data de Vencimento:</span>
                    <span className="font-mono font-bold text-white">{selectedRow.dueDate}</span>
                  </div>

                  {selectedRow.paidDate && (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/40 font-mono">Data de Liquidação:</span>
                      <span className="font-mono text-emerald-400">{selectedRow.paidDate}</span>
                    </div>
                  )}

                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 font-mono">Valor:</span>
                    <span className="font-mono font-bold text-white text-sm">
                      € {selectedRow.amount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  {selectedRow.taxAmount ? (
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-white/40 font-mono">Total c/ IVA (23%):</span>
                      <span className="font-mono text-white/80">
                        € {selectedRow.totalAmount.toLocaleString("pt-PT", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ) : null}

                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 font-mono">Cargo / Contacto:</span>
                    <span className="text-white text-right max-w-[200px]">{selectedRow.roleOrContact}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 font-mono">Método:</span>
                    <span className="font-mono text-white/70 text-right">{selectedRow.method}</span>
                  </div>

                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/40 font-mono">Estado:</span>
                    <span className="font-mono uppercase font-bold" style={{ color: selectedRow.status === "paid" ? "#34d399" : accentColor.hex }}>
                      {selectedRow.status === "paid" ? "CONCLUÍDO" : "PENDENTE"}
                    </span>
                  </div>

                  {selectedRow.notes && (
                    <div className="flex flex-col gap-1 pt-2">
                      <span className="text-white/40 font-mono text-[10px] uppercase">Notas:</span>
                      <p className="text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                        {selectedRow.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
                {selectedRow.status !== "paid" && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedRow)}
                    style={{ backgroundColor: accentColor.hex, color: "#050609" }}
                    className="w-full py-2.5 rounded-xl font-bold text-xs font-sans cursor-pointer hover:brightness-110 shadow-md"
                  >
                    Confirmar Liquidação
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
