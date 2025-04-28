"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/sidebar"
import { UserNav } from "@/components/user-nav"
import { ModeToggle } from "@/components/mode-toggle"

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

  // Verificar se estamos em uma rota de autenticação
  const isAuthRoute = pathname === "/login" || pathname === "/recuperar-senha" || pathname === "/cadastro"

  // Se estiver carregando, mostrar um indicador de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EC610D]"></div>
      </div>
    )
  }

  // Se não estiver autenticado e não estiver em uma rota de autenticação, o AuthProvider redirecionará para o login
  // Se estiver em uma rota de autenticação, mostrar apenas o conteúdo sem o layout do app
  if (!user || isAuthRoute) {
    return <>{children}</>
  }

  // Se estiver autenticado, mostrar o layout completo do app
  return (
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
  )
}

export default AppContent
