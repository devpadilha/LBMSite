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
import { Contract } from "@/models/contract.model"
import { ContractStatus, ServiceOrderStatus } from "@/types/database.types"

export default function ContratoPage({ params }: { params: { id: string; contratoId: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipio = {
    id: Number.parseInt(params.id),
    nome: "Campo Grande",
    estado: "MS",
  }

  // Usando o modelo Contract para tipar os dados do contrato
  const contrato: Contract = {
    id: Number.parseInt(params.contratoId),
    number: "CT-001/2024",
    title: "Fornecimento de equipamentos de informática",
    municipality: {
      id: Number.parseInt(params.id),
      name: "Campo Grande"
    },
    startDate: "15/01/2024",
    endDate: "15/01/2025",
    value: 250000.00,
    status: ContractStatus.ATIVO,
    description: "Contrato para fornecimento de computadores, impressoras e periféricos para uso nas secretarias municipais, conforme especificações do Termo de Referência do Pregão Eletrônico 001/2024.",
    parties: {
      contractor: "Prefeitura Municipal de Campo Grande",
      contracted: "TechSolutions Ltda."
    },
    attachments: ["termo_referencia.pdf", "proposta_comercial.pdf"],
    lastUpdate: "15/01/2024"
  }

  // Dados adicionais que não estão no modelo Contract
  const dadosAdicionais = {
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
        status: ServiceOrderStatus.CONCLUIDA,
        dataConclusao: "28/01/2024",
      },
      {
        id: 4,
        numero: "OS-004/2024",
        descricao: "Configuração de rede para novos equipamentos",
        status: ServiceOrderStatus.EM_ANDAMENTO,
        dataConclusao: "15/05/2024",
      },
    ],
  }

  const getStatusColor = (status: ServiceOrderStatus) => {
    switch (status) {
      case ServiceOrderStatus.CONCLUIDA:
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case ServiceOrderStatus.EM_ANDAMENTO:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case ServiceOrderStatus.PLANEJADA:
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case ServiceOrderStatus.CANCELADA:
        return "bg-red-100 text-red-800 hover:bg-red-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  // Formatar o valor do contrato para exibição
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
              Contrato {contrato.number}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contrato {contrato.number}</h1>
          <p className="text-muted-foreground">{contrato.title}</p>
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
                <p className="text-sm text-muted-foreground">{contrato.parties.contracted}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Valor</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(contrato.value)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Vigência</p>
                <p className="text-sm text-muted-foreground">{contrato.startDate} a {contrato.endDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Assinatura</p>
                <p className="text-sm text-muted-foreground">{contrato.startDate}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Responsável</p>
                <p className="text-sm text-muted-foreground">{dadosAdicionais.responsavel}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Licitação de Origem</p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={`/municipios/${municipio.id}/licitacoes/${dadosAdicionais.licitacao.id}`}>
                    {dadosAdicionais.licitacao.numero}
                  </Link>
                </Button>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge variant="outline" className={`bg-${contrato.status === ContractStatus.ATIVO ? 'green' : contrato.status === ContractStatus.CONCLUIDO ? 'blue' : contrato.status === ContractStatus.CANCELADO ? 'red' : 'amber'}-100`}>
                  {contrato.status.charAt(0).toUpperCase() + contrato.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Última Atualização</p>
                <p className="text-sm text-muted-foreground">{contrato.lastUpdate}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Descrição</p>
              <p className="text-sm text-muted-foreground">{contrato.description}</p>
            </div>
            {contrato.attachments && contrato.attachments.length > 0 && (
              <div>
                <p className="text-sm font-medium">Anexos</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {contrato.attachments.map((attachment, index) => (
                    <Badge key={index} variant="outline" className="bg-gray-100">
                      {attachment}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
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
                {dadosAdicionais.ordensServico.map((os) => (
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
