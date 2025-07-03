import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Activity,
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  Plus,
  RefreshCw,
} from "lucide-react"
import { MunicipiosRecentes } from "@/components/dashboard/municipios-recentes"
import { OrdensServicoRecentes } from "@/components/dashboard/ordens-servico-recentes"
import { GraficoOSPorStatus } from "@/components/dashboard/grafico-os-por-status"
import { GraficoLicitacoesPorMes } from "@/components/dashboard/grafico-licitacoes-por-mes"
import { GraficoContratosPorValor } from "@/components/dashboard/grafico-contratos-por-valor"
import Link from "next/link"
// Import models
import { Municipality, ServiceOrder, Bid, Contract, LogEntry } from "@/models"

// You can define interfaces for dashboard statistics using the models
interface DashboardStats {
  municipalities: {
    total: number;
    recentIncrease: number;
    recent: Municipality[];
  };
  bids: {
    active: number;
    recentIncrease: number;
    byMonth: { month: string; count: number }[];
  };
  contracts: {
    active: number;
    recentIncrease: number;
    byValue: { range: string; count: number }[];
  };
  serviceOrders: {
    total: number;
    recentIncrease: number;
    byStatus: { status: string; count: number }[];
    recent: ServiceOrder[];
  };
  recentActivities: LogEntry[];
}

// This would typically come from an API call or context
const dashboardData: DashboardStats = {
  municipalities: {
    total: 8,
    recentIncrease: 1,
    recent: []
  },
  bids: {
    active: 42,
    recentIncrease: 8,
    byMonth: []
  },
  contracts: {
    active: 56,
    recentIncrease: 5,
    byValue: []
  },
  serviceOrders: {
    total: 38,
    recentIncrease: 12,
    byStatus: [],
    recent: []
  },
  recentActivities: []
};

export default function DashboardPage() {
  // You could fetch data here using the models
  // const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  
  // useEffect(() => {
  //   async function fetchDashboardData() {
  //     // Fetch data and type it according to the models
  //     const municipalities = await fetchMunicipalities();
  //     const bids = await fetchBids();
  //     const contracts = await fetchContracts();
  //     const serviceOrders = await fetchServiceOrders();
  //     const recentActivities = await fetchRecentActivities();
  //     
  //     setDashboardData({
  //       municipalities: {
  //         total: municipalities.length,
  //         recentIncrease: calculateRecentIncrease(municipalities),
  //         recent: municipalities.slice(0, 5)
  //       },
  //       // ... other data
  //     });
  //   }
  //   
  //   fetchDashboardData();
  // }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Painel de Administração - LBM Engenharia</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Abril 2024
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button size="sm" className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:bg-[#EC610D]/5 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Total de Municípios</CardDescription>
            <CardTitle className="text-3xl">{dashboardData.municipalities.total}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">+{dashboardData.municipalities.recentIncrease} no último mês</p>
              <Building className="h-4 w-4 text-[#EC610D]" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-[#EC610D]/5 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Licitações Ativas</CardDescription>
            <CardTitle className="text-3xl">42</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">+8 no último mês</p>
              <FileText className="h-4 w-4 text-[#EC610D]" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-[#EC610D]/5 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Contratos Vigentes</CardDescription>
            <CardTitle className="text-3xl">56</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">+5 no último mês</p>
              <FileText className="h-4 w-4 text-[#EC610D]" />
            </div>
          </CardContent>
        </Card>
        <Card className="hover:bg-[#EC610D]/5 transition-colors">
          <CardHeader className="pb-2">
            <CardDescription>Ordens de Serviço</CardDescription>
            <CardTitle className="text-3xl">38</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">+12 no último mês</p>
              <CheckCircle className="h-4 w-4 text-[#EC610D]" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-muted/60 border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Análises
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            Relatórios
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div>
                  <CardTitle>Licitações por Mês</CardTitle>
                  <CardDescription>Número de licitações abertas nos últimos 6 meses</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                  >
                    <Filter className="h-4 w-4 mr-1" /> Filtrar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <GraficoLicitacoesPorMes />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle>Ordens de Serviço por Status</CardTitle>
                <CardDescription>Distribuição atual das OS</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <GraficoOSPorStatus />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2 border-b">
                <CardTitle>Contratos por Valor</CardTitle>
                <CardDescription>Distribuição de contratos por faixa de valor</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px]">
                  <GraficoContratosPorValor />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div>
                  <CardTitle>Ordens de Serviço Recentes</CardTitle>
                  <CardDescription>Últimas OS registradas no sistema</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                >
                  <Clock className="h-4 w-4 mr-1" /> Ver todas
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                <OrdensServicoRecentes />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
                <div>
                  <CardTitle>Atividades Recentes</CardTitle>
                  <CardDescription>Últimas ações no sistema</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#EC610D]/10 p-2">
                      <FileText className="h-4 w-4 text-[#EC610D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nova licitação registrada</p>
                      <p className="text-xs text-muted-foreground">Sidrolândia - 10 minutos atrás</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#EC610D]/10 p-2">
                      <CheckCircle className="h-4 w-4 text-[#EC610D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">OS concluída</p>
                      <p className="text-xs text-muted-foreground">Terenos - 45 minutos atrás</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#EC610D]/10 p-2">
                      <Building className="h-4 w-4 text-[#EC610D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Novo município adicionado</p>
                      <p className="text-xs text-muted-foreground">Rochedo - 2 horas atrás</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-[#EC610D]/10 p-2">
                      <FileText className="h-4 w-4 text-[#EC610D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Contrato atualizado</p>
                      <p className="text-xs text-muted-foreground">Jaraguari - 3 horas atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Análise de Desempenho</CardTitle>
              <CardDescription>Métricas detalhadas de desempenho do sistema</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <Activity className="h-16 w-16 mr-2 text-[#EC610D]/50" />
                <p className="text-lg">Selecione métricas para visualizar análises detalhadas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Relatórios Rápidos</CardTitle>
              <CardDescription>Gere relatórios com base nos dados do sistema</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center justify-center border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                >
                  <Building className="h-8 w-8 mb-2" />
                  <span>Relatório de Municípios</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center justify-center border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                >
                  <FileText className="h-8 w-8 mb-2" />
                  <span>Relatório de Licitações</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center justify-center border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                >
                  <CheckCircle className="h-8 w-8 mb-2" />
                  <span>Relatório de OS</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <div>
              <CardTitle>Municípios Recentes</CardTitle>
              <CardDescription>Últimos municípios adicionados ou atualizados</CardDescription>
            </div>
            <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
              <Link href="/municipios/adicionar">
                <Plus className="h-4 w-4 mr-1" /> Adicionar
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            <MunicipiosRecentes />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
