"use client";

import type { LucideIcon } from "lucide-react";
import type React from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  href: string;
  icon: LucideIcon;
  children: React.ReactNode;
  current: boolean;
};

export function SidebarNavItem({ href, icon: Icon, children, current }: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        current ? "bg-[#EC610D] text-white" : "text-muted-foreground hover:bg-[#EC610D]/10 hover:text-[#EC610D]",
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
    </Link>
  );
}
