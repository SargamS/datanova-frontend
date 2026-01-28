'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  FileText,
  Copy,
  Download,
  Sparkles,
  Loader2,
  Zap,
  Upload,
  AlertCircle
} from 'lucide-react';

export default function SummarizePage() {
  // --- State ---
  const [summary, setSummary] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState('Executive Summary');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsGenerating(true);
    setError(null);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      // We also send the summary style to the backend if your backend supports it
      formData.append("style", summaryStyle);

      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Analysis failed with status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Set the real summary from the backend
      setSummary(data.summary);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    }
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `summary-${fileName || 'data'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-xl border-b border-border/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/analyze" className="flex items-center gap-2 hover:text-primary transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Analyze</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">
                AI Summaries
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Transform complex datasets into clear, actionable summaries using advanced AI analysis.
            </p>
          </div>

          {!summary ? (
            <>
              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              )}

              {/* Upload Section */}
              <Card className="p-10 mb-8 border-primary/20 bg-card shadow-xl">
                <h2 className="text-2xl font-bold mb-4 text-foreground">Prepare Your Analysis</h2>
                <p className="text-muted-foreground mb-8">
                  Upload your CSV file and select a summary style to begin.
                </p>

                <div className="space-y-6">
                  {/* Hidden Input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept=".csv" 
                    className="hidden" 
                  />

                  <div>
                    <label className="block text-sm font-semibold mb-3">Target Dataset</label>
                    <div 
                      onClick={handleButtonClick}
                      className={`border-2 border-dashed rounded-2xl p-10 text-center transition cursor-pointer 
                        ${isGenerating ? 'opacity-50 pointer-events-none' : 'border-primary/30 hover:border-primary hover:bg-primary/5'}
                      `}
                    >
                      {isGenerating ? (
                        <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin mb-4" />
                      ) : (
                        <Upload className="w-12 h-12 text-primary/60 mx-auto mb-4" />
                      )}
                      <p className="text-lg font-medium text-foreground">
                        {fileName ? fileName : "Click to select a CSV file"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Maximum file size: 10MB</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">Desired Summary Style</label>
                    <select 
                      className="w-full px-5 py-3 rounded-xl border border-input bg-background text-foreground hover:border-primary transition"
                      value={summaryStyle}
                      onChange={(e) => setSummaryStyle(e.target.value)}
                    >
                      <option>Executive Summary</option>
                      <option>Technical Analysis</option>
                      <option>Business Insights</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleButtonClick}
                  disabled={isGenerating}
                  className="w-full mt-10 gap-2 text-lg py-6 font-bold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating AI Insights...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </Card>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "GPT-4 Powered", desc: "Context-aware analysis of your specific variables." },
                  { title: "Smart Formatting", desc: "Results optimized for reports and slides." },
                  { title: "Anomaly Detection", desc: "AI highlights inconsistencies in your data." },
                  { title: "Secure Processing", desc: "Data is analyzed and never stored permanently." }
                ].map((feature, i) => (
                  <Card key={i} className="p-5 border-border/50 bg-card/50">
                    <h3 className="font-bold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-xs text-muted-foreground">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Summary Display */}
              <Card className="p-8 bg-card border-2 border-primary/20 rounded-2xl mb-6 shadow-2xl relative">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <FileText className="w-6 h-6 text-primary" />
                      {summaryStyle}
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">Generated for: {fileName}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                      <Copy className="w-4 h-4" />
                      {copiedToClipboard ? 'Copied' : 'Copy'}
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadSummary} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap bg-muted/30 p-8 rounded-xl border border-border text-foreground text-base leading-relaxed font-sans">
                  {summary}
                </div>
              </Card>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/visualize" className="flex-1">
                  <Button className="w-full py-6 font-bold">Explore Visualizations</Button>
                </Link>
                <Button 
                  variant="outline" 
                  className="flex-1 py-6 font-bold bg-transparent"
                  onClick={() => setSummary(null)}
                >
                  Generate New Summary
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}