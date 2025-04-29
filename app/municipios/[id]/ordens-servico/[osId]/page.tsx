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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Home, LinkIcon, MapPin } from "lucide-react"
import Link from "next/link"

export default function OrdemServicoPage({ params }: { params: { id: string; osId: string } }) {
  // Em produção, estes dados viriam de uma API ou banco de dados
  const municipio = {
    id: Number.parseInt(params.id),
    nome: "Campo Grande",
    estado: "MS",
  }

  const ordemServico = {
    id: Number.parseInt(params.osId),
    numero: "OS-001/2024",
    descricao: "Instalação de computadores na Secretaria de Educação",
    dataConclusao: "28/01/2024",
    status: "Concluída",
    solicitante: "Maria Oliveira - Secretária de Educação",
    dataSolicitacao: "20/01/2024",
    detalhamento:
      "Instalação e configuração de 15 computadores novos, incluindo sistemas operacionais, softwares básicos e conexão à rede municipal. Treinamento básico para os usuários.",
    contrato: {
      id: 1,
      numero: "CT-001/2024",
    },
    funcionariosResponsaveis: [
      {
        id: 1,
        nome: "Carlos Silva",
        cargo: "Técnico de TI",
        avatar: "/placeholder.svg",
      },
      {
        id: 2,
        nome: "Ana Souza",
        cargo: "Analista de Sistemas",
        avatar: "/placeholder.svg",
      },
      {
        id: 3,
        nome: "Roberto Almeida",
        cargo: "Técnico de Suporte",
        avatar: "/placeholder.svg",
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
            <BreadcrumbLink href={`/municipios/${municipio.id}/ordens-servico/${ordemServico.id}`}>
              OS {ordemServico.numero}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">OS {ordemServico.numero}</h1>
            <Badge variant="outline" className={getStatusColor(ordemServico.status)}>
              {ordemServico.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{ordemServico.descricao}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" /> Editar
          </Button>
          <Button>
            <LinkIcon className="mr-2 h-4 w-4" /> Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
            <CardDescription>Informações gerais da OS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Solicitante</p>
                <p className="text-sm text-muted-foreground">{ordemServico.solicitante}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Solicitação</p>
                <p className="text-sm text-muted-foreground">{ordemServico.dataSolicitacao}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Data de Conclusão</p>
                <p className="text-sm text-muted-foreground">{ordemServico.dataConclusao}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Contrato Referente</p>
                <Button variant="link" className="p-0 h-auto" asChild>
                  <Link href={`/municipios/${municipio.id}/contratos/${ordemServico.contrato.id}`}>
                    {ordemServico.contrato.numero}
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Detalhamento</p>
              <p className="text-sm text-muted-foreground">{ordemServico.detalhamento}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Funcionários Responsáveis</CardTitle>
            <CardDescription>Equipe designada para esta OS</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ordemServico.funcionariosResponsaveis.map((funcionario) => (
                <div key={funcionario.id} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={funcionario.avatar || "/placeholder.svg"} alt={funcionario.nome} />
                    <AvatarFallback>{funcionario.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{funcionario.nome}</p>
                    <p className="text-sm text-muted-foreground">{funcionario.cargo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
