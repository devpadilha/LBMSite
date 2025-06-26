"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { setCookie, removeCookie, getCookie } from "@/lib/cookie-utils"
import { authService, type User } from "@/lib/auth-service"
import { EmployeeRole } from "@/types/database.types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string) => Promise<boolean>
  resetPassword: (email: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Verificação inicial da sessão
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { user: currentUser } = await authService.getCurrentSession()
        
        if (currentUser) {
          setUser(currentUser)
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { user: userData, error } = await authService.signIn(email, password);
  
      if (error) {
        toast({ title: "Erro ao fazer login", type: "error" });
        return false;
      }
  
      if (userData) {
        // 1. Atualiza o cookie
        setCookie("user", JSON.stringify(userData), { maxAge: 2592000 });
        
        // 2. Atualiza o estado local ANTES do redirecionamento
        setUser(userData);
        
        // 3. Força uma atualização do router
        window.location.href = "/dashboard"; // ⚠️ Use window.location em vez de router.push
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const { error } = await authService.signOut()
      
      if (error) throw new Error(error)
      
      removeCookie("user")
      setUser(null)
      toast({
        title: "Logout realizado com sucesso",
        type: "success",
      })
      
      // Forçar reload para limpar qualquer estado residual
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