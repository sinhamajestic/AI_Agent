import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, Chat } from '@google/genai';
import { BotIcon, SendIcon } from './Icons';
import ChatMessage from './ChatMessage';
import { Task, TaskPriority, TaskStatus, Summary } from '../types';

// Mock data to simulate fetching from a backend
const mockTasks: Task[] = [
    { id: '1', title: 'Finalize Q4 Deck for All-Hands', description: '', status: TaskStatus.Todo, priority: TaskPriority.Critical, dueAt: new Date(Date.now() - 86400000).toISOString(), source: { type: 'email', origin: 'support@example.com' } },
    { id: '2', title: 'Review legal docs from acquisitions', description: '', status: TaskStatus.Todo, priority: TaskPriority.High, dueAt: new Date().toISOString(), source: { type: 'document', origin: 'Legal_Brief.pdf' } },
    { id: '3', title: 'Draft release notes for v2.1', description: '', status: TaskStatus.InProgress, priority: TaskPriority.High, dueAt: new Date().toISOString(), source: { type: 'meeting', origin: 'Weekly Sync' } },
];
const mockSummaries: Summary[] = [
    { id: '1', type: 'meeting', title: 'Q3 Planning Session', createdAt: '2024-07-21T14:00:00Z', content: 'Discussed roadmap for the next quarter. Key decisions include focusing on feature X and postponing Y.' },
];

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
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const tools: Record<string, Function> = {
    getTasks: ({ status }: { status: 'overdue' | 'due_today' | 'all' }) => {
      console.log(`Tool called: getTasks with status: ${status}`);
      if (status === 'overdue') {
        return mockTasks.filter(t => new Date(t.dueAt) < new Date() && t.status !== TaskStatus.Done);
      }
      if (status === 'due_today') {
        const today = new Date().toDateString();
        return mockTasks.filter(t => new Date(t.dueAt).toDateString() === today);
      }
      return mockTasks;
    },
    createTask: ({ title, priority, dueDate }: { title: string, priority: TaskPriority, dueDate: string }) => {
      console.log(`Tool called: createTask with title: ${title}`);
      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        title,
        description: '',
        status: TaskStatus.Todo,
        priority: priority || TaskPriority.Medium,
        dueAt: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
        source: { type: 'slack', origin: 'Smart Agent' }
      };
      mockTasks.push(newTask);
      return { success: true, task: newTask };
    },
    getSummaries: () => {
        console.log('Tool called: getSummaries');
        return mockSummaries;
    }
  };

  useEffect(() => {
    const initChat = () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const functionDeclarations: FunctionDeclaration[] = [
        {
          name: 'getTasks',
          description: 'Get a list of the user\'s tasks based on a status filter.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              status: {
                type: Type.STRING,
                description: 'The status to filter tasks by. Can be "overdue", "due_today", or "all".',
                enum: ['overdue', 'due_today', 'all']
              },
            },
            required: ['status'],
          },
        },
        {
          name: 'createTask',
          description: 'Create a new task for the user.',
          parameters: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'The title of the task.' },
              priority: { type: Type.STRING, description: 'The priority of the task. Can be "low", "medium", "high", or "critical".', enum: ['low', 'medium', 'high', 'critical'] },
              dueDate: { type: Type.STRING, description: 'The due date of the task in ISO 8601 format.' },
            },
            required: ['title'],
          },
        },
        {
            name: 'getSummaries',
            description: 'Get a list of all meeting and document summaries.',
            parameters: {
                type: Type.OBJECT,
                properties: {}
            }
        }
      ];

      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          tools: [{ functionDeclarations }],
        },
      });
      setChat(newChat);
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chat) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        let response = await chat.sendMessage({ message: userMessage.text });

        while(response.functionCalls && response.functionCalls.length > 0) {
            const functionCalls = response.functionCalls;
            const functionResponses = [];

            for (const call of functionCalls) {
                const tool = tools[call.name];
                if (tool) {
                    const result = await tool(call.args);
                    functionResponses.push({
                        id: call.id,
                        name: call.name,
                        response: { result: JSON.stringify(result) }
                    });
                }
            }
            response = await chat.sendMessage({ functionResponses });
        }
        
        const modelResponse = { role: 'model' as const, text: response.text };
        setMessages(prev => [...prev, modelResponse]);

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
