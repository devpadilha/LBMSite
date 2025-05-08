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

export default function AdicionarFuncionarioPage() {
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
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Save className="mr-2 h-4 w-4" /> Salvar Funcionário
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Dados pessoais do funcionário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="Ex: João da Silva" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="Ex: 123.456.789-00" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data-nascimento">Data de Nascimento</Label>
                <Input id="data-nascimento" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select>
                  <SelectTrigger id="genero">
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
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="Ex: (67) 99999-8888" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Ex: joao.silva@lbm.com.br" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Textarea id="endereco" placeholder="Endereço completo" rows={2} />
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
                <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
                  <Upload className="mr-2 h-4 w-4" /> Selecionar Foto
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" placeholder="Ex: 1234567 SSP/MS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ctps">CTPS</Label>
              <Input id="ctps" placeholder="Ex: 12345/001" />
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
                <Label htmlFor="departamento">Departamento</Label>
                <Select>
                  <SelectTrigger id="departamento">
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
                <Label htmlFor="cargo">Cargo</Label>
                <Input id="cargo" placeholder="Ex: Engenheiro Civil" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-admissao">Data de Admissão</Label>
                <Input id="data-admissao" type="date" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salario">Salário</Label>
                <Input id="salario" type="number" placeholder="Ex: 5000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carga-horaria">Carga Horária Semanal</Label>
                <Input id="carga-horaria" type="number" placeholder="Ex: 40" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo-contrato">Tipo de Contrato</Label>
                <Select>
                  <SelectTrigger id="tipo-contrato">
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
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Informações adicionais sobre o funcionário" rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4">
            <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Save className="mr-2 h-4 w-4" /> Salvar Funcionário
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
