"use client"

import { usePathname } from "next/navigation"
import { SidebarNavItem } from "@/components/sidebar-nav-item"
import { iconMap } from "./icons";

type Route = {
  name: string;
  href: string;
  iconName: keyof typeof iconMap;
}

interface SidebarClientProps {
  routes: Route[];
}

export function SidebarClient({ routes }: SidebarClientProps) {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1 px-2"> {
      routes.map((route) => {
        const IconComponent = iconMap[route.iconName];
        return (
          <SidebarNavItem 
          key={route.name} 
          href={route.href} 
          icon={IconComponent}
          current={pathname.startsWith(route.href)}
          >
            {route.name}
          </SidebarNavItem>
        );
      })}
    </nav>
  )
}