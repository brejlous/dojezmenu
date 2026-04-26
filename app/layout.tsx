import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const geist = Geist({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#94002A',
}

export const metadata: Metadata = {
  title: 'LastBite – zachraňte dobré jídlo',
  description: 'Rezervujte si zbylé porce denního menu za zvýhodněnou cenu a vyzvedněte je přímo v restauraci.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LastBite',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  )
}
