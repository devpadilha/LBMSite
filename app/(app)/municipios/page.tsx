import { Plus } from "lucide-react";
import Link from "next/link";

import { getMunicipalitiesWithCounts } from "@/app/actions/municipalityActions";
import { MunicipalitiesList } from "@/components/municipios/municipalities-table";
import { Button } from "@/components/ui/button";

export default async function MunicipiosPage() {
  const municipalitiesWithCounts = await getMunicipalitiesWithCounts();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Municípios</h1>
          <p className="text-muted-foreground">Gerencie os municípios e seus processos</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
          <Link href="/municipios/adicionar">
            <Plus className="mr-2 h-4 w-4" />
            {" "}
            Adicionar Município
          </Link>
        </Button>
      </div>

      <div>
        <MunicipalitiesList initialMunicipalities={municipalitiesWithCounts} />
      </div>

    </div>
  );
}
