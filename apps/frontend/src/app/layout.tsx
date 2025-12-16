import './globals.css'

import { cn } from '@/lib/utils'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Link from 'next/link'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'CAOJI Official',
  description: 'The official site of CAOJI, a software developer and tech enthusiast.',
  icons: { icon: '/images/favicon.ico' }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased bg-background text-foreground',
          '[&>main]:container [&>main]:mx-auto [&>main]:p-4'
        )}
      >
        <header className="border-b bg-white sticky top-0 z-50">
          <div className="container mx-auto px-4 h-16 flex items-center">
            <Link href="/" className="text-2xl font-bold hover:text-blue-600 transition-colors">
              CAOJI
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  )
}
