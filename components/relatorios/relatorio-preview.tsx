"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function RelatorioPreview() {
  return (
    <div className="space-y-4">
      <div className="text-center p-4 border-b">
        <h2 className="text-xl font-bold">Relatório de Licitações</h2>
        <p className="text-sm text-muted-foreground">Período: 01/01/2024 a 30/04/2024</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="border rounded-md p-3">
          <p className="text-sm font-medium">Total de Licitações</p>
          <p className="text-2xl font-bold">87</p>
        </div>
        <div className="border rounded-md p-3">
          <p className="text-sm font-medium">Valor Total</p>
          <p className="text-2xl font-bold">R$ 12.450.000,00</p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Objeto</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              {
                numero: "001/2024",
                municipio: "São Paulo",
                objeto: "Aquisição de equipamentos de informática",
                valor: "R$ 250.000,00",
                status: "Concluída",
              },
              {
                numero: "002/2024",
                municipio: "Rio de Janeiro",
                objeto: "Contratação de serviços de limpeza urbana",
                valor: "R$ 1.200.000,00",
                status: "Em andamento",
              },
              {
                numero: "003/2024",
                municipio: "Belo Horizonte",
                objeto: "Reforma de escolas municipais",
                valor: "R$ 850.000,00",
                status: "Em andamento",
              },
              {
                numero: "004/2024",
                municipio: "Salvador",
                objeto: "Aquisição de medicamentos",
                valor: "R$ 500.000,00",
                status: "Concluída",
              },
              {
                numero: "005/2024",
                municipio: "Fortaleza",
                objeto: "Manutenção de vias públicas",
                valor: "R$ 1.500.000,00",
                status: "Suspensa",
              },
            ].map((licitacao, i) => (
              <TableRow key={i}>
                <TableCell>{licitacao.numero}</TableCell>
                <TableCell>{licitacao.municipio}</TableCell>
                <TableCell>{licitacao.objeto}</TableCell>
                <TableCell>{licitacao.valor}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      licitacao.status === "Concluída"
                        ? "bg-green-100 text-green-800"
                        : licitacao.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {licitacao.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="text-center text-sm text-muted-foreground pt-4 border-t">
        <p>Gerado em 27/04/2024 às 20:42 - LBM Engenharia</p>
      </div>
    </div>
  )
}
