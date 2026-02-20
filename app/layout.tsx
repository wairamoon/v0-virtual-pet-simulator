import type { Metadata, Viewport } from 'next'
import { Orbitron } from 'next/font/google'

import './globals.css'

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'PixSim - Tu Mascota Virtual',
  description: 'Simulador de mascota virtual con estética futurista Y2K',
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${orbitron.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
