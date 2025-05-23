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
import { Municipality } from "@/models/municipality.model"

export default function MunicipioPage({ params }: { params: { id: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipiosData: Municipality[] = [
    {
      id: 1,
      name: "Campo Grande",
      state: "MS",
      latitude: -20.4697,
      longitude: -54.6201,
      totalBids: 24,
      totalContracts: 18,
      totalServiceOrders: 12,
      lastUpdate: "27/04/2024"
    },
    {
      id: 2,
      name: "Sidrolândia",
      state: "MS",
      latitude: -20.9302,
      longitude: -54.9692,
      totalBids: 14,
      totalContracts: 10,
      totalServiceOrders: 8,
      lastUpdate: "26/04/2024"
    },
    {
      id: 3,
      name: "Terenos",
      state: "MS",
      latitude: -20.4378,
      longitude: -54.8647,
      totalBids: 8,
      totalContracts: 6,
      totalServiceOrders: 4,
      lastUpdate: "25/04/2024"
    },
    {
      id: 4,
      name: "Jaraguari",
      state: "MS",
      latitude: -20.1386,
      longitude: -54.3996,
      totalBids: 6,
      totalContracts: 5,
      totalServiceOrders: 3,
      lastUpdate: "24/04/2024"
    },
    {
      id: 5,
      name: "Nova Alvorada do Sul",
      state: "MS",
      latitude: -21.4657,
      longitude: -54.3825,
      totalBids: 10,
      totalContracts: 7,
      totalServiceOrders: 5,
      lastUpdate: "23/04/2024"
    },
    {
      id: 6,
      name: "Ribas do Rio Pardo",
      state: "MS",
      latitude: -20.4444,
      longitude: -53.7592,
      totalBids: 12,
      totalContracts: 9,
      totalServiceOrders: 6,
      lastUpdate: "22/04/2024"
    },
    {
      id: 7,
      name: "Rio Brilhante",
      state: "MS",
      latitude: -21.8019,
      longitude: -54.5452,
      totalBids: 9,
      totalContracts: 7,
      totalServiceOrders: 4,
      lastUpdate: "21/04/2024"
    },
    {
      id: 8,
      name: "Rochedo",
      state: "MS",
      latitude: -19.9564,
      longitude: -54.8939,
      totalBids: 5,
      totalContracts: 4,
      totalServiceOrders: 2,
      lastUpdate: "20/04/2024"
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
            <BreadcrumbLink href={`/municipios/${municipio.id}`}>{municipio.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#EC610D]" />
            {municipio.name} - {municipio.state}
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
            <MunicipioMap latitude={municipio.latitude || 0} longitude={municipio.longitude || 0} nome={municipio.name} />
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
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.totalBids}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Contratos Ativos</p>
                  <p className="text-sm text-muted-foreground">Em vigência</p>
                </div>
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.totalContracts}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">OS em Execução</p>
                  <p className="text-sm text-muted-foreground">Ordens de serviço ativas</p>
                </div>
                <div className="text-2xl font-bold text-[#EC610D]">{municipio.totalServiceOrders}</div>
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
