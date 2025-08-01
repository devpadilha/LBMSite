// Em app/municipios/[id]/page.tsx

import { getMunicipalityDetails } from "@/app/actions/municipalityActions";
import { BidsList } from "@/components/municipios/bids-list";
import { MunicipalityInfoPanel } from "@/components/municipios/municipality-info-panel";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, Plus } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function MunicipioPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const municipality = await getMunicipalityDetails(id);

  if (!municipality) {
    notFound();
  }

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/"><Home className="h-4 w-4 mr-1" />Início</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href={`/municipios/${municipality.id}`}>{municipality.name}</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da Esquerda: Painel de Informações */}
        <div className="lg:col-span-1">
          <MunicipalityInfoPanel municipality={municipality} />
        </div>

        {/* Coluna da Direita: Conteúdo Principal */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Licitações</h1>
              <p className="text-muted-foreground">
                Processos licitatórios registrados para {municipality.name}.
              </p>
            </div>
            <Button asChild className="bg-[#EC610D] hover:bg-[#EC610D]/90">
              <Link href={`/municipios/${municipality.id}/licitacoes/adicionar`}>
                <Plus className="mr-2 h-4 w-4" />
                Nova Licitação
              </Link>
            </Button>
          </div>

          <BidsList initialBids={municipality.bids || []} municipalityId={municipality.id} />
        </div>
      </div>
    </div>
  );
}