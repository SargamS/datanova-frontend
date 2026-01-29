'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from "@/context/DataContext";
import { DataNovaLogoWithText } from '@/components/DataNovaLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Upload, Sparkles, BarChart3, MessageSquare, 
  FileText, TrendingUp, Zap, ArrowRight, 
  CheckCircle2, Loader2, AlertCircle, X 
} from 'lucide-react';

export default function Home() {
  const { setSharedData } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.name.endsWith('.csv'));
    
    if (!csvFile) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    await handleFileUpload(csvFile);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    if (!selectedFile.name.endsWith('.csv')) {
      setUploadError('Please upload a CSV file');
      return;
    }
    
    await handleFileUpload(selectedFile);
  };

  const handleFileUpload = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const res = await fetch("https://datanova-backend.onrender.com/api/summary", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to analyze file");
      }

      const result = await res.json();
      setSharedData(result);

    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to process file');
    } finally {
      setIsUploading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Summaries",
      description: "Get intelligent insights from your data in seconds with advanced AI analysis.",
      color: "from-purple-500 to-pink-500",
      link: "/summarize"
    },
    {
      icon: BarChart3,
      title: "Beautiful Visualizations",
      description: "Create stunning charts and graphs with customizable colors and styles.",
      color: "from-blue-500 to-cyan-500",
      link: "/visualize"
    },
    {
      icon: MessageSquare,
      title: "Interactive Q&A",
      description: "Ask questions about your data and get instant, accurate answers.",
      color: "from-orange-500 to-red-500",
      link: "/qna"
    },
  ];

  const steps = [
    { icon: Upload, title: "Upload", description: "CSV, Excel files" },
    { icon: Sparkles, title: "Analyze", description: "AI-powered insights" },
    { icon: FileText, title: "Export", description: "To Figma" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <DataNovaLogoWithText logoSize={40} />
          
          <div className="flex items-center gap-8">
            <Link href="#features" className="text-slate-600 hover:text-purple-600 font-medium transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-slate-600 hover:text-purple-600 font-medium transition">
              How It Works
            </Link>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            Transform Your Data
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Into Insights
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Upload CSV or Excel files, get AI-powered summaries, create beautiful visualizations, 
            and export designs to Figma.
          </p>

          {/* Step indicators */}
          <div className="flex justify-center gap-8 mb-12">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800">{step.title}</h3>
                  <p className="text-sm text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Upload Section */}
          <Card 
            className={`max-w-3xl mx-auto border-2 transition-all ${
              isDragging 
                ? 'border-purple-500 border-dashed bg-purple-50' 
                : 'border-dashed border-slate-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <CardContent className="p-12">
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="animate-spin text-purple-600 mb-4" size={48} />
                  <h3 className="text-2xl font-bold mb-2">Processing your data...</h3>
                  <p className="text-slate-500">This may take a moment</p>
                </div>
              ) : (
                <>
                  <Upload size={56} className={`mx-auto mb-6 ${isDragging ? 'text-purple-600' : 'text-slate-300'}`} />
                  <h2 className="text-3xl font-bold mb-3">
                    {file ? file.name : 'Drop your CSV file here'}
                  </h2>
                  <p className="text-slate-500 mb-8">or click to browse</p>
                  
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileInput}
                    className="hidden"
                    id="csv-upload-home"
                  />
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-lg px-12 py-6"
                  >
                    <label htmlFor="csv-upload-home" className="cursor-pointer">
                      <Upload className="mr-2" size={20} />
                      Start Analyzing
                      <ArrowRight className="ml-2" size={20} />
                    </label>
                  </Button>

                  {uploadError && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">{uploadError}</span>
                      </div>
                      <button onClick={() => setUploadError(null)} className="text-red-500 hover:text-red-700">
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-black text-center mb-16">
          Powerful Features for Data Analysis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <Link href={feature.link} key={idx}>
              <Card className="h-full hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-purple-200">
                <CardContent className="p-8">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-purple-600 font-semibold">
                    Learn more <ArrowRight className="ml-2" size={16} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16">
            How It Works
          </h2>
          
          <div className="space-y-8">
            {[
              { step: "01", title: "Upload Your Data", description: "Drag and drop or select CSV files from your computer. We support files up to 100MB." },
              { step: "02", title: "AI Analysis", description: "Our advanced AI processes your data, identifying patterns, trends, and key insights automatically." },
              { step: "03", title: "Visualize & Export", description: "Create beautiful charts, get summaries, and export everything to Figma or download as images." },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-8 items-start">
                <div className="text-6xl font-black text-transparent bg-gradient-to-br from-purple-200 to-pink-200 bg-clip-text">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-lg">{item.description}</p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 border-0">
          <CardContent className="p-16 text-center text-white">
            <Zap className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-black mb-4">Ready to Transform Your Data?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who trust DataNova for their data analysis needs.
            </p>
            <Button 
              size="lg"
              className="bg-white text-purple-600 hover:bg-slate-100 text-lg px-12 py-6"
            >
              Get Started Free
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <DataNovaLogoWithText logoSize={36} className="justify-center mb-4" />
          <p className="text-slate-400 mb-6">
            Transform your data into insights with AI-powered analysis.
          </p>
          <div className="flex justify-center gap-8 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Contact</Link>
          </div>
          <p className="text-slate-500 mt-8 text-sm">
            © 2026 DataNova. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}