/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FolderArchive, 
  Search, 
  UploadCloud, 
  Download, 
  FileText, 
  FileCode, 
  FileSpreadsheet, 
  ShieldCheck, 
  Share2, 
  Eye, 
  Clock, 
  Tag, 
  ArrowLeft, 
  Plus, 
  X, 
  Check, 
  Filter, 
  FileArchive, 
  HardDrive,
  Lock,
  Sparkles
} from "lucide-react";
import { AccentColorOption } from "../../types/settings";

interface DocumentRepositoryScreenProps {
  accentColor?: AccentColorOption;
  onBackToOverview?: () => void;
}

interface VaultDocument {
  id: string;
  title: string;
  description: string;
  category: "Plantas & CAD" | "Contratos & Acordos" | "Relatórios Técnicos" | "Manuais & Compliance" | "Políticas Corporativas";
  extension: "PDF" | "DWG" | "XLSX" | "DOCX" | "ZIP";
  fileSize: string;
  version: string;
  clearance: "Nível 5 Executivo" | "Confidencial" | "Interno" | "Geral";
  author: string;
  updatedAt: string;
  downloadsCount: number;
}

const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: "doc-001",
    title: "Planta_Arquitetonica_Edificio_AXION_Pisos_Gerais_2026.dwg",
    description: "Planta técnica completa dos 4 pisos do edifício, rotas de emergência e sensores IoT.",
    category: "Plantas & CAD",
    extension: "DWG",
    fileSize: "48.2 MB",
    version: "v4.1",
    clearance: "Nível 5 Executivo",
    author: "Nelson Afonso",
    updatedAt: "Hoje às 15:30",
    downloadsCount: 14
  },
  {
    id: "doc-002",
    title: "Contrato_Fornecimento_Energia_Verde_EDP_2026_2029.pdf",
    description: "Acordo trienal de abastecimento 100% fotovoltaico e biomassa com garantia de origem.",
    category: "Contratos & Acordos",
    extension: "PDF",
    fileSize: "3.4 MB",
    version: "v1.0 (Assinado)",
    clearance: "Confidencial",
    author: "Direção Jurídica",
    updatedAt: "Ontem às 11:20",
    downloadsCount: 8
  },
  {
    id: "doc-003",
    title: "Relatorio_Auditoria_Seguranca_FIDO2_Q3_2026.pdf",
    description: "Auditoria independente aos nós biométricos, passkeys NFC e tolerância a intrusão.",
    category: "Relatórios Técnicos",
    extension: "PDF",
    fileSize: "8.9 MB",
    version: "v2.0",
    clearance: "Nível 5 Executivo",
    author: "Nelson Afonso",
    updatedAt: "28 Ago, 18:00",
    downloadsCount: 22
  },
  {
    id: "doc-004",
    title: "Manual_Operacao_Sistemas_Clima_HVAC_Central.docx",
    description: "Guia operacional para parametrização dos controladores de temperatura e humidade.",
    category: "Manuais & Compliance",
    extension: "DOCX",
    fileSize: "12.1 MB",
    version: "v3.2",
    clearance: "Interno",
    author: "Carlos Mendes (Facilities)",
    updatedAt: "26 Ago, 14:15",
    downloadsCount: 35
  },
  {
    id: "doc-005",
    title: "Matriz_Orcamento_Operacional_Consolidado_2026.xlsx",
    description: "Folha de cálculo mestre com dotações de infraestrutura, despesas energéticas e IoT.",
    category: "Contratos & Acordos",
    extension: "XLSX",
    fileSize: "5.6 MB",
    version: "v5.0",
    clearance: "Nível 5 Executivo",
    author: "Direção Financeira",
    updatedAt: "25 Ago, 09:40",
    downloadsCount: 19
  },
  {
    id: "doc-006",
    title: "Politica_Privacidade_e_Protecao_Dados_Biometricos.pdf",
    description: "Conformidade com RGPD e standards internacionais de encriptação biométrica zero-knowledge.",
    category: "Políticas Corporativas",
    extension: "PDF",
    fileSize: "1.8 MB",
    version: "v1.4",
    clearance: "Geral",
    author: "Compliance & DPO",
    updatedAt: "20 Ago, 16:00",
    downloadsCount: 42
  },
  {
    id: "doc-007",
    title: "Firmware_Pacote_OTA_Beacons_UWB_Build890.zip",
    description: "Binários assinados e chaves criptográficas para atualização dos 32 nós de presença.",
    category: "Relatórios Técnicos",
    extension: "ZIP",
    fileSize: "124.5 MB",
    version: "v8.9.0",
    clearance: "Nível 5 Executivo",
    author: "Nelson Afonso",
    updatedAt: "18 Ago, 22:10",
    downloadsCount: 6
  }
];

