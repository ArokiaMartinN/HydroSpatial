import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: "Hello! I'm your Water Resource Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // This function formats the answer text:
  // - **bold** markdown syntax is converted to HTML <strong>.
  // - Numeric values are wrapped in a span with blue color.
  // - Newlines are replaced with <br/>.
  const formatText = (text: string): string => {
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formatted = formatted.replace(/(\d+(\.\d+)?)/g, '<span style="color: blue;">$1</span>');
    formatted = formatted.replace(/\n/g, '<br/>');
    return formatted;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message and clear the input immediately.
    setMessages(prev => [...prev, { text: input, isBot: false }]);
    const query = input;
    setInput('');
    setIsTyping(true);

    try {
      // Send the query to your Flask backend.
      const response = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();

      // Get the answer or error message.
      const botResponse = response.ok
        ? data.answer
        : data.error || 'Error occurred while processing your query.';

      // Create a placeholder bot message for streaming.
      setMessages(prev => [...prev, { text: '', isBot: true }]);

      // Split the answer into lines.
      const lines = botResponse.split('\n');
      let currentText = '';

      // Stream each line with a slight delay.
      lines.forEach((line: string, index: number) => {
        setTimeout(() => {
          currentText += line + "\n";
          // Update the last bot message with the new content.
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: currentText };
            return newMessages;
          });
        }, index * 100); // Adjust delay (100ms) as needed.
      });
    } catch (error) {
      console.error('Fetch error:', error);
      setMessages(prev => [
        ...prev,
        { text: 'Network error. Please try again later.', isBot: true }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600">
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Bot className="mr-3" size={32} />
            AI Water Resource Assistant
          </h1>
        </div>

        <div className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${message.isBot ? 'bg-gray-100 text-gray-800' : 'bg-blue-600 text-white'}`}
                >
                  {message.isBot ? (
                    <div>
                      <div className="flex items-center mb-2">
                        <Sparkles className="w-4 h-4 mr-2" />
                        <span className="font-semibold">AI Assistant</span>
                      </div>
                      {/* Render formatted bot message using dangerouslySetInnerHTML */}
                      <p
                        className="whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: formatText(message.text) }}
                      />
                    </div>
                  ) : (
                    <p>{message.text}</p>
                  )}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about water resources..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIAssistant;
