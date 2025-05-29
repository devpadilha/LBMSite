"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { setCookie, removeCookie, getCookie } from "@/lib/cookie-utils"
import { authService, type User } from "@/lib/auth-service"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  // Marcar quando o componente estiver montado no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Função para buscar o perfil do usuário
  const fetchUserProfile = async (userId: string) => {
    try {
      const { profile, error } = await authService.getUserProfile(userId)

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      return profile
    } catch (error) {
      console.error('Erro ao buscar perfil:', error)
      return null
    }
  }

  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    if (!mounted) return

    const checkAuth = async () => {
      try {
        setIsLoading(true)
        
        // Verificar sessão atual usando o serviço de autenticação
        const { user: currentUser, error } = await authService.getCurrentSession()
        
        if (currentUser) {
          // Armazenar dados do usuário em cookie (não mais em localStorage)
          setCookie("user", JSON.stringify(currentUser), { maxAge: 2592000 }); // 30 dias
          
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Usamos um intervalo para verificar periodicamente o cookie em vez de depender do evento do Supabase
    const intervalId = setInterval(async () => {
      const userCookie = getCookie("user");
      
      if (userCookie) {
        try {
          const userData = JSON.parse(userCookie);
          // Só atualizar o estado se for diferente do atual
          if (JSON.stringify(userData) !== JSON.stringify(user)) {
            setUser(userData);
          }
        } catch (e) {
          console.error("Erro ao analisar cookie do usuário:", e);
        }
      } else if (user) {
        // Se não há cookie mas há usuário no estado, limpar o estado
        setUser(null);
      }
    }, 5000); // Verificar a cada 5 segundos

    checkAuth()

    // Limpar intervalo ao desmontar
    return () => {
      clearInterval(intervalId)
    }
  }, [mounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const { user: userData, error } = await authService.signIn(email, password)
      
      if (error) {
        console.error("Erro ao fazer login:", error)
        toast({
          title: "Erro ao fazer login",
          description: error,
          type: "error",
        })
        return false
      }
      
      if (userData) {
        // Armazenar dados do usuário em cookie
        setCookie("user", JSON.stringify(userData), { maxAge: 2592000 }) // 30 dias
        
        setUser(userData)
        
        toast({
          title: "Login realizado com sucesso",
          type: "success",
        })
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

  const logout = async (): Promise<void> => {
    try {
      const { error } = await authService.signOut()
      
      if (error) {
        throw new Error(error)
      }
      
      // Remover cookie do usuário
      removeCookie("user")
      setUser(null)
      
      toast({
        title: "Logout realizado com sucesso",
        type: "success",
      })
      
      // Forçar redirecionamento após logout
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
      toast({
        title: "Erro ao fazer logout",
        description: "Ocorreu um erro ao tentar sair",
        type: "error",
      })
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const { success, error } = await authService.signUp(name, email, password)
      
      if (error) {
        console.error("Erro ao registrar:", error)
        toast({
          title: "Erro no cadastro",
          description: error,
          type: "error",
        })
        return false
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro",
        type: "success",
      })
      
      return success
    } catch (error) {
      console.error("Erro ao registrar:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const { success, error } = await authService.resetPassword(email, `${window.location.origin}/redefinir-senha`)
      
      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error)
        toast({
          title: "Erro ao solicitar redefinição de senha",
          description: error,
          type: "error",
        })
        return false
      }
      
      toast({
        title: "Email enviado com sucesso",
        description: "Verifique seu email para redefinir sua senha",
        type: "success",
      })
      
      return success
    } catch (error) {
      console.error("Erro ao solicitar redefinição de senha:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        setIsLoading,
        login, 
        logout, 
        register, 
        resetPassword 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
