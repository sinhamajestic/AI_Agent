import React from 'react';
import { BotIcon } from './Icons';

interface ChatMessageProps {
  role: 'user' | 'model';
  text: string;
  isLoading?: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, text, isLoading = false }) => {
  const isUser = role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <BotIcon className="w-5 h-5 text-gray-600" />
        </div>
      )}
      <div
        className={`max-w-md md:max-w-lg lg:max-w-xl px-4 py-2.5 rounded-2xl ${
          isUser
            ? 'bg-accent-primary text-white rounded-br-none'
            : 'bg-base-bg text-text border border-border rounded-bl-none'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
          </div>
        ) : (
          <p className="whitespace-pre-wrap">{text}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
