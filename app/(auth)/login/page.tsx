"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, Mail, User as UserIcon } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import Image from "next/image"
import { User } from "@/models/user.model"
import { EmployeeRole, EmployeeStatus } from "@/types/database.types"

export default function LoginPage() {
  const { login, register, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Estados para o formulário de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Estados para o formulário de cadastro usando o modelo User
  const [registerData, setRegisterData] = useState<Partial<User>>({
    name: "",
    email: "",
    role: EmployeeRole.USUARIO, // Default role
    status: EmployeeStatus.ATIVO, // Default status
    permissions: {
      dashboard: true,
      municipalities: false,
      reports: false,
      employees: false,
      settings: false,
    }
  })

  // Estado adicional para campos que não estão no modelo User
  const [additionalRegisterData, setAdditionalRegisterData] = useState({
    password: "",
    confirmPassword: "",
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Check if the field is part of the User model
    if (name === "name" || name === "email") {
      setRegisterData((prev) => ({ ...prev, [name]: value }))
    } else {
      // Handle password fields separately
      setAdditionalRegisterData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(loginData.email, loginData.password)
      
      if (!success) {
        toast({
          title: "Erro ao fazer login",
          description: "Email ou senha incorretos",
          type: "error",
        })
      }
    } catch (error) {
      toast({
        title: "Erro ao fazer login",
        description: "Ocorreu um erro ao tentar fazer login",
        type: "error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validação básica
      if (additionalRegisterData.password !== additionalRegisterData.confirmPassword) {
        toast({
          title: "Erro no cadastro",
          description: "As senhas não coincidem",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      const success = await register(
        registerData.name || "", 
        registerData.email || "", 
        additionalRegisterData.password
      )
      
      if (success) {
        // Limpar o formulário e mudar para a aba de login
        setRegisterData({
          name: "",
          email: "",
          role: EmployeeRole.USUARIO,
          status: EmployeeStatus.ATIVO,
          permissions: {
            dashboard: true,
            municipalities: false,
            reports: false,
            employees: false,
            settings: false,
          }
        })
        setAdditionalRegisterData({
          password: "",
          confirmPassword: "",
        })
        setActiveTab("login")
      }
    } catch (error) {
      toast({
        title: "Erro no cadastro",
        description: "Ocorreu um erro ao tentar criar sua conta",
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
          <Image 
            src={require('@/public/logo-lbm.png')}
            alt="LBM Engenharia" 
            width={184} 
            height={184}
            unoptimized
            priority
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Cadastro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Entrar no Sistema</CardTitle>
              <CardDescription>Digite seu email e senha para acessar o sistema</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      placeholder="seu.email@exemplo.com"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <Link href="/recuperar-senha" className="text-sm text-[#EC610D] hover:underline">
                      Esqueceu a senha?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      className="pl-10"
                      value={loginData.password}
                      onChange={handleLoginChange}
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
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Criar uma conta</CardTitle>
              <CardDescription>Preencha os dados abaixo para se cadastrar</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      required
                      className="pl-10"
                      value={registerData.name}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      name="email"
                      placeholder="seu.email@exemplo.com"
                      type="email"
                      autoComplete="email"
                      required
                      className="pl-10"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="pl-10"
                      value={additionalRegisterData.password}
                      onChange={handleRegisterChange}
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
                  <Label htmlFor="confirm-password">Confirmar senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      className="pl-10"
                      value={additionalRegisterData.confirmPassword}
                      onChange={handleRegisterChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isLoading}>
                  {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Ao continuar, você concorda com os{" "}
          <Link href="#" className="text-[#EC610D] hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="#" className="text-[#EC610D] hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
