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
  Sparkles 
} from "lucide-react";

// Define the exact shape of data we expect from the backend
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

  // Drag & Drop Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // File Input Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Main Upload Logic
  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file only');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Make sure this URL matches your actual backend URL
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || `Upload failed with status: ${res.status}`);
      }

      const data = await res.json();

      // Check if backend sent an error message
      if (data.error) {
        throw new Error(data.error);
      }

      // Map the backend response to our state
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
      console.error("Upload error:", err);
      setError(err.message || "Failed to analyze file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearDataset = () => {
    setDataset(null);
    setError(null);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="font-bold text-lg text-slate-800">DataNova</span>
        </div>
      </nav>

      <div className="pt-10 pb-20 px-6 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-2">Data Analysis</h1>
        <p className="text-slate-500 text-lg mb-10">
          Upload your CSV to explore insights, structure, and AI summaries.
        </p>

        {!dataset ? (
          /* UPLOAD STATE */
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                flex flex-col items-center justify-center h-80 rounded-3xl border-2 border-dashed transition-all duration-300
                ${dragActive ? "border-blue-500 bg-blue-50/50 scale-[1.02]" : "border-slate-300 bg-white hover:border-slate-400"}
                ${isLoading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
              `}
            >
              {isLoading ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Loader className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                  <p className="font-medium text-slate-600">Analyzing dataset...</p>
                  <p className="text-sm text-slate-400 mt-2">This may take a few moments</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & Drop CSV</h3>
                  <p className="text-slate-500 mb-4">or</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <Button onClick={handleButtonClick} className="rounded-full px-8">
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* DASHBOARD STATE */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Rows</CardTitle>
                  <Database className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataset.rowCount.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Columns</CardTitle>
                  <LayoutTemplate className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataset.columnCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">File Name</CardTitle>
                  <FileText className="w-4 h-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-md font-bold truncate" title={dataset.fileName}>
                    {dataset.fileName}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Sparkles className="w-5 h-5" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {dataset.summary}
                </p>
              </CardContent>
            </Card>

            {/* Column List */}
            <Card>
              <CardHeader>
                <CardTitle>Dataset Columns ({dataset.columns.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {dataset.columns.map((col) => (
                    <span 
                      key={col} 
                      className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-medium border hover:bg-slate-200 transition-colors"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Entries Table */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle>Top 10 Entries</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                    <tr>
                      {dataset.columns.map((col) => (
                        <th key={col} className="px-6 py-3 whitespace-nowrap font-semibold">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataset.head.map((row, i) => (
                      <tr key={i} className="bg-white border-b hover:bg-slate-50 transition-colors">
                        {dataset.columns.map((col) => (
                          <td key={`${i}-${col}`} className="px-6 py-3 whitespace-nowrap text-slate-700">
                            {row[col]?.toString() || "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4">
              <Button onClick={clearDataset} variant="destructive" className="rounded-full px-6">
                Upload New File
              </Button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}