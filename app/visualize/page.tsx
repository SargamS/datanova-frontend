'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Sparkles,
  Download,
  Figma,
  Loader2
} from 'lucide-react';

export default function VisualizePage() {
  const { sharedData } = useData();

  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [chartImage, setChartImage] = useState<string | null>(null);

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Compare categories' },
    { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Show trends over time' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Proportions & ratios' },
    { id: 'scatter', name: 'Scatter Plot', icon: TrendingUp, description: 'Correlations' },
  ];

  const handleGenerate = async () => {
    if (!sharedData || !selectedChart) return;

    setIsLoading(true);
    setChartImage(null);

    try {
      const res = await fetch("https://datanova-backend.onrender.com/visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: sharedData,
          chartType: selectedChart
        })
      });

      if (!res.ok) throw new Error("Failed to generate chart");

      const result = await res.json();
      setChartImage(result.image_url); // backend should return base64 or URL

    } catch (error) {
      console.error("Visualization error:", error);
      alert("Failed to generate visualization.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!sharedData) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="p-12 text-center">
          <BarChart3 size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl font-bold">No Dataset Loaded</h2>
          <p className="text-slate-500 mb-6">Upload a CSV file on the Dashboard first.</p>
          <Button asChild className="bg-orange-600">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="sticky top-0 bg-white border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-orange-600">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Main Section */}
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-5xl font-black uppercase italic flex items-center gap-2">
                <Sparkles className="text-orange-500" /> Visualizer
              </h1>
              <p className="text-slate-500 mt-2">Dataset: {sharedData.fileName}</p>
            </header>

            {!selectedChart ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chartTypes.map((chart) => (
                  <Card
                    key={chart.id}
                    onClick={() => setSelectedChart(chart.id)}
                    className="p-8 cursor-pointer hover:border-orange-500 hover:shadow-xl transition border-2"
                  >
                    <chart.icon className="w-12 h-12 text-orange-500 mb-4" />
                    <h3 className="text-2xl font-bold">{chart.name}</h3>
                    <p className="text-slate-500">{chart.description}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 border-2 border-orange-100 shadow-xl rounded-3xl">
                <div className="flex justify-between mb-6">
                  <h2 className="text-2xl font-bold uppercase">{selectedChart} Chart</h2>
                  <Button variant="outline" onClick={() => setSelectedChart(null)}>
                    Change Chart
                  </Button>
                </div>

                <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border-dashed border-2">
                  {chartImage ? (
                    <img src={chartImage} alt="chart" className="w-full h-full object-contain" />
                  ) : (
                    <Button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="bg-orange-600 text-lg px-8 py-4 rounded-full flex items-center justify-center"
                    >
                      {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                      {isLoading ? "Generating..." : "Generate Visualization"}
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <Button variant="secondary"><Download size={16}/> Save PNG</Button>
                  <Button variant="secondary"><Figma size={16}/> Send to Figma</Button>
                  <Button className="bg-slate-900 text-white">Full Report</Button>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <h2 className="font-bold text-xl flex items-center gap-2 text-purple-600">
              <Sparkles size={20} /> Design Inspiration
            </h2>

            <div className="columns-2 gap-4 space-y-4">
              {[...Array(8)].map((_, i) => (
                <img
                  key={i}
                  src={`https://picsum.photos/seed/chart${i}/400/500`}
                  className="rounded-xl border shadow-sm hover:shadow-xl transition"
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
