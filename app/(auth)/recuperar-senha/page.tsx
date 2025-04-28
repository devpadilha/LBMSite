"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Mail } from "lucide-react"

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description: "Ocorreu um erro ao tentar enviar o email de recuperação",
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
          <CardTitle className="text-2xl font-bold">Recuperar senha</CardTitle>
          <CardDescription>
            {isSubmitted
              ? "Enviamos um email com instruções para redefinir sua senha"
              : "Digite seu email para receber instruções de recuperação de senha"}
          </CardDescription>
        </CardHeader>
        {!isSubmitted ? (
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
            <CardFooter className="flex flex-col space-y-2">
              <Button type="submit" className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar instruções"}
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar para o login
                </Link>
              </Button>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 p-4 rounded-md">
              <p>
                Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha. Verifique sua
                caixa de entrada e siga as instruções no email.
              </p>
            </div>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o login
              </Link>
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
