"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"

interface ContratosTableProps {
  municipioId: number
}

export function ContratosTable({ municipioId }: ContratosTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
  const contratos = [
    {
      id: 1,
      numero: "CT-001/2024",
      objeto: "Fornecimento de equipamentos de informática",
      vigencia: "15/01/2024 a 15/01/2025",
      valor: "R$ 250.000,00",
      fornecedor: "TechSolutions Ltda.",
    },
    {
      id: 2,
      numero: "CT-002/2024",
      objeto: "Serviços de limpeza urbana",
      vigencia: "01/02/2024 a 31/01/2026",
      valor: "R$ 1.200.000,00",
      fornecedor: "EcoLimpa S.A.",
    },
    {
      id: 3,
      numero: "CT-003/2024",
      objeto: "Reforma de escolas municipais",
      vigencia: "15/02/2024 a 15/08/2024",
      valor: "R$ 850.000,00",
      fornecedor: "Construtora Educação Ltda.",
    },
    {
      id: 4,
      numero: "CT-004/2024",
      objeto: "Fornecimento de medicamentos",
      vigencia: "01/03/2024 a 28/02/2025",
      valor: "R$ 500.000,00",
      fornecedor: "FarmaMed Distribuidora",
    },
  ]

  const filteredContratos = contratos.filter(
    (contrato) =>
      contrato.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.objeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contrato.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar contratos..."
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
              <TableHead className="w-[30%]">Objeto</TableHead>
              <TableHead>Vigência</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContratos.length > 0 ? (
              filteredContratos.map((contrato) => (
                <TableRow key={contrato.id}>
                  <TableCell className="font-medium">{contrato.numero}</TableCell>
                  <TableCell>{contrato.objeto}</TableCell>
                  <TableCell>{contrato.vigencia}</TableCell>
                  <TableCell>{contrato.valor}</TableCell>
                  <TableCell>{contrato.fornecedor}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="link" asChild>
                      <Link href={`/municipios/${municipioId}/contratos/${contrato.id}`}>Detalhes</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum contrato encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
