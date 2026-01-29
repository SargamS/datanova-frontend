'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  Wand2,
  Upload,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 text-foreground overflow-hidden relative">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-foreground">DataNova</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-foreground hover:text-primary transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-foreground hover:text-primary transition">
              How It Works
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12 sm:p-16 overflow-hidden relative">
            {/* Decorative colored shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 rounded-full opacity-20 blur-3xl -z-10"></div>

            <div className="mb-12">
              <h1 className="text-5xl sm:text-6xl font-black text-foreground mb-6 leading-tight animate-float-up">
                Transform Your Data<br />Into Insights
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl">
                Upload CSV or Excel files, get AI-powered summaries, create beautiful visualizations, and export designs to Figma.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Upload</p>
                  <p className="text-sm text-muted-foreground">CSV, Excel files</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Wand2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Analyze</p>
                  <p className="text-sm text-muted-foreground">AI-powered insights</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-foreground">Export</p>
                  <p className="text-sm text-muted-foreground">To Figma</p>
                </div>
              </div>
            </div>

            <Link href="/analyze">
              <Button size="lg" className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 text-lg rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all">
                Start Analyzing
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to analyze, visualize, and share your data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <Link href="/analyze">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer h-full overflow-hidden relative border-2 border-blue-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-2xl -z-10"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Data Analysis</h3>
                <p className="text-muted-foreground mb-6">
                  Upload datasets and explore comprehensive statistics and insights in real-time.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Explore <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Feature 2 */}
            <Link href="/summarize">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer h-full overflow-hidden relative border-2 border-purple-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-full opacity-40 blur-2xl -z-10"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">AI Summaries</h3>
                <p className="text-muted-foreground mb-6">
                  Get intelligent summaries with advanced analysis. Perfect for reports and presentations.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Generate <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Feature 3 */}
            <Link href="/visualize">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer h-full overflow-hidden relative border-2 border-green-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full opacity-40 blur-2xl -z-10"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Wand2 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Visualizations</h3>
                <p className="text-muted-foreground mb-6">
                  Create beautiful, interactive charts and infographics with Plotly.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Create <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Feature 4 */}
            <Link href="/export">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group cursor-pointer h-full overflow-hidden relative border-2 border-orange-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100 rounded-full opacity-40 blur-2xl -z-10"></div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Figma Export</h3>
                <p className="text-muted-foreground mb-6">
                  Export designs directly to Figma for seamless team collaboration.
                </p>
                <div className="flex items-center text-primary font-semibold text-sm">
                  Export <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl sm:text-6xl font-black text-center mb-16 text-foreground">
            How It Works
          </h2>

          <div className="space-y-6">
            {[
              { step: 1, title: 'Upload Your Data', description: 'Simply upload your CSV or Excel file.' },
              { step: 2, title: 'Get Insights', description: 'Our AI analyzes and generates summaries.' },
              { step: 3, title: 'Create Visuals', description: 'Build interactive charts and infographics.' },
              { step: 4, title: 'Export', description: 'Download designs and export to Figma.' },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 text-white font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 sm:p-16 text-center shadow-2xl overflow-hidden relative border-2 border-orange-200">
          <div className="absolute top-0 left-0 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-orange-200 rounded-full opacity-30 blur-3xl -z-10"></div>
          
          <h2 className="text-4xl sm:text-5xl font-black text-foreground mb-6">Ready to Transform Your Data?</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Start analyzing, visualizing, and exporting your data in minutes. Join teams that trust DataNova.
          </p>
          <Link href="/analyze">
            <Button size="lg" className="bg-gradient-to-r from-primary via-purple-600 to-secondary text-white font-bold py-6 px-10 text-lg rounded-xl hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:scale-105">
              Upload Your First File
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">&copy; 2025 DataNova. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary transition font-semibold">Privacy</a>
            <a href="#" className="hover:text-primary transition font-semibold">Terms</a>
            <a href="#" className="hover:text-primary transition font-semibold">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}