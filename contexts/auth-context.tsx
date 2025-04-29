"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

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
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar perfil:', error)
        return null
      }

      return data as User
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
        
        // Verificar sessão atual
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          
          if (profile) {
            const userData = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role
            };
            
            // Armazenar dados do usuário no localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Armazenar dados do usuário em um cookie para o middleware
            document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000`; // 30 dias
            
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error)
      } finally {
        setIsLoading(false)
      }
    }

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchUserProfile(session.user.id)
          
          if (profile) {
            const userData = {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role
            };
            
            // Armazenar dados do usuário no localStorage
            localStorage.setItem("user", JSON.stringify(userData));
            
            // Armazenar dados do usuário em um cookie para o middleware
            document.cookie = `user=${JSON.stringify(userData)}; path=/; max-age=2592000`; // 30 dias
            
            setUser(userData);
          }
        } else {
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    checkAuth()

    // Limpar subscription ao desmontar
    return () => {
      subscription.unsubscribe()
    }
  }, [mounted])

  // Redirecionar usuário não autenticado para login
  useEffect(() => {
    if (!mounted) return
    
    // Só realizar redirecionamentos quando não estiver carregando
    if (!isLoading) {
      // Redirecionar usuário não autenticado para login
      if (
        !user &&
        pathname !== "/login" &&
        pathname !== "/recuperar-senha" &&
        !pathname.startsWith("/cadastro")
      ) {
        router.push("/login")
      }
      
      // Redirecionar usuário autenticado para dashboard se estiver na página de login
      // Garantir que o usuário está completamente carregado antes de redirecionar
      if (user && user.id && user.name && (pathname === "/login" || pathname === "/")) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, pathname, router, mounted])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error("Erro ao fazer login:", error.message)
        toast({
          title: "Erro ao fazer login",
          description: error.message,
          type: "error",
        })
        return false
      }
      
      if (data.user) {
        const profile = await fetchUserProfile(data.user.id)
        
        if (profile) {
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role
          })
          
          toast({
            title: "Login realizado com sucesso",
            type: "success",
          })
          return true
        }
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
      await supabase.auth.signOut()
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      })
      
      if (error) {
        console.error("Erro ao registrar:", error.message)
        toast({
          title: "Erro no cadastro",
          description: error.message,
          type: "error",
        })
        return false
      }
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Verifique seu email para confirmar o cadastro",
        type: "success",
      })
      
      return true
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
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/redefinir-senha`,
      })
      
      if (error) {
        console.error("Erro ao solicitar redefinição de senha:", error.message)
        toast({
          title: "Erro ao solicitar redefinição de senha",
          description: error.message,
          type: "error",
        })
        return false
      }
      
      toast({
        title: "Email enviado com sucesso",
        description: "Verifique seu email para redefinir sua senha",
        type: "success",
      })
      
      return true
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
