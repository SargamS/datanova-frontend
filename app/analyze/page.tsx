'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  Loader2,
  Database,
  LayoutTemplate,
  FileText,
  AlertCircle,
  Sparkles,
  BarChart3
} from "lucide-react";
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
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Only CSV files are allowed.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://datanova-backend.onrender.com/api/summary", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || "Upload failed");
      }

      const data = await res.json();

      setDataset({
        fileName: data.fileName || file.name,
        uploadedAt: new Date(),
        rowCount: data.row_count || 0,
        columnCount: data.column_count || 0,
        columns: Array.isArray(data.columns) ? data.columns : [],
        summary: data.summary || "No summary available",
        head: Array.isArray(data.head) ? data.head.slice(0, 10) : [],
      });

    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      <nav className="sticky top-0 bg-white/80 backdrop-blur border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs">
              DN
            </div>
            DataNova
          </div>
        </div>
      </nav>

      <div className="pt-10 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900">Analyze Dataset</h1>
        <p className="text-slate-500 mb-10">Upload a CSV to generate insights & visualizations</p>

        {!dataset && (
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <div
              onDragEnter={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`h-80 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition
                ${dragActive ? "border-orange-500 bg-orange-50" : "border-slate-300 bg-white hover:shadow-lg"}
                ${isLoading ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              {isLoading ? (
                <Loader2 className="animate-spin w-10 h-10 text-orange-500" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-slate-700 mb-4" />
                  <h3 className="text-xl font-bold">Drop CSV file here</h3>
                  <p className="text-slate-400 text-sm">or click to upload</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                hidden
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {dataset && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard title="Rows" value={dataset.rowCount} icon={<Database />} />
              <StatCard title="Columns" value={dataset.columnCount} icon={<LayoutTemplate />} />
              <StatCard title="File" value={dataset.fileName} icon={<FileText />} isTruncate />

              <Link href="/visualize">
                <Card className="bg-slate-900 text-white hover:bg-orange-600 transition cursor-pointer">
                  <CardContent className="pt-6">
                    <BarChart3 className="w-5 h-5 mb-2" />
                    <div className="font-bold">Visualize</div>
                    <div className="text-xs text-slate-300">Create charts</div>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="text-orange-500 w-4 h-4" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 italic">{dataset.summary || "No summary available."}</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Data Preview (Top 10)</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                {dataset.columns && dataset.columns.length > 0 && dataset.head && dataset.head.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        {dataset.columns.map((col, idx) => (
                          <th key={`${col}-${idx}`} className="px-4 py-2 border-b text-left">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.head.map((row, i) => (
                        <tr key={i} className="border-b">
                          {dataset.columns.map((col, idx) => (
                            <td key={`${col}-${idx}`} className="px-4 py-2 text-slate-600">
                              {row?.[col]?.toString() || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No data preview available</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="flex justify-center">
              <Button 
                onClick={() => setDataset(null)} 
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Another File
              </Button>
            </div>
          </div>
        )}
      </div>

      <AIAssistant csvData={dataset} />
    </main>
  );
}

function StatCard({ title, value, icon, isTruncate }: any) {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center pb-2">
        <CardTitle className="text-xs text-slate-400 uppercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={`text-xl font-bold ${isTruncate ? "truncate" : ""}`}>{value}</div>
      </CardContent>
    </Card>
  );
}