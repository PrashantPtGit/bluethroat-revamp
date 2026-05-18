import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { LanguageProvider } from '@/context/LanguageContext'
import LenisProvider from '@/components/LenisProvider'
import Navbar from '@/components/Navbar'
import GlobalBackground from '@/components/GlobalBackground'
import ScrollStory from '@/components/ScrollStory'
import FloatingBlue from '@/components/FloatingBlue'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Bluethroat.ie — AI Automation for Professionals · Ireland',
  description:
    'Bluethroat builds automation dashboards and web platforms for non-tech professionals in Ireland, UK, and Australia. Irish-registered. Builder-led.',
  keywords: [
    'AI automation Ireland',
    'web development Ireland',
    'automation agency Dublin',
    'AI chatbot Ireland',
  ],
  openGraph: {
    type: 'website',
    url: 'https://bluethroat.ie',
    title: 'Bluethroat.ie — AI Automation for Professionals · Ireland',
    description:
      'Bluethroat builds automation dashboards and web platforms for non-tech professionals in Ireland, UK, and Australia. Irish-registered. Builder-led.',
    images: [{ url: 'https://bluethroat.ie/og.png' }],
  },
  alternates: {
    canonical: 'https://bluethroat.ie',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        {/* Fixed canvas particle field — sits behind everything */}
        <GlobalBackground />

        <LanguageProvider>
          <LenisProvider>
            <Navbar />
            <ScrollStory />
            <FloatingBlue />
            {children}
          </LenisProvider>
        </LanguageProvider>

        {/* TODO Phase 2: Add Google Analytics 4 gtag here */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
