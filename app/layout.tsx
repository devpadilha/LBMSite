import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/use-toast"
import { AuthProvider } from "@/contexts/auth-context"
import AppContent from "@/app/app-content"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "LBM - Sistema de Gestão Municipal",
  description: "Sistema de gestão de municípios, licitações, contratos e ordens de serviço",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <AppContent>{children}</AppContent>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
