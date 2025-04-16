"use client"

import { useState } from "react"
import { ArrowLeft, FileUp, User } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"

export default function ServiceOrderDetailPage() {
  // Use the useParams hook to get the id parameter
  const params = useParams()
  const orderId = params?.id as string

  // In a real app, this would be fetched from a database
  const order = {
    id: orderId,
    municipality: "São Paulo",
    description: "Manutenção de equipamentos de informática incluindo substituição de peças defeituosas, atualização de software e configuração de rede para 15 computadores em escritório administrativo.",
    status: "pendente",
    requester: "Secretaria Municipal de Administração",
    contract: "CONT-2023-001",
    priority: "alta",
    deadline: "2023-07-30",
    responsible: "Carlos Oliveira",
    createdAt: "2023-06-15",
    estimatedHours: 48,
    completedHours: 12,
    location: "Av. Paulista, 1000 - São Paulo, SP",
    notes: "Acesso ao local deve ser agendado com 24h de antecedência."
  }

  // Calcular progresso baseado nas horas
  const progress = Math.round((order.completedHours / order.estimatedHours) * 100)

  const technicians = [
    {
      id: "FUNC-001",
      name: "João Silva",
      role: "Técnico de Informática",
      department: "Suporte",
      assignedDate: "2023-06-20",
    },
    {
      id: "FUNC-002",
      name: "Maria Santos",
      role: "Analista de Sistemas",
      department: "TI",
      assignedDate: "2023-06-22",
    },
    {
      id: "FUNC-003",
      name: "Pedro Alves",
      role: "Auxiliar Técnico",
      department: "Suporte",
      assignedDate: "2023-06-25",
    },
  ]

  const activities = [
    {
      id: "ATIV-001",
      title: "Diagnóstico Inicial",
      description: "Avaliação dos equipamentos e identificação de problemas",
      technician: "João Silva",
      date: "2023-06-22",
      hours: 4,
      status: "concluído",
    },
    {
      id: "ATIV-002",
      title: "Substituição de Peças",
      description: "Troca de HDs e memória RAM em 5 computadores",
      technician: "Pedro Alves",
      date: "2023-06-25",
      hours: 8,
      status: "concluído",
    },
    {
      id: "ATIV-003",
      title: "Configuração de Rede",
      description: "Configuração de rede e acesso compartilhado",
      technician: "Maria Santos",
      date: "2023-06-28",
      hours: 0,
      status: "pendente",
    },
  ]

  const [isAddingTechnician, setIsAddingTechnician] = useState(false)
  const [isAddingActivity, setIsAddingActivity] = useState(false)

  return (
    <div className="container mx-auto py-10">
      <Link href="/ordens-de-servico" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de ordens de serviço
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">Ordem de Serviço: {order.id}</h1>
            <Badge 
              className={order.status === "pendente" 
                ? "bg-slate-600 text-slate-50" 
                : "bg-orange-500 text-white"}
            >
              {order.status === "pendente" ? "Pendente" : "Concluído"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Município: {order.municipality} | Solicitante: {order.requester}
          </p>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">{order.status === "pendente" ? "Marcar como Concluído" : "Reabrir Ordem"}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar alteração de status</DialogTitle>
                <DialogDescription>
                  Você está prestes a {order.status === "pendente" ? "concluir" : "reabrir"} esta ordem de serviço. 
                  Esta ação pode afetar relatórios e estatísticas.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button>Editar Ordem</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progresso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{progress}%</div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {order.completedHours} de {order.estimatedHours} horas estimadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(order.deadline).toLocaleDateString("pt-BR")}</div>
            <p className="text-xs text-muted-foreground">
              Criada em: {new Date(order.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Prioridade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{order.priority}</div>
            <p className="text-xs text-muted-foreground">Responsável: {order.responsible}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Descrição</h3>
              <p className="text-sm">{order.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-1">Contrato</h3>
                <p className="text-sm">{order.contract}</p>
              </div>

              <div>
                <h3 className="font-medium mb-1">Localização</h3>
                <p className="text-sm">{order.location}</p>
              </div>
            </div>

            {order.notes && (
              <div>
                <h3 className="font-medium mb-1">Observações</h3>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="technicians" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="technicians">Técnicos</TabsTrigger>
          <TabsTrigger value="activities">Atividades</TabsTrigger>
        </TabsList>

        <TabsContent value="technicians">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Técnicos Designados</CardTitle>
                <CardDescription>Técnicos atualmente trabalhando nesta ordem de serviço</CardDescription>
              </div>
              <Dialog open={isAddingTechnician} onOpenChange={setIsAddingTechnician}>
                <DialogTrigger asChild>
                  <Button>
                    <User className="mr-2 h-4 w-4" />
                    Designar Técnico
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Designar Técnico à Ordem de Serviço</DialogTitle>
                    <DialogDescription>Selecione um técnico e defina sua função na ordem</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="technician">Técnico</Label>
                      <Select>
                        <SelectTrigger id="technician">
                          <SelectValue placeholder="Selecione um técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="func-005">Roberto Almeida</SelectItem>
                          <SelectItem value="func-006">Juliana Mendes</SelectItem>
                          <SelectItem value="func-007">Fernando Costa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Função na Ordem</Label>
                      <Input id="role" placeholder="Ex: Técnico de Suporte" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTechnician(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingTechnician(false)}>Designar</Button>
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
                      <TableHead>Função na Ordem</TableHead>
                      <TableHead className="hidden md:table-cell">Departamento</TableHead>
                      <TableHead className="hidden md:table-cell">Data de Designação</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {technicians.map((technician) => (
                      <TableRow key={technician.id}>
                        <TableCell className="font-medium">{technician.id}</TableCell>
                        <TableCell>{technician.name}</TableCell>
                        <TableCell>{technician.role}</TableCell>
                        <TableCell className="hidden md:table-cell">{technician.department}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(technician.assignedDate).toLocaleDateString("pt-BR")}
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

        <TabsContent value="activities">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Atividades Realizadas</CardTitle>
                <CardDescription>Registro de atividades executadas nesta ordem de serviço</CardDescription>
              </div>
              <Dialog open={isAddingActivity} onOpenChange={setIsAddingActivity}>
                <DialogTrigger asChild>
                  <Button>
                    <FileUp className="mr-2 h-4 w-4" />
                    Registrar Atividade
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Nova Atividade</DialogTitle>
                    <DialogDescription>
                      Adicione detalhes sobre uma atividade realizada nesta ordem
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Título</Label>
                      <Input id="title" placeholder="Ex: Instalação de Software" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva a atividade realizada" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="technician">Técnico Responsável</Label>
                      <Select>
                        <SelectTrigger id="technician">
                          <SelectValue placeholder="Selecione o técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((tech) => (
                            <SelectItem key={tech.id} value={tech.name}>
                              {tech.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hours">Horas Trabalhadas</Label>
                      <Input id="hours" type="number" min="0" placeholder="Ex: 4" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pendente">Pendente</SelectItem>
                          <SelectItem value="concluído">Concluído</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingActivity(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={() => setIsAddingActivity(false)}>Registrar</Button>
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
                      <TableHead>Técnico</TableHead>
                      <TableHead className="hidden md:table-cell">Data</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell className="font-medium">{activity.id}</TableCell>
                        <TableCell>{activity.title}</TableCell>
                        <TableCell className="hidden md:table-cell">{activity.description}</TableCell>
                        <TableCell>{activity.technician}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {new Date(activity.date).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{activity.hours}</TableCell>
                        <TableCell>
                          <Badge 
                            className={activity.status === "pendente" 
                              ? "bg-slate-600 text-slate-50" 
                              : "bg-orange-500 text-white"}
                          >
                            {activity.status === "pendente" ? "Pendente" : "Concluído"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Editar
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