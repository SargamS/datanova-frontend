'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, FileText, Sparkles, Loader2, Lightbulb, 
  ExternalLink, History, Upload, X, FileCheck, 
  AlertCircle, Settings2, Download 
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

      const res = await fetch("https://datanova-backend.onrender.com/api/summary", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to analyze file");
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
    if (!localData) return;

    setIsGenerating(true);
    setUploadError(null);

    try {
      const res = await fetch("https://datanova-backend.onrender.com/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          existingData: localData,
          length: summaryLength,
          tone: summaryTone,
          audience: audienceType,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to regenerate summary");
      }

      const result = await res.json();
      setLocalData(result);
      setSharedData(result); // Update context

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to regenerate summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportSummary = (format: 'txt' | 'json' | 'md') => {
    if (!localData) return;
    
    let content = '';
    let mimeType = 'text/plain';
    let extension = format;
    
    if (format === 'json') {
      content = JSON.stringify(localData, null, 2);
      mimeType = 'application/json';
    } else if (format === 'md') {
      content = `# ${localData.fileName || 'Data Summary'}\n\n`;
      content += `**Generated**: ${new Date().toLocaleString()}\n\n`;
      content += `## Summary\n\n${localData.summary || ''}\n\n`;
      content += `## Key Insights\n\n${insights.map((i: string) => `- ${i}`).join('\n')}\n\n`;
      content += `## Dataset Information\n\n`;
      content += `- **Rows**: ${localData.row_count || 0}\n`;
      content += `- **Columns**: ${localData.column_count || 0}\n`;
      content += `- **Mode**: ${localData.mode || 'N/A'}\n`;
      mimeType = 'text/markdown';
    } else {
      content = localData.summary || "";
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DataNova_Summary_${Date.now()}.${extension}`;
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
  if (!sharedData && !localData) {
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

  const displayData = localData || sharedData;

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
              <p className="text-slate-600">Currently analyzing: <span className="font-bold">{displayData.fileName || "N/A"}</span></p>
            </div>
          </div>

          {/* Upload new file button */}
          <div className="flex gap-2">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
              id="csv-upload-active"
              disabled={isUploading}
            />
            <Button 
              asChild 
              variant="outline" 
              className="border-orange-200 hover:border-orange-400"
              disabled={isUploading}
            >
              <label htmlFor="csv-upload-active" className="cursor-pointer flex items-center gap-2">
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {isUploading ? 'Uploading...' : 'Upload New CSV'}
              </label>
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {uploadError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{uploadError}</span>
            </div>
            <button onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Customization Controls */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings2 size={18} className="text-orange-500" />
                <h3 className="font-bold">Customize Summary</h3>
              </div>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Length */}
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Length</label>
                <div className="flex bg-slate-100 rounded-lg p-1">
                  {['concise', 'medium', 'lengthy'].map(length => (
                    <button
                      key={length}
                      onClick={() => setSummaryLength(length)}
                      disabled={isGenerating}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition ${
                        summaryLength === length 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      disabled={isGenerating}
                      className={`flex-1 px-3 py-2 text-xs font-bold rounded-md transition ${
                        summaryTone === tone 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                      disabled={isGenerating}
                      className={`px-2 py-2 text-xs font-bold rounded-md transition ${
                        audienceType === audience 
                          ? 'bg-white text-orange-600 shadow' 
                          : 'text-slate-500 hover:text-slate-700'
                      } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {audience.charAt(0).toUpperCase() + audience.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Summary */}
            <Card className="bg-white">
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="text-orange-500" size={20} />
                    <h2 className="text-xl font-bold">Summary</h2>
                    {displayData.mode === 'ai' && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                        AI Generated
                      </span>
                    )}
                    {displayData.mode === 'fallback' && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                        Statistical
                      </span>
                    )}
                  </div>
                  
                  {/* Export Options */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportSummary('txt')}
                      className="text-xs"
                    >
                      <Download size={14} className="mr-1" /> TXT
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportSummary('md')}
                      className="text-xs"
                    >
                      <Download size={14} className="mr-1" /> MD
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => exportSummary('json')}
                      className="text-xs"
                    >
                      <Download size={14} className="mr-1" /> JSON
                    </Button>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  {isGenerating ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin text-orange-500 mr-3" size={24} />
                      <span className="text-slate-600">Generating new summary...</span>
                    </div>
                  ) : (
                    <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {displayData.summary || "No summary available"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Dataset Stats */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-orange-500" />
                  Dataset Statistics
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Rows</p>
                    <p className="text-2xl font-black">{displayData.row_count?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Columns</p>
                    <p className="text-2xl font-black">{displayData.column_count || 0}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-1">Missing</p>
                    <p className="text-2xl font-black">{displayData.stats?.['Missing Values'] || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Insights */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="text-orange-500" size={18} />
                  Key Insights
                </h3>
                {insights.length > 0 ? (
                  <ul className="space-y-3">
                    {insights.map((insight: string, idx: number) => (
                      <li key={idx} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No insights available</p>
                )}
              </CardContent>
            </Card>

            {/* Recommended Resources */}
            <Card className="bg-white">
              <CardContent className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ExternalLink className="text-orange-500" size={18} />
                  Resources
                </h3>
                {resources.length > 0 ? (
                  <ul className="space-y-3">
                    {resources.map((resource: any, idx: number) => (
                      <li key={idx}>
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                        >
                          {resource.title}
                          <ExternalLink size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No resources available</p>
                )}
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-6">
                <h3 className="font-bold mb-3 text-sm text-slate-600">Current Preferences</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Length:</span>
                    <span className="font-bold text-slate-700">{summaryLength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tone:</span>
                    <span className="font-bold text-slate-700">{summaryTone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Audience:</span>
                    <span className="font-bold text-slate-700">{audienceType}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}