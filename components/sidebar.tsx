"use client"

import { BarChart3, Building, LayoutDashboard, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { SidebarNavItem } from "@/components/sidebar-nav-item"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { EmployeeRole } from "@/types/database.types"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado usando cookies
    import("@/lib/cookie-utils").then(({ getCookie }) => {
      const user = getCookie("user")
      if (user) {
        setIsAuthenticated(true)
        // Parse user data from cookie
        try {
          const userData = JSON.parse(user)
          // Fetch user role from database using the user ID
          fetchUserRole(userData.id)
        } catch (error) {
          console.error("Error parsing user data:", error)
        }
      }
    })
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("role")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error fetching user role:", error)
        return
      }

      if (data) {
        setUserRole(data.role)
      }
    } catch (error) {
      console.error("Error fetching user role:", error)
    }
  }

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
    ...(userRole === EmployeeRole.ADMIN ? [
      {
        name: "Funcionários",
        href: "/employees",
        icon: Users,
        current: pathname.includes("/employees"),
      }
    ] : []),
    ...(userRole === EmployeeRole.ADMIN ? [
    {
      name: "Configurações",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ] : []),
  ]

  return (
    <div className={cn("flex h-screen max-w-[280px] flex-col border-r bg-card", className)}>
      <div className="px-4 py-6 flex flex-col h-full">
        <Link href="/dashboard" className="flex items-center justify-center gap-2 mb-6">
          <Image 
            src="/logo-lbm.png" 
            alt="LBM Engenharia" 
            width={128} 
            height={128} 
          />
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
