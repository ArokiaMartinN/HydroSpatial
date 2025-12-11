import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import parse from "html-react-parser";
import {
  Bot, Send, Plus, Trash2, Copy,
  MessageSquare, MoreHorizontal, Sparkles, Menu, X,
  Zap, BarChart3, FileText, Settings, ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeContext } from "../App"; 

/* ------------------------- UTILS ------------------------- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// IMPROVED MARKDOWN PARSER
// Handles the specific "* Observation:" format with better spacing
const parseMarkdown = (text: string) => {
  let formatted = text
    // 1. Handle " * Key:" patterns by adding a line break and bolding
    // Added <br/> before the strong tag to ensure it starts on a new line visually
    .replace(/\* (.*?):/g, '<br/><br/><strong class="text-blue-600 dark:text-blue-400">$1:</strong>')
    // 2. Handle bullet points (single * at start of line)
    .replace(/(?:\r\n|\r|\n)\s*\*\s+/g, '<br/>• ')
    // 3. Bold text (**text**)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // 4. Code blocks
    .replace(/```([\s\S]*?)```/g, '<div class="bg-black/5 dark:bg-black/30 p-3 rounded-lg my-2 border border-black/5 font-mono text-xs overflow-x-auto"><code>$1</code></div>')
    // 5. Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>')
    // 6. Basic Line breaks
    .replace(/\n/g, '<br/>');

  return formatted;
};

/* ------------------------- THEME CONFIG ------------------------- */
const themeConfig = {
  light: {
    bg: "bg-[#F9FAFB]",
    sidebar: "bg-white border-r border-slate-200",
    textMain: "text-slate-800",
    textMuted: "text-slate-500",
    botBubble: "bg-white border border-slate-200 shadow-sm text-slate-800",
    userBubble: "bg-blue-600 text-white shadow-md",
    inputWrapper: "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100",
    card: "bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-400 transition-all cursor-pointer",
    highlight: "bg-slate-100 text-slate-900 font-medium",
  },
  dark: {
    bg: "bg-[#0B0F15]",
    sidebar: "bg-[#0f141c] border-r border-white/5",
    textMain: "text-slate-200",
    textMuted: "text-slate-400",
    botBubble: "bg-[#161b26] border border-white/5 text-slate-200",
    userBubble: "bg-blue-600 text-white shadow-lg shadow-blue-900/20",
    inputWrapper: "bg-[#161b26] shadow-2xl border border-white/10",
    card: "bg-[#161b26] border border-white/5 hover:border-white/20 transition-all cursor-pointer",
    highlight: "bg-white/10 text-white font-medium",
  },
};

/* ------------------------- TYPES ------------------------- */
type Attachment = { id: string; name: string; size: number; type: string; url: string; };
type Message = { id: string; text: string; isBot: boolean; timestamp: number; attachments?: Attachment[]; isStreaming?: boolean; };
type Conversation = { id: string; title: string; messages: Message[]; lastModified: number; };

