// app/finalizar-cadastro/page.tsx

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
import { createClient } from "@/utils/supabase/client"

export default function FinalizarCadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isValidToken, setIsValidToken] = useState(false)
  const [isCheckingToken, setIsCheckingToken] = useState(true)
  const [isFormReady, setIsFormReady] = useState(false)
  const [hasUserInteracted, setHasUserInteracted] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        // Verifica se há access_token no hash da URL
        const hash = window.location.hash
        const hasAccessToken = hash.includes("access_token")
        
        if (!hasAccessToken) {
          toast({
            title: "Acesso Inválido",
            description: "Esta página só pode ser acessada através de um link de convite válido.",
            type: "error",
          });
          router.push("/login");
          return;
        }

        // Se há access_token, valida se é um token válido
        const supabase = createClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          toast({
            title: "Token Inválido",
            description: "O link de convite é inválido ou expirou. Solicite um novo convite.",
            type: "error",
          });
          router.push("/login");
          return;
        }

        // Verifica se o usuário já tem uma senha definida
        if (session.user && session.user.app_metadata?.provider === 'email') {
          // Se o usuário já tem uma sessão válida, verifica se já tem senha
          const { data: { user }, error: userError } = await supabase.auth.getUser()
          
          if (userError) {
            console.error("Erro ao verificar usuário:", userError)
            toast({
              title: "Erro de Verificação",
              description: "Ocorreu um erro ao verificar o usuário.",
              type: "error",
            });
            router.push("/login");
            return;
          }

          // Se o usuário já tem uma senha definida, redireciona para login
          if (user && user.app_metadata?.provider === 'email') {
            toast({
              title: "Cadastro já finalizado",
              description: "Você já possui uma conta ativa. Faça login com suas credenciais.",
            });
            router.push("/login");
            return;
          }
        }

        // Aguarda um pequeno delay para garantir que não há comportamento automático
        await new Promise(resolve => setTimeout(resolve, 100))

        setIsValidToken(true)
        setIsFormReady(true)
      } catch (error) {
        console.error("Erro ao verificar token:", error)
        toast({
          title: "Erro de Verificação",
          description: "Ocorreu um erro ao verificar o link de convite.",
          type: "error",
        });
        router.push("/login");
      } finally {
        setIsCheckingToken(false)
      }
    }

    checkAccessToken()
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({ ...prev, [id]: value }))
    setHasUserInteracted(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Verificações de segurança adicionais
    if (!isValidToken || !isFormReady) {
      toast({
        title: "Formulário não está pronto",
        description: "Aguarde a verificação do link de convite.",
        type: "error",
      });
      return;
    }

    // Verifica se o usuário interagiu com o formulário
    if (!hasUserInteracted) {
      toast({
        title: "Interação necessária",
        description: "Por favor, preencha os campos antes de submeter o formulário.",
        type: "error",
      });
      return;
    }

    // Verifica se os campos estão preenchidos
    if (!passwordData.password || !passwordData.confirmPassword) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        type: "error",
      });
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({ title: "As senhas não coincidem", type: "error" })
      return
    }

    if (passwordData.password.length < 6) {
      toast({ title: "Senha muito curta", description: "A senha deve ter pelo menos 6 caracteres.", type: "error" })
      return
    }

    // Verifica se já está carregando para evitar submissões múltiplas
    if (isLoading) {
      return;
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordData.password }),
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

  // Mostra loading enquanto verifica o token
  if (isCheckingToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-6">
            <Link href="/" className="flex items-center gap-2">
              <Image src={require('@/public/logo-lbm.png')} alt="LBM Engenharia" width={184} height={184} />
            </Link>
          </div>
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Verificando link de convite...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Se o token não for válido, não mostra o formulário
  if (!isValidToken) {
    return null
  }

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
                    minLength={6}
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1 h-8 w-8" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
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
                    minLength={6}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" 
                disabled={isLoading || !isValidToken || !isFormReady || !hasUserInteracted}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Finalizando...
                  </>
                ) : (
                  "Criar conta e ir para o login"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}