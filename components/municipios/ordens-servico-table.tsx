"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import type { Tables } from "@/types/database.types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type ServiceOrder = Tables<"service_orders">;

type OrdensServicoTableProps = {
  serviceOrders: ServiceOrder[];
  municipalityId: string;
};

export function OrdensServicoTable({ serviceOrders, municipalityId }: OrdensServicoTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSO = serviceOrders.filter(
    so =>
      so.number?.toLowerCase().includes(searchTerm.toLowerCase())
      || so.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Função para formatar a data que vem do banco
  const formatDate = (dateString: string | null) => {
    if (!dateString)
      return "N/A";
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluida": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Em andamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Pausada": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelada": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Planejada": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por número ou descrição..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead className="w-[40%]">Descrição</TableHead>
              <TableHead>Data de Conclusão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSO.length > 0
              ? (
                  filteredSO.map(so => (
                    <TableRow key={so.id}>
                      <TableCell className="font-medium">{so.number}</TableCell>
                      <TableCell>{so.description}</TableCell>
                      <TableCell>{formatDate(so.completion_date)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(so.status)}>
                          {so.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="link" asChild>
                          <Link href={`/municipios/${municipalityId}/ordens-servico/${so.id}`}>Detalhes</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )
              : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma ordem de serviço encontrada.
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
