import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AdSenseScript } from '@/components/ads/AdSenseScript'
import { defaultMetadata } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = defaultMetadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AdSenseScript />
          <a
            href="#main-content"
            className="sr-only fixed left-4 top-4 z-[60] rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600"
          >
            Skip to main content
          </a>
          <Navbar />
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
