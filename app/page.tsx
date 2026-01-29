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
          <Link href="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black text-foreground">DataNova</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-semibold text-foreground hover:text-orange-600 transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-semibold text-foreground hover:text-orange-600 transition">
              How It Works
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-16 relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 mb-6 leading-tight">
                Transform Your Data<br />Into Insights
              </h1>
              <p className="text-xl text-slate-500 mb-10 max-w-2xl">
                Upload CSV files, get AI-powered summaries, and export designs to Figma instantly.
              </p>
              <Link href="/analyze">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-6 text-lg rounded-xl transition-all shadow-lg shadow-orange-200">
                  Start Analyzing <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          href="/analyze" 
          title="Analyze" 
          desc="Real-time stats" 
          icon={<BarChart3 className="text-blue-500" />} 
          color="border-blue-200"
        />
        <FeatureCard 
          href="/summarize" 
          title="AI Summary" 
          desc="GPT-4 Insights" 
          icon={<FileText className="text-purple-500" />} 
          color="border-purple-200"
        />
        <FeatureCard 
          href="/visualize" 
          title="Visualize" 
          desc="Interactive charts" 
          icon={<Wand2 className="text-green-500" />} 
          color="border-green-200"
        />
        <FeatureCard 
          href="/export" 
          title="Export" 
          desc="Figma & PNG" 
          icon={<Upload className="text-orange-500" />} 
          color="border-orange-200"
        />
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0 text-white font-bold">
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
            <Button size="lg" className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 text-white font-bold py-6 px-10 text-lg rounded-xl hover:shadow-2xl hover:shadow-orange-400/40 transition-all transform hover:scale-105">
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
            <a href="#" className="hover:text-orange-600 transition font-semibold">Privacy</a>
            <a href="#" className="hover:text-orange-600 transition font-semibold">Terms</a>
            <a href="#" className="hover:text-orange-600 transition font-semibold">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ href, title, desc, icon, color }: {
  href: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Link href={href}>
      <div className={`bg-white p-6 rounded-2xl border-2 ${color} hover:shadow-xl transition-all cursor-pointer group`}>
        <div className="mb-4 group-hover:scale-110 transition-transform">{icon}</div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-slate-500 text-sm">{desc}</p>
      </div>
    </Link>
  );
}