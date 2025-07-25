import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Plus, Bot, User, Loader, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPE DEFINITIONS ---
type ChatMessage = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: Date;
};

// --- GEMINI API CALL ---
const getBotResponse = async (userMessage: string, history: ChatMessage[]): Promise<string> => {
    // We'll use the Gemini API here
    const chatHistory = history.map(msg => ({
        // The API expects 'model' for the bot's role
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    // The Gemini API requires the history to not include the current message, which is passed separately.
    // Let's remove the last message from history if it's the user's current message.
    const apiHistory = chatHistory.slice(0, -1);

    const payload = {
        contents: [
            ...apiHistory,
            { role: "user", parts: [{ text: userMessage }] }
        ]
    };

    const apiKey = ""; // Leave empty, will be handled by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error:", errorBody);
            return `Error: ${errorBody.error?.message || 'Failed to get a response from the AI.'}`;
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            return result.candidates[0].content.parts[0].text;
        } else {
            console.warn("Unexpected API response structure:", result);
            if (result.promptFeedback && result.promptFeedback.blockReason) {
                 return `Your request was blocked. Reason: ${result.promptFeedback.blockReason}`;
            }
            return "I received an empty response. Please try again.";
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return 'Network error. Please check your connection and try again.';
    }
};


// --- HELPER FUNCTIONS ---
const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// --- UI COMPONENTS ---

const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isBot = message.sender === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex items-start gap-3 my-4 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isBot ? 'bg-gray-700' : 'bg-blue-500'}`}>
        {isBot ? <Bot size={20} className="text-white" /> : <User size={20} className="text-white" />}
      </div>
      <div className={`p-4 rounded-lg max-w-lg shadow-md ${isBot ? 'bg-gray-700 text-gray-200 rounded-bl-none' : 'bg-blue-600 text-white rounded-br-none'}`}>
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </motion.div>
  );
};

const WelcomeScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center px-4">
    <MessageSquare size={64} className="mb-4 text-gray-500" />
    <h2 className="text-2xl font-semibold mb-2 text-gray-200">Water Resource Assistant</h2>
    <p>You can start a new conversation by typing in the box below.</p>
  </div>
);

const Sidebar: React.FC<{
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string) => void;
  onNewChat: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}> = ({ conversations, activeConversationId, setActiveConversationId, onNewChat, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute z-20 top-0 left-0 h-full w-72 bg-gray-900 flex flex-col md:relative md:w-72 md:flex-shrink-0"
        >
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Chat History</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="p-2">
              {conversations.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((convo) => (
                <a
                  key={convo.id}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveConversationId(convo.id);
                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                  }}
                  className={`block px-4 py-3 my-1 rounded-lg truncate transition-colors ${
                    activeConversationId === convo.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {truncateText(convo.title, 25)}
                </a>
              ))}
            </nav>
          </div>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                onNewChat();
                 if (window.innerWidth < 768) setIsSidebarOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Plus size={20} />
              New Chat
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, loading]);

  const handleNewChat = () => {
    setActiveConversationId(null);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    
    const localInput = input;
    setInput('');

    let currentConvoId = activeConversationId;
    let updatedConversations: Conversation[];
    
    // Step 1: Add user message to state for immediate UI update.
    if (!currentConvoId) {
        currentConvoId = `convo-${Date.now()}`;
        const newConvo: Conversation = {
            id: currentConvoId,
            title: truncateText(localInput, 30),
            messages: [userMessage],
            timestamp: new Date(),
        };
        updatedConversations = [newConvo, ...conversations];
        setActiveConversationId(currentConvoId);
    } else {
        updatedConversations = conversations.map(c =>
            c.id === currentConvoId
                ? { ...c, messages: [...c.messages, userMessage], timestamp: new Date() }
                : c
        );
    }
    setConversations(updatedConversations);
    setLoading(true);

    // Step 2: Call API with the complete history.
    const historyForAPI = updatedConversations.find(c => c.id === currentConvoId)!.messages;
    const botResponseText = await getBotResponse(localInput, historyForAPI);

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponseText,
      sender: 'bot',
    };

    // Step 3: Add bot response to the conversation.
    setConversations(prev =>
      prev.map(c =>
        c.id === currentConvoId
          ? { ...c, messages: [...c.messages, botMessage] }
          : c
      )
    );
    setLoading(false);
  };

  return (
    <div className="h-screen w-screen bg-gray-800 text-white flex font-sans overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        onNewChat={handleNewChat}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="flex-1 flex flex-col bg-gray-800">
        {!isSidebarOpen && (
           <button onClick={() => setIsSidebarOpen(true)} className="md:hidden absolute top-4 left-4 z-10 p-2 bg-gray-700 rounded-md">
             <MessageSquare size={24} />
           </button>
        )}
        <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
                {activeConversation ? (
                    <motion.div key={activeConversation.id} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}>
                        {activeConversation.messages.map((msg) => (
                            <ChatMessageComponent key={msg.id} message={msg} />
                        ))}
                        {loading && (
                            <div className="flex items-start gap-3 my-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-700">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="p-4 rounded-lg bg-gray-700 text-gray-300 rounded-bl-none flex items-center gap-2">
                                    <Loader size={16} className="animate-spin" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </motion.div>
                ) : (
                    <WelcomeScreen key="welcome" />
                )}
            </AnimatePresence>
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={activeConversation ? "Ask a follow-up..." : "Ask about water resources..."}
                className="w-full bg-gray-700 text-white p-4 pr-20 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                rows={1}
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
              >
                {loading ? <Loader size={20} className="animate-spin" /> : <Send size={20} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              Press Shift + Enter for a new line.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
