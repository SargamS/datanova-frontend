import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DataNova - AI-Powered Data Analysis",
  description: "Transform your data into insights with AI-powered summaries, beautiful visualizations, and intelligent Q&A.",
  icons: {
    icon: [
      {
        url: "/datanova-icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/datanova-icon.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Inline SVG favicon as fallback */}
        <link 
          rel="icon" 
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%238B5CF6'/><stop offset='50%' stop-color='%23EC4899'/><stop offset='100%' stop-color='%23F97316'/></linearGradient></defs><circle cx='50' cy='50' r='45' fill='url(%23g)'/><path d='M50 20 L55 40 L75 45 L55 50 L50 70 L45 50 L25 45 L45 40 Z' fill='white' opacity='0.9'/></svg>" 
          type="image/svg+xml" 
        />
      </head>
      <body className={inter.className}>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}