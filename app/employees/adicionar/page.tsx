"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Upload } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "@/components/ui/use-toast"
import { Employee } from "@/models/employee.model"

export default function AdicionarFuncionarioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<Partial<Employee>>({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "Usuário",
    status: "Ativo",
    permissions: {
      dashboard: true,
      municipalities: false,
      reports: false,
      employees: false,
      settings: false,
    }
  })

  // Additional form data not in the Employee model
  const [additionalData, setAdditionalData] = useState({
    cpf: "",
    birthDate: "",
    gender: "",
    address: "",
    rg: "",
    ctps: "",
    admissionDate: "",
    salary: "",
    workHours: "",
    contractType: "",
    observations: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    
    // Check if the field is part of the Employee model
    if (id in formData) {
      setFormData((prev) => ({ ...prev, [id]: value }))
    } else {
      setAdditionalData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    if (id in formData) {
      setFormData((prev) => ({ ...prev, [id]: value }))
    } else {
      setAdditionalData((prev) => ({ ...prev, [id]: value }))
    }
  }

  const handlePermissionChange = (permission: keyof Employee["permissions"], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Combine data for API submission
    const employeeData = {
      ...formData,
      // Map additional data as needed
      // This would depend on your API structure
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Funcionário adicionado",
        description: `O funcionário ${formData.name} foi adicionado com sucesso.`,
      })

      // Redirect to employees list
      router.push("/employees")
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/employees">Funcionários</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/employees/adicionar">Adicionar Funcionário</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Funcionário</h1>
          <p className="text-muted-foreground">Cadastre um novo funcionário no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/employees">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button 
            className="bg-[#EC610D] hover:bg-[#EC610D]/90" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" /> 
            {isSubmitting ? "Salvando..." : "Salvar Funcionário"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Dados pessoais do funcionário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input 
                    id="name" 
                    placeholder="Ex: João da Silva" 
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input 
                    id="cpf" 
                    placeholder="Ex: 123.456.789-00" 
                    value={additionalData.cpf}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input 
                    id="birthDate" 
                    type="date" 
                    value={additionalData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gênero</Label>
                  <Select onValueChange={(value) => handleSelectChange("gender", value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="nao-informar">Prefiro não informar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Ex: (67) 99999-8888" 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Ex: joao.silva@lbm.com.br" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Textarea 
                  id="address" 
                  placeholder="Endereço completo" 
                  rows={2} 
                  value={additionalData.address}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Foto e Documentos</CardTitle>
              <CardDescription>Foto e documentação do funcionário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label>Foto do Funcionário</Label>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-[#EC610D]/50">
                    <Upload className="h-8 w-8 text-[#EC610D]/50" />
                  </div>
                  <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10" type="button">
                    <Upload className="mr-2 h-4 w-4" /> Selecionar Foto
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input 
                  id="rg" 
                  placeholder="Ex: 1234567 SSP/MS" 
                  value={additionalData.rg}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ctps">CTPS</Label>
                <Input 
                  id="ctps" 
                  placeholder="Ex: 12345/001" 
                  value={additionalData.ctps}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="border-b">
              <CardTitle>Informações Profissionais</CardTitle>
              <CardDescription>Dados profissionais do funcionário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento</Label>
                  <Select onValueChange={(value) => handleSelectChange("department", value)}>
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Selecione o departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engenharia">Engenharia</SelectItem>
                      <SelectItem value="administracao">Administração</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                      <SelectItem value="ti">TI</SelectItem>
                      <SelectItem value="rh">Recursos Humanos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Cargo</Label>
                  <Input 
                    id="position" 
                    placeholder="Ex: Engenheiro Civil" 
                    value={formData.position}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admissionDate">Data de Admissão</Label>
                  <Input 
                    id="admissionDate" 
                    type="date" 
                    value={additionalData.admissionDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salary">Salário</Label>
                  <Input 
                    id="salary" 
                    type="number" 
                    placeholder="Ex: 5000" 
                    value={additionalData.salary}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workHours">Carga Horária Semanal</Label>
                  <Input 
                    id="workHours" 
                    type="number" 
                    placeholder="Ex: 40" 
                    value={additionalData.workHours}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contractType">Tipo de Contrato</Label>
                  <Select onValueChange={(value) => handleSelectChange("contractType", value)}>
                    <SelectTrigger id="contractType">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clt">CLT</SelectItem>
                      <SelectItem value="pj">PJ</SelectItem>
                      <SelectItem value="estagio">Estágio</SelectItem>
                      <SelectItem value="temporario">Temporário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Função no Sistema</Label>
                <Select 
                  defaultValue={formData.role} 
                  onValueChange={(value) => handleSelectChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Administrador</SelectItem>
                    <SelectItem value="Gerente">Gerente</SelectItem>
                    <SelectItem value="Usuário">Usuário</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Permissões do Sistema</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="perm-dashboard" 
                      className="rounded border-gray-300 text-[#EC610D] focus:ring-[#EC610D]"
                      checked={formData.permissions?.dashboard}
                      onChange={(e) => handlePermissionChange("dashboard", e.target.checked)}
                    />
                    <Label htmlFor="perm-dashboard">Dashboard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="perm-municipalities" 
                      className="rounded border-gray-300 text-[#EC610D] focus:ring-[#EC610D]"
                      checked={formData.permissions?.municipalities}
                      onChange={(e) => handlePermissionChange("municipalities", e.target.checked)}
                    />
                    <Label htmlFor="perm-municipalities">Municípios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="perm-reports" 
                      className="rounded border-gray-300 text-[#EC610D] focus:ring-[#EC610D]"
                      checked={formData.permissions?.reports}
                      onChange={(e) => handlePermissionChange("reports", e.target.checked)}
                    />
                    <Label htmlFor="perm-reports">Relatórios</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="perm-employees" 
                      className="rounded border-gray-300 text-[#EC610D] focus:ring-[#EC610D]"
                      checked={formData.permissions?.employees}
                      onChange={(e) => handlePermissionChange("employees", e.target.checked)}
                    />
                    <Label htmlFor="perm-employees">Funcionários</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="perm-settings" 
                      className="rounded border-gray-300 text-[#EC610D] focus:ring-[#EC610D]"
                      checked={formData.permissions?.settings}
                      onChange={(e) => handlePermissionChange("settings", e.target.checked)}
                    />
                    <Label htmlFor="perm-settings">Configurações</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="observations">Observações</Label>
                <Textarea 
                  id="observations" 
                  placeholder="Informações adicionais sobre o funcionário" 
                  rows={3} 
                  value={additionalData.observations}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button 
                type="submit" 
                className="bg-[#EC610D] hover:bg-[#EC610D]/90"
                disabled={isSubmitting}
              >
                <Save className="mr-2 h-4 w-4" /> 
                {isSubmitting ? "Salvando..." : "Salvar Funcionário"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
