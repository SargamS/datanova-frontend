'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "How do I upload my data?",
  "What file formats are supported?",
  "How does the AI summary work?",
  "Can I export to Figma?",
];

const BOT_RESPONSES: Record<string, string> = {
  "upload": "To upload your data, go to the Data Analysis page and drag & drop your CSV or Excel file. The file will be analyzed instantly!",
  "format": "We support CSV, Excel (.xlsx), and .xls files. Each file can contain up to 50MB of data.",
  "summary": "Our AI summary uses GPT-4 to analyze your data and generate comprehensive insights including statistics, trends, and actionable recommendations.",
  "figma": "Yes! After creating your visualizations and summaries, you can export everything directly to your Figma workspace with a single click.",
  "help": "I'm here to help! I can answer questions about features, file uploads, AI analysis, and exporting. What would you like to know?",
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! 👋 I\'m the DataNova Assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('file')) {
      return BOT_RESPONSES.upload;
    } else if (lowerMessage.includes('format') || lowerMessage.includes('support')) {
      return BOT_RESPONSES.format;
    } else if (lowerMessage.includes('summary') || lowerMessage.includes('ai')) {
      return BOT_RESPONSES.summary;
    } else if (lowerMessage.includes('figma') || lowerMessage.includes('export')) {
      return BOT_RESPONSES.figma;
    } else {
      return BOT_RESPONSES.help;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: getResponse(inputValue),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-primary via-blue-500 to-primary/80 text-white rounded-full shadow-2xl shadow-primary/60 hover:shadow-2xl hover:shadow-primary/80 hover:scale-125 transition-all z-40 flex items-center justify-center group animate-bounce-soft"
          aria-label="Open chat"
        >
          <MessageCircle className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          <span className="absolute inset-0 rounded-full bg-primary/20 animate-pulse"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-card border border-border/50 rounded-3xl shadow-2xl shadow-primary/40 flex flex-col z-40 overflow-hidden animate-scale-in backdrop-blur-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary via-blue-500 to-primary/80 text-primary-foreground p-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">DataNova Assistant</h3>
              <p className="text-xs opacity-90">AI-powered support 24/7</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area - FIXED WITH NULL CHECK */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {Array.isArray(messages) && messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-br from-primary to-primary/80 text-white rounded-br-none shadow-md shadow-primary/20'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Typing...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions - FIXED WITH NULL CHECK */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">
                Quick questions:
              </p>
              <div className="space-y-2">
                {Array.isArray(SUGGESTED_QUESTIONS) && SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-xs p-2 rounded-lg border border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 transition font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border p-4 bg-card/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSendMessage();
                  }
                }}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-2 bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg hover:shadow-lg hover:shadow-primary/40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}