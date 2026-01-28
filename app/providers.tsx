'use client'

import { ReactNode } from 'react'
import Chatbot from '@/components/chatbot'
import { DataProvider } from '@/context/DataContext'

export default function Providers({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DataProvider>
      {children}
      <Chatbot />
    </DataProvider>
  )
}
