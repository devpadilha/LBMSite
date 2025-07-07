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
import { supabase } from "@/lib/supabase"

export default function FinalizarCadastroPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isReady, setIsReady] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: ""
  })

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1)); // Remove o '#'
      const accessToken = params.get('access_token');
      const error = params.get('error');

      if (error) {
        console.error('Erro no token de convite:', params.get('error_description'));
        toast({
          title: "Acesso Inválido",
          description: "Esta página só pode ser acessada através de um link de convite.",
          type: "error",
        });
        router.push("/login");
        return;
      }

      if (accessToken) {
        console.log('Access Token capturado:', accessToken);
      }
    }
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setPasswordData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('1. Função handleSubmit foi chamada.');
    console.log('2. Senha a ser enviada:', passwordData);
    //if (isLoading || !isReady) return;
    console.log('passo o if isloading/ready')

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({ title: "As senhas não coincidem", type: "error" })
      console.log('as senhas n tao igual')
      return
    }

    setIsLoading(true)
    console.log('isloading ta true agr')
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: passwordData.password,
      });
      console.log('entro no try do supabase')
  
      if (error) {
        console.error('3. Erro do Supabase ao atualizar usuário:', error.message);
        toast({ title: "Erro ao finalizar cadastro", description: error.message, type: "error" })
        throw new Error('Erro do Supabase ao atualizar usuário.');
      }
  
      console.log('4. Usuário atualizado com sucesso!', data);
      toast({
        title: "Senha criada com sucesso!",
        description: "Você já pode fazer login com suas novas credenciais.",
      })
      router.push('/login');
  
    } catch (error: any) {
      console.error('5. Ocorreu um erro inesperado no bloco try/catch:', error);
      toast({ title: "Erro ao finalizar cadastro", description: error.message, type: "error" })
      setIsLoading(false)
    }
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
                  <Input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required className="pl-10" value={passwordData.password} onChange={handlePasswordChange} />
                  <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1 h-8 w-8" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                    <span className="sr-only">{showPassword ? "Esconder senha" : "Mostrar senha"}</span>
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirme sua senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" required className="pl-10" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Finalizando...</> : "Criar conta e ir para o login"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}