"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"


type Bid = {
  id: string;
  number: string;
  object: string;
  status: string;
  opening_date: string | null;
  municipality_id?: string; 
};

// DEPOIS: A interface de props agora espera um array de licitações.
interface LicitacoesTableProps {
  bids: Bid[];
  municipalityId: string;
}

export function LicitacoesTable({ bids, municipalityId }: LicitacoesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // DEPOIS: Removemos os dados mocados. A busca agora funciona sobre os dados recebidos via props.
  const filteredBids = bids.filter(
    (bid) =>
      bid.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bid.object.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Função para formatar a data que vem do banco (ex: "2024-07-15T...")
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluida": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Em andamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Suspensa": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "Cancelada": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Planejada": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por número ou objeto..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead className="w-[50%]">Objeto</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data de Abertura</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBids.length > 0 ? (
              filteredBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">{bid.number}</TableCell>
                  <TableCell>{bid.object}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(bid.status)}>
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(bid.opening_date)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" asChild>
                      <Link href={`/municipios/${municipalityId}/licitacoes/${bid.id}`}>Detalhes</Link>
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