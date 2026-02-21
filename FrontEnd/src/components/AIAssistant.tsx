import React, { useState, useEffect, useRef } from 'react';
import {
  Bot, Plus, Trash2,
  User, Sparkles, Copy, Check, CornerDownLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Session {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
}

// --- SIDEBAR ---
const ChatSidebar = ({ sessions, activeId, onSelect, onNew, onDelete }: any) => (
  <div className="w-64 h-full flex flex-col shrink-0"
    style={{
      background: 'linear-gradient(180deg, #ffffff 0%, #f5f3ff 100%)',
      borderRight: '1px solid var(--border-main)',
    }}>
    <div className="p-4">
      <button
        onClick={onNew}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all"
        style={{
          background: 'var(--gradient-main)',
          color: 'white',
          boxShadow: 'var(--shadow-violet)',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
          fontWeight: '600',
          letterSpacing: '0.01em',
        }}
        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.filter = '')}
      >
        <Plus size={15} />
        New Chat
      </button>
    </div>

    <div className="flex-1 overflow-y-auto px-2 pb-4">
      <div className="text-label px-3 py-2" style={{ color: 'var(--text-tertiary)' }}>
        Recent
      </div>
      {sessions.length === 0 && (
        <div className="text-center text-xs py-6 italic" style={{ color: 'var(--text-tertiary)' }}>
          No history
        </div>
      )}
      {sessions.map((session: Session) => (
        <div
          key={session.id}
          onClick={() => onSelect(session.id)}
          className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all text-sm mb-1"
          style={activeId === session.id
            ? { background: 'var(--gradient-soft)', border: '1px solid var(--border-main)', color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }
            : { color: 'var(--text-secondary)', border: '1px solid transparent', fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)' }
          }
          onMouseEnter={e => {
            if (activeId !== session.id) {
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-hover)';
              (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
            }
          }}
          onMouseLeave={e => {
            if (activeId !== session.id) {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
            }
          }}
        >
          <span className="truncate">{session.title}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(session.id); }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded-md transition-all hover:text-rose-500"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- MESSAGE BUBBLE ---
const ChatMessage = ({ msg, isTyping }: { msg: Message, isTyping?: boolean }) => {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 w-full max-w-3xl mx-auto py-5 group`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md`}
        style={isUser
          ? { background: 'var(--bg-hover)', border: '1px solid var(--border-main)' }
          : { background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }
        }>
        {isUser
          ? <User size={16} style={{ color: 'var(--primary)' }} />
          : <Bot size={16} color="white" />
        }
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="font-semibold"
            style={{ color: 'var(--text-main)', fontFamily: 'var(--font-display)', fontSize: 'var(--text-sm)', letterSpacing: '-0.01em' }}>
            {isUser ? 'You' : 'HydroMind'}
          </span>
          {!isUser && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-semibold badge-violet">
              AI
            </span>
          )}
        </div>

        <div className="prose prose-sm max-w-none"
          style={{
            color: isUser ? 'var(--text-secondary)' : 'var(--text-main)',
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--text-base)',
            lineHeight: 'var(--leading-relaxed)',
          }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.content + (isTyping ? '▍' : '')}
          </ReactMarkdown>
        </div>

        {!isTyping && !isUser && (
          <div className="flex items-center gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs font-medium rounded-lg px-2 py-1 transition-all"
              style={{ color: 'var(--text-tertiary)', background: 'var(--bg-hover)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- MAIN ---
const AIAssistant = () => {
  const [sessions, setSessions] = useState<Session[]>(() => {
    const saved = localStorage.getItem('hydro_ai_sessions');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamedResponse, setStreamedResponse] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    localStorage.setItem('hydro_ai_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, streamedResponse, autoScroll]);

  const createNewSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: 'New Discussion',
      messages: [],
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (inputRef.current) inputRef.current.focus();
  };

  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSubmit = async () => {
    if (!input.trim() || !activeSessionId) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: input, timestamp: Date.now() };
    const updatedSessions = sessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, messages: [...s.messages, userMsg], title: s.messages.length === 0 ? input.slice(0, 40) : s.title };
      }
      return s;
    });

    setSessions(updatedSessions);
    setInput('');
    setIsProcessing(true);
    setAutoScroll(true);
    setStreamedResponse('');

    try {
      const response = await api.queryAI("Context: Advanced Hydrology", userMsg.content);
      const fullText = response.answer || "Processing request...";

      let currentText = "";
      const words = fullText.split(" ");
      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + " ";
        setStreamedResponse(currentText);
        await new Promise(r => setTimeout(r, 15));
      }

      const aiMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: fullText, timestamp: Date.now() };
      setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s));
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
      setStreamedResponse('');
    }
  };

  useEffect(() => {
    if (sessions.length === 0 && !activeSessionId) createNewSession();
    else if (sessions.length > 0 && !activeSessionId) setActiveSessionId(sessions[0].id);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const suggestions = ['Analyze northern sector risk', 'Show rainfall trends', 'Draft safety report'];

  return (
    <div className="flex h-full w-full font-sans" style={{ background: 'var(--bg-main)' }}>

      <ChatSidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNew={createNewSession}
        onDelete={deleteSession}
      />

      <div className="flex-1 flex flex-col relative" style={{ background: 'white' }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 scroll-smooth">
          <div className="max-w-3xl mx-auto pb-40 pt-10">
            {activeSession?.messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl animate-float"
                  style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}>
                  <Sparkles size={28} color="white" />
                </div>
                <div>
                  <h2 className="text-display" style={{ color: 'var(--text-main)', fontSize: 'var(--text-2xl)' }}>
                    How can I help you today?
                  </h2>
                  <p className="mt-2 max-w-md mx-auto text-body-sm" style={{ color: 'var(--text-secondary)' }}>
                    Analyze risk factors, query historical flood data, or help draft compliance reports.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 max-w-lg">
                  {suggestions.map(sug => (
                    <button
                      key={sug}
                      onClick={() => { setInput(sug); if (inputRef.current) inputRef.current.focus(); }}
                      className="text-body-sm px-4 py-2 rounded-xl font-medium border transition-all"
                      style={{
                        background: 'var(--bg-subtle)',
                        border: '1px solid var(--border-main)',
                        color: 'var(--text-secondary)',
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--gradient-soft)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--primary)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-main)';
                      }}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSession?.messages.map(msg => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}

            {isProcessing && (
              <ChatMessage
                msg={{ id: 'stream', role: 'assistant', content: streamedResponse, timestamp: Date.now() }}
                isTyping
              />
            )}
          </div>
        </div>

        {/* Input */}
        <div className="absolute bottom-0 left-0 right-0 p-6 backdrop-blur-xl"
          style={{ background: 'rgba(255,255,255,0.85)', borderTop: '1px solid var(--border-subtle)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 rounded-2xl p-2 transition-all"
              style={{
                background: 'var(--bg-subtle)',
                border: '1.5px solid var(--border-main)',
              }}
              onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
              onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-main)'}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message HydroMind..."
                className="flex-1 bg-transparent px-3 py-3 outline-none resize-none max-h-32"
                style={{ color: 'var(--text-main)', minHeight: '44px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', lineHeight: 'var(--leading-relaxed)' }}
                rows={1}
              />
              <div className="pb-1 pr-1">
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim() || isProcessing}
                  className="p-2.5 rounded-xl text-white transition-all disabled:opacity-40"
                  style={{ background: 'var(--gradient-main)', boxShadow: 'var(--shadow-violet)' }}
                  onMouseEnter={e => {
                    if (!(!input.trim() || isProcessing))
                      (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = ''}
                >
                  {isProcessing
                    ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <CornerDownLeft size={16} />
                  }
                </button>
              </div>
            </div>
            <div className="text-center mt-3 text-caption tracking-wide"
              style={{ color: 'var(--text-tertiary)' }}>
              AI can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
