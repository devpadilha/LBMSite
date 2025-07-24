"use client";

import { Download, Printer } from "lucide-react";
import { useState } from "react";

import type { Report } from "@/models/report.model";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Interfaces adicionais para os dados do relatório
type BidReportItem = {
  id: number;
  number: string;
  title: string;
  municipality: string;
  value: number;
  status: string;
  createdAt: string;
};

type ReportData = {
  totalBids: number;
  totalValue: number;
  items: BidReportItem[];
};

type RelatorioPreviewProps = {
  report?: Report;
};

export function RelatorioPreview({ report }: RelatorioPreviewProps) {
  // Estado para armazenar os dados do relatório
  const [reportData, setReportData] = useState<ReportData>({
    totalBids: report?.stats?.totalItems || 15,
    totalValue: report?.stats?.totalValue || 2500000,
    items: [
      {
        id: 1,
        number: "001/2023",
        title: "Aquisição de Equipamentos de Informática",
        municipality: "Campo Grande",
        value: 450000,
        status: "Em andamento",
        createdAt: "2023-05-15",
      },
      {
        id: 2,
        number: "002/2023",
        title: "Contratação de Serviços de Manutenção",
        municipality: "Sidrolândia",
        value: 320000,
        status: "Concluído",
        createdAt: "2023-06-10",
      },
      {
        id: 3,
        number: "003/2023",
        title: "Reforma de Prédio Público",
        municipality: "Terenos",
        value: 780000,
        status: "Em análise",
        createdAt: "2023-07-05",
      },
    ],
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Relatório de
          {report?.type === "bid" ? "Licitações" : report?.type === "municipality" ? "Municípios" : "Desempenho"}
        </CardTitle>
        <CardDescription>
          Período:
          {report?.filters?.startDate || "01/01/2023"}
          {" "}
          a
          {report?.filters?.endDate || "31/12/2023"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Total de Licitações</div>
            <div className="text-2xl font-bold">{reportData.totalBids}</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm text-muted-foreground">Valor Total</div>
            <div className="text-2xl font-bold">
              R$
              {reportData.totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </CardContent>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Município</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.items.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.number}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.municipality}</TableCell>
                <TableCell className="text-right">
                  R$
                  {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      item.status === "Concluído"
                        ? "bg-green-100 text-green-800"
                        : item.status === "Em andamento"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center pt-4 border-t mt-6">
        <div className="text-sm text-muted-foreground">
          <p>
            Gerado em
            {new Date().toLocaleDateString("pt-BR")}
            {" "}
            - LBM Engenharia
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>
    </Card>
  );
}
