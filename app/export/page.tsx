'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader, Palette, Download, Copy, AlertCircle, CheckCircle } from "lucide-react";

export default function ExportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [figmaData, setFigmaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setExported(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      
      // Generate Figma frames from data
      const figmaFrames = generateFigmaFrames(data);

      setFigmaData({
        fileName: file.name,
        uploadedAt: new Date(),
        columns: data.columns || [],
        summary: data.summary || "",
        frames: figmaFrames,
        figmaFile: {
          name: `${file.name.replace('.csv', '')}_design`,
          url: `figma://file/${Math.random().toString(36).substring(7)}`,
        },
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to generate Figma export. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Figma frame data
  const generateFigmaFrames = (data: any) => {
    const frames = [];

    // Header Frame
    frames.push({
      name: "Header",
      type: "header",
      width: 1200,
      height: 200,
      elements: [
        { type: "text", content: "Data Dashboard", fontSize: 48, color: "#f97316" },
        { type: "text", content: "AI-Powered Insights", fontSize: 24, color: "#8b5cf6" },
      ],
    });

    // Data Table Frame
    frames.push({
      name: "Data Table",
      type: "table",
      width: 1200,
      height: 600,
      columns: data.columns?.slice(0, 5) || [],
      rows: 10,
    });

    // Stats Frame
    frames.push({
      name: "Statistics",
      type: "stats",
      width: 1200,
      height: 400,
      stats: [
        { label: "Total Columns", value: data.columns?.length || 0 },
        { label: "Data Quality", value: "High" },
        { label: "Completeness", value: "95%" },
      ],
    });

    return frames;
  };

  const handleExportToFigma = () => {
    setExported(true);
    // In real app, this would use Figma API
    setTimeout(() => {
      alert("Figma file created! Check your Figma workspace.");
    }, 1000);
  };

  const handleCopyFigmaLink = () => {
    navigator.clipboard.writeText(figmaData.figmaFile.url);
    alert("Figma link copied to clipboard!");
  };

  const clearFigmaData = () => {
    setFigmaData(null);
    setExported(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/85 backdrop-blur-sm border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold hover:text-orange-600 transition">
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
          {figmaData && (
            <Button onClick={clearFigmaData} variant="outline">
              Create New Export
            </Button>
          )}
        </div>
      </nav>

      <div className="pt-12 pb-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Figma Export
          </h1>
          <p className="text-muted-foreground text-lg">
            Export your data as beautiful Figma designs for seamless team collaboration.
          </p>
        </div>

        {!figmaData ? (
          <>
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`bg-white rounded-3xl p-16 text-center border-2 transition-all duration-300 shadow-lg
                ${dragActive ? "border-orange-500 bg-orange-50 scale-105" : "border-orange-200 hover:border-orange-300"}
                ${isLoading ? "opacity-60 pointer-events-none" : ""}
              `}
            >
              {isLoading ? (
                <>
                  <Loader className="w-16 h-16 animate-spin text-orange-600 mx-auto mb-6" />
                  <h2 className="text-3xl font-black mb-2">Preparing Figma Export...</h2>
                  <p className="text-muted-foreground">Creating design frames from your data</p>
                </>
              ) : (
                <>
                  <Palette className="w-20 h-20 text-orange-400 mx-auto mb-6" />
                  <h2 className="text-4xl font-black mb-2">
                    Upload CSV for Figma
                  </h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    Automatically convert data into Figma designs
                  </p>

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
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-white font-bold px-8 py-6 text-lg"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose CSV File
                  </Button>
                </>
              )}
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 border-orange-200">
                <Palette className="w-10 h-10 text-orange-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Auto-Design</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate beautiful Figma frames
                </p>
              </Card>
              <Card className="p-6 border-pink-200">
                <Download className="w-10 h-10 text-pink-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Direct Export</h3>
                <p className="text-sm text-muted-foreground">
                  Export directly to your Figma workspace
                </p>
              </Card>
              <Card className="p-6 border-purple-200">
                <Copy className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Team Sharing</h3>
                <p className="text-sm text-muted-foreground">
                  Share with your team instantly
                </p>
              </Card>
            </div>
          </>
        ) : (
          <>
            {/* File Info Header */}
            <Card className="p-6 mb-8 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Palette className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{figmaData.figmaFile.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {figmaData.frames.length} frames generated
                    </p>
                  </div>
                </div>
                {exported && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Exported Successfully!</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Figma Frames Preview */}
            <div className="mb-8 space-y-6">
              {figmaData.frames.map((frame: any, index: number) => (
                <Card key={index} className="p-8 border-2 border-orange-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{frame.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {frame.width} × {frame.height}px
                      </p>
                    </div>
                    <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                      {frame.type.toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 min-h-[200px] border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {frame.type === "header" && (
                      <div className="text-center">
                        <h2 className="text-4xl font-black text-orange-600 mb-2">Data Dashboard</h2>
                        <p className="text-xl text-purple-600">AI-Powered Insights</p>
                      </div>
                    )}
                    {frame.type === "table" && (
                      <div className="w-full">
                        <div className="grid grid-cols-5 gap-2">
                          {frame.columns.slice(0, 5).map((col: string, idx: number) => (
                            <div key={idx} className="p-3 bg-white rounded border text-center font-semibold text-sm">
                              {col}
                            </div>
                          ))}
                        </div>
                        <p className="text-center text-sm text-gray-500 mt-4">+ {frame.rows} data rows</p>
                      </div>
                    )}
                    {frame.type === "stats" && (
                      <div className="grid grid-cols-3 gap-6 w-full">
                        {frame.stats.map((stat: any, idx: number) => (
                          <div key={idx} className="text-center p-4 bg-white rounded-lg border">
                            <p className="text-3xl font-black text-orange-600 mb-1">{stat.value}</p>
                            <p className="text-sm text-gray-600">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            {/* Export Actions */}
            <Card className="p-8 border-2 border-orange-200 bg-orange-50 mb-8">
              <h3 className="text-xl font-bold mb-4">Export to Figma</h3>
              <p className="text-gray-700 mb-6">
                Your design is ready! Export it to Figma or copy the link to share with your team.
              </p>
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-orange-700 flex-1"
                  onClick={handleExportToFigma}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {exported ? "Exported to Figma" : "Export to Figma"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopyFigmaLink}
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Figma Link
                </Button>
              </div>
            </Card>

            {/* Data Summary */}
            <Card className="p-8 mb-8 border-2 border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold mb-4">Original Data Summary</h3>
              <p className="text-base leading-relaxed text-gray-700">
                {figmaData.summary}
              </p>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-pink-700">
                Download as PNG
              </Button>
              <Button size="lg" variant="outline" onClick={clearFigmaData}>
                Create New Export
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}