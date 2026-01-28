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
  AlertCircle 
} from "lucide-react";

// Define the shape of the data we expect from the backend
interface DatasetInfo {
  fileName: string;
  uploadedAt: Date;
  rowCount: number;
  columnCount: number;
  columns: string[];
  preview: Array<Record<string, any>>; // Array of objects for the top 10 rows
  dtypes?: Record<string, string>;     // Optional: Column data types
}

export default function AnalyzePage() {
  const [dragActive, setDragActive] = useState(false);
  const [dataset, setDataset] = useState<DatasetInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Drag & Drop Handlers ---
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // --- File Selection Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // --- API Upload Logic ---
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // NOTE: Ensure your backend returns the JSON structure defined below!
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      
      // Map backend response to our state
      setDataset({
        fileName: file.name,
        uploadedAt: new Date(),
        // Fallbacks provided in case backend data is missing
        rowCount: data.row_count || 0,
        columnCount: data.columns ? data.columns.length : 0,
        columns: data.columns || [],
        preview: data.head || [], // Expecting 'head' or 'preview' array
        dtypes: data.dtypes || {}
      });

    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to analyze file. Please ensure it is a valid CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearDataset = () => setDataset(null);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition font-medium">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <span className="font-bold text-xl tracking-tight text-slate-800">DataNova</span>
        </div>
      </nav>

      <div className="pt-10 pb-20 px-6 max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 mb-3">
            {dataset ? "Analysis Report" : "Upload Dataset"}
          </h1>
          <p className="text-slate-500 text-lg">
            {dataset 
              ? `Viewing insights for ${dataset.fileName}` 
              : "Upload your CSV to generate an interactive data profile."}
          </p>
        </div>

        {!dataset ? (
          /* --- Upload Area --- */
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="text-red-600 w-5 h-5" />
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                group relative flex flex-col items-center justify-center 
                h-80 rounded-3xl border-2 border-dashed transition-all duration-300
                ${dragActive 
                  ? "border-blue-500 bg-blue-50/50 scale-[1.02]" 
                  : "border-slate-300 bg-white hover:border-slate-400 hover:bg-slate-50/50"
                }
                ${isLoading ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              {isLoading ? (
                <div className="flex flex-col items-center animate-pulse">
                  <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                  <p className="text-lg font-medium text-slate-600">Analyzing structure...</p>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">Drag & Drop CSV</h3>
                  <p className="text-slate-500 mb-8 text-center max-w-xs">
                    or click below to browse your files
                  </p>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleChange}
                  />
                  <Button 
                    onClick={handleButtonClick} 
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8"
                  >
                    Select File
                  </Button>
                </>
              )}
            </div>
          </div>
        ) : (
          /* --- Dashboard View --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Rows</CardTitle>
                  <Database className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dataset.rowCount.toLocaleString()}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Columns</CardTitle>
                  <LayoutTemplate className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dataset.columnCount}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">File Name</CardTitle>
                  <FileText className="w-4 h-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold truncate" title={dataset.fileName}>
                    {dataset.fileName}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {dataset.uploadedAt.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 2. Data Preview Table */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle>Data Preview (Top 10 Rows)</CardTitle>
              </CardHeader>
              <div className="overflow-x-auto">
                {dataset.preview && dataset.preview.length > 0 ? (
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                      <tr>
                        {dataset.columns.map((col) => (
                          <th key={col} className="px-6 py-4 font-bold whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {dataset.preview.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b hover:bg-slate-50/50">
                          {dataset.columns.map((col) => (
                            <td key={`${rowIndex}-${col}`} className="px-6 py-4 whitespace-nowrap text-slate-700">
                              {row[col]?.toString() || "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-muted-foreground">
                    No preview data available from server.
                  </div>
                )}
              </div>
            </Card>

            {/* 3. Column Structure / Schema */}
            <Card>
              <CardHeader>
                <CardTitle>Column Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataset.columns.map((col) => (
                    <div key={col} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                      <span className="font-medium text-slate-700 truncate mr-2" title={col}>
                        {col}
                      </span>
                      {dataset.dtypes && dataset.dtypes[col] && (
                        <span className="px-2 py-1 bg-slate-200 text-slate-600 text-xs rounded font-mono">
                          {dataset.dtypes[col]}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end pt-4">
              <Button onClick={clearDataset} variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100">
                Delete & Upload New File
              </Button>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}