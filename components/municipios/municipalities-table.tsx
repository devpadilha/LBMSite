"use client";

import { Building, Gavel, Search, Wrench } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { MunicipalitiesToList } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type MunicipalitiesListProps = {
  initialMunicipalities: MunicipalitiesToList[];
};

export function MunicipalitiesList({ initialMunicipalities }: MunicipalitiesListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMunicipalities = useMemo(() => {
    if (!searchTerm) {
      return initialMunicipalities;
    }

    const lowercasedTerm = searchTerm.toLowerCase();

    return initialMunicipalities.filter(municipality =>
      municipality.name.toLowerCase().includes(lowercasedTerm),
    );
  }, [initialMunicipalities, searchTerm]);

  return (
    <>
      <div className="flex items-center mb-6 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar município pelo nome..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredMunicipalities.length > 0 ?
        (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMunicipalities.map(municipality => (
              <Link href={`/municipios/${municipality.id}`} key={municipality.id}>
                <Card className="hover:border-[#EC610D]/50 transition-colors cursor-pointer h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#EC610D]/10 p-2 rounded-lg">
                        <Building className="h-5 w-5 text-[#EC610D]" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{municipality.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{municipality.state}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-1 space-y-2">
                    <div className="flex items-start gap-4">
                      <Gavel className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">Total de Licitações</p>
                        <p className="text-sm text-muted-foreground">Processos registrados</p>
                      </div>
                      <div className="text-2xl font-bold text-[#EC610D]">{municipality.total_bids}</div>
                    </div>
                    <div className="flex items-start gap-4">
                      <Wrench className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">Ordens de Serviço</p>
                        <p className="text-sm text-muted-foreground">Serviços em execução</p>
                      </div>
                      {/* MUDANÇA AQUI */}
                      <div className="text-2xl font-bold text-[#EC610D]">{municipality.total_service_orders}</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <p className="text-xs text-muted-foreground">
                      Cadastrado em:
                      {" "}
                      {new Date(municipality.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )
        : (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <Search className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-semibold">Nenhum município encontrado</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tente um termo de busca diferente.</p>
          </div>
        )}
    </>
  );
}
