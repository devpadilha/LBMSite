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

export default function ContratoPage({ params }: { params: { id: string; contratoId: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipio = {
    id: Number.parseInt(params.id),
    nome: "São Paulo",
    estado: "SP",
  }

  const contrato = {
    id: Number.parseInt(params.contratoId),
    numero: "CT-001/2024",
    objeto: "Fornecimento de equipamentos de informática",
    vigencia: "15/01/2024 a 15/01/2025",
    valor: "R$ 250.000,00",
    fornecedor: "TechSolutions Ltda.",
    descricao:
      "Contrato para fornecimento de computadores, impressoras e periféricos para uso nas secretarias municipais, conforme especificações do Termo de Referência do Pregão Eletrônico 001/2024.",
    dataAssinatura: "15/01/2024",
    responsavel: "João Silva - Secretário de Administração",
    licitacao: {
      id: 1,
      numero: "001/2024",
    },
    ordensServico: [
      {
        id: 1,
        numero: "OS-001/2024",
        descricao: "Instalação de computadores na Secretaria de Educação",
        status: "Concluída",
        dataConclusao: "28/01/2024",
      },
      {
        id: 4,
        numero: "OS-004/2024",
        descricao: "Configuração de rede para novos equipamentos",
        status: "Em andamento",
        dataConclusao: "15/05/2024",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Em andamento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
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
            <BreadcrumbLink href={`/municipios/${municipio.id}/contratos/${contrato.id}`}>
              Contrato {contrato.numero}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contrato {contrato.numero}</h1>
          <p className="text-muted-foreground">{contrato.objeto}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button>
            <LinkIcon className="mr-2 h-4 w-4" /> Documentos
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Contrato</CardTitle>
            <CardDescription>Informações gerais do contrato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Fornecedor</p>
                <p className="text-sm text-muted-foreground">{contrato.fornecedor}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Valor</p>
                <p className="text-sm text-muted-foreground">{contrato.valor}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Vigência</p>
                <p className="text-sm text-muted-foreground">{contrato.vigencia}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Assinatura</p>
                <p className="text-sm text-muted-foreground">{contrato.dataAssinatura}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">{contrato.responsavel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Licitação de Origem</p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={`/municipios/${municipio.id}/licitacoes/${contrato.licitacao.id}`}>
                    {contrato.licitacao.numero}
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Descrição</p>
              <p className="text-sm text-muted-foreground">{contrato.descricao}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço Emitidas</CardTitle>
            <CardDescription>Serviços relacionados a este contrato</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Conclusão</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contrato.ordensServico.map((os) => (
                  <TableRow key={os.id}>
                    <TableCell className="font-medium">{os.numero}</TableCell>
                    <TableCell>{os.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(os.status)}>
                        {os.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{os.dataConclusao}</TableCell>
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
