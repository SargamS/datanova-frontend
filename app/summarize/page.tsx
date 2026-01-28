'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowLeft, FileText, Copy, Download, Sparkles, 
  Loader2, Zap, Upload, AlertCircle, Lightbulb, ExternalLink, FileJson
} from 'lucide-react';

interface SummaryData {
  mainSummary: string;
  insights: string[];
  resources: { title: string; url: string }[];
}

export default function SummarizePage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summaryStyle, setSummaryStyle] = useState('Executive Summary');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true);
    setError(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("style", summaryStyle); // Sending style to backend

      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend failed to process file.");

      const result = await res.json();
      
      // Assuming your backend returns these fields. 
      // If your backend only returns a string, we "fake" the split for UI logic.
      setData({
        mainSummary: result.summary || "No summary generated.",
        insights: result.insights || [
          "Check for high variance in numeric columns.",
          "Identify potential outliers in the top 5% of records.",
          "Consider normalizing data for better AI modeling."
        ],
        resources: result.resources || [
          { title: "Pandas Data Cleaning Guide", url: "https://pandas.pydata.org/docs/user_guide/10min.html" },
          { title: "Kaggle: Exploratory Data Analysis Tutorial", url: "https://www.kaggle.com/learn/exploratory-data-analysis" }
        ]
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportSummary = (format: 'txt' | 'json') => {
    if (!data) return;
    const content = format === 'json' ? JSON.stringify(data, null, 2) : data.mainSummary;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `summary-${Date.now()}.${format}`;
    a.click();
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="h-16 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 flex items-center px-6">
        <Link href="/analyze" className="flex items-center gap-2 text-sm font-medium hover:text-primary">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto pt-12 px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 flex items-center gap-3">
            <Sparkles className="text-purple-600" /> AI Data Summary
          </h1>
          <p className="text-slate-500 mt-2">Get professional insights in multiple formats instantly.</p>
        </div>

        {!data ? (
          <Card className="p-8 border-dashed border-2 bg-white shadow-none">
            {error && <div className="mb-4 text-red-500 flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold mb-2 block">1. Choose Format</label>
                  <select 
                    className="w-full p-3 rounded-lg border bg-white"
                    value={summaryStyle}
                    onChange={(e) => setSummaryStyle(e.target.value)}
                  >
                    <option>Executive Summary</option>
                    <option>Technical Analysis</option>
                    <option>Business Insights</option>
                  </select>
                </div>
                
                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="hidden" accept=".csv" />
                
                <Button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={isGenerating}
                  className="w-full h-16 text-lg font-bold"
                >
                  {isGenerating ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2" />}
                  Upload & Generate
                </Button>
              </div>

              <div className="bg-slate-100 rounded-xl p-6 flex flex-col justify-center">
                <h3 className="font-bold text-slate-700 mb-2">Supported Features:</h3>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">✅ Multiple Formats (Exec, Tech, Business)</li>
                  <li className="flex items-center gap-2">✅ Actionable Business Insights</li>
                  <li className="flex items-center gap-2">✅ Learning Resource Recommendations</li>
                  <li className="flex items-center gap-2">✅ Export to TXT or JSON</li>
                </ul>
              </div>
            </div>
          </Card>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header / Export */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase tracking-widest">{summaryStyle}</p>
                <h2 className="font-bold text-slate-800">{fileName}</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportSummary('txt')}><Download size={14} className="mr-2"/> TXT</Button>
                <Button variant="outline" size="sm" onClick={() => exportSummary('json')}><FileJson size={14} className="mr-2"/> JSON</Button>
                <Button variant="ghost" size="sm" onClick={() => setData(null)}>New</Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Main Summary */}
              <Card className="md:col-span-2 shadow-sm border-none">
                <CardContent className="pt-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-500"/> Analysis</h3>
                  <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {data.mainSummary}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar: Insights & Resources */}
              <div className="space-y-6">
                <Card className="bg-amber-50 border-amber-100 shadow-none">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Lightbulb size={18}/> Insights</h3>
                    <ul className="space-y-3">
                      {data.insights.map((insight, i) => (
                        <li key={i} className="text-sm text-amber-900 bg-white/50 p-2 rounded-md border border-amber-200/50">
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-none border-slate-200">
                  <CardContent className="pt-6">
                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><ExternalLink size={18} className="text-purple-500"/> Resources</h3>
                    <div className="space-y-2">
                      {data.resources.map((res, i) => (
                        <a key={i} href={res.url} target="_blank" rel="noreferrer" className="block p-3 rounded-lg border bg-slate-50 hover:bg-white hover:border-purple-300 transition text-sm font-medium text-slate-700">
                          {res.title}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}