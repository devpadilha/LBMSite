"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, CheckCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function FinalizarCadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const hash = window.location.hash
    const params = new URLSearchParams(hash.substring(1))
    const token = params.get("access_token")

    if (token) {
      setAccessToken(token)
    } else if (!params.has('error')) {
    } else {
      toast({
        title: "Link inválido ou expirado",
        description: "Por favor, peça um novo convite.",
        type: "error",
      })
      router.push("/login")
    }
  }, [router])

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({ title: "As senhas não coincidem", type: "error" })
      return
    }
    if (!accessToken) {
      toast({ title: "Sessão inválida", description: "O token de acesso não foi encontrado.", type: "error" })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: passwordData.password,
          access_token: accessToken,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Falha ao finalizar o cadastro.');
      }
      
      toast({
        title: "Senha criada com sucesso!",
        description: "Você já pode fazer login com suas novas credenciais.",
      })

      router.push("/login")

    } catch (error: any) {
      toast({ title: "Erro ao finalizar cadastro", description: error.message, type: "error" })
    } finally {
      setIsLoading(false)
    }
  }

  // O componente de retorno JSX continua o mesmo do seu original, sem a alteração na logo
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
       <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src={require('@/public/logo-lbm.png')} alt="LBM Engenharia" width={184} height={184} />
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto bg-green-100 rounded-full p-2 w-fit mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Finalize seu Cadastro</CardTitle>
            <CardDescription>
              Você está a um passo de se juntar à equipe. Crie sua senha de acesso.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Crie uma senha</Label>
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
                    className="absolute right-1 top-1 h-8 w-8"
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
                <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
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
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizando...
                  </>
                ) : "Criar conta e ir para o login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}