'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, BarChart3, LineChart, PieChart, TrendingUp, 
  Sparkles, Loader2, Download, Upload, Settings2, 
  FileCheck, AlertCircle, X, Grid3x3, Palette
} from 'lucide-react';

interface ColumnInfo {
  numeric_columns: string[];
  categorical_columns: string[];
  all_columns: string[];
}

export default function VisualizePage() {
  const { sharedData } = useData();
  
  // File and data state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [columnInfo, setColumnInfo] = useState<ColumnInfo | null>(null);
  const [totalRows, setTotalRows] = useState(0);
  
  // Chart selection and generation
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartImage, setChartImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Chart customization
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [rowLimit, setRowLimit] = useState(50);
  const [chartColor, setChartColor] = useState('#FF6B35');
  const [chartTitle, setChartTitle] = useState('');
  const [showGrid, setShowGrid] = useState(true);

  const chartTypes = [
    { 
      id: 'bar', 
      name: 'Bar Chart', 
      icon: BarChart3, 
      description: 'Perfect for comparing categories and values',
      color: 'from-green-400 to-green-600'
    },
    { 
      id: 'line', 
      name: 'Line Chart', 
      icon: LineChart, 
      description: 'Ideal for showing trends over time',
      color: 'from-blue-400 to-blue-600'
    },
    { 
      id: 'pie', 
      name: 'Pie Chart', 
      icon: PieChart, 
      description: 'Great for showing proportions and percentages',
      color: 'from-purple-400 to-purple-600'
    },
    { 
      id: 'scatter', 
      name: 'Scatter Plot', 
      icon: TrendingUp, 
      description: 'Perfect for analyzing correlations',
      color: 'from-orange-400 to-orange-600'
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setIsAnalyzing(true);
    setChartImage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch("https://datanova-backend.onrender.com/api/analyze-columns", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to analyze file");
      }

      const result = await res.json();
      setColumnInfo(result.columns);
      setTotalRows(result.total_rows);
      
      // Auto-select first columns
      if (result.columns.all_columns.length > 0) {
        setXAxis(result.columns.all_columns[0]);
        if (result.columns.all_columns.length > 1) {
          setYAxis(result.columns.all_columns[1]);
        }
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze file');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!uploadedFile || !selectedChart || !xAxis) {
      setError('Please select a chart type and X-axis column');
      return;
    }

    // Validate Y-axis for charts that need it
    if (['bar', 'line', 'scatter'].includes(selectedChart) && !yAxis) {
      setError('Please select a Y-axis column for this chart type');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('chart_type', selectedChart);
      formData.append('x_axis', xAxis);
      if (yAxis) formData.append('y_axis', yAxis);
      formData.append('limit', rowLimit.toString());
      formData.append('color', chartColor);
      formData.append('title', chartTitle);
      formData.append('show_grid', showGrid.toString());

      const res = await fetch("https://datanova-backend.onrender.com/api/visualize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to generate visualization");
      }

      const result = await res.json();
      setChartImage(result.chart_url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate visualization');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadChart = () => {
    if (!chartImage) return;
    
    const link = document.createElement('a');
    link.href = chartImage;
    link.download = `DataNova_${selectedChart}_${Date.now()}.png`;
    link.click();
  };

  const resetChart = () => {
    setChartImage(null);
    setChartTitle('');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="sticky top-0 bg-white/80 backdrop-blur-lg border-b z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          
          {uploadedFile && (
            <div className="flex items-center gap-2 text-sm">
              <FileCheck className="text-green-600" size={16} />
              <span className="font-medium">{uploadedFile.name}</span>
              <span className="text-slate-400">({totalRows.toLocaleString()} rows)</span>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 lg:p-12">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Visualization Studio
          </h1>
          <p className="text-slate-600 text-lg">Create stunning charts with powerful customization</p>
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between max-w-3xl mx-auto">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* File Upload Section */}
        {!uploadedFile && (
          <Card className="max-w-2xl mx-auto mb-12 border-2 border-dashed">
            <CardContent className="p-12 text-center">
              {isAnalyzing ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                  <h3 className="text-xl font-bold mb-2">Analyzing your data...</h3>
                  <p className="text-slate-500">This will only take a moment</p>
                </div>
              ) : (
                <>
                  <Upload size={48} className="mx-auto mb-4 text-slate-300" />
                  <h2 className="text-2xl font-bold mb-2">Upload CSV File</h2>
                  <p className="text-slate-500 mb-6">Choose a CSV file to create visualizations</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Button asChild className="bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700">
                    <label htmlFor="csv-upload" className="cursor-pointer">
                      Choose CSV File
                    </label>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Main Content - Chart Type Selection or Chart Configuration */}
        {uploadedFile && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Side - Chart Types or Generated Chart */}
            <div className="lg:col-span-8">
              
              {!selectedChart ? (
                <>
                  <h2 className="text-3xl font-bold mb-6">Choose Chart Type</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chartTypes.map(chart => (
                      <Card 
                        key={chart.id} 
                        onClick={() => setSelectedChart(chart.id)}
                        className="p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 hover:border-orange-400 bg-gradient-to-br from-white to-slate-50"
                      >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${chart.color} flex items-center justify-center mb-4`}>
                          <chart.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{chart.name}</h3>
                        <p className="text-slate-600">{chart.description}</p>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <Card className="p-8 border-2 border-orange-100 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                      {chartTypes.find(c => c.id === selectedChart)?.icon && 
                        React.createElement(chartTypes.find(c => c.id === selectedChart)!.icon, { 
                          className: "w-8 h-8 text-orange-600" 
                        })
                      }
                      <h2 className="text-3xl font-bold">
                        {chartTypes.find(c => c.id === selectedChart)?.name}
                      </h2>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSelectedChart(null);
                        resetChart();
                      }}
                    >
                      Change Chart
                    </Button>
                  </div>

                  {/* Chart Display Area */}
                  <div className="aspect-video bg-slate-100 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300 mb-6">
                    {chartImage ? (
                      <img 
                        src={chartImage} 
                        alt="Generated chart" 
                        className="w-full h-full object-contain rounded-xl" 
                      />
                    ) : (
                      <div className="text-center">
                        <Sparkles className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">
                          Configure your chart and click Generate
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button 
                      onClick={handleGenerate} 
                      disabled={isGenerating || !xAxis}
                      className="flex-1 bg-gradient-to-r from-orange-600 to-pink-600 hover:from-orange-700 hover:to-pink-700 text-lg py-6"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="animate-spin mr-2" size={20} />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2" size={20} />
                          {chartImage ? 'Regenerate' : 'Generate'} Chart
                        </>
                      )}
                    </Button>
                    
                    {chartImage && (
                      <Button 
                        onClick={downloadChart}
                        variant="secondary"
                        className="px-8 py-6"
                      >
                        <Download size={20} className="mr-2" />
                        Download PNG
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>

            {/* Right Side - Configuration Panel */}
            {selectedChart && columnInfo && (
              <div className="lg:col-span-4 space-y-6">
                
                {/* Column Selection */}
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Settings2 size={18} className="text-orange-500" />
                      Data Configuration
                    </h3>
                    
                    {/* X-Axis Selection */}
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                        X-Axis Column *
                      </label>
                      <select 
                        value={xAxis}
                        onChange={(e) => setXAxis(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      >
                        <option value="">Select column...</option>
                        {columnInfo.all_columns.map(col => (
                          <option key={col} value={col}>{col}</option>
                        ))}
                      </select>
                    </div>

                    {/* Y-Axis Selection (not needed for pie/hist) */}
                    {!['pie', 'hist'].includes(selectedChart) && (
                      <div className="mb-4">
                        <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                          Y-Axis Column *
                        </label>
                        <select 
                          value={yAxis}
                          onChange={(e) => setYAxis(e.target.value)}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        >
                          <option value="">Select column...</option>
                          {columnInfo.numeric_columns.map(col => (
                            <option key={col} value={col}>{col}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Row Limit */}
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                        Number of Rows: {rowLimit}
                      </label>
                      <input 
                        type="range"
                        min="10"
                        max={Math.min(totalRows, 1000)}
                        step="10"
                        value={rowLimit}
                        onChange={(e) => setRowLimit(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1">
                        <span>10</span>
                        <span>{Math.min(totalRows, 1000)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Customization Options */}
                <Card className="bg-white">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Palette size={18} className="text-orange-500" />
                      Customization
                    </h3>

                    {/* Chart Title */}
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                        Chart Title
                      </label>
                      <input 
                        type="text"
                        value={chartTitle}
                        onChange={(e) => setChartTitle(e.target.value)}
                        placeholder="Enter custom title..."
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>

                    {/* Color Picker */}
                    <div className="mb-4">
                      <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">
                        Chart Color
                      </label>
                      <div className="flex gap-3">
                        <input 
                          type="color"
                          value={chartColor}
                          onChange={(e) => setChartColor(e.target.value)}
                          className="w-16 h-12 rounded-lg cursor-pointer border-2 border-slate-200"
                        />
                        <input 
                          type="text"
                          value={chartColor}
                          onChange={(e) => setChartColor(e.target.value)}
                          className="flex-1 px-4 py-2 border rounded-lg font-mono text-sm"
                          placeholder="#FF6B35"
                        />
                      </div>
                      
                      {/* Color Presets */}
                      <div className="flex gap-2 mt-3">
                        {['#FF6B35', '#4ECDC4', '#556270', '#FF6F91', '#845EC2'].map(color => (
                          <button
                            key={color}
                            onClick={() => setChartColor(color)}
                            className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Grid Toggle */}
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Show Grid</label>
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`relative w-12 h-6 rounded-full transition ${
                          showGrid ? 'bg-orange-500' : 'bg-slate-300'
                        }`}
                      >
                        <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-all ${
                          showGrid ? 'right-0.5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Column Info */}
                <Card className="bg-slate-50 border-slate-200">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-3 text-sm text-slate-600">Dataset Info</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Rows:</span>
                        <span className="font-bold text-slate-700">{totalRows.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Columns:</span>
                        <span className="font-bold text-slate-700">{columnInfo.all_columns.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Numeric:</span>
                        <span className="font-bold text-slate-700">{columnInfo.numeric_columns.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Categorical:</span>
                        <span className="font-bold text-slate-700">{columnInfo.categorical_columns.length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upload New File */}
                <Card className="bg-white border-orange-200">
                  <CardContent className="p-6">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="csv-reupload"
                    />
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full border-orange-300 hover:border-orange-500"
                    >
                      <label htmlFor="csv-reupload" className="cursor-pointer flex items-center justify-center gap-2">
                        <Upload size={16} />
                        Upload Different File
                      </label>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}