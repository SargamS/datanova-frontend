'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, FileText, Sparkles, Loader2, Lightbulb, 
  ExternalLink, History, Upload, X, FileCheck, 
  AlertCircle, Settings2 
} from 'lucide-react';

export default function SummarizePage() {
  const { sharedData, setSharedData } = useData();
  const [localData, setLocalData] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Summary customization options
  const [summaryLength, setSummaryLength] = useState('medium');
  const [summaryTone, setSummaryTone] = useState('professional');
  const [audienceType, setAudienceType] = useState('general');
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (sharedData && !localData) {
      setLocalData(sharedData);
    }
  }, [sharedData, localData]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (!csvFile) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    await processFile(csvFile);
  }, [summaryLength, summaryTone, audienceType]);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    await processFile(file);
  }, [summaryLength, summaryTone, audienceType]);

  const processFile = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('length', summaryLength);
      formData.append('tone', summaryTone);
      formData.append('audience', audienceType);

      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to analyze file");
      }

      const result = await res.json();
      setLocalData(result);
      setSharedData(result); // Update context
      
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRegenerateSummary = async () => {
    if (!sharedData) return;

    setIsGenerating(true);

    try {
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingData: sharedData,
          length: summaryLength,
          tone: summaryTone,
          audience: audienceType,
        }),
      });

      if (!res.ok) throw new Error("Failed to regenerate summary.");

      const result = await res.json();
      setLocalData(result);

    } catch (err) {
      console.error(err);
      setUploadError('Failed to regenerate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportSummary = (format: 'txt' | 'json' | 'md') => {
    if (!localData) return;
    
    let content = '';
    let mimeType = 'text/plain';
    
    if (format === 'json') {
      content = JSON.stringify(localData, null, 2);
      mimeType = 'application/json';
    } else if (format === 'md') {
      content = `# ${localData.fileName || 'Data Summary'}\n\n## Summary\n\n${localData.summary || ''}\n\n## Key Insights\n\n${insights.map((i: string) => `- ${i}`).join('\n')}`;
      mimeType = 'text/markdown';
    } else {
      content = localData.summary || "";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataNova_Summary_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
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

  // No active dataset view with drag-drop
  if (!sharedData) {
    return (
      <main className="min-h-screen bg-slate-50">
        <nav className="h-16 border-b bg-white flex items-center px-6">
          <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </nav>

        <div className="max-w-4xl mx-auto pt-20 px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black mb-2">AI Summarizer</h1>
            <p className="text-slate-500">Upload a CSV file to generate intelligent summaries</p>
          </div>

          <Card 
            className={`relative overflow-hidden transition-all ${
              isDragging 
                ? 'border-orange-500 border-2 bg-orange-50' 
                : 'border-dashed border-2'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-16 text-center">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">Processing your data...</h3>
                  <p className="text-slate-500">This may take a moment</p>
                </div>
              ) : (
                <>
                  <Upload size={48} className={`mx-auto mb-4 ${isDragging ? 'text-orange-500' : 'text-slate-300'}`} />
                  <h2 className="text-xl font-bold mb-2">Drop your CSV file here</h2>
                  <p className="text-slate-500 mb-6">or click to browse</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      Choose CSV File
                    </label>
                  </Button>

                  {uploadError && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle size={16} />
                      <span className="text-sm">{uploadError}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Customization Options Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-sm text-slate-600">Summary Length</h3>
                <div className="space-y-2">
                  {['concise', 'medium', 'lengthy'].map(length => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition ${
                        summaryLength === length 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-sm text-slate-600">Tone</h3>
                <div className="space-y-2">
                  {['professional', 'technical', 'casual'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSummaryTone(tone)}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition ${
                        summaryTone === tone 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-sm text-slate-600">Audience</h3>
                <div className="space-y-2">
                  {['general', 'executive', 'technical', 'academic'].map(audience => (
                    <button
                      key={audience}
                      onClick={() => setAudienceType(audience)}
                      className={`w-full px-4 py-2 text-sm font-medium rounded-lg transition ${
                        audienceType === audience 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    );
  }

  // Active dataset view with summary
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="h-16 border-b bg-white flex items-center px-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-slate-500 hover:text-orange-600">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-6xl mx-auto pt-12 px-6">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl font-black flex items-center gap-3">
              <Sparkles className="text-orange-500" /> AI Summarizer
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <FileCheck className="text-green-600" size={16} />
              <p className="text-slate-600">Currently analyzing: <span className="font-bold">{sharedData.fileName || "N/A"}</span></p>
            </div>
          </div>

          {/* Upload new file button */}
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="csv-upload-active"
            />
            <Button asChild variant="outline" className="border-orange-200 hover:border-orange-400">
              <label htmlFor="csv-upload-active" className="cursor-pointer flex items-center gap-2">
                <Upload size={16} />
                Upload New CSV
              </label>
            </Button>
          </div>
        </div>

        {/* Customization Controls */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Settings2 size={18} className="text-orange-500" />
              <h3 className="font-bold">Customize Summary</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Length */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Length</label>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {['concise', 'medium', 'lengthy'].map(length => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition ${
                        summaryLength === length 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Tone</label>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {['professional', 'technical', 'casual'].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setSummaryTone(tone)}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition ${
                        summaryTone === tone 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Audience */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Audience</label>
                <div className="grid grid-cols-2 gap-1 bg-slate-100 rounded-lg p-1">
                  {['general', 'executive', 'technical', 'academic'].map(audience => (
                    <button
                      key={audience}
                      onClick={() => setAudienceType(audience)}
                      className={`px-2 py-2 text-xs font-bold rounded-md transition ${
                        audienceType === audience 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleRegenerateSummary}
                disabled={isGenerating}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={16} />
                    Regenerate Summary
                  </>
                )}
              </Button>
            </div>

            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span className="text-sm">{uploadError}</span>
                <button onClick={() => setUploadError(null)} className="ml-auto">
                  <X size={16} />
                </button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Summary */}
          <div className="lg:col-span-8">
            <Card className="shadow-xl rounded-3xl overflow-hidden">
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-orange-400" />
                  <span className="text-xs font-bold">
                    {summaryTone.charAt(0).toUpperCase() + summaryTone.slice(1)} Summary 
                    <span className="text-slate-400 ml-2">• {summaryLength}</span>
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => exportSummary('txt')} className="hover:bg-slate-800">
                    TXT
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => exportSummary('md')} className="hover:bg-slate-800">
                    MD
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => exportSummary('json')} className="hover:bg-slate-800">
                    JSON
                  </Button>
                </div>
              </div>

              <CardContent className="p-8 relative">
                {isGenerating && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-orange-500 mb-3" size={40} />
                    <p className="text-sm font-bold text-slate-600">Re-shaping insights...</p>
                    <p className="text-xs text-slate-500 mt-1">This may take a moment</p>
                  </div>
                )}
                <div className="whitespace-pre-wrap text-slate-700 text-base leading-relaxed">
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
                  <ul className="space-y-3">
                    {insights.map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-orange-900 flex gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{insight}</span>
                      </li>
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
                        className="block p-3 rounded-lg border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition text-sm font-medium text-slate-700 hover:text-orange-900"
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

            {/* Data Stats Card */}
            {localData?.stats && (
              <Card className="rounded-2xl border-2 border-slate-200">
                <CardContent className="p-6">
                  <h3 className="font-bold mb-4 text-sm text-slate-600">Dataset Stats</h3>
                  <div className="space-y-2">
                    {Object.entries(localData.stats).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-bold">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}