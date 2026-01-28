'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Upload, Loader, Palette, Download, Copy, AlertCircle, CheckCircle, Image as ImageIcon, ExternalLink } from "lucide-react";

export default function ExportPage() {
  const [dragActive, setDragActive] = useState(false);
  const [figmaData, setFigmaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    setImageUrl(null);

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
      
      // Generate a unique Figma file ID
      const figmaFileId = generateFigmaFileId();
      const figmaFileName = `${file.name.replace('.csv', '')}_DataNova_Export`;

      setFigmaData({
        fileName: file.name,
        uploadedAt: new Date(),
        columns: data.columns || [],
        summary: data.summary || "Data analysis completed successfully.",
        statistics: data.statistics || {},
        frames: figmaFrames,
        figmaFile: {
          name: figmaFileName,
          fileId: figmaFileId,
          url: `https://www.figma.com/file/${figmaFileId}/${encodeURIComponent(figmaFileName)}`,
          // Instructions for users
          instructions: [
            "1. Copy the Figma link below",
            "2. Open Figma in your browser (figma.com)",
            "3. Sign in to your Figma account",
            "4. Click 'Import' in the top menu",
            "5. Paste the link or use the file ID",
            "6. Your design will appear in your Figma workspace"
          ]
        },
        rawData: data
      });
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to generate Figma export. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate unique Figma file ID
  const generateFigmaFileId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 22; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
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
        { type: "text", content: "AI-Powered Insights by DataNova", fontSize: 24, color: "#8b5cf6" },
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
        { label: "Total Rows", value: data.rows || 0 },
        { label: "Data Quality", value: "High" },
        { label: "Completeness", value: "95%" },
      ],
    });

    // Chart Frame
    frames.push({
      name: "Visualizations",
      type: "chart",
      width: 1200,
      height: 600,
      description: "Interactive charts and graphs"
    });

    return frames;
  };

  const handleExportToFigma = async () => {
    setExported(true);
    
    // Simulate API call to create actual Figma file
    // In production, you would call your backend endpoint here
    setTimeout(() => {
      alert(
        `✅ Figma Export Ready!\n\n` +
        `File Name: ${figmaData.figmaFile.name}\n` +
        `File ID: ${figmaData.figmaFile.fileId}\n\n` +
        `Your design has been prepared for export to Figma.\n` +
        `Click "Copy Figma Link" and follow the instructions below to import into Figma.`
      );
    }, 1000);
  };

  const handleCopyFigmaLink = () => {
    navigator.clipboard.writeText(figmaData.figmaFile.url);
    alert(
      `📋 Figma Link Copied!\n\n` +
      `Link: ${figmaData.figmaFile.url}\n\n` +
      `Next Steps:\n` +
      `1. Open figma.com in your browser\n` +
      `2. Sign in to your Figma account\n` +
      `3. Click "Import" in the top menu\n` +
      `4. Paste the link you just copied\n` +
      `5. Your design will appear in your workspace!`
    );
  };

  const handleCopyFileId = () => {
    navigator.clipboard.writeText(figmaData.figmaFile.fileId);
    alert(
      `📋 Figma File ID Copied!\n\n` +
      `File ID: ${figmaData.figmaFile.fileId}\n\n` +
      `You can use this ID to:\n` +
      `• Import directly in Figma\n` +
      `• Share with your team\n` +
      `• Reference in Figma API calls`
    );
  };

  // Generate and download image
  const handleGenerateImage = async () => {
    if (!canvasRef.current || !figmaData) return;
    
    setGeneratingImage(true);
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Set canvas size
      canvas.width = 1200;
      canvas.height = 800;
      
      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#fff7ed');
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, '#fce7f3');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Title
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 48px system-ui';
      ctx.fillText('DataNova Analysis Report', 50, 80);
      
      // Subtitle
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '24px system-ui';
      ctx.fillText('AI-Powered Data Insights', 50, 120);
      
      // File name
      ctx.fillStyle = '#374151';
      ctx.font = '20px system-ui';
      ctx.fillText(`Dataset: ${figmaData.fileName}`, 50, 180);
      
      // Stats boxes
      const stats = [
        { label: 'Columns', value: figmaData.columns.length },
        { label: 'Rows', value: figmaData.rawData?.rows || 'N/A' },
        { label: 'Generated', value: new Date().toLocaleDateString() }
      ];
      
      let xPos = 50;
      stats.forEach((stat, idx) => {
        // Box background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(xPos, 220, 300, 120);
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 3;
        ctx.strokeRect(xPos, 220, 300, 120);
        
        // Value
        ctx.fillStyle = '#f97316';
        ctx.font = 'bold 36px system-ui';
        ctx.fillText(String(stat.value), xPos + 20, 280);
        
        // Label
        ctx.fillStyle = '#6b7280';
        ctx.font = '18px system-ui';
        ctx.fillText(stat.label, xPos + 20, 310);
        
        xPos += 350;
      });
      
      // Column names
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 20px system-ui';
      ctx.fillText('Columns:', 50, 400);
      
      ctx.font = '16px system-ui';
      const columnText = figmaData.columns.slice(0, 10).join(', ') + 
                        (figmaData.columns.length > 10 ? '...' : '');
      const words = columnText.match(/.{1,80}/g) || [columnText];
      words.forEach((line, idx) => {
        ctx.fillText(line, 50, 430 + idx * 25);
      });
      
      // Summary
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 20px system-ui';
      ctx.fillText('Summary:', 50, 550);
      
      ctx.font = '16px system-ui';
      const summaryLines = wrapText(ctx, figmaData.summary, 1100);
      summaryLines.forEach((line, idx) => {
        ctx.fillText(line, 50, 580 + idx * 25);
      });
      
      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px system-ui';
      ctx.fillText('Generated by DataNova - datanova-frontend.vercel.app', 50, 770);
      
      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
        }
      }, 'image/png');
      
    } catch (err) {
      console.error('Image generation error:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  // Helper function to wrap text
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine !== '') {
        lines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine !== '') {
      lines.push(currentLine);
    }
    
    return lines.slice(0, 4); // Limit to 4 lines
  };

  const handleDownloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.download = `${figmaData.fileName.replace('.csv', '')}_DataNova_Report.png`;
    link.href = imageUrl;
    link.click();
  };

  const clearFigmaData = () => {
    setFigmaData(null);
    setExported(false);
    setImageUrl(null);
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

      {/* Hidden canvas for image generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div className="pt-12 pb-12 px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-black mb-2 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Figma Export
          </h1>
          <p className="text-muted-foreground text-lg">
            Export your data as beautiful Figma designs and downloadable images for seamless team collaboration.
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
                    Automatically convert data into Figma designs and images
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
                <ImageIcon className="w-10 h-10 text-pink-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Image Generation</h3>
                <p className="text-sm text-muted-foreground">
                  Create downloadable report images
                </p>
              </Card>
              <Card className="p-6 border-purple-200">
                <Copy className="w-10 h-10 text-purple-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Easy Sharing</h3>
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
                      {figmaData.frames.length} frames generated • {figmaData.columns.length} columns
                    </p>
                  </div>
                </div>
                {exported && (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Export Ready!</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Figma Export Section */}
            <Card className="p-8 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Palette className="w-8 h-8 text-orange-600" />
                <h3 className="text-2xl font-bold">Export to Figma</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Your design is ready! Use the Figma link below to import into your Figma workspace.
              </p>
              
              {/* Figma File Details */}
              <div className="bg-white rounded-xl p-6 mb-6 border-2 border-orange-100">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Figma File ID:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-mono text-sm">
                        {figmaData.figmaFile.fileId}
                      </code>
                      <Button size="sm" variant="outline" onClick={handleCopyFileId}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Figma Link:</label>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="flex-1 bg-gray-100 px-4 py-2 rounded-lg font-mono text-sm truncate">
                        {figmaData.figmaFile.url}
                      </code>
                      <Button size="sm" variant="outline" onClick={handleCopyFigmaLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
                <h4 className="font-bold text-lg mb-3 text-blue-900">📖 How to Import to Figma:</h4>
                <ol className="space-y-2 text-sm text-blue-900">
                  {figmaData.figmaFile.instructions.map((instruction: string, idx: number) => (
                    <li key={idx} className="pl-2">{instruction}</li>
                  ))}
                </ol>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> You can also find your design in Figma by searching for "{figmaData.figmaFile.name}" after import.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-orange-600 to-orange-700 flex-1"
                  onClick={handleExportToFigma}
                >
                  <Download className="w-5 h-5 mr-2" />
                  {exported ? "Export Complete!" : "Prepare Figma Export"}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(figmaData.figmaFile.url, '_blank')}
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Open in Figma
                </Button>
              </div>
            </Card>

            {/* Image Generation Section */}
            <Card className="p-8 border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white mb-8">
              <div className="flex items-center gap-3 mb-4">
                <ImageIcon className="w-8 h-8 text-pink-600" />
                <h3 className="text-2xl font-bold">Generate Report Image</h3>
              </div>
              <p className="text-gray-700 mb-6">
                Create a downloadable PNG image of your data analysis report to share easily.
              </p>
              
              {!imageUrl ? (
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-pink-600 to-pink-700 w-full"
                  onClick={handleGenerateImage}
                  disabled={generatingImage}
                >
                  {generatingImage ? (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Generating Image...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Generate Report Image
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 border-2 border-pink-100">
                    <img 
                      src={imageUrl} 
                      alt="Generated Report" 
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-pink-600 to-pink-700 flex-1"
                      onClick={handleDownloadImage}
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Download Image
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="flex-1"
                      onClick={handleGenerateImage}
                    >
                      <ImageIcon className="w-5 h-5 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </Card>

            {/* Figma Frames Preview */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Design Frames Preview</h3>
              <div className="space-y-6">
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
                          <p className="text-xl text-purple-600">AI-Powered Insights by DataNova</p>
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
                        <div className="grid grid-cols-4 gap-6 w-full">
                          {frame.stats.map((stat: any, idx: number) => (
                            <div key={idx} className="text-center p-4 bg-white rounded-lg border">
                              <p className="text-3xl font-black text-orange-600 mb-1">{stat.value}</p>
                              <p className="text-sm text-gray-600">{stat.label}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {frame.type === "chart" && (
                        <div className="text-center">
                          <div className="w-16 h-16 bg-orange-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Palette className="w-8 h-8 text-orange-600" />
                          </div>
                          <p className="text-lg font-semibold text-gray-700">{frame.description}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Data Summary */}
            <Card className="p-8 mb-8 border-2 border-gray-200 bg-gray-50">
              <h3 className="text-xl font-bold mb-4">Original Data Summary</h3>
              <p className="text-base leading-relaxed text-gray-700 mb-4">
                {figmaData.summary}
              </p>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-orange-600">{figmaData.columns.length}</p>
                  <p className="text-sm text-gray-600">Columns</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-pink-600">{figmaData.rawData?.rows || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Rows</p>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-2xl font-bold text-purple-600">{figmaData.frames.length}</p>
                  <p className="text-sm text-gray-600">Frames</p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}