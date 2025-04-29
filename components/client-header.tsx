"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"

export function ClientHeader() {
  return (
    <div className="flex items-center gap-4">
      <ModeToggle />
      <UserNav />
    </div>
  )
}