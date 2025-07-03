"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail, UserPlus, Send, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import { ProfileRole } from "@/lib/types"
import { inviteUser } from "@/app/actions"

export default function AdicionarFuncionarioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "user" as ProfileRole,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Chamamos nossa Server Action
    const { error } = await inviteUser(formData.email, formData.name, formData.role)

    setIsSubmitting(false)

    if (error) {
      toast({
        type: "error",
        title: "Erro ao enviar convite",
        description: error,
      })
    } else {
      toast({
        title: "Convite enviado com sucesso!",
        description: `Um email de convite foi enviado para ${formData.email}.`,
      })
      router.push("/funcionarios") 
    }
  }

  // O JSX do componente permanece o mesmo
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Funcionário</h1>
          <p className="text-muted-foreground">Envie um convite por email para adicionar um novo membro à equipe</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
          <Link href="/funcionarios">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
          </Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="max-w-2xl w-full">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-[#EC610D]" />
                <CardTitle>Convite por Email</CardTitle>
              </div>
              <CardDescription>
                O funcionário receberá um link para criar sua conta e configurar sua senha.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Funcionário</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email do Funcionário</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="funcionario@empresa.com"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Função no Sistema</Label>
                  <Select 
                    value={formData.role}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as ProfileRole }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" asChild>
                    <Link href="/funcionarios">Cancelar</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#EC610D] hover:bg-[#EC610D]/90"
                    disabled={isSubmitting || !formData.email || !formData.name}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Convite
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
