'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  FileText,
  Copy,
  Download,
  Sparkles,
  Loader2,
  Zap,
} from 'lucide-react';

const SAMPLE_SUMMARIES: Record<string, string> = {
  'Executive Summary': `EXECUTIVE SUMMARY

Dataset Analysis Overview:
The uploaded dataset contains 15,234 records across 12 columns with diverse data types. Our analysis reveals several key insights:

Key Findings:
• Strong correlation between variables A and B (r=0.87), indicating strong relationship
• Outliers detected in 3.2% of records, primarily in the revenue column
• Distribution is positively skewed with median value 45% lower than mean
• Seasonal trends visible in monthly aggregations with peak occurring in Q3

Business Impact:
These patterns suggest opportunities for predictive modeling and optimization. Recommend implementing automated anomaly detection and forecasting models for improved decision-making.`,
  
  'Technical Analysis': `TECHNICAL ANALYSIS

Data Quality Assessment:
- Data Completeness: 98.4% (missing values in 2 columns)
- Outlier Detection: 127 anomalies identified using IQR method
- Distribution Analysis: 6 numerical columns follow normal distribution
- Correlation Matrix: High multicollinearity detected (VIF > 5) in columns C and D

Statistical Insights:
- Mean values range from 12.3 to 892.5 across numeric columns
- Standard deviation indicates high variability in measurement columns
- Skewness analysis reveals 4 left-skewed and 3 right-skewed distributions
- Kurtosis values suggest presence of outliers in 5 columns

Recommendations:
Apply data normalization, feature engineering, and consider dimensionality reduction techniques before modeling.`,

  'Business Insights': `BUSINESS INSIGHTS

Performance Metrics:
Revenue shows strong growth trajectory with 23% YoY increase. Customer acquisition cost has decreased by 15% while lifetime value increased by 31%, indicating improved operational efficiency.

Market Trends:
Geographic analysis reveals highest demand in North American markets (42% of total), followed by EU (28%). Emerging markets show 45% growth rate despite lower base volumes.

Strategic Recommendations:
1. Prioritize resource allocation to high-growth segments
2. Implement targeted campaigns for seasonal demand peaks
3. Develop retention programs for high-value customer cohorts
4. Explore cross-selling opportunities in underperforming regions`,
};

export default function SummarizePage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState('Executive Summary');
  const fileId = null; // Declare the fileId variable

  const handleGenerateSummary = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setSummary(SAMPLE_SUMMARIES[summaryStyle] || SAMPLE_SUMMARIES['Executive Summary']);
      setIsGenerating(false);
    }, 2000);
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    }
  };

  const downloadSummary = () => {
    const element = document.createElement('a');
    const file = new Blob([summary || ''], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `summary-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };



  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-xl border-b border-border/50 z-50 animate-float-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/analyze" className="flex items-center gap-2 hover:text-primary transition group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16 animate-float-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/50 animate-bounce-soft">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">AI Summaries</h1>
            </div>
            <p className="text-muted-foreground text-xl">
              Generate intelligent, actionable summaries of your data powered by
              GPT-4 AI
            </p>
          </div>

          {!summary ? (
            <>
              {/* Upload Section */}
              <Card className="p-10 mb-8 border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg">
                <h2 className="text-3xl font-bold mb-6">
                  Generate Summary
                </h2>
                <p className="text-muted-foreground mb-10 text-lg">
                  Upload a data file to generate a comprehensive AI-powered
                  summary with key insights and recommendations.
                </p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Data File
                    </label>
                    <div className="border-2 border-dashed border-primary/40 rounded-2xl p-8 text-center hover:border-primary/70 transition cursor-pointer bg-primary/5">
                      <FileText className="w-10 h-10 text-primary mx-auto mb-3" />
                      <p className="text-base text-muted-foreground">
                        Click or drag to upload your data file
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-3">
                      Summary Style
                    </label>
                    <select 
                      className="w-full px-5 py-3 rounded-xl border border-primary/30 bg-card text-foreground font-medium hover:border-primary/50 transition"
                      value={summaryStyle}
                      onChange={(e) => setSummaryStyle(e.target.value)}
                    >
                      <option>Executive Summary</option>
                      <option>Technical Analysis</option>
                      <option>Business Insights</option>
                    </select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerateSummary}
                  disabled={isGenerating}
                  className="w-full mt-10 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/40 text-lg py-6 font-semibold"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </Card>

              {/* Features */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Powered by GPT-4</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced AI model for deep insights and comprehensive analysis
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Multiple Formats</h3>
                  <p className="text-sm text-muted-foreground">
                    Get summaries in executive, technical, or business format
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Actionable Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive specific recommendations for your business
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Export Ready</h3>
                  <p className="text-sm text-muted-foreground">
                    Download summaries in multiple formats
                  </p>
                </Card>
              </div>
            </>
          ) : (
            <>
              {/* Summary Display */}
              <Card className="p-8 bg-white shadow-lg border-2 border-purple-100 rounded-2xl mb-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 rounded-full opacity-40 blur-2xl"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <h2 className="text-2xl font-bold text-foreground">Your Summary</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="gap-2 border-purple-200 text-foreground hover:bg-purple-50 font-semibold bg-transparent"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedToClipboard ? 'Copied!' : 'Copy'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadSummary}
                      className="gap-2 border-purple-200 text-foreground hover:bg-purple-50 font-semibold bg-transparent"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>

                <div className="whitespace-pre-wrap bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100 text-foreground text-sm leading-relaxed relative z-10">
                  {summary}
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/visualize" className="flex-1">
                  <Button className="w-full gap-2">
                    Create Visualizations
                  </Button>
                </Link>
                <Link href="/analyze" className="flex-1">
                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    Upload New File
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setSummary(null)}
                >
                  Generate Another
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
