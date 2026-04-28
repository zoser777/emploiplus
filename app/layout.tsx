import type { Metadata } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const dmSans = DM_Sans({ 
  subsets: ["latin"],
  variable: '--font-dm-sans',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Emploi Plus - Plateforme d\'emploi & de formation au Congo',
  description: 'Emploi Plus connecte les entreprises et les chercheurs d\'emploi à Brazzaville et Pointe-Noire. Offres d\'emploi, stages, formations professionnelles.',
  keywords: ['emploi', 'congo', 'brazzaville', 'pointe-noire', 'recrutement', 'formation', 'stage', 'CDI', 'CDD'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster position="bottom-right" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
