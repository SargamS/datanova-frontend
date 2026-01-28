'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  ArrowLeft, 
  Upload, 
  Loader, 
  Database, 
  LayoutTemplate, 
  FileText, 
  AlertCircle, 
  Sparkles,
  BarChart3,
  Palette,
  ChevronRight
} from "lucide-react";
// Import your AI Assistant component
import AIAssistant from "@/components/chatbot"; 

interface DatasetInfo {
  fileName: string;
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  columns: string[];
  summary: string;
  head: Array<Record<string, any>>; 
}

export default function AnalyzePage() {
  const [dragActive, setDragActive] = useState(false);
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEvents = (e: React.DragEvent, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed: ${res.status}`);
      }

      const data = await res.json();

      setDataset({
        fileName: file.name,
        uploadedAt: new Date(),
        rowCount: data.row_count || 0,
        columnCount: data.column_count || 0,
        columns: data.columns || [],
        summary: data.summary || "No summary available.",
        head: data.head || []
      });
    } catch (err: any) {
      setError(err.message || "Failed to analyze file.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-xs italic">DN</div>
            <span className="font-bold text-slate-800">DataNova</span>
          </div>
        </div>
      </nav>

      <div className="pt-10 px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Data Analysis</h1>
          <p className="text-slate-500 text-lg">Structure your insights and prepare for visualization.</p>
        </div>

        {!dataset ? (
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700 animate-in fade-in zoom-in">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium text-sm">{error}</p>
              </div>
            )}

            <div
              onDragEnter={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                flex flex-col items-center justify-center h-96 rounded-[2rem] border-2 border-dashed transition-all duration-500 cursor-pointer
                ${dragActive ? "border-orange-500 bg-orange-50/50 scale-[1.01] rotate-1" : "border-slate-300 bg-white hover:border-slate-400 hover:shadow-xl"}
                ${isLoading ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Loader className="w-12 h-12 animate-spin text-orange-600 mb-4" />
                    <Sparkles className="w-5 h-5 text-blue-500 absolute -top-1 -right-1 animate-pulse" />
                  </div>
                  <p className="font-bold text-slate-700 uppercase tracking-widest text-xs">Processing Intelligence</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6 rotate-3 hover:rotate-0 transition-transform shadow-lg">
                    <Upload className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Drop your dataset</h3>
                  <p className="text-slate-400 text-sm font-medium">CSV files only • Max 10MB</p>
                  <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Total Rows" value={dataset.rowCount.toLocaleString()} icon={<Database className="text-blue-500" />} />
              <StatCard title="Dimensions" value={dataset.columnCount} icon={<LayoutTemplate className="text-purple-500" />} />
              <StatCard title="File Ref" value={dataset.fileName.split('.')[0]} icon={<FileText className="text-orange-500" />} isTruncate />
              
              <Link href="/visualize" className="group">
                <Card className="h-full bg-slate-900 text-white hover:bg-orange-600 transition-colors border-none cursor-pointer">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-2">
                      <BarChart3 className="w-5 h-5 text-orange-400 group-hover:text-white transition-colors" />
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
                    </div>
                    <div className="font-bold">Visualize Now</div>
                    <div className="text-[10px] text-slate-400 group-hover:text-white uppercase tracking-tighter">Generate Charts</div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* AI Summary Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-2 border-slate-100 shadow-sm overflow-hidden">
                <div className="bg-slate-900 p-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-white font-bold text-xs uppercase tracking-widest italic">AI Executive Summary</span>
                </div>
                <CardContent className="pt-6">
                  <p className="text-slate-600 leading-relaxed text-lg italic">"{dataset.summary}"</p>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Next Phase</h4>
                <div className="grid grid-cols-1 gap-3">
                  <ActionButton 
                    href="/export" 
                    title="Design in Figma" 
                    desc="Convert to UI Components" 
                    icon={<Palette className="w-4 h-4" />} 
                    color="bg-purple-100 text-purple-700" 
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => setDataset(null)} 
                    className="w-full justify-start gap-3 h-14 rounded-xl border-dashed hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Upload className="w-4 h-4" />
                    <div className="text-left">
                      <div className="text-sm font-bold">New Upload</div>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Data Preview */}
            <Card className="border-none shadow-xl overflow-hidden rounded-3xl">
              <div className="px-6 py-4 bg-white border-b flex items-center justify-between">
                <CardTitle className="text-sm font-black uppercase tracking-tighter">Raw Data Preview (Top 10)</CardTitle>
                <div className="flex gap-1">
                    {dataset.columns.slice(0, 3).map(c => <div key={c} className="w-2 h-2 rounded-full bg-slate-200" />)}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-slate-400 uppercase bg-slate-50/50">
                    <tr>
                      {dataset.columns.map((col) => (
                        <th key={col} className="px-6 py-4 whitespace-nowrap font-bold border-b">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataset.head.map((row, i) => (
                      <tr key={i} className="bg-white hover:bg-slate-50/80 transition-colors">
                        {dataset.columns.map((col) => (
                          <td key={`${i}-${col}`} className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                            {row[col]?.toString() || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* THE SMART ASSISTANT: Receives dataset immediately */}
      <AIAssistant csvData={dataset} />
    </main>
  );
}

// Sub-components for cleaner code
function StatCard({ title, value, icon, isTruncate }: { title: string, value: any, icon: any, isTruncate?: boolean }) {
  return (
    <Card className="border-none shadow-sm bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{title}</CardTitle>
        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center scale-75">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className={`text-xl font-black text-slate-900 ${isTruncate ? 'truncate' : ''}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

function ActionButton({ href, title, desc, icon, color }: { href: string, title: string, desc: string, icon: any, color: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full justify-start gap-3 h-16 rounded-xl border-slate-200 hover:border-slate-900 hover:bg-slate-50 transition-all">
        <div className={`p-2 rounded-lg ${color}`}>{icon}</div>
        <div className="text-left">
          <div className="text-sm font-black">{title}</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-tighter">{desc}</div>
        </div>
      </Button>
    </Link>
  );
}