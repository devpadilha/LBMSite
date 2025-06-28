"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { toast } from "@/components/ui/use-toast"
import { 
  signIn, 
  signUp, 
  signOut, 
  getCurrentUserWithProfile, 
  resetPasswordForEmail, 
  User 
} from "@/lib/auth-service"

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

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true)
      const currentUser = await getCurrentUserWithProfile()
      setUser(currentUser)
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)
    const { user, error } = await signIn(formData)
    setIsLoading(false)
    if (error) {
      toast({ title: "Erro ao fazer login", description: error, type: "error" })
      return false
    }
    setUser(await getCurrentUserWithProfile())
    return true
  }

  const logout = async () => {
    setIsLoading(true)
    await signOut()
    setUser(null)
    setIsLoading(false)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    formData.append("password", password)
    const { success, error } = await signUp(formData)
    setIsLoading(false)
    if (error) {
      toast({ title: "Erro no cadastro", description: error, type: "error" })
      return false
    }
    toast({ title: "Cadastro realizado", description: "Verifique seu email para confirmar.", type: "success" })
    return success
  }

  const resetPassword = async (email: string) => {
    setIsLoading(true)
    const { success, error } = await resetPasswordForEmail(email)
    setIsLoading(false)
    if (error) {
      toast({ title: "Erro ao solicitar redefinição de senha", description: error, type: "error" })
      return false
    }
    toast({ title: "Email enviado", description: "Verifique seu email para redefinir sua senha.", type: "success" })
    return success
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  return context
}