import { FileText, Home, LinkIcon, MapPin } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBidById } from "@/app/actions/bidActions";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function LicitacaoPage({ params }: { params: { licitacaoId: string } }) {
  const bid = await getBidById(params.licitacaoId);

  // Se a licitação ou seu município relacionado não forem encontrados, exibimos a página 404.
  if (!bid || !bid.municipalities) {
    notFound();
  }

  // Funções helper para formatar os dados para exibição em português.
  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined)
      return "Não informado";
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString)
      return "Não informada";
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluida": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Em andamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Suspensa": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelada": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Planejada": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

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
            <BreadcrumbLink href={`/municipios/${bid.municipality_id}`}>
              <MapPin className="h-4 w-4 mr-1" />
              {bid.municipalities.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              Licitação
              {bid.edital_number || "Sem Número"}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              Licitação
              {bid.edital_number || "Sem Número"}
            </h1>
            <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
          </div>
          <p className="text-muted-foreground">{bid.object}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/municipios/${bid.municipality_id}/licitacoes/${bid.id}/editar`}>
                <FileText className="mr-2 h-4 w-4" />
                {" "}
                Editar
              </Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Licitação</CardTitle>
            <CardDescription>Informações gerais do processo licitatório</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm space-y-2 pt-2">
              <p className="font-medium text-muted-foreground">Edital</p>
              {bid.edital_source_url
                ? (
                    <Button asChild variant="outline" className="w-full md:w-auto">
                      <Link href={bid.edital_source_url} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="mr-2 h-4 w-4" />
                        Acessar Edital na Fonte Oficial
                      </Link>
                    </Button>
                  )
                : (
                    <p className="text-muted-foreground italic">Nenhum link para o edital foi fornecido.</p>
                  )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-muted-foreground">Modalidade</p>
                <p>{bid.modality || "Não informada"}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Valor Estimado</p>
                <p>{formatCurrency(bid.estimated_value)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Data de Abertura</p>
                <p>{formatDate(bid.opening_date)}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Data de Homologação</p>
                <p>{formatDate(bid.approval_date)}</p>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <p className="font-medium text-muted-foreground">Descrição do Objeto</p>
              <p>{bid.description || "Nenhuma descrição fornecida."}</p>
            </div>
            {/* Seção para o link do edital */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço Vinculadas</CardTitle>
            <CardDescription>Serviços relacionados a esta licitação</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bid.service_orders && bid.service_orders.length > 0
                  ? (
                      bid.service_orders.map((os: any) => (
                        <TableRow key={os.id}>
                          <TableCell>{os.number || "N/A"}</TableCell>
                          <TableCell>{os.description}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(os.status)}>{os.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )
                  : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground">
                          Nenhuma ordem de serviço vinculada.
                        </TableCell>
                      </TableRow>
                    )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
