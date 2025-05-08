"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function MunicipiosRecentes() {
  const municipalities = [
    {
      id: 1,
      name: "Campo Grande",
      state: "MS",
      totalBids: 24,
      totalContracts: 18,
      totalServiceOrders: 12,
      lastUpdate: "27/04/2024",
    },
    {
      id: 2,
      name: "Sidrolândia",
      state: "MS",
      totalBids: 14,
      totalContracts: 10,
      totalServiceOrders: 8,
      lastUpdate: "26/04/2024",
    },
    {
      id: 3,
      name: "Terenos",
      state: "MS",
      totalBids: 8,
      totalContracts: 6,
      totalServiceOrders: 4,
      lastUpdate: "25/04/2024",
    },
    {
      id: 4,
      name: "Jaraguari",
      state: "MS",
      totalBids: 6,
      totalContracts: 5,
      totalServiceOrders: 3,
      lastUpdate: "24/04/2024",
    },
    {
      id: 5,
      name: "Nova Alvorada do Sul",
      state: "MS",
      totalBids: 10,
      totalContracts: 7,
      totalServiceOrders: 5,
      lastUpdate: "23/04/2024",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Município</TableHead>
            <TableHead>Licitações</TableHead>
            <TableHead>Contratos</TableHead>
            <TableHead>OS</TableHead>
            <TableHead>Atualização</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {municipalities.map((municipality) => (
            <TableRow key={municipality.id} className="hover:bg-[#EC610D]/5">
              <TableCell className="font-medium">
                {municipality.name} - {municipality.state}
              </TableCell>
              <TableCell>{municipality.totalBids}</TableCell>
              <TableCell>{municipality.totalContracts}</TableCell>
              <TableCell>{municipality.totalServiceOrders}</TableCell>
              <TableCell>{municipality.lastUpdate}</TableCell>
              <TableCell className="text-right">
                <Button variant="link" className="text-[#EC610D] hover:text-[#EC610D]/80" asChild>
                  <Link href={`/municipios/${municipality.id}`}>Detalhes</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
