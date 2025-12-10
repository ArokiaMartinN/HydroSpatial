/**
 * AIAssistant.tsx
 * Super UI: attachments, drag/drop, previews, search (debounced + highlight + jump),
 * command palette, improved visuals, keyboard shortcuts, accessible controls.
 *
 * Requirements:
 * - React + TypeScript
 * - Tailwind CSS
 * - framer-motion, lucide-react, html-react-parser
 *
 * Notes:
 * - Attachment previews use URL.createObjectURL (local preview). For persistent hosting, replace with server upload.
 * - Search is substring-based; switch to fuse.js for fuzzy search if desired.
 */

import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import parse from "html-react-parser";
import {
  Bot, Send, Plus, Trash2, Copy, Loader2,
  MessageSquare, MoreHorizontal, Sparkles, Menu, X,
  Zap, History, Smile, Paperclip, CornerDownLeft, Search
} from "lucide-react";
import { ThemeContext } from "../App";

/* ------------------------- THEME ------------------------- */
const themeConfig = {
  light: {
    bg: "bg-gradient-to-b from-[#fbfdff] to-[#f1f7fb]",
    sidebar: "bg-white/70 backdrop-blur-xl border-r border-slate-200/60 shadow-md",
    textMain: "text-slate-800",
    textMuted: "text-slate-500",
    accentSolid: "bg-blue-600",
    accentHover: "hover:brightness-95",
    botMsg: "bg-white/90 text-slate-800",
    userMsg: "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg",
    inputBg: "bg-white/95 border border-slate-100 shadow-lg",
    card: "bg-white border border-slate-100 shadow-sm hover:shadow-md",
  },
  dark: {
    bg: "bg-gradient-to-b from-[#071018] to-[#0f1117]",
    sidebar: "bg-[#0a0f14]/70 backdrop-blur-xl border-r border-white/5 shadow-lg",
    textMain: "text-slate-100",
    textMuted: "text-slate-400",
    accentSolid: "bg-blue-600",
    accentHover: "hover:brightness-110",
    botMsg: "bg-[#0f1724]/80 text-slate-200",
    userMsg: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-2xl",
    inputBg: "bg-[#0f1724] shadow-2xl border border-white/5",
    card: "bg-[#0f1724] border border-white/5 hover:border-blue-500/30",
  },
};

type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // objectURL or uploaded URL
};

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
  attachments?: Attachment[];
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
};

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB

/* ------------------------- HELPERS ------------------------ */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const highlightText = (text: string, query: string) => {
  if (!query) return escapeHtml(text);
  try {
    const safeQuery = escapeRegExp(query);
    const re = new RegExp(`(${safeQuery})`, "ig");
    const escaped = escapeHtml(text);
    return escaped.replace(re, '<mark class="bg-yellow-300/30 rounded px-1">$1</mark>');
  } catch {
    return escapeHtml(text);
  }
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
};

/* ------------------------- API (fallback-safe) ------------- */
const getBotResponse = async (userMessage: string, history: Message[]): Promise<string> => {
  try {
    const resp = await fetch("http://127.0.0.1:5000/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: userMessage, history }),
    });
    if (!resp.ok) throw new Error("Network");
    const data = await resp.json();
    if (typeof data.answer === "string") return data.answer;
    if (typeof data === "string") return data;
    return JSON.stringify(data);
  } catch {
    return `<p><strong>Offline</strong>: couldn't contact the API. Simulated reply for <em>${escapeHtml(userMessage)}</em></p>`;
  }
};

/* ------------------------- SUB-COMPONENTS ------------------ */
const SidebarItem: React.FC<{
  active: boolean;
  title: string;
  onClick: () => void;
  onDelete: () => void;
  theme: any;
}> = ({ active, title, onClick, onDelete, theme }) => (
  <div
    onClick={onClick}
    className={`group flex items-center gap-3 px-3 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-200
      ${active ? "bg-gradient-to-r from-blue-50 to-white text-blue-600 shadow-inner" : `${theme.textMain} hover:bg-slate-100/70`}`}
  >
    <MessageSquare size={16} className={active ? "opacity-100" : "opacity-60"} />
    <span className="flex-1 truncate text-sm font-medium">{title}</span>
    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 hover:bg-red-100 rounded-md text-red-500">
        <Trash2 size={12} />
      </button>
    </div>
  </div>
);

