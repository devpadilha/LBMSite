"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Building, FileText, Home, LayoutDashboard } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      href: "/municipios",
      label: "Municípios",
      icon: <Building className="h-4 w-4 mr-2" />,
      active: pathname.includes("/municipios"),
    },
    {
      href: "/relatorios",
      label: "Relatórios",
      icon: <FileText className="h-4 w-4 mr-2" />,
      active: pathname.includes("/relatorios"),
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="flex items-center text-lg font-bold">
        <Home className="h-5 w-5 mr-2 text-primary" />
        LBM
      </Link>
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center text-sm font-medium transition-colors hover:text-primary",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.icon}
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
