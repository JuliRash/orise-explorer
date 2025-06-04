import './globals.css'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer/footer'
import { QueryProvider } from '@/components/query-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'UCCASH Explorer',
  description: 'Universe Chain Block Explorer',
  icons: "/favicon.png"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <QueryProvider>
            <div className="min-h-screen bg-background flex flex-col">
              <Navbar />
              <main className="flex-1ß pb-8">{children}</main>
              <Footer />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}