"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface OrdensServicoTableProps {
  municipioId: number
}

export function OrdensServicoTable({ municipioId }: OrdensServicoTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
  const ordensServico = [
    {
      id: 1,
      numero: "OS-001/2024",
      descricao: "Instalação de computadores na Secretaria de Educação",
      dataConclusao: "28/01/2024",
      status: "Concluída",
      solicitante: "Secretaria de Educação",
    },
    {
      id: 2,
      numero: "OS-002/2024",
      descricao: "Limpeza de praças e jardins - Zona Norte",
      dataConclusao: "15/02/2024",
      status: "Concluída",
      solicitante: "Secretaria de Meio Ambiente",
    },
    {
      id: 3,
      numero: "OS-003/2024",
      descricao: "Reforma da Escola Municipal João da Silva",
      dataConclusao: "30/04/2024",
      status: "Em andamento",
      solicitante: "Secretaria de Educação",
    },
    {
      id: 4,
      numero: "OS-004/2024",
      descricao: "Entrega de medicamentos ao Posto de Saúde Central",
      dataConclusao: "10/03/2024",
      status: "Concluída",
      solicitante: "Secretaria de Saúde",
    },
    {
      id: 5,
      numero: "OS-005/2024",
      descricao: "Recapeamento da Avenida Principal",
      dataConclusao: "15/05/2024",
      status: "Em andamento",
      solicitante: "Secretaria de Obras",
    },
  ]

  const filteredOS = ordensServico.filter(
    (os) =>
      os.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
      os.solicitante.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ordens de serviço..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead className="w-[30%]">Descrição</TableHead>
              <TableHead>Data Conclusão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOS.length > 0 ? (
              filteredOS.map((os) => (
                <TableRow key={os.id}>
                  <TableCell className="font-medium">{os.numero}</TableCell>
                  <TableCell>{os.descricao}</TableCell>
                  <TableCell>{os.dataConclusao}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(os.status)}>
                      {os.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{os.solicitante}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" asChild>
                      <Link href={`/municipios/${municipioId}/ordens-servico/${os.id}`}>Detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma ordem de serviço encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
