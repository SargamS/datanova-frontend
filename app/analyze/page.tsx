'use client';

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, BarChart3, AlertCircle, Loader } from "lucide-react";

export default function AnalyzePage() {
  const [dragActive, setDragActive] = useState(false);
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- Drag handlers ----------
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  // ---------- REAL backend upload ----------
  const handleFileUpload = async (file: globalThis.File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://datanova-backend.onrender.com/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Backend error");
      }

      const data = await response.json();

      setDataset({
        fileId: data.file_id,
        fileName: file.name,
        uploadedAt: new Date(),
        stats: data.stats,
      });
    } catch (err) {
      console.error(err);
      setError("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearDataset = () => {
    setDataset(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/85 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </nav>

      <div className="pt-12 pb-12 px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl font-black mb-2">Data Analysis</h1>
        <p className="text-muted-foreground mb-10">
          Upload your CSV or Excel file to explore statistics and insights.
        </p>

        {!dataset ? (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Upload box */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`bg-white rounded-3xl p-12 text-center border-2 transition ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-orange-200"
              } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="flex justify-center mb-6">
                {isLoading ? (
                  <Loader className="w-16 h-16 animate-spin text-primary" />
                ) : (
                  <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-3xl font-black mb-2">
                {isLoading ? "Uploading..." : "Drop your file here"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {isLoading
                  ? "Processing your file..."
                  : "or click to browse your computer"}
              </p>

              <label>
                <Button disabled={isLoading}>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </label>
            </div>
          </>
        ) : (
          <>
            {/* Results */}
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">File Summary</h2>
              <p><b>Name:</b> {dataset.fileName}</p>
              <p><b>ID:</b> {dataset.fileId}</p>
              <p><b>Uploaded:</b> {dataset.uploadedAt.toLocaleDateString()}</p>
            </Card>

            <Card className="p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">Dataset Statistics</h3>
              {Object.entries(dataset.stats || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between p-3 bg-muted/20 rounded mb-2">
                  <span>{key}</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </Card>

            <Button onClick={clearDataset} variant="outline">
              Upload Different File
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
