"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Download, FileText, Filter } from "lucide-react"

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ReportsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Sample data - in a real app, this would come from a database
  const reports = [
    {
      id: "REL-001",
      title: "Relatório de Projetos Ativos",
      description: "Resumo de todos os projetos atualmente ativos",
      type: "projeto",
      createdBy: "Carlos Oliveira",
      createdAt: "2023-04-01",
      format: "PDF",
    },
    {
      id: "REL-002",
      title: "Relatório de Ordens de Serviço - Março 2023",
      description: "Resumo de todas as ordens de serviço do mês de março",
      type: "ordem",
      createdBy: "Maria Santos",
      createdAt: "2023-04-05",
      format: "XLSX",
    },
    {
      id: "REL-003",
      title: "Relatório de Funcionários por Projeto",
      description: "Distribuição de funcionários entre os projetos ativos",
      type: "funcionario",
      createdBy: "João Silva",
      createdAt: "2023-04-10",
      format: "PDF",
    },
    {
      id: "REL-004",
      title: "Relatório Financeiro - Q1 2023",
      description: "Resumo financeiro do primeiro trimestre de 2023",
      type: "financeiro",
      createdBy: "Ana Pereira",
      createdAt: "2023-04-15",
      format: "XLSX",
    },
    {
      id: "REL-005",
      title: "Relatório de Desempenho de Projetos",
      description: "Análise de desempenho dos projetos em andamento",
      type: "projeto",
      createdBy: "Roberto Almeida",
      createdAt: "2023-04-20",
      format: "PDF",
    },
  ]

  const reportTemplates = [
    {
      id: "TEMP-001",
      title: "Projetos Ativos",
      description: "Lista todos os projetos atualmente ativos com detalhes de progresso",
      type: "projeto",
    },
    {
      id: "TEMP-002",
      title: "Ordens de Serviço por Período",
      description: "Resumo de ordens de serviço em um período específico",
      type: "ordem",
    },
    {
      id: "TEMP-003",
      title: "Funcionários por Projeto",
      description: "Distribuição de funcionários entre os projetos",
      type: "funcionario",
    },
    {
      id: "TEMP-004",
      title: "Relatório Financeiro",
      description: "Resumo financeiro de projetos e ordens de serviço",
      type: "financeiro",
    },
    {
      id: "TEMP-005",
      title: "Memoriais por Projeto",
      description: "Lista todos os memoriais descritivos por projeto",
      type: "memorial",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Filtrar Relatórios</DialogTitle>
                <DialogDescription>Defina os critérios para filtrar a lista de relatórios</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Relatório</Label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Selecione um tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="projeto">Projetos</SelectItem>
                      <SelectItem value="ordem">Ordens de Serviço</SelectItem>
                      <SelectItem value="funcionario">Funcionários</SelectItem>
                      <SelectItem value="financeiro">Financeiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Período</Label>
                  <div className="flex items-center gap-2">
                    <Input type="date" className="w-full" />
                    <span>até</span>
                    <Input type="date" className="w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Formato</Label>
                  <Select>
                    <SelectTrigger id="format">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsFilterOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setIsFilterOpen(false)}>Aplicar Filtros</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Gerar Relatório
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Gerar Novo Relatório</DialogTitle>
                <DialogDescription>
                  Selecione um modelo e defina os parâmetros para gerar um novo relatório
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="template">Modelo de Relatório</Label>
                  <Select>
                    <SelectTrigger id="template">
                      <SelectValue placeholder="Selecione um modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-date-range">Período do Relatório</Label>
                  <div className="flex items-center gap-2">
                    <Input type="date" className="w-full" />
                    <span>até</span>
                    <Input type="date" className="w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-format">Formato de Saída</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger id="report-format">
                      <SelectValue placeholder="Selecione um formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-options">Opções Adicionais</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-charts" />
                      <label htmlFor="include-charts" className="text-sm">
                        Incluir gráficos
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="include-summary" />
                      <label htmlFor="include-summary" className="text-sm">
                        Incluir resumo executivo
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button>Gerar Relatório</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Relatórios Recentes</TabsTrigger>
          <TabsTrigger value="templates">Modelos de Relatório</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Recentes</CardTitle>
              <CardDescription>Relatórios gerados recentemente no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Título</TableHead>
                      <TableHead className="hidden md:table-cell">Tipo</TableHead>
                      <TableHead className="hidden md:table-cell">Criado por</TableHead>
                      <TableHead className="hidden lg:table-cell">Data</TableHead>
                      <TableHead>Formato</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.id}</TableCell>
                        <TableCell>{report.title}</TableCell>
                        <TableCell className="hidden md:table-cell capitalize">{report.type}</TableCell>
                        <TableCell className="hidden md:table-cell">{report.createdBy}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {new Date(report.createdAt).toLocaleDateString("pt-BR")}
                        </TableCell>
                        <TableCell>{report.format}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-1" />
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

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Modelos de Relatório</CardTitle>
              <CardDescription>Modelos disponíveis para geração de relatórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.title}</CardTitle>
                      <CardDescription className="text-xs capitalize">Tipo: {template.type}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm">{template.description}</p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        Usar Modelo
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

