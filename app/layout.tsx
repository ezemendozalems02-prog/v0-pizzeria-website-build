import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { StoreProvider } from '@/lib/store'
import { BannersProvider } from '@/components/banners-provider'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { AddedToast } from '@/components/added-toast'
import { Footer } from '@/components/footer'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: 'Totore | Pizza Napolitana',
  description: 'Pizza napolitana con identidad propia. Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.',
  generator: 'v0.app',
  keywords: ['pizza', 'napolitana', 'delivery', 'El Palomar', 'Buenos Aires', 'pizzería'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#C4322B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <BannersProvider>
          <StoreProvider>
            <CartProvider>
              <Header />
              <CartDrawer />
              <AddedToast />
              <main className="min-h-screen pt-16">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </StoreProvider>
        </BannersProvider>
        <Analytics />
      </body>
    </html>
  )
}
