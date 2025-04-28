"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Em uma aplicação real, você verificaria o token JWT ou sessão
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Redirecionar usuário não autenticado para login
  useEffect(() => {
    if (
      !isLoading &&
      !user &&
      pathname !== "/login" &&
      pathname !== "/recuperar-senha" &&
      !pathname.startsWith("/cadastro")
    ) {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Em uma aplicação real, você faria uma chamada à API
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificação simples (em produção, isso seria feito no servidor)
      if (email === "admin@lbm.com.br" && password === "senha123") {
        const userData: User = {
          id: "1",
          name: "Administrador",
          email: "admin@lbm.com.br",
          role: "admin",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Em uma aplicação real, você faria uma chamada à API
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Em uma aplicação real, o usuário seria criado no banco de dados
      return true
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
