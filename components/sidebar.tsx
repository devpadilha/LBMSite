"use client"

import { useState } from "react"
import { BarChart, ClipboardList, FileText, FolderOpen, Menu, Users, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LBMLogo } from "@/components/logo"
import { cn } from "@/lib/utils"

const routes = [
  {
    label: "Dashboard",
    icon: BarChart,
    href: "/dashboard",
    color: "text-primary",
  },
  {
    label: "Ordens de Serviço",
    icon: ClipboardList,
    href: "/ordens-de-servico",
    color: "text-primary",
  },
  {
    label: "Projetos",
    icon: FolderOpen,
    href: "/projetos",
    color: "text-primary",
  },
  {
    label: "Funcionários",
    icon: Users,
    href: "/funcionarios",
    color: "text-primary",
  },
  {
    label: "Relatórios",
    icon: FileText,
    href: "/relatorios",
    color: "text-primary",
  },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="px-3 py-4 flex items-center justify-between border-b">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <LBMLogo className="w-full h-full" />
                </div>
                <span>LBM Engenharia</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto">
              <nav className="flex flex-col gap-1 px-2 py-4">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                      pathname === route.href 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground font-medium"
                    )}
                  >
                    <route.icon
                      className={cn("h-5 w-5", pathname === route.href ? "text-primary-foreground" : route.color)}
                    />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="border-t p-3 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">© 2023 LBM Engenharia</div>
              <ThemeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full w-64 flex-col border-r bg-background theme-transition", className)}>
        <div className="px-3 py-4 flex items-center border-b">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <LBMLogo className="w-full h-full" />
            </div>
            <span>LBM Engenharia</span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <nav className="flex flex-col gap-1 px-2 py-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent",
                  pathname === route.href 
                    ? "bg-primary text-primary-foreground" 
                    : "text-foreground font-medium"
                )}
              >
                <route.icon
                  className={cn("h-5 w-5", pathname === route.href ? "text-primary-foreground" : route.color)}
                />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t p-3 flex justify-between items-center">
          <div className="text-sm text-muted-foreground">© 2023 LBM Engenharia</div>
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

