'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // Ensure this file exists (see below)
import { 
  ArrowLeft, Loader, Download, 
  FileJson, ImageIcon, ExternalLink, Figma, BookOpen, Info, Layout 
} from "lucide-react";

export default function ExportPage() {
  const { sharedData } = useData();
  const [fileKey, setFileKey] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // FIX: Added explicit type for the event 'e'
  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileKey(e.target.value);
  };

  const downloadFigmaJSON = () => {
    if (!sharedData) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sharedData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `DataNova_Figma_Spec.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const generateReportImage = () => {
    if (!canvasRef.current || !sharedData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 1000;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 800, 1000);

    ctx.fillStyle = "#F97316";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("DataNova AI Report", 50, 80);

    ctx.fillStyle = "#F8FAFC";
    ctx.fillRect(50, 120, 330, 100); 
    ctx.fillRect(420, 120, 330, 100); 
    
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(String(sharedData.row_count || 0), 70, 160);
    ctx.fillText(String(sharedData.column_count || 0), 440, 160);
    
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("Total Rows", 70, 190);
    ctx.fillText("Total Columns", 440, 190);

    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("AI Analysis Summary", 50, 280);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";
    const words = (sharedData.summary || "").split(' ');
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
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-sm flex items-center gap-2 mb-8 text-slate-500 hover:text-orange-600 transition">
          <ArrowLeft size={16}/> Back to Dashboard Home
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-2">Exporter & Design</h1>
        <p className="text-slate-500 mb-10 italic">Working with: {sharedData?.fileName || "No dataset active"}</p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 border-2 border-orange-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-orange-600">
                <Figma size={24} />
                <h2 className="text-xl font-bold">Figma Integration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Figma File Key</label>
                  <Input 
                    placeholder="Paste File Key (from URL)" 
                    value={fileKey}
                    onChange={handleKeyChange}
                    className="bg-white"
                  />
                </div>
                <div className="p-3 bg-blue-50 rounded-lg flex gap-3">
                  <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-tight">
                    Find the key in your Figma URL: figma.com/file/<b>FILE_KEY</b>/name
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 border border-slate-200 hover:border-orange-200 transition">
                <FileJson className="text-orange-500 mb-2" size={24}/>
                <h4 className="font-bold text-sm mb-1">Design Spec</h4>
                <Button onClick={downloadFigmaJSON} disabled={!sharedData} variant="ghost" size="sm" className="w-full text-xs p-0 h-auto text-orange-600 hover:bg-transparent">
                   Download JSON
                </Button>
              </Card>

              <Card className="p-4 border border-slate-200 hover:border-blue-200 transition">
                <ImageIcon className="text-blue-500 mb-2" size={24}/>
                <h4 className="font-bold text-sm mb-1">Report Image</h4>
                <Button onClick={generateReportImage} disabled={!sharedData} variant="ghost" size="sm" className="w-full text-xs p-0 h-auto text-blue-600 hover:bg-transparent">
                   {imageUrl ? "Regenerate" : "Generate PNG"}
                </Button>
              </Card>
            </div>

            <Card className="p-6">
              <h3 className="font-bold flex items-center gap-2 mb-4 text-slate-800">
                <BookOpen size={18} className="text-blue-500" /> 
                Dataset Resources
              </h3>
              <div className="space-y-2">
                {sharedData?.resources?.map((res: any, i: number) => (
                  <a key={i} href={res.url} target="_blank" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border hover:bg-orange-50 transition text-sm">
                    <span className="font-medium truncate mr-2">{res.title}</span>
                    <ExternalLink size={14} className="shrink-0 text-slate-400" />
                  </a>
                )) || <p className="text-xs text-slate-400 italic">Analyze a file to see related learning materials.</p>}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-7">
            {fileKey ? (
              <Card className="h-full min-h-[600px] overflow-hidden border-2 shadow-xl rounded-2xl bg-white">
                <div className="bg-slate-100 p-3 border-b flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                    <Layout size={14}/> LIVE PROTOTYPE EMBED
                  </span>
                </div>
                <iframe 
                  className="w-full h-[550px]"
                  src={`https://www.figma.com/embed?embed_host=datanova&url=https://www.figma.com/file/${fileKey}`}
                  allowFullScreen
                />
              </Card>
            ) : (
              <div className="h-full min-h-[600px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-100/30 text-slate-400">
                <Figma size={64} className="opacity-10 mb-6" />
                <p className="font-medium">Connect a Figma File Key to see the live prototype</p>
                {imageUrl && (
                   <div className="mt-8 p-4 bg-white border rounded shadow-sm max-w-sm">
                     <p className="text-[10px] uppercase font-bold mb-2">Report Preview:</p>
                     <img src={imageUrl} alt="Preview" className="w-full h-auto rounded border mb-2" />
                     <a href={imageUrl} download="DataNova_Report.png" className="text-xs text-blue-600 font-bold flex items-center gap-1">
                       <Download size={12}/> Download PNG
                     </a>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}