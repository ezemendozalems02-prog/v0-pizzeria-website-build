import type { Metadata, Viewport } from 'next'
import { Open_Sans, Bricolage_Grotesque, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { CartProvider } from '@/lib/cart-context'
import { StoreProvider } from '@/lib/store'
import { BannersProvider } from '@/components/banners-provider'
import { Header } from '@/components/header'
import { CartDrawer } from '@/components/cart-drawer'
import { AddedToast } from '@/components/added-toast'
import { Footer } from '@/components/footer'
import './globals.css'

// Body / párrafos
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

// Navegación, botones, labels, UI
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// Acento futurista/robótico — taglines, frases destacadas
const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
  weight: ['400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: 'Totore | Pizza Napolitana',
  description: 'Pizza napolitana con identidad propia. Pedí tu favorita o vení a buscarla. Totore es pizza, barrio y buena comida.',
  generator: 'v0.app',
  keywords: ['pizza', 'napolitana', 'delivery', 'El Palomar', 'Buenos Aires', 'pizzería'],
  icons: {
    icon: [
      {
        url: '/favicon.jpg',
        sizes: '256x256',
        type: 'image/jpeg',
      },
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
      <body className={`${openSans.variable} ${bricolage.variable} ${orbitron.variable} font-sans antialiased`}>
        <BannersProvider>
          <StoreProvider>
            <CartProvider>
              <Header />
              <CartDrawer />
              <AddedToast />
              <main>
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
