"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function OrdensServicoRecentes() {
  const serviceOrders = [
    {
      id: 1,
      number: "OS-001/2024",
      municipality: { id: 1, name: "Campo Grande" },
      description: "Manutenção de equipamentos de informática",
      status: "Pendente",
      completionDate: "30/04/2024",
    },
    {
      id: 2,
      number: "OS-002/2024",
      municipality: { id: 2, name: "Sidrolândia" },
      description: "Instalação de rede de fibra óptica",
      status: "Concluído",
      completionDate: "25/04/2024",
    },
    {
      id: 3,
      number: "OS-003/2024",
      municipality: { id: 3, name: "Terenos" },
      description: "Reparo em sistema de ar condicionado",
      status: "Concluído",
      completionDate: "22/04/2024",
    },
    {
      id: 4,
      number: "OS-004/2024",
      municipality: { id: 4, name: "Jaraguari" },
      description: "Manutenção preventiva em elevadores",
      status: "Pendente",
      completionDate: "05/05/2024",
    },
    {
      id: 5,
      number: "OS-005/2024",
      municipality: { id: 5, name: "Nova Alvorada do Sul" },
      description: "Instalação de sistema de segurança",
      status: "Pendente",
      completionDate: "10/05/2024",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluído":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Em andamento":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "Pendente":
        return "bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
      case "Planejada":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Número</TableHead>
            <TableHead>Município</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Conclusão</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceOrders.map((order) => (
            <TableRow key={order.id} className="hover:bg-[#EC610D]/5">
              <TableCell className="font-medium">{order.number}</TableCell>
              <TableCell>{order.municipality.name}</TableCell>
              <TableCell>{order.description}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>{order.completionDate}</TableCell>
              <TableCell className="text-right">
                <Button variant="link" className="text-[#EC610D] hover:text-[#EC610D]/80" asChild>
                  <Link href={`/municipios/${order.municipality.id}/ordens-servico/${order.id}`}>Detalhes</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
