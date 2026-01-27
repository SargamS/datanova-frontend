'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
} from 'lucide-react';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'; // Import Loader2

const SAMPLE_COLUMNS = [
  'Sales Revenue',
  'Customer Count',
  'Product Category',
  'Monthly Trend',
  'Regional Distribution',
  'Market Share',
  'Growth Rate',
  'Customer Satisfaction',
];

export default function VisualizePage() {
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>('Sales Revenue');
  const [isLoading, setIsLoading] = useState(false); // Declare isLoading
  const [error, setError] = useState<string | null>(null); // Declare error
  const columns = SAMPLE_COLUMNS; // Declare columns

  const chartTypes = [
    {
      id: 'bar',
      name: 'Bar Chart',
      icon: BarChart3,
      description: 'Perfect for comparing categories and values',
    },
    {
      id: 'line',
      name: 'Line Chart',
      icon: LineChart,
      description: 'Ideal for showing trends over time',
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      icon: PieChart,
      description: 'Great for showing proportions and percentages',
    },
    {
      id: 'scatter',
      name: 'Scatter Plot',
      icon: TrendingUp,
      description: 'Perfect for analyzing correlations',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 text-foreground overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 bg-white/85 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold hover:text-primary transition">
            <ArrowLeft className="w-5 h-5" />
            Back
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-12 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {!selectedChart ? (
            <>
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-2">Visualizations</h1>
                <p className="text-lg text-muted-foreground">
                  Create beautiful, interactive charts to visualize your data
                </p>
              </div>

              {/* Chart Type Selection */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8">
                  Choose Chart Type
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {chartTypes.map((chart, idx) => {
                    const Icon = chart.icon;
                    return (
                      <button
                        key={chart.id}
                        onClick={() => setSelectedChart(chart.id)}
                        className={`group text-left animate-float-up stagger-${idx + 1}`}
                      >
                        <div className="h-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 rounded-3xl p-10 backdrop-blur-xl hover:border-green-500/70 transition-all duration-300 overflow-hidden relative hover:shadow-2xl hover:shadow-green-500/30 transform hover:-translate-y-4">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-500/0 to-green-500/10 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
                          <div className="relative z-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-125 transition-transform shadow-xl shadow-green-500/50 group-hover:shadow-green-500/80">
                              <Icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4">
                              {chart.name}
                            </h3>
                            <p className="text-muted-foreground text-lg">
                              {chart.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Features Section */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Interactive</h3>
                  <p className="text-sm text-muted-foreground">
                    Hover, zoom, and pan to explore your data
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Customizable</h3>
                  <p className="text-sm text-muted-foreground">
                    Colors, fonts, and styling options
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Export Options</h3>
                  <p className="text-sm text-muted-foreground">
                    PNG, SVG, PDF, or Figma export
                  </p>
                </Card>
              </div>
            </>
          ) : (
            <>
              {/* Chart Editor */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Preview */}
                <div className="lg:col-span-2">
                  <Card className="p-8 bg-card/50 border-primary/30">
                    <h2 className="text-xl font-semibold mb-6">
                      {chartTypes.find((c) => c.id === selectedChart)?.name} Preview
                    </h2>

                    {/* Mock Chart Visualization */}
                    <div className="bg-muted/20 rounded-lg p-8 h-96 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="flex justify-center gap-2 mb-6">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className="w-8 rounded-lg transition-all hover:w-10"
                              style={{
                                backgroundColor: `hsl(${50 + i * 50}, 70%, 60%)`,
                                height: `${50 + i * 30}px`,
                              }}
                            />
                          ))}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {chartTypes.find((c) => c.id === selectedChart)?.name} Visualization
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Configuration */}
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Data Source</h3>
                    <select
                      className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                      value={selectedColumn}
                      onChange={(e) => setSelectedColumn(e.target.value)}
                    >
                      {SAMPLE_COLUMNS.map((column) => (
                        <option key={column} value={column}>
                          {column}
                        </option>
                      ))}
                    </select>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Styling</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Color</label>
                        <input
                          type="color"
                          defaultValue="#7c3aed"
                          className="w-full h-10 rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Title</label>
                        <input
                          type="text"
                          placeholder="Chart title"
                          className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground text-sm"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Options</h3>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        Show legend
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded"
                        />
                        Show grid
                      </label>
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input type="checkbox" className="rounded" />
                        Animate
                      </label>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1 gap-2">Export to Figma</Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setSelectedChart(null)}
                >
                  Create Different Chart
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  Download Image
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
