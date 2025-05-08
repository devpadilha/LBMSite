"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface LicitacoesTableProps {
  municipioId: number
}

export function LicitacoesTable({ municipioId }: LicitacoesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
  const licitacoes = [
    {
      id: 1,
      numero: "001/2024",
      objeto: "Aquisição de equipamentos de informática",
      status: "Concluída",
      data: "15/01/2024",
    },
    {
      id: 2,
      numero: "002/2024",
      objeto: "Contratação de serviços de limpeza urbana",
      status: "Em andamento",
      data: "28/01/2024",
    },
    {
      id: 3,
      numero: "003/2024",
      objeto: "Reforma de escolas municipais",
      status: "Em andamento",
      data: "10/02/2024",
    },
    {
      id: 4,
      numero: "004/2024",
      objeto: "Aquisição de medicamentos",
      status: "Concluída",
      data: "22/02/2024",
    },
    {
      id: 5,
      numero: "005/2024",
      objeto: "Manutenção de vias públicas",
      status: "Suspensa",
      data: "05/03/2024",
    },
  ]

  const filteredLicitacoes = licitacoes.filter(
    (licitacao) =>
      licitacao.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      licitacao.objeto.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar licitações..."
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
              <TableHead className="w-[40%]">Objeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLicitacoes.length > 0 ? (
              filteredLicitacoes.map((licitacao) => (
                <TableRow key={licitacao.id}>
                  <TableCell className="font-medium">{licitacao.numero}</TableCell>
                  <TableCell>{licitacao.objeto}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(licitacao.status)}>
                      {licitacao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{licitacao.data}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" asChild>
                      <Link href={`/municipios/${municipioId}/licitacoes/${licitacao.id}`}>Detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhuma licitação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
