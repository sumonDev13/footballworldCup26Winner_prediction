import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'World Cup 26 - Champion Predictor',
  description: 'Predict the World Cup 2026 champion step by step',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
