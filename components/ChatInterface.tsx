'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Lightbulb, Plane } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import { useChat } from '@/lib/context/ChatContext';
import { useAuth } from '@/lib/context/AuthContext';
import SuggestionCards from './SuggestionCards';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentSession, addMessage } = useChat();
  const { session } = useAuth();

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentSession?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !currentSession || isSending) return;

    // Capture the message before clearing input
    const messageContent = input.trim();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    setInput('');
    setIsSending(true);

    try {
      // TODO: Send to backend when ready
      const token = localStorage.getItem('travelai_token') || '';
      
      // Simulate AI response delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'll help you plan your trip! I received your message: "${messageContent}". \n\nOnce the backend is ready, I'll be able to:\n- Generate personalized itineraries\n- Find the best flights and hotels\n- Suggest activities and restaurants\n- Create a detailed travel budget\n\nFor now, this is a placeholder response. Stay tuned!`,
        timestamp: new Date().toISOString(),
      };

      addMessage(assistantMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your request. Please try again.',
        timestamp: new Date().toISOString(),
      };
      addMessage(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true }));
      }
    }, 0);
  };

  if (!currentSession) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600 bg-white">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Plane className="w-16 h-16 text-blue-500" />
          </div>
          <p className="text-lg font-semibold mb-2">No chat session started</p>
          <p className="text-sm">Start a new conversation to begin planning your trip!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4 min-h-0"
      >
        {currentSession.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <SuggestionCards
                onSuggestionClick={handleSuggestionClick}
                isLoading={isSending}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-3">
            {currentSession.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                } animate-fadeIn`}
              >
                {message.role === 'assistant' && (
                  <div className="flex gap-3 w-full max-w-xl sm:max-w-2xl lg:max-w-3xl">
                    {/* Assistant Avatar */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      AI
                    </div>

                    {/* Assistant Message Bubble */}
                    <div className="bg-gray-100 text-gray-900 rounded-2xl rounded-bl-none shadow-sm border border-gray-200 px-4 sm:px-6 py-3 sm:py-4 break-words">
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-70 mt-2 block text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}

                {message.role === 'user' && (
                  <div className="flex gap-3 max-w-xl sm:max-w-2xl lg:max-w-3xl">
                    {/* User Message Bubble */}
                    <div className="bg-blue-500 text-white rounded-2xl rounded-br-none shadow-md px-4 sm:px-6 py-3 sm:py-4 break-words">
                      <p className="whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                        {message.content}
                      </p>
                      <span className="text-xs opacity-70 mt-2 block text-blue-100">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                    AI
                  </div>
                  <div className="bg-gray-100 px-4 sm:px-5 py-3 sm:py-4 rounded-2xl rounded-bl-none shadow-sm border border-gray-200">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="space-y-3 max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
              placeholder="Ask about flights, hotels, activities, budgets..."
              className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:opacity-50 transition text-sm sm:text-base"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition font-medium flex items-center gap-2 text-sm sm:text-base whitespace-nowrap"
            >
              {isSending ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span className="hidden sm:inline">Sending</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1">
            <Lightbulb className="w-3 h-3 flex-shrink-0" />
            <span>Tip: Click on a suggestion card or type your travel questions</span>
          </p>
        </form>
      </div>
    </div>
  );
}
