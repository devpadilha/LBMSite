"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth-utils"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    // Verificar se o usuário está autenticado
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  // Se o usuário não estiver autenticado, não renderizar nada
  if (typeof window !== "undefined" && !isAuthenticated()) {
    return null
  }

  // Se o usuário estiver autenticado, renderizar o conteúdo
  return <>{children}</>
}
