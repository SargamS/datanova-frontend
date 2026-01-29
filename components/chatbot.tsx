'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, MessageCircle, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface DatasetInfo {
  fileName?: string;
  uploadedAt?: Date;
  rowCount?: number;
  columnCount?: number;
  columns?: string[];
  summary?: string;
  head?: Array<Record<string, any>>;
}

interface AIAssistantProps {
  csvData?: DatasetInfo | null;
}

const SUGGESTED_QUESTIONS = [
  "What does this dataset contain?",
  "Show me column names",
  "What's the summary?",
  "How many rows and columns?",
];

export default function AIAssistant({ csvData }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      text: 'Hello! 👋 I\'m your DataNova AI Assistant. Upload a dataset and ask me questions about it!',
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

    if (!csvData) {
      return "Please upload a CSV file first to analyze your data. You can do this by clicking the upload area above.";
    }

    if (lowerMessage.includes('column') || lowerMessage.includes('field')) {
      if (csvData.columns && csvData.columns.length > 0) {
        return `Your dataset has ${csvData.columns.length} columns: ${csvData.columns.join(', ')}`;
      }
      return "No column information available.";
    }

    if (lowerMessage.includes('row') || lowerMessage.includes('record') || lowerMessage.includes('how many')) {
      return `Your dataset "${csvData.fileName || 'Uploaded file'}" contains ${csvData.rowCount || 0} rows and ${csvData.columnCount || 0} columns.`;
    }

    if (lowerMessage.includes('summary') || lowerMessage.includes('about')) {
      if (csvData.summary) {
        return csvData.summary;
      }
      return "No summary available for this dataset yet.";
    }

    if (lowerMessage.includes('contain') || lowerMessage.includes('dataset')) {
      let response = `📊 Dataset Overview:\n`;
      response += `• File: ${csvData.fileName || 'N/A'}\n`;
      response += `• Rows: ${csvData.rowCount || 0}\n`;
      response += `• Columns: ${csvData.columnCount || 0}\n`;
      
      if (csvData.columns && csvData.columns.length > 0) {
        response += `• Fields: ${csvData.columns.slice(0, 5).join(', ')}${csvData.columns.length > 5 ? '...' : ''}`;
      }
      
      return response;
    }

    if (lowerMessage.includes('help')) {
      return "I can help you understand your dataset! Try asking:\n• What columns does this have?\n• How many rows?\n• What's the summary?\n• What does this dataset contain?";
    }

    return `I'm here to help you analyze "${csvData.fileName || 'your data'}". You can ask me about the columns, row count, summary, or general information about the dataset.`;
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full shadow-2xl hover:shadow-orange-500/50 hover:scale-110 transition-all z-50 flex items-center justify-center group"
          aria-label="Open AI Assistant"
        >
          <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-8 right-8 w-96 h-[600px] bg-white border border-slate-200 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-5 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs opacity-90">Ask me about your data</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {Array.isArray(messages) && messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm shadow-sm border border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
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
                <div className="bg-white text-slate-800 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-slate-200 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && !isLoading && csvData && (
            <div className="px-4 py-3 border-t border-slate-200 bg-white">
              <p className="text-xs text-slate-500 mb-2 font-medium">
                Try asking:
              </p>
              <div className="space-y-2">
                {Array.isArray(SUGGESTED_QUESTIONS) && SUGGESTED_QUESTIONS.map((question) => (
                  <button
                    key={question}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="w-full text-left text-xs p-2.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-300 transition text-slate-700 font-medium"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-slate-200 p-4 bg-white">
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
                placeholder="Ask about your data..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-orange-400 focus:bg-white transition"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}