/* ------------------------- MAIN COMPONENT ----------------- */
const AIAssistant: React.FC = () => {
  const { theme: globalTheme } = useContext(ThemeContext); 
  const t = globalTheme === "dark" ? themeConfig.dark : themeConfig.light;

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try { return JSON.parse(localStorage.getItem("hydro-chat-history") || "[]"); } catch { return []; }
  });
  
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  
 
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => { localStorage.setItem("hydro-chat-history", JSON.stringify(conversations)); }, [conversations]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [conversations, isTyping, activeConversationId]);

  /* --- ACTIONS --- */

  // FORCE RESET TO WELCOME SCREEN
  const goHome = () => {
    setActiveConversationId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async (msg = input) => {
    if (!msg.trim() && pendingAttachments.length === 0) return;
    
    let currentId = activeConversationId;
    
    // Create new chat session only on first message
    if (!currentId) {
        const newId = Date.now().toString();
        const newConv = { id: newId, title: msg.slice(0, 40) || "New Analysis", messages: [], lastModified: Date.now() };
        setConversations(prev => [newConv, ...prev]);
        setActiveConversationId(newId);
        currentId = newId;
    }

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: msg,
      isBot: false,
      timestamp: Date.now(),
      attachments: [...pendingAttachments]
    };

    setConversations(prev => prev.map(c => 
      c.id === currentId 
      ? { ...c, messages: [...c.messages, userMsg], lastModified: Date.now(), title: c.messages.length === 0 ? msg.slice(0, 30) : c.title } 
      : c
    ));

    setInput("");
    setPendingAttachments([]);
    setIsTyping(true);

    // Simulated Response
    setTimeout(() => {
      const responseText = "Detailed Analysis:\n\n* Observation: The dataset indicates that recharge from rainfall and other sources During Non Monsoon Season (12823.54) is significantly higher than During Monsoon Season (1718.77).\n\n* Anomaly Detected: This appears to be an anomaly, as typically monsoon season contributes more to overall recharge.";
      
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        text: responseText,
        isBot: true,
        timestamp: Date.now(),
        isStreaming: true
      };

      setConversations(prev => prev.map(c => c.id === currentId ? { ...c, messages: [...c.messages, botMsg] } : c));
      setIsTyping(false);
    }, 1500);
  };

  const activeMessages = useMemo(() => conversations.find(c => c.id === activeConversationId)?.messages || [], [conversations, activeConversationId]);

  /* ------------------------- RENDER ------------------------- */
  return (
    <div className={cn("flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 relative", t.bg)}>
      
      {/* ---------------- SIDEBAR ---------------- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -280, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: -280, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn("h-full flex-shrink-0 flex flex-col z-50 shadow-xl lg:shadow-none w-[280px] absolute lg:relative", t.sidebar)}
          >
            <div className="p-4 flex flex-col gap-4 h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-2 mb-2">
                 <div onClick={goHome} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                        <Bot size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("font-bold text-sm tracking-tight", t.textMain)}>HydroSpatial</span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wide">AI WORKSPACE</span>
                    </div>
                 </div>
                 <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400"><X size={18}/></button>
              </div>

              {/* New Chat Button */}
              <button 
                onClick={goHome}
                className={cn("flex items-center gap-3 px-3 py-3 rounded-lg border transition-all group shadow-sm text-sm font-medium", 
                  globalTheme === 'dark' ? "bg-white/5 border-white/5 hover:bg-white/10" : "bg-white border-slate-200 hover:border-blue-400 text-slate-700")}
              >
                <Plus size={16} className="text-blue-500" />
                New Analysis
              </button>

              <div className="text-[11px] font-bold text-slate-400 px-2 mt-4 uppercase tracking-wider opacity-60">Recent Analysis</div>
              
              {/* History List */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                {conversations.length === 0 && <div className="text-xs text-slate-500 px-2 italic mt-2">No history found.</div>}
                {conversations.map(c => (
                  <div 
                    key={c.id} 
                    onClick={() => { setActiveConversationId(c.id); if(window.innerWidth < 1024) setSidebarOpen(false); }}
                    className={cn(
                      "group relative px-3 py-2.5 rounded-md cursor-pointer text-sm truncate transition-all flex items-center gap-3",
                      activeConversationId === c.id ? t.highlight : `${t.textMuted} hover:bg-black/5 dark:hover:bg-white/5`
                    )}
                  >
                    <MessageSquare size={14} className={activeConversationId === c.id ? "text-blue-500" : "opacity-70"} />
                    <span className="truncate flex-1">{c.title}</span>
                    <button 
                        onClick={(e) => { e.stopPropagation(); setConversations(p => p.filter(x => x.id !== c.id)); }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                    >
                        <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* CLEAN FOOTER - NO USER PROFILE, JUST SETTINGS */}
              <div className="mt-auto border-t border-dashed border-slate-500/20 pt-4">
                 <button className={cn("flex items-center gap-3 px-3 py-2 w-full rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left", t.textMuted)}>
                    <Settings size={16} />
                    <span className="text-xs font-medium">Settings</span>
                 </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 flex flex-col h-full relative z-0">
        
        {/* Header - Only shows when chat is active to keep Welcome screen clean */}
        <div className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-transparent z-10">
            <div className="flex items-center gap-3">
                {!isSidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className={cn("p-2 rounded-md hover:bg-black/5 transition-colors", t.textMain)}>
                        <Menu size={20}/>
                    </button>
                )}
                {activeConversationId && (
                   <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                      <span className={cn("font-medium text-sm", t.textMain)}>Analysis Session</span>
                      <ChevronRight size={14} className="text-slate-400" />
                   </div>
                )}
            </div>
        </div>

        {/* SCROLLABLE AREA 
            pb-56 (14rem) guarantees text is visible "below the bar"
        */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-0 pb-56">
            {!activeConversationId ? (
                /* WELCOME SCREEN - FORCE CENTERED */
                <div className="h-full flex flex-col items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                        className="text-center w-full max-w-2xl mx-auto mb-12"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center mb-6">
                           <Sparkles size={32} className="text-white" />
                        </div>
                        <h2 className={cn("text-3xl font-bold mb-3 tracking-tight", t.textMain)}>HydroSpatial AI</h2>
                        <p className={cn("text-base max-w-lg mx-auto leading-relaxed", t.textMuted)}>
                            Advanced hydrological data analysis.
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mx-auto px-4">
                        {[
                            { icon: Zap, label: "Trend Analysis", desc: "Analyze groundwater levels" },
                            { icon: BarChart3, label: "Comparison", desc: "Compare rainfall vs 2010" },
                            { icon: FileText, label: "Report Generation", desc: "Summarize monthly data" },
                        ].map((item, idx) => (
                            <motion.button 
                                key={idx}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                onClick={() => handleSend(item.desc)}
                                className={cn("p-5 rounded-2xl text-left flex flex-col gap-3 group transition-all duration-300", t.card)}
                            >
                                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", globalTheme === 'dark' ? "bg-blue-500/10 text-blue-400" : "bg-blue-50 text-blue-600")}>
                                    <item.icon size={18} />
                                </div>
                                <div>
                                    <div className={cn("font-semibold text-sm mb-1", t.textMain)}>{item.label}</div>
                                    <div className="text-xs text-slate-400 leading-snug">{item.desc}</div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            ) : (
                /* CHAT HISTORY */
                <div className="max-w-3xl mx-auto py-8 space-y-8 px-4">
                    {activeMessages.map((msg) => (
                        <motion.div 
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn("flex gap-5", msg.isBot ? "justify-start" : "justify-end")}
                        >
                            {msg.isBot && (
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                    <Bot size={16} className="text-white" />
                                </div>
                            )}

                            <div className={cn("flex flex-col max-w-[85%]", msg.isBot ? "items-start" : "items-end")}>
                                <div className={cn("text-xs font-semibold mb-2 opacity-70", t.textMain)}>
                                    {msg.isBot ? "HydroAI" : "You"}
                                </div>
                                
                                <div className={cn("px-6 py-4 text-[15px] leading-relaxed shadow-sm rounded-2xl", 
                                    msg.isBot ? `${t.botBubble} rounded-tl-none` : `${t.userBubble} rounded-tr-none`
                                )}>
                                    <div className="markdown-body">
                                        {parse(parseMarkdown(msg.text))}
                                    </div>
                                </div>
                                
                                {msg.isBot && (
                                    <div className="flex items-center gap-3 mt-2 px-1">
                                        <button className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1"><Copy size={12}/> Copy</button>
                                        <button className="text-xs text-slate-400 hover:text-blue-500 flex items-center gap-1"><MoreHorizontal size={12}/></button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isTyping && (
                         <div className="flex gap-5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot size={16} className="text-white" />
                            </div>
                            <div className={cn("px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1", t.botBubble)}>
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75" />
                                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                            </div>
                         </div>
                    )}
                    <div ref={chatEndRef} />
                </div>
            )}
        </div>

        {/* INPUT AREA - Pinned to bottom with safety spacing */}
        <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-20 pointer-events-none">
            <div className="w-full max-w-3xl pointer-events-auto">
                <div className={cn("rounded-2xl p-2 pl-4 flex items-end gap-3 transition-all duration-300", t.inputWrapper)}>
                    <textarea 
                        ref={inputRef} 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        onKeyDown={(e) => { if(e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} 
                        placeholder="Ask HydroSpatial AI about your data..." 
                        className={cn("flex-1 max-h-32 py-3 bg-transparent outline-none resize-none text-[15px]", t.textMain)} 
                        rows={1} 
                    />
                    <button 
                        onClick={() => handleSend()} 
                        disabled={!input.trim()} 
                        className={cn("mb-1 p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center", 
                        input.trim() ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105" : "bg-slate-200 dark:bg-slate-800 text-slate-400")}
                    >
                        <Send size={18} className={input.trim() ? "ml-0.5" : ""} />
                    </button>
                </div>
                <div className="text-center mt-3 text-[11px] text-slate-400 opacity-70">
                    HydroSpatial AI can make mistakes. Please verify important information.
                </div>
            </div>
        </div>
      </main>

      <style>{`
        /* Professional Markdown Styles */
        .markdown-body strong { font-weight: 600; }
        .markdown-body ul { list-style-type: disc; padding-left: 20px; margin: 10px 0; }
        .markdown-body li { margin-bottom: 4px; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.3); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.5); }
      `}</style>
    </div>
  );
};

export default AIAssistant;