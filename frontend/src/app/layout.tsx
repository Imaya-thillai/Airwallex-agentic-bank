import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'STACK AI — Treasury • Lending • Risk',
  description: 'Multi-Agent Treasury and Lending Intelligence Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-800 text-slate-100 min-h-screen font-sans antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
