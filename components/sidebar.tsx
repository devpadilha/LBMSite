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
import { EmployeePermissions, PermissionType } from "@/types/permissions.types"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userPermissions, setUserPermissions] = useState<EmployeePermissions>(new EmployeePermissions())

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
      // Buscar o papel do usuário
      const { data: employeeData, error: employeeError } = await supabase
        .from("employees")
        .select("role")
        .eq("id", userId)
        .single()

      if (employeeError) {
        console.error("Error fetching user role:", employeeError)
        return
      }

      if (employeeData) {
        setUserRole(employeeData.role)
      }

      // Buscar as permissões do usuário
      const { data: permissionsData, error: permissionsError } = await supabase
        .from("employee_permissions")
        .select(`
          permission_id
        `)
        .eq("employee_id", userId)

      if (permissionsError) {
        console.error("Error fetching user permissions:", permissionsError)
        return
      }

      // Criar um objeto de permissões com base nos dados do banco
      const permissions = new EmployeePermissions()
      
      // Se não houver permissões específicas, usar as permissões padrão baseadas no papel
      if (!permissionsData || permissionsData.length === 0) {
        const defaultPermissions = EmployeePermissions.getDefaultByRole(employeeData.role)
        setUserPermissions(defaultPermissions)
        return
      }

      // Configurar as permissões com base nos IDs encontrados
      permissionsData.forEach((item) => {
        switch (item.permission_id) {
          case PermissionType.DASHBOARD:
            permissions.dashboard = true
            break
          case PermissionType.MUNICIPALITIES:
            permissions.municipalities = true
            break
          case PermissionType.REPORTS:
            permissions.reports = true
            break
          case PermissionType.EMPLOYEES:
            permissions.employees = true
            break
          case PermissionType.SETTINGS:
            permissions.settings = true
            break
        }
      })

      setUserPermissions(permissions)
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  // Se não estiver autenticado, não renderizar o sidebar
  if (!isAuthenticated) {
    return null
  }

  // Definir as rotas com base nas permissões do usuário
  const routes = [
    // Dashboard - mostrar apenas se o usuário tiver permissão
    ...(userPermissions.dashboard ? [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        current: pathname === "/dashboard",
      }
    ] : []),
    // Municípios - mostrar apenas se o usuário tiver permissão
    ...(userPermissions.municipalities ? [
      {
        name: "Municípios",
        href: "/municipios",
        icon: Building,
        current: pathname.includes("/municipios"),
      }
    ] : []),
    // Relatórios - mostrar apenas se o usuário tiver permissão
    ...(userPermissions.reports ? [
      {
        name: "Relatórios",
        href: "/relatorios",
        icon: BarChart3,
        current: pathname.includes("/relatorios"),
      }
    ] : []),
    // Funcionários - mostrar apenas se o usuário tiver permissão
    ...(userPermissions.employees ? [
      {
        name: "Funcionários",
        href: "/employees",
        icon: Users,
        current: pathname.includes("/employees"),
      }
    ] : []),
    // Configurações - mostrar apenas se o usuário tiver permissão
    ...(userPermissions.settings ? [
      {
        name: "Configurações",
        href: "/settings",
        icon: Settings,
        current: pathname === "/settings",
      }
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