const CATEGORIES = [
  "Todos os Ficheiros",
  "Plantas & CAD",
  "Contratos & Acordos",
  "Relatórios Técnicos",
  "Manuais & Compliance",
  "Políticas Corporativas"
];

export default function DocumentRepositoryScreen({
  accentColor = {
    id: "axion-blue",
    name: "AXION Blue",
    hex: "#00f0ff",
    secondary: "#0284c7",
    glow: "rgba(0, 240, 255, 0.4)"
  },
  onBackToOverview
}: DocumentRepositoryScreenProps) {
  const [documents, setDocuments] = useState<VaultDocument[]>(INITIAL_DOCUMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos os Ficheiros");
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // New Doc Form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<VaultDocument["category"]>("Relatórios Técnicos");
  const [newClearance, setNewClearance] = useState<VaultDocument["clearance"]>("Nível 5 Executivo");

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === "Todos os Ficheiros" || doc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [documents, searchQuery, selectedCategory]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setUploadProgress(20);
    setTimeout(() => setUploadProgress(60), 400);
    setTimeout(() => {
      setUploadProgress(100);
      const newDoc: VaultDocument = {
        id: `doc-${Date.now()}`,
        title: newTitle.endsWith(".pdf") ? newTitle : `${newTitle}.pdf`,
        description: newDesc || "Documento carregado no repositório digital AXION.",
        category: newCategory,
        extension: "PDF",
        fileSize: "4.2 MB",
        version: "v1.0",
        clearance: newClearance,
        author: "Nelson Afonso",
        updatedAt: "Agora mesmo",
        downloadsCount: 0
      };

      setDocuments([newDoc, ...documents]);
      setTimeout(() => {
        setUploadProgress(null);
        setIsUploadModalOpen(false);
        setNewTitle("");
        setNewDesc("");
      }, 300);
    }, 900);
  };

  const getExtensionColor = (ext: VaultDocument["extension"]) => {
    switch (ext) {
      case "PDF": return "#ef4444";
      case "DWG": return "#00f0ff";
      case "XLSX": return "#10b981";
      case "DOCX": return "#3b82f6";
      case "ZIP": return "#f59e0b";
      default: return "#ffffff";
    }
  };

  const getExtensionIcon = (ext: VaultDocument["extension"]) => {
    switch (ext) {
      case "XLSX": return FileSpreadsheet;
      case "DWG": return FileCode;
      case "ZIP": return FileArchive;
      default: return FileText;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col py-6 pb-28 relative z-10 select-none">
      
      {/* ================= TOP EDITORIAL HEADER ================= */}
      <div className="flex flex-col gap-6 pb-6 border-b border-white/10">
        
        {/* Top bar with back action and upload */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToOverview && (
              <button
                type="button"
                onClick={onBackToOverview}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-2 text-xs font-sans"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Voltar ao Painel</span>
              </button>
            )}
            <span className="text-[11px] font-mono tracking-widest text-white/40 uppercase">
              AXION // ENCRYPTED CLOUD VAULT & REPOSITORY
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            style={{
              backgroundColor: accentColor.hex,
              color: "#050609",
              boxShadow: `0 0 20px ${accentColor.glow}`
            }}
            className="px-4 py-2 rounded-xl font-bold text-xs font-sans transition-all cursor-pointer hover:brightness-110 flex items-center gap-2"
          >
            <UploadCloud size={15} />
            <span>Carregar Documento</span>
          </button>
        </div>

        {/* Title, Storage info & Telemetry */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
          
          <motion.div 
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-sans font-bold text-white tracking-tight uppercase">
                DEPÓSITO DE DOCUMENTOS, <span className="text-white/70 font-normal">VAULT DIGITAL</span>
              </h1>
              
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold">
                <ShieldCheck size={12} className="text-emerald-400" />
                ENCRIPTAÇÃO AES-256
              </span>

              <span className="text-[10px] font-mono text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                VAULT // IMMUTABLE
              </span>
            </div>

            <p className="text-xs md:text-sm text-white/70 font-sans flex items-center gap-2 flex-wrap">
              <HardDrive size={14} className="text-white/40 shrink-0" />
              <span>24.8 GB de 100 GB em uso</span>
              <span className="text-white/30">•</span>
              <span className="text-white/50">{documents.length} ficheiros indexados</span>
              <span className="text-white/30">•</span>
              <span className="text-white/50">Auditoria diária ativa</span>
            </p>
          </motion.div>

          {/* Quick Storage Meter */}
          <div className="flex flex-col gap-1.5 min-w-[220px] shrink-0 border-l border-white/10 pl-6 hidden lg:flex">
            <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
              <span>Capacidade Cloud</span>
              <span className="text-white font-bold">24.8%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700"
                style={{ width: "24.8%", backgroundColor: accentColor.hex }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* ================= SEARCH & CATEGORIES TOOLBAR ================= */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-b border-white/10">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Pesquisar documento, planta, contrato ou autor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-white text-xs font-sans placeholder:text-white/30 focus:outline-none focus:border-[#00f0ff] transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white/15 text-white font-semibold border border-white/20"
                    : "text-white/50 hover:text-white hover:bg-white/[0.03]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* ================= DOCUMENT LIST (CLEAN OPEN ROWS) ================= */}
      <div className="flex flex-col divide-y divide-white/5 pt-2">
        {filteredDocs.length === 0 ? (
          <div className="py-16 text-center text-white/40 text-xs">
            Nenhum documento corresponde aos critérios de pesquisa.
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const ExtIcon = getExtensionIcon(doc.extension);
            const extColor = getExtensionColor(doc.extension);

            return (
              <div
                key={doc.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors group"
              >
                {/* Left info */}
                <div className="flex items-start gap-4 flex-1">
                  <div 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5"
                    style={{ borderColor: `${extColor}40` }}
                  >
                    <ExtIcon size={18} style={{ color: extColor }} />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-semibold text-white font-sans group-hover:text-[#00f0ff] transition-colors cursor-pointer" onClick={() => setPreviewDoc(doc)}>
                        {doc.title}
                      </span>
                      <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-0.2 rounded">
                        {doc.version}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                        doc.clearance === "Nível 5 Executivo"
                          ? "text-purple-400 bg-purple-400/10 border-purple-400/20"
                          : doc.clearance === "Confidencial"
                          ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
                          : "text-white/60 bg-white/5 border-white/10"
                      }`}>
                        {doc.clearance}
                      </span>
                    </div>

                    <p className="text-[11px] text-white/50 font-sans line-clamp-1">
                      {doc.description}
                    </p>

                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/40 mt-0.5">
                      <span>{doc.category}</span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                      <span>•</span>
                      <span>Por {doc.author}</span>
                      <span>•</span>
                      <span>{doc.updatedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(doc)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white text-xs font-sans transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Eye size={13} />
                    <span>Detalhes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`A transferir ${doc.title}...`)}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Transferir Ficheiro"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ================= DOCUMENT PREVIEW MODAL ================= */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0c1017] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
                    style={{ color: getExtensionColor(previewDoc.extension) }}
                  >
                    {React.createElement(getExtensionIcon(previewDoc.extension), { size: 20 })}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-white font-sans line-clamp-1">
                      {previewDoc.title}
                    </h3>
                    <span className="text-[11px] font-mono text-white/50">
                      {previewDoc.fileSize} • Versão {previewDoc.version}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-xs font-sans">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                  <span className="text-[10px] font-mono text-white/40 uppercase">Descrição</span>
                  <p className="text-white/80 leading-relaxed">{previewDoc.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Classificação</span>
                    <span className="font-semibold text-white">{previewDoc.clearance}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Autor</span>
                    <span className="font-semibold text-white">{previewDoc.author}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Última Modificação</span>
                    <span className="font-mono text-white/80">{previewDoc.updatedAt}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Transferências</span>
                    <span className="font-mono text-white/80">{previewDoc.downloadsCount} acessos</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  Hash SHA-256 Verificado
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      alert(`A transferir ${previewDoc.title}...`);
                      setPreviewDoc(null);
                    }}
                    style={{
                      backgroundColor: accentColor.hex,
                      color: "#050609"
                    }}
                    className="px-4 py-2 rounded-xl font-bold text-xs hover:brightness-110 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Transferir Ficheiro</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= UPLOAD MODAL ================= */}
      <AnimatePresence>
        {isUploadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#0c1017] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col gap-5"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <UploadCloud size={18} style={{ color: accentColor.hex }} />
                  <h3 className="text-base font-bold text-white font-sans tracking-tight uppercase">
                    CARREGAR FICHEIRO, <span className="text-white/70 font-normal">ENCRIPTAÇÃO VAULT</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4 text-xs font-sans">
                {/* Drag and Drop Zone */}
                <div className="border-2 border-dashed border-white/15 hover:border-white/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-white/[0.02] cursor-pointer transition-colors">
                  <UploadCloud size={28} className="text-white/40" />
                  <span className="text-xs font-semibold text-white/90">
                    Arraste o ficheiro ou clique para selecionar
                  </span>
                  <span className="text-[10px] font-mono text-white/40">
                    PDF, DWG, XLSX, DOCX, ZIP até 250 MB
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/80 font-medium">Nome do Documento / Ficheiro *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Relatorio_Trimestral_Energia_Q3.pdf"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/80 font-medium">Categoria</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[#121824] border border-white/10 text-white focus:outline-none focus:border-[#00f0ff]"
                    >
                      <option value="Plantas & CAD">Plantas & CAD</option>
                      <option value="Contratos & Acordos">Contratos & Acordos</option>
                      <option value="Relatórios Técnicos">Relatórios Técnicos</option>
                      <option value="Manuais & Compliance">Manuais & Compliance</option>
                      <option value="Políticas Corporativas">Políticas Corporativas</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/80 font-medium">Classificação</label>
                    <select
                      value={newClearance}
                      onChange={(e) => setNewClearance(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-[#121824] border border-white/10 text-white focus:outline-none focus:border-[#00f0ff]"
                    >
                      <option value="Nível 5 Executivo">Nível 5 Executivo</option>
                      <option value="Confidencial">Confidencial</option>
                      <option value="Interno">Interno</option>
                      <option value="Geral">Geral</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-white/80 font-medium">Descrição Breve</label>
                  <textarea
                    rows={2}
                    placeholder="Descrição do conteúdo e finalidade..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white focus:outline-none focus:border-[#00f0ff] resize-none"
                  />
                </div>

                {uploadProgress !== null && (
                  <div className="flex flex-col gap-1.5 pt-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-white/60">
                      <span>A encriptar e transferir...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-[#00f0ff] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-white/60 hover:text-white text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={uploadProgress !== null}
                    style={{
                      backgroundColor: accentColor.hex,
                      color: "#050609"
                    }}
                    className="px-5 py-2 rounded-xl font-bold text-xs hover:brightness-110 transition-all cursor-pointer"
                  >
                    {uploadProgress !== null ? "A Enviar..." : "Guardar no Depósito"}
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
