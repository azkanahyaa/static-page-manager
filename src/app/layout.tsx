import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StaticManager - Static Website Management Platform',
  description: 'A production-ready platform for creating, managing, and deploying static websites with advanced editing capabilities.',
  keywords: ['static websites', 'website builder', 'cms', 'web development'],
  authors: [{ name: 'StaticManager Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster 
            position="top-right" 
            richColors 
            closeButton
            duration={4000}
          />
        </AuthProvider>
      </body>
    </html>
  )
}