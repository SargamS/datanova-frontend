'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader } from "lucide-react";

export default function AnalyzePage() {
  const [dragActive, setDragActive] = useState(false);
  const [dataset, setDataset] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag events
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input triggered!");
    
    if (e.target.files && e.target.files[0]) {
      console.log("File selected:", e.target.files[0].name);
      handleFileUpload(e.target.files[0]);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    console.log("Button clicked!");
    fileInputRef.current?.click();
  };

  // Upload to backend
  const handleFileUpload = async (file: File) => {
    console.log("Starting upload for:", file.name);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      console.log("Sending request to backend...");
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Backend error:", errorText);
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      console.log("Backend response:", data);

      setDataset({
        fileName: file.name,
        uploadedAt: new Date(),
        summary: data.summary,
        columns: data.columns,
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Upload failed. Check backend or file format.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearDataset = () => setDataset(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/85 backdrop-blur-sm border-b z-50">
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
          Upload your CSV file to explore insights.
        </p>

        {!dataset ? (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`bg-white rounded-3xl p-12 text-center border-2 transition
                ${dragActive ? "border-primary bg-primary/10" : "border-orange-200"}
                ${isLoading ? "opacity-60 pointer-events-none" : ""}
              `}
            >
              {isLoading ? (
                <Loader className="w-16 h-16 animate-spin text-primary mx-auto mb-6" />
              ) : null}

              <h2 className="text-3xl font-black mb-2">
                {isLoading ? "Uploading..." : "Drag & Drop Your CSV File Here"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {isLoading ? "Processing file..." : "or click the button below to browse"}
              </p>

              {/* ✅ FIXED: Using ref to trigger hidden input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleChange}
                disabled={isLoading}
              />
              <Button 
                onClick={handleButtonClick}
                disabled={isLoading} 
                type="button"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </>
        ) : (
          <>
            <Card className="p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">File Info</h2>
              <p><b>Name:</b> {dataset.fileName}</p>
              <p><b>Uploaded:</b> {dataset.uploadedAt.toLocaleDateString()}</p>
            </Card>

            <Card className="p-8 mb-6">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <p className="whitespace-pre-wrap">{dataset.summary}</p>
            </Card>

            <Card className="p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">Columns</h3>
              <div className="space-y-2">
                {dataset.columns.map((col: string) => (
                  <div key={col} className="p-2 bg-muted/20 rounded">
                    {col}
                  </div>
                ))}
              </div>
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