/* ------------------------- MAIN COMPONENT ----------------- */
const AIAssistant: React.FC = () => {
  const { theme: globalTheme } = useContext(ThemeContext);
  const t = globalTheme === "dark" ? themeConfig.dark : themeConfig.light;

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const s = localStorage.getItem("hydro-chat-history");
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // search
  const [sidebarFilter, setSidebarFilter] = useState("");
  const [globalSearchInput, setGlobalSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);

  // attachments pending
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);

  // message refs for scrolling to a match
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    try { localStorage.setItem("hydro-chat-history", JSON.stringify(conversations)); } catch {}
  }, [conversations]);

  // debounce search
  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(globalSearchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [globalSearchInput]);

  // auto-resize input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 220) + "px";
    }
  }, [input]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((p) => !p);
      }
      if (e.key === "Escape") {
        setPaletteOpen(false);
        setGlobalSearchInput("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // drag/drop attachment support
  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      el.classList.add("ring-2", "ring-blue-400/60");
    };
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("ring-2", "ring-blue-400/60");
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      el.classList.remove("ring-2", "ring-blue-400/60");
      if (e.dataTransfer?.files) handleFiles(e.dataTransfer.files);
    };
    el.addEventListener("dragover", onDragOver);
    el.addEventListener("dragleave", onDragLeave);
    el.addEventListener("drop", onDrop);
    return () => {
      el.removeEventListener("dragover", onDragOver);
      el.removeEventListener("dragleave", onDragLeave);
      el.removeEventListener("drop", onDrop);
    };
  }, []);

  // filtered sidebar conversations
  const filteredConversations = useMemo(() => {
    const q = sidebarFilter.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [conversations, sidebarFilter]);

  // search results for global search
  const searchResults = useMemo(() => {
    const q = debouncedSearch;
    if (!q) return [];
    const out: {
      convoId: string;
      convoTitle: string;
      titleMatches: number;
      messageMatches: number;
      sampleMessageId?: string;
      sampleSnippet?: string;
    }[] = [];

    const qLower = q.toLowerCase();

    for (const c of conversations) {
      let titleMatches = c.title.toLowerCase().includes(qLower) ? 1 : 0;
      let messageMatches = 0;
      let sampleMessageId: string | undefined;
      let sampleSnippet: string | undefined;

      for (const m of c.messages) {
        if (m.text.toLowerCase().includes(qLower)) {
          messageMatches++;
          if (!sampleMessageId) {
            sampleMessageId = m.id;
            const txt = m.text.replace(/\n+/g, " ");
            const idx = txt.toLowerCase().indexOf(qLower);
            const start = Math.max(0, idx - 30);
            const end = Math.min(txt.length, idx + qLower.length + 30);
            sampleSnippet = (start > 0 ? "…" : "") + txt.slice(start, end) + (end < txt.length ? "…" : "");
          }
        }
      }

      if (titleMatches || messageMatches) {
        out.push({ convoId: c.id, convoTitle: c.title, titleMatches, messageMatches, sampleMessageId, sampleSnippet });
      }
    }

    out.sort((a, b) => {
      const cm = (b.messageMatches - a.messageMatches) || (b.titleMatches - a.titleMatches);
      if (cm !== 0) return cm;
      const ca = conversations.find((x) => x.id === a.convoId);
      const cb = conversations.find((x) => x.id === b.convoId);
      return (cb?.lastModified || 0) - (ca?.lastModified || 0);
    });

    return out;
  }, [conversations, debouncedSearch]);

  // register message ref (for scrolling)
  const registerMessageRef = (messageId: string, el: HTMLDivElement | null) => {
    if (el) messageRefs.current[messageId] = el;
    else delete messageRefs.current[messageId];
  };

  // file handling
  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const next: Attachment[] = [];
    for (const f of Array.from(files)) {
      if (f.size > MAX_FILE_SIZE) {
        alert(`${f.name} is larger than ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)} MB and was skipped.`);
        continue;
      }
      const id = `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const url = URL.createObjectURL(f);
      next.push({ id, name: f.name, size: f.size, type: f.type, url });
    }
    if (next.length > 0) setPendingAttachments((p) => [...p, ...next]);
  };

  const onAttachClick = () => {
    if (!fileRef.current) return;
    fileRef.current.value = "";
    fileRef.current.click();
  };
  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files);

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((p) => {
      const remove = p.find((x) => x.id === id);
      try { if (remove) URL.revokeObjectURL(remove.url); } catch {}
      return p.filter((x) => x.id !== id);
    });
  };

  // send message (includes pending attachments)
  const handleSend = async (msg = input) => {
    if (!msg.trim() && pendingAttachments.length === 0) return;
    if (isTyping) return;

    let convoId = activeConversationId;
    if (!convoId) {
      convoId = Date.now().toString();
      const conv: Conversation = { id: convoId, title: msg.slice(0, 60) || "New Analysis", messages: [], lastModified: Date.now() };
      setConversations((p) => [conv, ...p]);
      setActiveConversationId(convoId);
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: msg,
      isBot: false,
      timestamp: Date.now(),
      attachments: pendingAttachments.map((a) => ({ ...a })), // attach local previews
    };

    setConversations((p) => p.map((c) => (c.id === convoId ? { ...c, messages: [...c.messages, userMsg], lastModified: Date.now() } : c)));
    setInput("");
    setPendingAttachments([]);
    setIsTyping(true);

    // Note: if you want server uploads, perform them here and update message attachments with server URLs

    const botText = await getBotResponse(msg, []);
    const botMsg: Message = { id: `b-${Date.now()}`, text: botText, isBot: true, timestamp: Date.now() };
    setConversations((p) => p.map((c) => (c.id === convoId ? { ...c, messages: [...c.messages, botMsg], lastModified: Date.now() } : c)));
    setIsTyping(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  const newChat = () => {
    setActiveConversationId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 120);
  };

  const openSearchResult = (convoId: string, messageId?: string) => {
    setActiveConversationId(convoId);
    setSidebarOpen(true);
    setTimeout(() => {
      if (messageId) {
        const el = messageRefs.current[messageId];
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 160);
  };

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  const activeMessages = useMemo(() => conversations.find((c) => c.id === activeConversationId)?.messages || [], [conversations, activeConversationId]);

  /* ------------------------- RENDER ------------------------- */
  return (
    <div className={`flex h-[calc(100dvh-4rem)] overflow-hidden ${t.bg} font-sans text-sm`}>
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside initial={{ x: -320, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -320, opacity: 0 }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className={`${t.sidebar} z-40 w-[320px] flex flex-col`}>
            <div className="px-5 h-16 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg text-white"><Bot size={18} /></div>
              <div>
                <div className={`font-bold text-lg ${t.textMain}`}>HydroAI</div>
                <div className="text-xs text-slate-400">Hydrology workspace</div>
              </div>
              <button className="ml-auto lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X /></button>
            </div>

            <div className="px-4">
              <button onClick={newChat} className={`w-full rounded-2xl py-3 px-4 flex items-center gap-3 ${t.inputBg} transition`}>
                <Plus size={18} className="text-slate-800" />
                <span className="font-semibold">New Analysis</span>
              </button>
            </div>

            {/* quick filter */}
            <div className="px-4 mt-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-white/50 dark:bg-white/3">
                <Search size={16} />
                <input value={sidebarFilter} onChange={(e) => setSidebarFilter(e.target.value)} placeholder="Filter history" className="flex-1 bg-transparent outline-none" />
                <button onClick={() => setSidebarFilter("")}><X size={14} /></button>
              </div>
            </div>

            <div className="px-4 mt-4 text-xs font-bold uppercase opacity-50">History</div>

            <div className="flex-1 overflow-y-auto px-2 py-2">
              {filteredConversations.length === 0 ? (
                <div className="px-4 py-6 text-center text-slate-500">No conversations yet</div>
              ) : (
                filteredConversations.map((c) => (
                  <SidebarItem key={c.id} theme={t} title={c.title} active={activeConversationId === c.id} onClick={() => { setActiveConversationId(c.id); if (window.innerWidth < 1024) setSidebarOpen(false); }} onDelete={() => setConversations((p) => p.filter((x) => x.id !== c.id))} />
                ))
              )}
            </div>

            <div className="px-4 py-4 border-t border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">JS</div>
                <div className="flex-1 min-w-0">
                  <div className={`${t.textMain} font-medium truncate`}>Jane Scientist</div>
                  <div className="text-xs text-slate-400 truncate">Pro Plan • Manage</div>
                </div>
                <MoreHorizontal className="text-slate-400" />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* overlay for mobile */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg"><Menu /></button>}
            <h2 className={`${t.textMain} font-medium`}>{activeConversationId ? "Analysis Session" : "Overview"}</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input value={globalSearchInput} onChange={(e) => setGlobalSearchInput(e.target.value)} placeholder="Search messages & titles (global)" className="rounded-lg px-3 py-2 w-72 bg-white/90 dark:bg-[#0f1724] outline-none" />
              {debouncedSearch && <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">{searchResults.length} results</div>}
            </div>

            <div className="hidden md:block text-xs text-slate-400">Tip: press <kbd className="px-1 bg-white/10 rounded">⌘/Ctrl</kbd> + <kbd className="px-1 bg-white/10 rounded">K</kbd></div>
            <button className="p-2 rounded-lg text-slate-400"><MoreHorizontal /></button>
          </div>
        </header>

        {/* search results dropdown */}
        <AnimatePresence>
          {debouncedSearch && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="absolute left-1/2 -translate-x-1/2 top-16 z-40 w-[min(980px,94%)]">
              <div className="bg-white/95 dark:bg-[#071018]/90 backdrop-blur rounded-xl shadow-xl border border-white/10 p-3 max-h-60 overflow-auto">
                {searchResults.length === 0 ? (
                  <div className="text-sm text-slate-500 p-2">No results for “{debouncedSearch}”</div>
                ) : (
                  searchResults.map((r) => (
                    <div key={r.convoId} className="p-2 hover:bg-black/5 rounded cursor-pointer flex gap-3 items-start" onClick={() => openSearchResult(r.convoId, r.sampleMessageId)}>
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center text-blue-600">
                        <MessageSquare />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium truncate">{parse(highlightText(r.convoTitle, debouncedSearch))}</div>
                          <div className="ml-auto text-xs text-slate-400">{r.messageMatches} messages</div>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{r.sampleSnippet ? parse(highlightText(r.sampleSnippet, debouncedSearch)) : ""}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat area (drop target) */}
        <div ref={dropRef} className="flex-1 overflow-y-auto px-4 lg:px-8 pb-36 pt-4">
          {!activeConversationId ? (
            <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center -mt-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 px-4">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-3xl shadow-2xl flex items-center justify-center mb-4">
                  <Sparkles size={42} className="text-white" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-white">Welcome back, Jane</h1>
                <p className="text-lg max-w-xl mx-auto text-slate-300">Ask HydroAI to analyze hydrological data, simulate scenarios, or generate a report.</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-3xl">
                <div className={`${t.card} p-4 rounded-2xl`}>
                  <h3 className="font-semibold">Trend Analysis</h3>
                  <p className="text-sm text-slate-500 mt-2">Analyze groundwater over time</p>
                  <button onClick={() => handleSend("Analyze groundwater levels in District 4")} className="mt-3 px-3 py-2 rounded bg-blue-600 text-white">Run</button>
                </div>
                <div className={`${t.card} p-4 rounded-2xl`}>
                  <h3 className="font-semibold">Historical Report</h3>
                  <p className="text-sm text-slate-500 mt-2">Compare current rainfall vs 2010</p>
                  <button onClick={() => handleSend("Compare current rainfall vs 2010 benchmarks")} className="mt-3 px-3 py-2 rounded bg-blue-600 text-white">Run</button>
                </div>
                <div className={`${t.card} p-4 rounded-2xl`}>
                  <h3 className="font-semibold">Forecast</h3>
                  <p className="text-sm text-slate-500 mt-2">Forecast reservoir capacity for next summer</p>
                  <button onClick={() => handleSend("Forecast reservoir capacity for next summer")} className="mt-3 px-3 py-2 rounded bg-blue-600 text-white">Run</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {activeMessages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-4 ${msg.isBot ? "" : "flex-row-reverse"} group`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mt-1 ${msg.isBot ? "bg-gradient-to-br from-teal-500 to-blue-600 text-white" : "bg-slate-200 text-slate-800"}`}>
                    {msg.isBot ? <Bot /> : <div className="text-xs font-bold">YOU</div>}
                  </div>

                  <div className="relative max-w-[85%] lg:max-w-[75%]">
                    <div ref={(el) => registerMessageRef(msg.id, el)} className={`${msg.isBot ? t.botMsg : t.userMsg} rounded-2xl px-4 py-3 shadow-sm`}>
                      <div className="prose prose-sm max-w-none break-words text-sm">
                        {debouncedSearch ? parse(highlightText(msg.text, debouncedSearch)) : parse(msg.text)}
                      </div>

                      {/* attachments */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.attachments.map((att) => (
                            <div key={att.id} className="border rounded p-2 bg-white/60">
                              {att.type.startsWith("image/") ? (
                                <img src={att.url} alt={att.name} className="w-full object-contain rounded max-h-44" />
                              ) : (
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="font-medium text-sm truncate">{att.name}</div>
                                    <div className="text-xs text-slate-500">{(att.size / 1024).toFixed(0)} KB</div>
                                  </div>
                                  <a className="ml-3 px-2 py-1 bg-blue-600 text-white rounded text-xs" href={att.url} download={att.name}>Download</a>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity items-center text-xs">
                      <button onClick={() => copyToClipboard(msg.text)} className="p-1 rounded-md hover:bg-black/5" title="Copy"><Copy size={14} /></button>
                      <button className="p-1 rounded-md hover:bg-black/5" title="Reply"><CornerDownLeft size={14} /></button>
                      <button className="p-1 rounded-md hover:bg-black/5" title="React"><Smile size={14} /></button>
                      <span className="text-[11px] text-slate-400 ml-auto">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white">
                    <Loader2 className="animate-spin" />
                  </div>
                  <div className="text-sm text-slate-400">HydroAI is thinking...</div>
                </motion.div>
              )}

              <div ref={chatEndRef} className="h-6" />
            </div>
          )}
        </div>

        {/* Floating composer */}
        <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-30">
          <div className={`${t.inputBg} w-full max-w-3xl rounded-2xl p-3`}>
            {/* pending attachment chips */}
            {pendingAttachments.length > 0 && (
              <div className="mb-2 flex gap-2 flex-wrap">
                {pendingAttachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-2 bg-white/70 px-3 py-1 rounded-full">
                    <div className="text-xs font-medium truncate max-w-[200px]">{att.name}</div>
                    <div className="text-xs text-slate-500">{(att.size / 1024).toFixed(0)} KB</div>
                    <button onClick={() => removePendingAttachment(att.id)} className="p-1"><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-3">
              <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} placeholder="Ask HydroAI anything... (Shift+Enter for newline)" rows={1} className="flex-1 bg-transparent outline-none resize-none px-2 py-2 text-sm" />

              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <button title="Attach" onClick={onAttachClick} className="p-2 rounded-xl hover:bg-black/5"><Paperclip /></button>
                  <button title="Emoji" className="p-2 rounded-xl hover:bg-black/5"><Smile /></button>
                </div>

                <div>
                  <button onClick={() => handleSend()} disabled={!input.trim() && pendingAttachments.length === 0} className={`px-4 py-2 rounded-xl ${(!input.trim() && pendingAttachments.length === 0) ? "bg-slate-200 text-slate-400" : "bg-blue-600 text-white"}`}>
                    {isTyping ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center px-2 mt-2 text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Paperclip size={12} /> Attach</span>
                <span className="flex items-center gap-1"><Smile size={12} /> Emoji</span>
              </div>
              <div className="text-[11px] opacity-60">Press <kbd className="px-1 bg-white/10 rounded">Enter</kbd> to send</div>
            </div>

            {/* hidden file input */}
            <input ref={fileRef} type="file" hidden multiple onChange={onFileInputChange} />
          </div>
        </div>

        <div className={`absolute bottom-1 w-full text-center text-[10px] ${t.textMuted} opacity-60`}>HydroAI generated content may be inaccurate. Verify important information.</div>
      </main>

      {/* Command Palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.12 }} className="fixed inset-0 z-50 flex items-start justify-center pt-24 pointer-events-none">
            <div className="pointer-events-auto w-[min(720px,92%)] bg-white/90 dark:bg-[#071018]/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10">
              <div className="p-3">
                <input autoFocus value={globalSearchInput} onChange={(e) => setGlobalSearchInput(e.target.value)} placeholder="Search commands, actions, or history..." className="w-full bg-transparent outline-none text-lg px-2 py-2" />
                <div className="max-h-56 overflow-y-auto mt-2">
                  <button onClick={() => { handleSend("Analyze groundwater levels in District 4"); setPaletteOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-black/5 flex items-center gap-3"><Zap /><div><div className="font-medium">Trend Analysis</div><div className="text-xs text-slate-400">Analyze groundwater levels</div></div></button>
                  <button onClick={() => { handleSend("Compare current rainfall vs 2010 benchmarks"); setPaletteOpen(false); }} className="w-full text-left px-3 py-2 rounded hover:bg-black/5 flex items-center gap-3"><History /><div><div className="font-medium">Historical Report</div><div className="text-xs text-slate-400">Compare benchmarks</div></div></button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* styles */}
      <style>{`
        .prose img { max-width: 100%; height: auto; }
        mark { background: rgba(250,204,21,0.25); padding: 0 2px; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${globalTheme === "light" ? "#cbd5e1" : "#24303a"}; border-radius: 20px; }
        kbd { background: rgba(255,255,255,0.04); padding: 2px 6px; border-radius: 6px; }
      `}</style>
    </div>
  );
};

export default AIAssistant;
