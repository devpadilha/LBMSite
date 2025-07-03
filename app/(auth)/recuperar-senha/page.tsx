"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Mail, ArrowLeft, Loader2 } from "lucide-react"

// DEPOIS: Importamos diretamente a nossa Server Action.
import { sendPasswordResetEmail } from "@/lib/auth-service"

// REMOVIDO: Não precisamos mais do useAuth context nem do modelo antigo de User.
// import { useAuth } from "@/contexts/auth-context"
// import { User } from "@/models/user.model"

export default function RecuperarSenhaPage() {
  const [isLoading, setIsLoading] = useState(false)
  // DEPOIS: Simplificamos o estado para ser apenas uma string.
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)

    // DEPOIS: A lógica agora chama diretamente a Server Action.
    // Não há mais um 'try/catch' complexo, pois a action já lida com os erros.
    await sendPasswordResetEmail(email)

    setIsLoading(false)
    
    // MELHORIA DE SEGURANÇA: Sempre mostramos uma mensagem de sucesso genérica.
    // Isso evita que pessoas mal-intencionadas usem este formulário para descobrir
    // quais emails estão cadastrados no seu sistema (enumeração de usuários).
    toast({
      title: "Verifique seu email",
      description: "Se uma conta com este email existir, um link para redefinição de senha foi enviado.",
    })
    
    // Limpamos o campo após o envio.
    setEmail("")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
            <CardDescription>
              Digite seu email para receber um link de redefinição de senha.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="seu.email@exemplo.com"
                    type="email"
                    autoComplete="email"
                    required
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" 
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar link de redefinição"
                )}
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                asChild
              >
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
