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

  // Get current topic from filename or default to Data Visualization
  const currentTopic = sharedData?.fileName?.split('.')[0] || "Data Visualization";

  // Dynamic Inspiration Gallery based on your actual data topic
  const inspirationPins = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    img: `https://picsum.photos/seed/${currentTopic + i}/400/${i % 3 === 0 ? '600' : '450'}`,
    url: `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(currentTopic + " dashboard design")}`
  }));

  const chartTypes = [
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Perfect for comparing categories' },
    { id: 'line', name: 'Line Chart', icon: LineChart, description: 'Ideal for showing trends' },
    { id: 'pie', name: 'Pie Chart', icon: PieChart, description: 'Great for proportions' },
    { id: 'scatter', name: 'Scatter Plot', icon: TrendingUp, description: 'Analyze correlations' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    // This simulates the call to your Render backend /visualize endpoint
    setTimeout(() => {
      setIsLoading(false);
      setChartImage("https://images.unsplash.com/photo-1551288049-bbbda546697a?auto=format&fit=crop&w=800&q=80");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition font-medium">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Visualizer Area */}
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Visualizer</h1>
              <p className="text-slate-500 mt-2">
                {sharedData ? `Dataset: ${sharedData.fileName}` : "Select a chart type to begin"}
              </p>
            </header>

            {!selectedChart ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {chartTypes.map((chart) => (
                  <Card 
                    key={chart.id} 
                    onClick={() => setSelectedChart(chart.id)}
                    className="p-8 cursor-pointer hover:border-orange-500 hover:shadow-2xl transition-all group relative overflow-hidden bg-white border-2 border-slate-100"
                  >
                    <chart.icon className="w-12 h-12 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold mb-2">{chart.name}</h3>
                    <p className="text-slate-500">{chart.description}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 border-2 border-orange-100 shadow-xl bg-white rounded-3xl overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold uppercase tracking-tight">{selectedChart} Result</h2>
                  <Button variant="outline" onClick={() => setSelectedChart(null)} className="rounded-full">Change Chart</Button>
                </div>

                <div className="aspect-video bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 relative overflow-hidden">
                  {chartImage ? (
                    <img src={chartImage} alt="Chart" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <BarChart3 size={64} className="mx-auto text-slate-200 mb-6" />
                      <Button onClick={handleGenerate} disabled={isLoading} className="bg-orange-600 hover:bg-orange-700 h-12 px-8 text-lg font-bold rounded-full shadow-lg shadow-orange-200">
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2" />}
                        Render Analysis
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mt-8">
                  <Button variant="secondary" className="gap-2 rounded-xl"><Download size={16}/> Save PNG</Button>
                  <Button variant="secondary" className="gap-2 rounded-xl"><Figma size={16}/> Copy to Figma</Button>
                  <Button className="bg-slate-900 text-white rounded-xl">Full Report</Button>
                </div>
              </Card>
            )}
          </div>

          {/* Pinterest-Style Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="flex items-center gap-2 text-purple-600 mb-4">
                <Sparkles size={20} />
                <h2 className="font-bold text-xl uppercase tracking-tighter">Design Inspiration</h2>
              </div>
              
              <div className="columns-2 gap-4 space-y-4">
                {inspirationPins.map((pin) => (
                  <a 
                    key={pin.id} 
                    href={pin.url} 
                    target="_blank" 
                    className="block group relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-xl"
                  >
                    <img src={pin.img} alt="pin" className="w-full h-auto transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] text-white font-bold bg-orange-600 px-3 py-1 rounded-full uppercase">View Design</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}