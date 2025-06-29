import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import QueryProvider from '@/providers/QueryProvider'
import { ThemeProvider } from '@/components/theme-provider'
import ClientSideProvider from '@/providers/ClientSideProvider'

export const metadata: Metadata = {
  title: 'Early Warning System',
  description: 'Hệ thống cảnh báo sớm cho học sinh',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background">
        <QueryProvider>
          <ClientSideProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </ClientSideProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
