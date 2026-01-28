'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext"; // Using Shared Context
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, FileText, Download, Sparkles, 
  Loader2, AlertCircle, Lightbulb, ExternalLink, FileJson, History
} from 'lucide-react';

export default function SummarizePage() {
  const { sharedData } = useData(); // Global dataset
  const [localData, setLocalData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryStyle, setSummaryStyle] = useState('Executive Summary');

  // Effect: Auto-load data if global state exists, but allow local re-generation for styles
  useEffect(() => {
    if (sharedData && !localData) {
      setLocalData(sharedData);
    }
  }, [sharedData, localData]);

  const handleStyleChange = async (newStyle: string) => {
    setSummaryStyle(newStyle);
    if (!sharedData) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Re-triggering the backend with the NEW style using the same data context
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          existingData: sharedData, // Send back the context
          style: newStyle 
        }),
      });

      if (!res.ok) throw new Error("Failed to re-generate summary style.");

      const result = await res.json();
      setLocalData(result);
    } catch (err: any) {
      setError("Could not update summary style. Using default.");
    } finally {
      setIsGenerating(false);
    }
  };

  const exportSummary = (format: 'txt' | 'json') => {
    if (!localData) return;
    const content = format === 'json' ? JSON.stringify(localData, null, 2) : localData.summary;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataNova_Summary.${format}`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto pt-12 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3 tracking-tighter uppercase italic">
              <Sparkles className="text-orange-500" /> AI Summarizer
            </h1>
            <p className="text-slate-500 mt-2">
              {sharedData ? `Currently Analyzing: ${sharedData.fileName}` : "Upload a file on the Dashboard to begin."}
            </p>
          </div>

          {sharedData && (
            <div className="flex flex-col gap-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Tone</label>
               <div className="flex p-1 bg-slate-200 rounded-lg">
                  {['Executive', 'Technical', 'Business'].map((style) => (
                    <button
                      key={style}
                      onClick={() => handleStyleChange(style)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                        summaryStyle === style ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
               </div>
            </div>
          )}
        </div>

        {!sharedData ? (
          <Card className="p-16 border-dashed border-2 flex flex-col items-center justify-center text-center bg-white/50">
            <History size={48} className="text-slate-200 mb-4" />
            <h2 className="text-xl font-bold text-slate-800">No Active Dataset</h2>
            <p className="text-slate-500 max-w-xs mb-6">Please return to the dashboard and upload a CSV file to generate an AI summary.</p>
            <Button asChild className="bg-orange-600">
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-6">
              <Card className="border-none shadow-xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white">
                <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-orange-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">{summaryStyle} View</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => exportSummary('txt')} className="h-8 text-[10px] font-bold hover:bg-white/10">TXT</Button>
                    <Button variant="ghost" size="sm" onClick={() => exportSummary('json')} className="h-8 text-[10px] font-bold hover:bg-white/10">JSON</Button>
                  </div>
                </div>
                <CardContent className="p-8 md:p-12 relative">
                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                      <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
                      <p className="text-sm font-bold text-slate-600">Re-shaping insights...</p>
                    </div>
                  )}
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg whitespace-pre-wrap">
                    {localData?.summary || sharedData.summary}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Insights */}
              <Card className="bg-orange-50 border-orange-100 shadow-none rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-orange-800 mb-4 flex items-center gap-2">
                    <Lightbulb size={20}/> Key Takeaways
                  </h3>
                  <ul className="space-y-3">
                    {(localData?.insights || sharedData.insights || []).map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-orange-900 flex gap-2">
                        <span className="text-orange-400 font-bold">•</span> {insight}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Resource Links */}
              <Card className="shadow-none border-slate-200 rounded-2xl">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <ExternalLink size={20} className="text-blue-500"/> Recommended Reading
                  </h3>
                  <div className="space-y-2">
                    {(localData?.resources || sharedData.resources || []).map((res: any, i: number) => (
                      <a key={i} href={res.url} target="_blank" rel="noreferrer" className="flex items-center justify-between p-3 rounded-xl border bg-slate-50 hover:bg-white hover:border-orange-300 transition text-sm font-bold text-slate-700">
                        <span className="truncate">{res.title}</span>
                        <ArrowLeft size={14} className="rotate-180 text-slate-300" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}