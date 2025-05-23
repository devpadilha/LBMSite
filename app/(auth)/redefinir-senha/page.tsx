"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { hashPassword } from "@/lib/crypto"
import { Employee } from "@/models/employee.model" // Import the Employee model

export default function RedefinirSenhaPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // State for password fields (not part of the Employee model)
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  })
  
  // State for employee data (using the Employee model)
  const [employeeData, setEmployeeData] = useState<Partial<Employee>>({
    email: ""
  })

  useEffect(() => {
    // Verificar se há um hash na URL (necessário para redefinição de senha)
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    if (!hashParams.get("access_token")) {
      toast({
        title: "Link inválido",
        description: "O link de redefinição de senha é inválido ou expirou",
        type: "error",
      })
      router.push("/login")
    }
    
    // Get the email from localStorage
    const email = window.localStorage.getItem("reset_password_email") || ""
    setEmployeeData({ email })
  }, [router])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [id === "password" ? "password" : "confirmPassword"]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação básica
      if (passwordData.password !== passwordData.confirmPassword) {
        toast({
          title: "Erro na redefinição",
          description: "As senhas não coincidem",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      // Gerar hash da nova senha
      const password_hash = await hashPassword(passwordData.password)

      const {
        error,
      } = await supabase
        .from("employees")
        .update({ password_hash })
        .eq("email", employeeData.email)
        .single()

      if (error) {
        throw error
      }

      toast({
        title: "Senha redefinida com sucesso",
        description: "Sua senha foi atualizada. Você já pode fazer login com a nova senha.",
        type: "success",
      })

      // Redirecionar para a página de login
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Erro na redefinição",
        description: error.message || "Ocorreu um erro ao tentar redefinir sua senha",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#EC610D] rounded-md flex items-center justify-center">
            <span className="text-white font-bold">LBM</span>
          </div>
          <span className="font-bold text-xl">LBM Engenharia</span>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
          <CardDescription>
            Digite sua nova senha
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10"
                  value={passwordData.password}
                  onChange={handlePasswordChange}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nova senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="pl-10"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" 
              disabled={isLoading}
            >
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}