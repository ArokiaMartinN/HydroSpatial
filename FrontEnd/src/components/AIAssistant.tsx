import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import parse from "html-react-parser";
import {
  Bot,
  Send,
  Plus,
  MessageSquare,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ThemeContext } from "../App";

/* ------------------------- UTILS ------------------------- */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// IMPROVED MARKDOWN / HTML PARSER
const parseMarkdown = (text: string) => {
  let formatted = text
    .replace(
      /\* (.*?):/g,
      '<br/><br/><strong class="text-blue-500 font-semibold">$1:</strong>'
    )
    .replace(/(?:\r\n|\r|\n)\s*\*\s+/g, "<br/>• ")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /```([\s\S]*?)```/g,
      '<div class="bg-black/20 p-3 rounded-lg my-2 border border-white/10 font-mono text-xs overflow-x-auto"><code>$1</code></div>'
    )
    .replace(
      /`([^`]+)`/g,
      '<code class="bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">$1</code>'
    )
    .replace(/\n/g, "<br/>");
  return formatted;
};

/* ------------------------- THEME CONFIG ------------------------- */
const themeConfig = {
  light: {
    bg: "bg-white",
    sidebar: "bg-slate-50 border-r border-slate-200",
    textMain: "text-slate-800",
    textMuted: "text-slate-500",
    botBubble: "bg-transparent pl-0 text-slate-800",
    userBubble: "bg-slate-100 text-slate-800 rounded-2xl",
    inputBg: "bg-white border-t border-slate-200",
    inputWrapper:
      "bg-slate-100 border-transparent focus-within:bg-white focus-within:ring-2 ring-blue-500/20",
    card: "bg-white border border-slate-200 shadow-sm hover:border-blue-400 cursor-pointer",
    highlight: "bg-slate-200 text-slate-900 font-medium",
  },
  dark: {
    bg: "bg-[#0B0F15]",
    sidebar: "bg-[#0f141c] border-r border-white/5",
    textMain: "text-slate-200",
    textMuted: "text-slate-400",
    botBubble: "bg-transparent pl-0 text-slate-200",
    userBubble: "bg-[#1E232E] text-slate-200 border border-white/5",
    inputBg: "bg-[#0B0F15] border-t border-white/5",
    inputWrapper:
      "bg-[#161b26] border border-white/5 focus-within:border-blue-500/50",
    card: "bg-[#161b26] border border-white/5 hover:border-white/20 cursor-pointer",
    highlight: "bg-white/10 text-white font-medium",
  },
};

/* ------------------------- TYPES ------------------------- */
type Attachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

type Message = {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: number;
  attachments?: Attachment[];
  isStreaming?: boolean;
};

type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  lastModified: number;
};

// ✅ BACKEND URL (Flask)
const API_BASE_URL = "http://localhost:5000"; // change if backend runs elsewhere

/* ------------------------- MAIN COMPONENT ----------------- */
const AIAssistant: React.FC = () => {
  const { theme: globalTheme } = useContext(ThemeContext);
  const t = globalTheme === "dark" ? themeConfig.dark : themeConfig.light;

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("hydro-chat-history") || "[]");
    } catch {
      return [];
    }
  });

  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>(
    []
  );

  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  /* ------------------------- EFFECTS ------------------------- */
  useEffect(() => {
    localStorage.setItem("hydro-chat-history", JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, isTyping, activeConversationId]);

  /* ------------------------- ACTIONS ------------------------- */
  const goHome = () => {
    setActiveConversationId(null);
    if (window.innerWidth < 1024) setSidebarOpen(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleSend = async (msg = input) => {
    if (!msg.trim() && pendingAttachments.length === 0) return;

    // 1. Ensure there is an active conversation
    let currentId = activeConversationId;
    if (!currentId) {
      const newId = Date.now().toString();
      const newConv: Conversation = {
        id: newId,
        title: msg.slice(0, 40) || "New Analysis",
        messages: [],
        lastModified: Date.now(),
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newId);
      currentId = newId;
    }

    // 2. Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      text: msg,
      isBot: false,
      timestamp: Date.now(),
      attachments: [...pendingAttachments],
    };

    const convIdForClosure = currentId; // capture for async

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convIdForClosure
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              lastModified: Date.now(),
              title:
                c.messages.length === 0
                  ? msg.slice(0, 30) || "New Analysis"
                  : c.title,
            }
          : c
      )
    );

    setInput("");
    setPendingAttachments([]);
    setIsTyping(true);

    try {
      // 3. Call Flask backend /query
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: msg,
          // You can later send dynamic context (selected district, state, etc.)
          context: "Hydrological dataset analysis for groundwater and rainfall.",
        }),
      });

      const data = await response.json();

      const aiText: string =
        data?.answer ||
        "AI analysis not available. Please check backend response.";

      // 4. Add bot message
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        text: aiText,
        isBot: true,
        timestamp: Date.now(),
        isStreaming: false,
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convIdForClosure
            ? { ...c, messages: [...c.messages, botMsg] }
            : c
        )
      );
    } catch (error) {
      console.error("Error calling backend:", error);
      const errorMsg: Message = {
        id: `b-${Date.now()}`,
        text:
          "⚠️ Error connecting to AI backend. Please make sure the Flask server is running.",
        isBot: true,
        timestamp: Date.now(),
        isStreaming: false,
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convIdForClosure
            ? { ...c, messages: [...c.messages, errorMsg] }
            : c
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const activeMessages = useMemo(
    () =>
      conversations.find((c) => c.id === activeConversationId)?.messages || [],
    [conversations, activeConversationId]
  );

  /* ------------------------- RENDER ------------------------- */
  return (
    <div
      className={cn(
        "flex h-screen w-full overflow-hidden font-sans transition-colors duration-300 relative",
        t.bg
      )}
    >
      {/* SIDEBAR */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -280, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -280, opacity: 0 }}
            className={cn(
              "h-full flex-shrink-0 flex flex-col z-50 shadow-xl lg:shadow-none w-[280px] absolute lg:relative",
              t.sidebar
            )}
          >
            <div className="p-4 flex flex-col gap-4 h-full">
              <div className="flex items-center justify-between px-2 mb-2">
                <div
                  onClick={goHome}
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                    <Bot size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("font-bold text-sm", t.textMain)}>
                      HydroSpatial
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-slate-400"
                >
                  <X size={18} />
                </button>
              </div>

              <button
                onClick={goHome}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-lg border text-sm font-medium",
                  globalTheme === "dark"
                    ? "bg-white/5 border-white/5"
                    : "bg-white border-slate-200"
                )}
              >
                <Plus size={16} className="text-blue-500" /> New Analysis
              </button>

              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveConversationId(c.id)}
                    className={cn(
                      "px-3 py-2.5 rounded-md cursor-pointer text-sm truncate flex items-center gap-3",
                      activeConversationId === c.id
                        ? t.highlight
                        : t.textMuted
                    )}
                  >
                    <MessageSquare size={14} />{" "}
                    <span className="truncate flex-1">{c.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        {/* HEADER */}
        <div className="h-14 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className={cn("p-2 rounded-md", t.textMain)}
              >
                <Menu size={20} />
              </button>
            )}
            {activeConversationId && (
              <span className={cn("font-medium text-sm", t.textMain)}>
                Analysis Session
              </span>
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-0 scroll-smooth">
          {!activeConversationId ? (
            // WELCOME SCREEN
            <div className="h-full flex flex-col items-center justify-center p-4">
              <div className="text-center max-w-2xl mb-12">
                <div className="w-16 h-16 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-600/20">
                  <Sparkles size={32} className="text-white" />
                </div>
                <h2 className={cn("text-3xl font-bold mb-3", t.textMain)}>
                  HydroSpatial AI
                </h2>
                <p className={cn("text-base", t.textMuted)}>
                  Advanced hydrological data analysis.
                </p>
              </div>
            </div>
          ) : (
            // CHAT MESSAGES
            <div className="max-w-3xl mx-auto py-8 space-y-6 px-4">
              {activeMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    msg.isBot ? "justify-start" : "justify-end"
                  )}
                >
                  {msg.isBot && (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot size={16} className="text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.isBot ? "items-start" : "items-end"
                    )}
                  >
                    <div
                      className={cn(
                        "text-xs font-semibold mb-1 opacity-50",
                        t.textMain
                      )}
                    >
                      {msg.isBot ? "HydroAI" : "You"}
                    </div>

                    <div
                      className={cn(
                        "px-5 py-3 text-[15px] leading-relaxed shadow-sm",
                        msg.isBot
                          ? t.botBubble
                          : `${t.userBubble} rounded-tr-none`
                      )}
                    >
                      <div className="markdown-body">
                        {parse(parseMarkdown(msg.text))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="text-xs text-slate-500 px-4">
                  HydroAI is thinking…
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* INPUT AREA */}
        <div className={cn("flex-shrink-0 p-4 z-20", t.inputBg)}>
          <div className="w-full max-w-3xl mx-auto">
            <div
              className={cn(
                "rounded-2xl p-2 pl-4 flex items-end gap-3 transition-all",
                t.inputWrapper
              )}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask HydroSpatial AI..."
                className={cn(
                  "flex-1 max-h-32 py-3 bg-transparent outline-none resize-none text-[15px]",
                  t.textMain
                )}
                rows={1}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className={cn(
                  "mb-1 p-2 rounded-xl transition-all",
                  input.trim()
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-400"
                )}
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-2 text-[10px] text-slate-500">
              HydroSpatial AI can make mistakes. Please verify important
              information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistant;
