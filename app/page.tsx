"use client"

import { useState } from "react"
import { Eye, Filter, PlusCircle, Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ServiceOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string[]>([])

  // Sample data - in a real app, this would come from a database
  const serviceOrders = [
    {
      id: "OS-001",
      municipality: "São Paulo",
      description: "Manutenção de equipamentos de informática",
      requester: "João Silva",
      requestDate: "2023-04-01",
      contract: "CONT-2023-001",
      status: "pendente",
      completionDate: "",
    },
    {
      id: "OS-002",
      municipality: "Rio de Janeiro",
      description: "Instalação de rede de fibra óptica",
      requester: "Maria Santos",
      requestDate: "2023-04-05",
      contract: "CONT-2023-002",
      status: "concluído",
      completionDate: "2023-04-15",
    },
    {
      id: "OS-003",
      municipality: "Belo Horizonte",
      description: "Reparo em sistema de ar condicionado",
      requester: "Carlos Oliveira",
      requestDate: "2023-04-10",
      contract: "CONT-2023-001",
      status: "concluído",
      completionDate: "2023-04-12",
    },
    {
      id: "OS-004",
      municipality: "Brasília",
      description: "Manutenção preventiva em elevadores",
      requester: "Ana Pereira",
      requestDate: "2023-04-15",
      contract: "CONT-2023-003",
      status: "pendente",
      completionDate: "",
    },
    {
      id: "OS-005",
      municipality: "Salvador",
      description: "Instalação de sistema de segurança",
      requester: "Roberto Almeida",
      requestDate: "2023-04-20",
      contract: "CONT-2023-002",
      status: "pendente",
      completionDate: "",
    },
  ]

  const filteredOrders = serviceOrders.filter(
    (order) =>
      (searchTerm === "" ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.requester.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter.length === 0 || statusFilter.includes(order.status)),
  )

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <Card className="engineering-pattern">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-2xl">Ordens de Serviço</CardTitle>
            <CardDescription>Gerencie todas as ordens de serviço em um só lugar</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar ordens..."
                className="pl-8 w-full sm:w-[200px] md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("pendente")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter([...statusFilter, "pendente"])
                    } else {
                      setStatusFilter(statusFilter.filter((s) => s !== "pendente"))
                    }
                  }}
                >
                  Pendentes
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes("concluído")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setStatusFilter([...statusFilter, "concluído"])
                    } else {
                      setStatusFilter(statusFilter.filter((s) => s !== "concluído"))
                    }
                  }}
                >
                  Concluídas
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/ordens-de-servico/novo">
              <Button className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Ordem
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>ID</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.municipality}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{order.description}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "concluído" ? "success" : "secondary"}>
                        {order.status === "concluído" ? "Concluído" : "Pendente"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredOrders.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2" />
                        <p>Nenhuma ordem de serviço encontrada</p>
                        <p className="text-sm">Tente ajustar os filtros ou criar uma nova ordem</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Ordem de Serviço {selectedOrder?.id}</DialogTitle>
            <DialogDescription>Informações completas sobre a ordem de serviço</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">ID:</span>
                <span className="col-span-3">{selectedOrder.id}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Município:</span>
                <span className="col-span-3">{selectedOrder.municipality}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Descrição:</span>
                <span className="col-span-3">{selectedOrder.description}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Solicitante:</span>
                <span className="col-span-3">{selectedOrder.requester}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Data da Solicitação:</span>
                <span className="col-span-3">{new Date(selectedOrder.requestDate).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Contrato:</span>
                <span className="col-span-3">{selectedOrder.contract}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge variant={selectedOrder.status === "concluído" ? "success" : "secondary"}>
                    {selectedOrder.status === "concluído" ? "Concluído" : "Pendente"}
                  </Badge>
                </span>
              </div>
              {selectedOrder.completionDate && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-sm font-medium">Data da Conclusão:</span>
                  <span className="col-span-3">
                    {new Date(selectedOrder.completionDate).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

