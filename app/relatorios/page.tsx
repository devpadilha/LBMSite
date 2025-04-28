import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BarChart3, Building, Calendar, Download, FileText, Filter, Printer, Search, Share2 } from "lucide-react"
import { RelatorioPreview } from "@/components/relatorios/relatorio-preview"
import { RelatorioForm } from "@/components/relatorios/relatorio-form"

export default function RelatoriosPage() {
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
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="card-hover-effect">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>Relatório de Licitações</CardTitle>
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <CardDescription>Gerado em 15/04/2024</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground">
                    Relatório detalhado de licitações por município no período de Jan-Mar 2024
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
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle>Relatório de Municípios</CardTitle>
                <CardDescription>Visão geral de todos os municípios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <Building className="h-16 w-16 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Usar este modelo</Button>
              </CardFooter>
            </Card>
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle>Relatório de Licitações</CardTitle>
                <CardDescription>Análise de processos licitatórios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <FileText className="h-16 w-16 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Usar este modelo</Button>
              </CardFooter>
            </Card>
            <Card className="card-hover-effect">
              <CardHeader>
                <CardTitle>Relatório de Desempenho</CardTitle>
                <CardDescription>Métricas e indicadores de desempenho</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-6">
                  <BarChart3 className="h-16 w-16 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Usar este modelo</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
