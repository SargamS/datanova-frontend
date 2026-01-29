'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Send, X, Sparkles, Loader, MessageSquare } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Chatbot({ csvData }: { csvData?: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "I'm the DataNova AI. I can analyze your CSV or explain how our Figma export works. What's on your mind?",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const SITE_INFO = {
    features:
      'DataNova offers AI data summarization, automated charting (Visualizer), and high-fidelity Figma exports for designers.',
    figma:
      'Our Figma feature converts your CSV into a JSON format that our Figma Plugin uses to build instant UI components.',
    visualizer:
      'The Visualizer creates Bar, Line, Pie, and Scatter plots. It also features a Pinterest-style inspiration gallery.',
    export:
      'You can export your analysis as professional reports in TXT, JSON, or PNG formats.',
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg = input
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      let response = ''
      const query = userMsg.toLowerCase()

      if (query.includes('how') || query.includes('what') || query.includes('feature')) {
        if (query.includes('figma')) response = SITE_INFO.figma
        else if (query.includes('visual')) response = SITE_INFO.visualizer
        else response = SITE_INFO.features
      } else if (csvData && typeof csvData === 'object') {
        // FIXED: Safe access to csvData properties
        const fileName = csvData.fileName || 'your dataset'
        const columns = Array.isArray(csvData.columns) ? csvData.columns : []
        const summary = csvData.summary || ''

        if (query.includes('column')) {
          if (columns.length > 0) {
            response = `Your dataset "${fileName}" has these columns: ${columns.join(', ')}.`
          } else {
            response = `Your dataset "${fileName}" doesn't have column information available yet.`
          }
        } else if (query.includes('summary') || query.includes('insight')) {
          if (summary) {
            response = `Analysis for ${fileName}: ${summary.substring(0, 150)}...`
          } else {
            response = `Your dataset "${fileName}" is loaded, but summary is still being generated.`
          }
        } else {
          response = `I can help analyze ${fileName}. Ask about columns or summaries.`
        }
      } else {
        response =
          'Upload a CSV on the dashboard so I can give you specific insights about your data.'
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-900 hover:bg-orange-600 shadow-xl z-50"
      >
        {isOpen ? <X /> : <MessageSquare />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 h-[450px] z-50 flex flex-col shadow-2xl border-none rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-slate-900 p-4 text-white flex items-center gap-2">
            <Sparkles size={16} className="text-orange-400" />
            <span className="font-bold text-sm uppercase italic">DataNova AI</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 text-sm">
            {Array.isArray(messages) && messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-xl max-w-[85%] ${
                    m.role === 'user'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && <Loader className="animate-spin text-slate-300" size={16} />}
            <div ref={scrollRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input
              className="flex-1 bg-slate-100 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500"
              placeholder="Ask about your data..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" onClick={handleSend} className="bg-slate-900">
              <Send size={14} />
            </Button>
          </div>
        </Card>
      )}
    </>
  )
}