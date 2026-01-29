'use client';

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Download,
  FileJson,
  ImageIcon,
  ExternalLink,
  Figma,
  BookOpen,
  Info,
  Layout
} from "lucide-react";

export default function ExportPage() {
  const { sharedData } = useData();
  const [fileKey, setFileKey] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileKey(e.target.value);
  };

  // ---------- Download JSON ----------
  const downloadFigmaJSON = () => {
    if (!sharedData) return;

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sharedData, null, 2));

    const link = document.createElement("a");
    link.href = dataStr;
    link.download = "DataNova_Figma_Spec.json";
    link.click();
  };

  // ---------- Generate PNG ----------
  const generateReportImage = () => {
    if (!canvasRef.current || !sharedData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 900;
    canvas.height = 1100;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Header
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("DataNova AI Report", 50, 60);

    // Metrics boxes
    ctx.fillStyle = "#f97316";
    ctx.fillRect(50, 90, 350, 100);
    ctx.fillRect(450, 90, 350, 100);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(String(sharedData.row_count || 0), 70, 140);
    ctx.fillText(String(sharedData.column_count || 0), 470, 140);

    ctx.font = "14px sans-serif";
    ctx.fillText("Total Rows", 70, 170);
    ctx.fillText("Total Columns", 470, 170);

    // Summary
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("AI Summary", 50, 240);

    ctx.font = "16px sans-serif";
    ctx.fillStyle = "#334155";

    const words = (sharedData.summary || "").split(" ");
    let line = "";
    let y = 280;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      if (ctx.measureText(testLine).width > 780) {
        ctx.fillText(line, 50, y);
        line = words[i] + " ";
        y += 26;
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
        <Link
          href="/"
          className="flex items-center gap-2 text-sm mb-8 text-slate-500 hover:text-orange-600"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Export & Design
        </h1>
        <p className="text-slate-500 mb-10 italic">
          Working with: {sharedData?.fileName || "No dataset active"}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-5 space-y-6">

            {/* Figma Input */}
            <Card className="p-6 border-2 border-orange-100">
              <div className="flex items-center gap-2 mb-4 text-orange-600">
                <Figma />
                <h2 className="text-xl font-bold">Figma Integration</h2>
              </div>

              <label className="text-xs font-bold uppercase text-slate-400">
                Figma File Key
              </label>
              <Input
                placeholder="Paste File Key from URL"
                value={fileKey}
                onChange={handleKeyChange}
              />

              <div className="mt-3 p-3 bg-blue-50 rounded flex gap-2">
                <Info size={14} className="text-blue-500 mt-1" />
                <p className="text-xs text-blue-700">
                  URL format: figma.com/file/<b>FILE_KEY</b>/name
                </p>
              </div>
            </Card>

            {/* Export Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4">
                <FileJson className="text-orange-500 mb-2" />
                <Button
                  onClick={downloadFigmaJSON}
                  disabled={!sharedData}
                  variant="ghost"
                  className="w-full text-orange-600"
                >
                  Download JSON
                </Button>
              </Card>

              <Card className="p-4">
                <ImageIcon className="text-blue-500 mb-2" />
                <Button
                  onClick={generateReportImage}
                  disabled={!sharedData}
                  variant="ghost"
                  className="w-full text-blue-600"
                >
                  {imageUrl ? "Regenerate PNG" : "Generate PNG"}
                </Button>
              </Card>
            </div>

            {/* Resources */}
            <Card className="p-6">
              <h3 className="flex items-center gap-2 font-bold mb-4">
                <BookOpen className="text-blue-500" /> Dataset Resources
              </h3>

              {sharedData?.resources?.length ? (
                sharedData.resources.map((res: any, i: number) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    className="flex justify-between items-center p-3 mb-2 bg-slate-50 rounded hover:bg-orange-50"
                  >
                    <span className="text-sm">{res.title}</span>
                    <ExternalLink size={14} />
                  </a>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Analyze a dataset to see resources.
                </p>
              )}
            </Card>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            {fileKey ? (
              <Card className="h-[650px] overflow-hidden">
                <div className="bg-slate-100 p-3 border-b text-xs font-bold flex gap-2">
                  <Layout size={14} /> LIVE FIGMA PREVIEW
                </div>
                <iframe
                  className="w-full h-full"
                  src={`https://www.figma.com/embed?embed_host=datanova&url=https://www.figma.com/file/${fileKey}`}
                  allowFullScreen
                />
              </Card>
            ) : (
              <div className="h-[650px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-slate-400">
                <Figma size={64} className="opacity-10 mb-4" />
                <p>Enter Figma File Key to preview design</p>

                {imageUrl && (
                  <div className="mt-6 bg-white p-4 rounded shadow">
                    <img src={imageUrl} alt="Preview" className="rounded mb-2" />
                    <a
                      href={imageUrl}
                      download="DataNova_Report.png"
                      className="flex items-center gap-1 text-blue-600 text-sm"
                    >
                      <Download size={12} /> Download PNG
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
