import { ExternalLink, FileText, Gavel, Home, MapPin, Plus, Wrench } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMunicipalityDetailsById } from "@/app/actions/municipalityActions";
import { LicitacoesTable } from "@/components/municipios/licitacoes-table";
import { OrdensServicoTable } from "@/components/municipios/ordens-servico-table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function MunicipioPage({ params }: { params: { id: string } }) {
  const id = await params.id;

  const municipality = await getMunicipalityDetailsById(id);

  if (!municipality) {
    notFound();
  }

  const totalBids = municipality.bids_count?.[0]?.count || 0;
  const totalSO = municipality.service_orders_count?.[0]?.count || 0;

  const googleMapsUrl = municipality.latitude && municipality.longitude
    ? `https://maps.google.com/?q=${municipality.latitude},${municipality.longitude}`
    : null;

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
          <BreadcrumbItem><BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/municipios/${municipality.id}`}>{municipality.name}</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#EC610D]" />
            {municipality.name}
            {" "}
            -
            {municipality.state}
          </h1>
          <p className="text-muted-foreground">Gestão de processos e serviços municipais</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Exportar Dados</Button>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <FileText className="mr-2 h-4 w-4" />
            {" "}
            Gerar Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4 border-b">
            <CardTitle>Localização Geográfica</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col justify-center h-full">
            {googleMapsUrl
              ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 text-sm">
                      <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Coordenadas</p>
                        <p className="text-muted-foreground">{`Latitude: ${municipality.latitude}, Longitude: ${municipality.longitude}`}</p>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full">
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Ver no Google Maps
                      </a>
                    </Button>
                  </div>
                )
              : (
                  <div className="text-center text-muted-foreground">
                    <p>As coordenadas para este município não foram cadastradas.</p>
                  </div>
                )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b">
            <CardTitle>Resumo</CardTitle>
            <CardDescription>Visão geral dos processos</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-start gap-4">
              <Gavel className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">Total de Licitações</p>
                <p className="text-sm text-muted-foreground">Processos registrados</p>
              </div>
              <div className="text-2xl font-bold text-[#EC610D]">{totalBids}</div>
            </div>
            <div className="flex items-start gap-4">
              <Wrench className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium leading-none">Ordens de Serviço</p>
                <p className="text-sm text-muted-foreground">Serviços em execução</p>
              </div>
              <div className="text-2xl font-bold text-[#EC610D]">{totalSO}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bids" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/60 border">
          <TabsTrigger value="bids" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">Licitações</TabsTrigger>
          <TabsTrigger value="service-orders" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">Ordens de Serviço</TabsTrigger>
        </TabsList>

        <TabsContent value="bids" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Licitações Registradas</h2>
            <Button size="sm" asChild className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Link href={`/municipios/${municipality.id}/licitacoes/adicionar`}>
                <Plus className="mr-2 h-4 w-4" />
                {" "}
                Nova Licitação
              </Link>
            </Button>
          </div>
          <LicitacoesTable bids={municipality.bids} municipalityId={municipality.id} />
        </TabsContent>

        <TabsContent value="service-orders" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ordens de Serviço</h2>
            <Button size="sm" asChild className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Link href={`/municipios/${municipality.id}/ordens-servico/adicionar`}>
                <Plus className="mr-2 h-4 w-4" />
                {" "}
                Nova OS
              </Link>
            </Button>
          </div>
          <OrdensServicoTable serviceOrders={municipality.service_orders} municipalityId={municipality.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
