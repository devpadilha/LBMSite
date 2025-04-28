"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("login")

  // Estados para o formulário de login
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  // Estados para o formulário de cadastro
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Verificar se o usuário já está autenticado
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Verificação simples (em produção, isso seria feito no servidor)
      if (loginData.email === "admin@lbm.com.br" && loginData.password === "senha123") {
        // Salvar usuário no localStorage
        const userData = {
          id: "1",
          name: "Administrador",
          email: "admin@lbm.com.br",
          role: "admin",
        }
        localStorage.setItem("user", JSON.stringify(userData))

        toast({
          title: "Login realizado com sucesso",
          type: "success",
        })

        // Redirecionamento forçado para o dashboard
        window.location.href = "/dashboard"
      } else {
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
      if (registerData.password !== registerData.confirmPassword) {
        toast({
          title: "Erro no cadastro",
          description: "As senhas não coincidem",
          type: "error",
        })
        setIsLoading(false)
        return
      }

      // Simulando uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Você já pode fazer login.",
        type: "success",
      })

      // Limpar o formulário e mudar para a aba de login
      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setActiveTab("login")
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
          <div className="w-10 h-10 bg-[#EC610D] rounded-md flex items-center justify-center">
            <span className="text-white font-bold">LBM</span>
          </div>
          <span className="font-bold text-xl">LBM Engenharia</span>
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
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
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
                      value={registerData.password}
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
                      value={registerData.confirmPassword}
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
