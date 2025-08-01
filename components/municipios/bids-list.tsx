"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Calendar, CircleDollarSign, Gavel, Search, Tag } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tables, Enums } from "@/types/database.types";

type Bid = Tables<'bids'>;

type BidsListProps = {
  initialBids: Bid[];
  municipalityId: string;
};

function getStatusColor(status: Enums<'bid_status'>) {
    switch (status) {
      case "Concluida": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Em andamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Suspensa": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelada": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Planejada": return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
}

const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export function BidsList({ initialBids, municipalityId }: BidsListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBids = useMemo(() => {
    if (!searchTerm) {
      return initialBids;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return initialBids.filter(bid =>
      bid.object.toLowerCase().includes(lowercasedTerm) ||
      bid.edital_number?.toLowerCase().includes(lowercasedTerm)
    );
  }, [initialBids, searchTerm]);

  return (
    <>
      <div className="flex items-center mb-6 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por objeto ou nº do edital..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredBids.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredBids.map(bid => (
            <Link href={`/municipios/${municipalityId}/licitacoes/${bid.id}`} key={bid.id}>
              <Card className="hover:border-[#EC610D]/50 transition-colors cursor-pointer h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-muted-foreground">{bid.edital_number || "S/N"}</p>
                      <CardTitle className="text-base leading-tight">{bid.object}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(bid.status)}>{bid.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Tag className="h-4 w-4" />
                        <span>{bid.modality || "Não informado"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <CircleDollarSign className="h-4 w-4" />
                        <span>{formatCurrency(bid.estimated_value)}</span>
                    </div>
                </CardContent>
                <CardFooter className="mt-auto pt-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Abertura: {bid.opening_date ? new Date(bid.opening_date).toLocaleDateString("pt-BR", { timeZone: 'UTC' }) : "N/D"}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">Nenhuma licitação encontrada</h3>
          <p className="mt-1 text-sm text-muted-foreground">Tente um termo de busca diferente ou adicione uma nova licitação.</p>
        </div>
      )}
    </>
  );
}