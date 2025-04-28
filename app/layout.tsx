import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/use-toast"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

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
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <header className="border-b bg-card">
                <div className="flex h-16 items-center px-4 md:px-6 justify-end">
                  <div className="flex items-center gap-4">
                    <ModeToggle />
                    <UserNav />
                  </div>
                </div>
              </header>
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
