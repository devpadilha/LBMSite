"use client"

import { BarChart3, Building, LayoutDashboard, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "@/components/sidebar-nav-item"
import { useEffect, useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const user = localStorage.getItem("user")
    setIsAuthenticated(!!user)
  }, [])

  // Se não estiver autenticado, não renderizar o sidebar
  if (!isAuthenticated) {
    return null
  }

  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: "Municípios",
      href: "/municipios",
      icon: Building,
      current: pathname.includes("/municipios"),
    },
    {
      name: "Relatórios",
      href: "/relatorios",
      icon: BarChart3,
      current: pathname.includes("/relatorios"),
    },
    {
      name: "Funcionários",
      href: "/employees",
      icon: Users,
      current: pathname.includes("/employees"),
    },
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ]

  return (
    <div className={cn("flex h-full max-w-[280px] flex-col border-r bg-card", className)}>
      <div className="px-4 py-6">
        <Link href="/dashboard" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-[#EC610D] rounded-md flex items-center justify-center">
            <span className="text-white font-bold">LBM</span>
          </div>
          <span className="font-bold text-lg">LBM Engenharia</span>
        </Link>
        <div className="text-xs text-muted-foreground mb-4 px-2">Painel de Administração</div>
        <nav className="grid gap-1 px-2">
          {routes.map((route) => (
            <SidebarNavItem key={route.name} href={route.href} icon={route.icon} current={route.current}>
              {route.name}
            </SidebarNavItem>
          ))}
        </nav>
      </div>
    </div>
  )
}
