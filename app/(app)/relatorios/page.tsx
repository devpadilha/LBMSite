"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Building, Calendar, Download, FileText, Filter, Printer, Search, Share2 } from "lucide-react"
import { RelatorioPreview } from "@/components/relatorios/relatorio-preview"
import { RelatorioForm } from "@/components/relatorios/relatorio-form"
import { Report, ReportTemplate, ReportType } from "@/models/report.model"
import { useState } from "react"

export default function RelatoriosPage() {
  // Sample data using the Report model
  const [savedReports, setSavedReports] = useState<Report[]>([
    {
      id: 1,
      title: "Relatório de Licitações",
      description: "Relatório detalhado de licitações por município no período de Jan-Mar 2024",
      type: "bid",
      createdAt: "2024-04-15T10:30:00Z",
      createdBy: "admin@lbm.com.br",
      filters: {
        startDate: "2024-01-01",
        endDate: "2024-03-31"
      },
      stats: {
        totalItems: 42,
        totalValue: 1250000
      }
    },
    {
      id: 2,
      title: "Relatório de Municípios",
      description: "Visão geral dos municípios atendidos no primeiro trimestre",
      type: "municipality",
      createdAt: "2024-04-10T14:45:00Z",
      createdBy: "admin@lbm.com.br",
      filters: {
        startDate: "2024-01-01",
        endDate: "2024-03-31"
      },
      stats: {
        totalItems: 8
      }
    },
    {
      id: 3,
      title: "Relatório de Desempenho",
      description: "Análise de desempenho dos projetos em andamento",
      type: "performance",
      createdAt: "2024-04-05T09:15:00Z",
      createdBy: "admin@lbm.com.br",
      displayOptions: {
        showCharts: true,
        chartType: "bar"
      }
    },
    {
      id: 4,
      title: "Relatório de Licitações",
      description: "Análise de licitações por valor e município",
      type: "bid",
      createdAt: "2024-03-28T16:20:00Z",
      createdBy: "admin@lbm.com.br",
      stats: {
        totalItems: 36,
        totalValue: 980000,
        averageValue: 27222
      }
    },
    {
      id: 5,
      title: "Relatório de Municípios",
      description: "Detalhamento de projetos por município",
      type: "municipality",
      createdAt: "2024-03-22T11:10:00Z",
      createdBy: "admin@lbm.com.br"
    },
    {
      id: 6,
      title: "Relatório de Desempenho",
      description: "Indicadores de desempenho trimestral",
      type: "performance",
      createdAt: "2024-03-15T13:40:00Z",
      createdBy: "admin@lbm.com.br",
      displayOptions: {
        showCharts: true,
        showTables: true,
        chartType: "line"
      }
    }
  ]);

  // Sample data for report templates
  const reportTemplates: ReportTemplate[] = [
    {
      id: 1,
      name: "Relatório de Municípios",
      description: "Visão geral de todos os municípios",
      type: "municipality",
      icon: "building",
      defaultFilters: {
        startDate: new Date().toISOString().split('T')[0]
      }
    },
    {
      id: 2,
      name: "Relatório de Licitações",
      description: "Análise de processos licitatórios",
      type: "bid",
      icon: "fileText",
      defaultFilters: {
        startDate: new Date().toISOString().split('T')[0]
      }
    },
    {
      id: 3,
      name: "Relatório de Desempenho",
      description: "Métricas e indicadores de desempenho",
      type: "performance",
      icon: "barChart",
      defaultFilters: {
        startDate: new Date().toISOString().split('T')[0]
      }
    }
  ];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Helper function to get icon based on report type
  const getReportIcon = (type: ReportType) => {
    switch (type) {
      case 'municipality':
        return <Building className="h-4 w-4 text-primary" />;
      case 'bid':
        return <FileText className="h-4 w-4 text-primary" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4 text-primary" />;
      default:
        return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  // Helper function to get large icon for templates
  const getTemplateIcon = (type: ReportType) => {
    switch (type) {
      case 'municipality':
        return <Building className="h-16 w-16 text-primary" />;
      case 'bid':
        return <FileText className="h-16 w-16 text-primary" />;
      case 'performance':
        return <BarChart3 className="h-16 w-16 text-primary" />;
      default:
        return <FileText className="h-16 w-16 text-primary" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Gere e visualize relatórios personalizados</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Abril 2024
          </Button>
          <Button size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Novo Relatório
          </Button>
        </div>
      </div>

      <Tabs defaultValue="gerar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gerar">Gerar Relatório</TabsTrigger>
          <TabsTrigger value="salvos">Relatórios Salvos</TabsTrigger>
          <TabsTrigger value="modelos">Modelos</TabsTrigger>
        </TabsList>
        <TabsContent value="gerar" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Relatório</CardTitle>
                <CardDescription>Defina os parâmetros para gerar seu relatório</CardDescription>
              </CardHeader>
              <CardContent>
                <RelatorioForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Pré-visualização</CardTitle>
                  <CardDescription>Visualize como ficará seu relatório</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-1" /> Imprimir
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <RelatorioPreview />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="salvos" className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar relatórios..." className="pl-8" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-1" /> Filtrar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedReports.map((report) => (
              <Card key={report.id} className="card-hover-effect">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{report.title}</CardTitle>
                    {getReportIcon(report.type)}
                  </div>
                  <CardDescription>Gerado em {formatDate(report.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    {report.description}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" /> Compartilhar
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4 mr-1" /> Baixar
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="modelos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="card-hover-effect">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center p-6">
                    {getTemplateIcon(template.type)}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Usar este modelo</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
