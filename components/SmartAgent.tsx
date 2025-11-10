import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './Icons';
import ChatMessage from './ChatMessage';

// Define the API URL your backend is running on
const API_URL = 'http://localhost:8080/api';

interface ChatMessageContent {
  role: 'user' | 'model';
  text: string;
}

const SmartAgent: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageContent[]>([
    { role: 'model', text: "Hello! I'm your personal assistant. How can I help you manage your tasks today? You can ask things like 'What are my overdue tasks?' or 'Create a task to finish the report by tomorrow with high priority'." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // --- THIS IS THE KEY CHANGE ---
      // Call your backend API instead of running Gemini locally
      const response = await fetch(`${API_URL}/agent/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const modelResponse: ChatMessageContent = await response.json();
      setMessages(prev => [...prev, modelResponse]);
      // --- END OF KEY CHANGE ---

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'model' as const, text: 'Sorry, something went wrong. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} role={msg.role} text={msg.text} />
        ))}
        {isLoading && <ChatMessage role="model" text="" isLoading={true} />}
         <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-gray-100 border-t border-border">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your agent..."
            className="w-full px-4 py-2 text-gray-700 bg-base-bg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 text-white bg-accent-primary rounded-lg shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default SmartAgent;