import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FileText, Home, MapPin, Plus } from "lucide-react"
import { LicitacoesTable } from "./components/licitacoes-table"
import { ContratosTable } from "./components/contratos-table"
import { OrdensServicoTable } from "./components/ordens-servico-table"
import { MunicipioMap } from "./components/municipio-map"

export default function MunicipioPage({ params }: { params: { id: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipiosData = [
    {
      id: 1,
      nome: "Campo Grande",
      estado: "MS",
      latitude: -20.4697,
      longitude: -54.6201,
      resumo: {
        totalLicitacoes: 24,
        contratosAtivos: 18,
        osEmExecucao: 12,
      },
    },
    {
      id: 2,
      nome: "Sidrolândia",
      estado: "MS",
      latitude: -20.9302,
      longitude: -54.9692,
      resumo: {
        totalLicitacoes: 14,
        contratosAtivos: 10,
        osEmExecucao: 8,
      },
    },
    {
      id: 3,
      nome: "Terenos",
      estado: "MS",
      latitude: -20.4378,
      longitude: -54.8647,
      resumo: {
        totalLicitacoes: 8,
        contratosAtivos: 6,
        osEmExecucao: 4,
      },
    },
    {
      id: 4,
      nome: "Jaraguari",
      estado: "MS",
      latitude: -20.1386,
      longitude: -54.3996,
      resumo: {
        totalLicitacoes: 6,
        contratosAtivos: 5,
        osEmExecucao: 3,
      },
    },
    {
      id: 5,
      nome: "Nova Alvorada do Sul",
      estado: "MS",
      latitude: -21.4657,
      longitude: -54.3825,
      resumo: {
        totalLicitacoes: 10,
        contratosAtivos: 7,
        osEmExecucao: 5,
      },
    },
    {
      id: 6,
      nome: "Ribas do Rio Pardo",
      estado: "MS",
      latitude: -20.4444,
      longitude: -53.7592,
      resumo: {
        totalLicitacoes: 12,
        contratosAtivos: 9,
        osEmExecucao: 6,
      },
    },
    {
      id: 7,
      nome: "Rio Brilhante",
      estado: "MS",
      latitude: -21.8019,
      longitude: -54.5452,
      resumo: {
        totalLicitacoes: 9,
        contratosAtivos: 7,
        osEmExecucao: 4,
      },
    },
    {
      id: 8,
      nome: "Rochedo",
      estado: "MS",
      latitude: -19.9564,
      longitude: -54.8939,
      resumo: {
        totalLicitacoes: 5,
        contratosAtivos: 4,
        osEmExecucao: 2,
      },
    },
  ]

  const municipioId = Number.parseInt(params.id)
  const municipio = municipiosData.find((m) => m.id === municipioId) || municipiosData[0]

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/municipios/${municipio.id}`}>{municipio.nome}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#EC610D]" />
            {municipio.nome} - {municipio.estado}
          </h1>
          <p className="text-muted-foreground">Gestão de processos e serviços municipais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
            Exportar Dados
          </Button>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <FileText className="mr-2 h-4 w-4" /> Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 border-b">
            <CardTitle>Mapa de Localização</CardTitle>
            <CardDescription>Visualização geográfica do município</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] pt-6">
            <MunicipioMap latitude={municipio.latitude} longitude={municipio.longitude} nome={municipio.nome} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b">
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Visão geral dos processos</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Total de Licitações</p>
                  <p className="text-sm text-muted-foreground">Processos licitatórios</p>
                </div>
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.resumo.totalLicitacoes}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Contratos Ativos</p>
                  <p className="text-sm text-muted-foreground">Em vigência</p>
                </div>
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.resumo.contratosAtivos}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">OS em Execução</p>
                  <p className="text-sm text-muted-foreground">Ordens de serviço ativas</p>
                </div>
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.resumo.osEmExecucao}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="licitacoes" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/60 border">
          <TabsTrigger value="licitacoes" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Licitações
          </TabsTrigger>
          <TabsTrigger value="contratos" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Contratos
          </TabsTrigger>
          <TabsTrigger
            value="ordens-servico"
            className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white"
          >
            Ordens de Serviço
          </TabsTrigger>
        </TabsList>
        <TabsContent value="licitacoes" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Licitações</h2>
            <Button size="sm" className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Plus className="mr-2 h-4 w-4" /> Nova Licitação
            </Button>
          </div>
          <LicitacoesTable municipioId={municipio.id} />
        </TabsContent>
        <TabsContent value="contratos" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Contratos</h2>
            <Button size="sm" className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Plus className="mr-2 h-4 w-4" /> Novo Contrato
            </Button>
          </div>
          <ContratosTable municipioId={municipio.id} />
        </TabsContent>
        <TabsContent value="ordens-servico" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ordens de Serviço</h2>
            <Button size="sm" className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Plus className="mr-2 h-4 w-4" /> Nova OS
            </Button>
          </div>
          <OrdensServicoTable municipioId={municipio.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
