import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DojezMenu – zachraňte dobré jídlo',
  description: 'Rezervujte si zbylé porce denního menu za zvýhodněnou cenu a vyzvedněte je přímo v restauraci.',
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
