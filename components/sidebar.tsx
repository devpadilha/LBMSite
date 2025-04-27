"use client"

import { LayoutDashboard, ListChecks, Tag, Settings, Building } from "lucide-react"
import { usePathname } from "next/navigation"

import { MainNav } from "@/components/main-nav"
import { SidebarNavItem } from "@/components/sidebar-nav-item"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

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
      icon: Building, // Importe o ícone Building do lucide-react
      current: pathname.includes("/municipios"),
    },
    {
      name: "Checklists",
      href: "/checklists",
      icon: ListChecks,
      current: pathname === "/checklists",
    },
    {
      name: "Tags",
      href: "/tags",
      icon: Tag,
      current: pathname === "/tags",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ]

  return (
    <div className="flex h-full max-w-[280px] flex-col border-r bg-white">
      <div className="px-4 py-6">
        <MainNav className="flex flex-col gap-6" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
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
