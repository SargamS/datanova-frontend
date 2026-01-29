'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, FileText, Sparkles, Loader2, Lightbulb, ExternalLink, History } from 'lucide-react';

export default function SummarizePage() {
  const { sharedData } = useData();
  const [localData, setLocalData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState('Executive');

  useEffect(() => {
    if (sharedData && !localData) {
      setLocalData(sharedData);
    }
  }, [sharedData, localData]);

  const handleStyleChange = async (newStyle: string) => {
    setSummaryStyle(newStyle);
    if (!sharedData) return;

    setIsGenerating(true);

    try {
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingData: sharedData,
          style: newStyle
        }),
      });

      if (!res.ok) throw new Error("Failed to regenerate summary.");

      const result = await res.json();
      setLocalData(result);

    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportSummary = (format: 'txt' | 'json') => {
    if (!localData) return;
    const content = format === 'json' ? JSON.stringify(localData, null, 2) : localData.summary || "";
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataNova_Summary.${format}`;
    a.click();
  };

  // Safe arrays for insights and resources
  const insights = Array.isArray(localData?.insights) 
    ? localData.insights 
    : Array.isArray(sharedData?.insights) 
    ? sharedData.insights 
    : [];

  const resources = Array.isArray(localData?.resources) 
    ? localData.resources 
    : Array.isArray(sharedData?.resources) 
    ? sharedData.resources 
    : [];

  if (!sharedData) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="p-16 text-center">
          <History size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold">No Active Dataset</h2>
          <p className="text-slate-500 mb-6">Upload a CSV file on the Dashboard to generate a summary.</p>
          <Button asChild className="bg-orange-600">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="h-16 border-b bg-white flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto pt-12 px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Sparkles className="text-orange-500" /> AI Summarizer
            </h1>
            <p className="text-slate-500 mt-2">Currently analyzing: {sharedData.fileName || "N/A"}</p>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">Tone</label>
            <div className="flex bg-slate-200 rounded-lg p-1 mt-1">
              {['Executive', 'Technical', 'Business'].map(style => (
                <button
                  key={style}
                  onClick={() => handleStyleChange(style)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition ${
                    summaryStyle === style ? 'bg-white text-orange-600 shadow' : 'text-slate-500'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Summary */}
          <div className="lg:col-span-8">
            <Card className="shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-slate-900 p-4 flex justify-between text-white">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-orange-400" />
                  <span className="text-xs font-bold">{summaryStyle} Summary</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => exportSummary('txt')}>TXT</Button>
                  <Button size="sm" variant="ghost" onClick={() => exportSummary('json')}>JSON</Button>
                </div>
              </div>

              <CardContent className="p-8 relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                    <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
                    <p className="text-sm font-bold text-slate-600">Re-shaping insights...</p>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-slate-700 text-lg leading-relaxed">
                  {localData?.summary || sharedData.summary || "No summary available."}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-orange-50 rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold flex items-center gap-2 text-orange-800 mb-4">
                  <Lightbulb size={18} /> Key Takeaways
                </h3>
                {insights.length > 0 ? (
                  <ul className="space-y-2">
                    {insights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-orange-900">• {insight}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-orange-700 italic">No insights available</p>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                  <ExternalLink size={18} className="text-blue-500"/> Recommended Reading
                </h3>
                {resources.length > 0 ? (
                  <div className="space-y-2">
                    {resources.map((res: any, i: number) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="block p-3 rounded-lg border hover:border-orange-400 transition text-sm font-bold"
                      >
                        {res.title}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic">No resources available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}