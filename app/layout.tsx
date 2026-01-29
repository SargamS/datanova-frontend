import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Chatbot  from '@/components/chatbot'
import { DataProvider } from '@/context/DataContext' 
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'DataNova - AI-Powered Data Analysis',
  description: 'Transform your data into insights with AI summaries, interactive visualizations, and export-ready designs',
  generator: 'v0.app',
  icons: {
    icon: '/datanova-icon.svg',
    apple: '/datanova-icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <DataProvider>
          {children}
          <Chatbot />
          <Analytics />
        </DataProvider>
      </body>
    </html>
  )
}