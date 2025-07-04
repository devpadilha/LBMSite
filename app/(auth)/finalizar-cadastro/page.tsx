"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/utils/supabase/client"

export default function FinalizarCadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  })

  // useEffect para verificar se o usuário chegou aqui através de um link válido.
  // O Supabase usa o mesmo tipo de token para convite e para recuperação de senha.
  useEffect(() => {
    const checkSession = async () => {
      // Primeiro, verificamos se o token ainda está na URL.
      const hasToken = window.location.hash.includes("access_token");
      
      // Em seguida, pedimos a sessão ao Supabase.
      // Isso dá tempo para a biblioteca processar o token, se ele existir.
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
  
      if (!hasToken && !session) {
        toast({
          title: "Link de convite inválido ou expirado",
          description: "Por favor, contate o administrador para receber um novo convite.",
          type: "error",
        });
        router.push("/login");
      }
    };
  
    checkSession();
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique os campos e tente novamente.",
        type: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // A mágica acontece aqui: ao chamar updateUser com a senha,
      // o Supabase finaliza o processo de convite, ativa o usuário
      // e o autentica na sessão atual.
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Cadastro finalizado com sucesso!",
        description: "Sua conta foi criada e você já está conectado.",
      })

      // Redireciona o usuário para o dashboard principal.
      router.push("/dashboard")

    } catch (error: any) {
      toast({
        title: "Erro ao finalizar cadastro",
        description: error.message || "Ocorreu um erro inesperado.",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo-lbm.png" alt="LBM Engenharia" width={40} height={40} />
            <span className="font-bold text-xl">LBM Engenharia</span>
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
                {isLoading ? "Finalizando..." : "Criar conta e acessar"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
