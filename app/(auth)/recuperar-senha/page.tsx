"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Mail, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { User } from "@/models/user.model" // Import the User model

export default function RecuperarSenhaPage() {
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  // Use the User model for the email field
  const [recoveryData, setRecoveryData] = useState<Pick<User, 'email'>>({
    email: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setRecoveryData({ email: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await resetPassword(recoveryData.email)
      
      if (success) {
        setRecoveryData({ email: "" })
      }
    } catch (error) {
      toast({
        title: "Erro ao solicitar redefinição de senha",
        description: "Ocorreu um erro ao tentar enviar o email de redefinição",
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
            Digite seu email para receber um link de redefinição de senha
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
                  value={recoveryData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" 
              disabled={isLoading}
            >
              {isLoading ? "Enviando..." : "Enviar link de redefinição"}
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
  )
}
