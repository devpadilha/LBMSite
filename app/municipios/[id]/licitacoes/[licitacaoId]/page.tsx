import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Home, LinkIcon, MapPin } from "lucide-react"
import Link from "next/link"

export default function LicitacaoPage({ params }: { params: { id: string; licitacaoId: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipio = {
    id: Number.parseInt(params.id),
    nome: "Campo Grande",
    estado: "MS",
  }

  const licitacao = {
    id: Number.parseInt(params.licitacaoId),
    numero: "001/2024",
    objeto: "Aquisição de equipamentos de informática",
    status: "Concluída",
    data: "15/01/2024",
    descricao:
      "Processo licitatório para aquisição de computadores, impressoras e periféricos para uso nas secretarias municipais, visando a modernização do parque tecnológico da prefeitura.",
    modalidade: "Pregão Eletrônico",
    valorEstimado: "R$ 250.000,00",
    dataAbertura: "05/01/2024",
    dataHomologacao: "15/01/2024",
    contrato: {
      id: 1,
      numero: "CT-001/2024",
    },
    ordensServico: [
      {
        id: 1,
        numero: "OS-001/2024",
        descricao: "Instalação de computadores na Secretaria de Educação",
        status: "Concluída",
      },
      {
        id: 4,
        numero: "OS-004/2024",
        descricao: "Configuração de rede para novos equipamentos",
        status: "Em andamento",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Em andamento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Suspensa":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
      case "Planejada":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

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
            <BreadcrumbLink href={`/municipios/${municipio.id}`}>
              <MapPin className="h-4 w-4 mr-1" />
              {municipio.nome}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/municipios/${municipio.id}/licitacoes/${licitacao.id}`}>
              Licitação {licitacao.numero}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Licitação {licitacao.numero}</h1>
            <Badge variant="outline" className={getStatusColor(licitacao.status)}>
              {licitacao.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{licitacao.objeto}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button>
            <LinkIcon className="mr-2 h-4 w-4" /> Contrato Gerado
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Licitação</CardTitle>
            <CardDescription>Informações gerais do processo licitatório</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Modalidade</p>
                <p className="text-sm text-muted-foreground">{licitacao.modalidade}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Valor Estimado</p>
                <p className="text-sm text-muted-foreground">{licitacao.valorEstimado}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Abertura</p>
                <p className="text-sm text-muted-foreground">{licitacao.dataAbertura}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Homologação</p>
                <p className="text-sm text-muted-foreground">{licitacao.dataHomologacao}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Descrição</p>
              <p className="text-sm text-muted-foreground">{licitacao.descricao}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Contrato Gerado</p>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href={`/municipios/${municipio.id}/contratos/${licitacao.contrato.id}`}>
                  {licitacao.contrato.numero}
                </Link>
              </Button>
            </div>
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
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licitacao.ordensServico.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">{os.numero}</TableCell>
                    <TableCell>{os.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(os.status)}>
                        {os.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="link" asChild>
                        <Link href={`/municipios/${municipio.id}/ordens-servico/${os.id}`}>Detalhes</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
