'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeft, Upload, Loader, Palette, Download, 
  FileJson, ImageIcon, CheckCircle, AlertCircle, ExternalLink 
} from "lucide-react";

export default function ExportPage() {
  const [figmaData, setFigmaData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://datanova-backend.onrender.com/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend connection failed.");

      const data = await res.json();
      setFigmaData(data);
    } catch (err) {
      setError("Could not connect to the DataNova engine.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- FEATURE 1: DOWNLOAD FIGMA JSON ---
  const downloadFigmaJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(figmaData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `DataNova_Figma_Spec.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- FEATURE 2: GENERATE PNG REPORT ---
  const generateReportImage = () => {
    if (!canvasRef.current || !figmaData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas Styling
    canvas.width = 800;
    canvas.height = 1000;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1000);

    // Header Branding
    ctx.fillStyle = "#F97316";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("DataNova AI Report", 50, 80);

    // Stats Cards
    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(50, 120, 330, 100); // Card 1
    ctx.fillRect(420, 120, 330, 100); // Card 2
    
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(String(figmaData.row_count), 70, 160);
    ctx.fillText(String(figmaData.column_count), 440, 160);
    
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("Total Rows", 70, 190);
    ctx.fillText("Total Columns", 440, 190);

    // AI Summary
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("AI Analysis Summary", 50, 280);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";
    const words = figmaData.summary.split(' ');
    let line = '';
    let y = 320;
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > 700) {
        ctx.fillText(line, 50, y);
        line = words[n] + ' ';
        y += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 50, y);

    setImageUrl(canvas.toDataURL("image/png"));
  };

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-sm flex items-center gap-2 mb-8 text-slate-500 hover:text-orange-600 transition">
          <ArrowLeft size={16}/> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Exporter & Design</h1>
        <p className="text-slate-500 mb-10">Convert your raw data into design-ready assets.</p>

        {!figmaData ? (
          <Card className="p-16 border-dashed border-2 flex flex-col items-center justify-center text-center">
            {isLoading ? (
              <div className="space-y-4">
                <Loader className="animate-spin text-orange-500 mx-auto" size={48} />
                <p className="font-bold text-lg text-slate-700">Architecting your design frames...</p>
              </div>
            ) : (
              <>
                <div className="bg-orange-100 p-6 rounded-full mb-6 text-orange-600">
                  <Palette size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Ready to Export?</h2>
                <p className="text-slate-500 mb-8 max-w-xs">Upload your CSV to generate Figma-ready JSON and high-res report images.</p>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".csv" 
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
                />
                <Button onClick={() => fileInputRef.current?.click()} className="bg-orange-600 hover:bg-orange-700 h-12 px-8 font-bold">
                  <Upload className="mr-2" size={18}/> Start Export
                </Button>
              </>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
            {/* Figma Card */}
            <Card className="p-8 border-2 border-orange-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><FileJson size={80}/></div>
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-orange-700"><CheckCircle size={20}/> Figma Design Spec</h3>
               <p className="text-sm text-slate-600 mb-6">Download the JSON specification to import your data directly into Figma using the "JSON to Design" plugin.</p>
               <Button onClick={downloadFigmaJSON} variant="outline" className="w-full border-orange-200 hover:bg-orange-50 text-orange-700 font-bold">
                 <Download className="mr-2" size={18}/> Download JSON
               </Button>
            </Card>

            {/* PNG Report Card */}
            <Card className="p-8 border-2 border-blue-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10"><ImageIcon size={80}/></div>
               <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-blue-700">PNG Report Image</h3>
               <p className="text-sm text-slate-600 mb-6">Generate a high-resolution summary image perfect for sharing in Slack, emails, or presentations.</p>
               {imageUrl ? (
                 <div className="space-y-4">
                    <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded border" />
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                        <a href={imageUrl} download="DataNova_Report.png"><Download size={18} className="mr-2"/> Save Image</a>
                    </Button>
                 </div>
               ) : (
                 <Button onClick={generateReportImage} className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
                    Generate Preview
                 </Button>
               )}
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}