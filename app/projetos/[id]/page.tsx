"use client"

import { useState } from "react"
import { ArrowLeft, FileUp, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export default function ProjectDetailPage() {
  // Use the useParams hook to get the id parameter
  const params = useParams()
  const projectId = params?.id as string

  // In a real app, this would be fetched from a database
  const project = {
    id: projectId,
    name: "Instalação Elétrica - São Paulo",
    description:
      "Instalação completa de rede elétrica em prédio comercial de 20 andares, incluindo cabeamento estruturado, instalação de quadros de distribuição, sistemas de proteção contra descargas atmosféricas e implementação de soluções de eficiência energética.",
    deadline: "2023-06-15",
    status: "ativo",
    progress: 85,
    client: "Construtora ABC",
    startDate: "2023-01-10",
    budget: "R$ 450.000,00",
    location: "Av. Paulista, 1000 - São Paulo, SP",
    manager: "Carlos Oliveira",
  }

  const employees = [
    {
      id: "FUNC-001",
      name: "João Silva",
      role: "Engenheiro Eletricista",
      department: "Engenharia",
      assignedDate: "2023-01-15",
    },
    {
      id: "FUNC-002",
      name: "Maria Santos",
      role: "Técnica em Eletricidade",
      department: "Técnico",
      assignedDate: "2023-01-20",
    },
    {
      id: "FUNC-003",
      name: "Pedro Alves",
      role: "Auxiliar Técnico",
      department: "Técnico",
      assignedDate: "2023-02-05",
    },
    {
      id: "FUNC-004",
      name: "Ana Costa",
      role: "Supervisora",
      department: "Gerência",
      assignedDate: "2023-01-10",
    },
  ]

  const memorials = [
    {
      id: "MEM-001",
      title: "Relatório Inicial de Avaliação",
      description: "Avaliação inicial do local e planejamento das atividades",
      author: "João Silva",
      date: "2023-01-20",
      fileSize: "2.4 MB",
    },
    {
      id: "MEM-002",
      title: "Memorial de Instalação - Fase 1",
      description: "Detalhamento da instalação dos quadros principais",
      author: "Maria Santos",
      date: "2023-02-15",
      fileSize: "5.1 MB",
    },
    {
      id: "MEM-003",
      title: "Relatório de Progresso - Mês 1",
      description: "Acompanhamento das atividades do primeiro mês",
      author: "Carlos Oliveira",
      date: "2023-02-28",
      fileSize: "3.7 MB",
    },
    {
      id: "MEM-004",
      title: "Memorial Técnico - Cabeamento",
      description: "Especificações técnicas do cabeamento utilizado",
      author: "Pedro Alves",
      date: "2023-03-10",
      fileSize: "4.2 MB",
    },
  ]

  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isUploadingMemorial, setIsUploadingMemorial] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <Link href="/projetos" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de projetos
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge variant={project.status === "ativo" ? "default" : "secondary"}>
              {project.status === "ativo" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            ID: {project.id} | Cliente: {project.client}
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">{project.status === "ativo" ? "Desativar Projeto" : "Ativar Projeto"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar alteração de status</DialogTitle>
                <DialogDescription>
                  Você está prestes a {project.status === "ativo" ? "desativar" : "ativar"} este projeto. Esta ação pode
                  afetar as ordens de serviço e funcionários associados.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button>Editar Projeto</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{project.progress}%</div>
            <Progress value={project.progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(project.deadline).toLocaleDateString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              Início: {new Date(project.startDate).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Orçamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{project.budget}</div>
            <p className="text-xs text-muted-foreground">Gerente: {project.manager}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes do Projeto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Descrição</h3>
              <p className="text-sm">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Cliente</h3>
                <p className="text-sm">{project.client}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Localização</h3>
                <p className="text-sm">{project.location}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="employees">Funcionários</TabsTrigger>
          <TabsTrigger value="memorials">Memoriais Descritivos</TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Funcionários Designados</CardTitle>
                <CardDescription>Funcionários atualmente trabalhando neste projeto</CardDescription>
              </div>
              <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
                <DialogTrigger asChild>
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Designar Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Designar Funcionário ao Projeto</DialogTitle>
                    <DialogDescription>Selecione um funcionário e defina sua função no projeto</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="employee">Funcionário</Label>
                      <Select>
                        <SelectTrigger id="employee">
                          <SelectValue placeholder="Selecione um funcionário" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="func-005">Roberto Almeida</SelectItem>
                          <SelectItem value="func-006">Juliana Mendes</SelectItem>
                          <SelectItem value="func-007">Fernando Costa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Função no Projeto</Label>
                      <Input id="role" placeholder="Ex: Técnico Eletricista" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingEmployee(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingEmployee(false)}>Designar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Função no Projeto</TableHead>
                      <TableHead className="hidden md:table-cell">Departamento</TableHead>
                      <TableHead className="hidden md:table-cell">Data de Designação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.id}</TableCell>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(employee.assignedDate).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Remover
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memorials">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Memoriais Descritivos</CardTitle>
                <CardDescription>Documentos detalhando as atividades realizadas pelos funcionários</CardDescription>
              </div>
              <Dialog open={isUploadingMemorial} onOpenChange={setIsUploadingMemorial}>
                <DialogTrigger asChild>
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    Adicionar Memorial
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Memorial Descritivo</DialogTitle>
                    <DialogDescription>
                      Faça upload de um documento descrevendo as atividades realizadas
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" placeholder="Ex: Relatório de Instalação - Fase 2" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Breve descrição do conteúdo do memorial" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="author">Autor</Label>
                      <Select>
                        <SelectTrigger id="author">
                          <SelectValue placeholder="Selecione o autor" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file">Arquivo</Label>
                      <Input id="file" type="file" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsUploadingMemorial(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsUploadingMemorial(false)}>Enviar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Descrição</TableHead>
                      <TableHead>Autor</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memorials.map((memorial) => (
                      <TableRow key={memorial.id}>
                        <TableCell className="font-medium">{memorial.id}</TableCell>
                        <TableCell>{memorial.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                          {memorial.description}
                        </TableCell>
                        <TableCell>{memorial.author}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(memorial.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

