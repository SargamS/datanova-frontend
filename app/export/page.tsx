'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Upload, CheckCircle2, Loader2, Share2 } from 'lucide-react';

export default function ExportPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const connectFigma = () => {
    setIsConnected(true);
  };

  const startExport = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse opacity-40"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/70 backdrop-blur-xl border-b border-border/50 z-50 animate-float-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:text-primary transition group">
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
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-xl shadow-yellow-500/50 animate-bounce-soft">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">Figma Export</h1>
            </div>
            <p className="text-muted-foreground text-xl">
              Seamlessly export your analysis, summaries, and visualizations
              directly to Figma for collaboration
            </p>
          </div>

          {!exportComplete ? (
            <>
              {/* Connection Status */}
              <Card className="p-10 mb-8 border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 to-yellow-500/10 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {isConnected
                        ? 'Figma Connected'
                        : 'Connect to Figma'}
                    </h2>
                    <p className="text-muted-foreground">
                      {isConnected
                        ? 'Ready to export your work'
                        : 'Authorize DataNova to access your Figma workspace'}
                    </p>
                  </div>
                  {isConnected ? (
                    <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <CheckCircle2 className="w-7 h-7 text-white" />
                    </div>
                  ) : (
                    <Button onClick={connectFigma} className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:shadow-lg hover:shadow-yellow-500/40 font-semibold">
                      Connect Figma
                    </Button>
                  )}
                </div>
              </Card>

              {isConnected && (
                <>
                  {/* Export Options */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6">
                      What to Export
                    </h2>
                    <div className="space-y-4">
                      {[
                        {
                          name: 'Data Summary',
                          description: 'AI-generated insights and key findings',
                        },
                        {
                          name: 'Visualizations',
                          description: 'Interactive charts and infographics',
                        },
                        {
                          name: 'Analysis Report',
                          description: 'Detailed statistical analysis',
                        },
                        {
                          name: 'Recommendations',
                          description: 'Actionable insights and next steps',
                        },
                      ].map((item, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-card/50 cursor-pointer transition"
                        >
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded"
                          />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Export Configuration */}
                  <Card className="p-8 mb-8">
                    <h3 className="text-xl font-semibold mb-6">
                      Export Configuration
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Figma Project
                        </label>
                        <select className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground">
                          <option>Select a project...</option>
                          <option>DataNova Project</option>
                          <option>Design System</option>
                          <option>Brand Assets</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          File Name
                        </label>
                        <input
                          type="text"
                          defaultValue="DataNova Export - [Date]"
                          className="w-full px-4 py-2 rounded-lg border border-border bg-card text-foreground"
                        />
                      </div>

                      <div>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm font-medium">
                            Create new page
                          </span>
                        </label>
                        <p className="text-xs text-muted-foreground mt-2">
                          Create a new page in the selected project
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Export Button */}
                  <Button
                    onClick={startExport}
                    disabled={isExporting}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Export to Figma
                      </>
                    )}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                </div>

                <h2 className="text-3xl font-bold mb-4">
                  Export Successful!
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Your data analysis, visualizations, and summaries have been
                  successfully exported to your Figma workspace. You can now
                  collaborate with your team and further customize the designs.
                </p>

                <div className="bg-card border border-primary/30 rounded-lg p-6 mb-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    Exported to
                  </p>
                  <p className="font-semibold">DataNova Project</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Open in Figma →
                  </p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-6">What's Next?</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <h4 className="font-semibold mb-2">Customize in Figma</h4>
                    <p className="text-sm text-muted-foreground">
                      Edit colors, fonts, and layouts to match your brand
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <h4 className="font-semibold mb-2">Share with Team</h4>
                    <p className="text-sm text-muted-foreground">
                      Invite team members to collaborate on the designs
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <h4 className="font-semibold mb-2">Export & Use</h4>
                    <p className="text-sm text-muted-foreground">
                      Download as PNG, PDF, or use in your presentations
                    </p>
                  </Card>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/analyze" className="flex-1">
                  <Button className="w-full">Analyze New Data</Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => {
                    setExportComplete(false);
                    setIsConnected(false);
                  }}
                >
                  Export Again
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
