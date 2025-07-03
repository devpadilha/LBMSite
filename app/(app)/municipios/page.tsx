import { Building, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Municipality } from "@/models/municipality.model"

export default function MunicipiosPage() {
  // Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
  const municipios: Municipality[] = [
    { 
      id: 1, 
      name: "Campo Grande", 
      state: "MS", 
      totalBids: 24, 
      totalContracts: 18, 
      totalServiceOrders: 12,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 2, 
      name: "Sidrolândia", 
      state: "MS", 
      totalBids: 14, 
      totalContracts: 10, 
      totalServiceOrders: 8,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 3, 
      name: "Terenos", 
      state: "MS", 
      totalBids: 8, 
      totalContracts: 6, 
      totalServiceOrders: 4,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 4, 
      name: "Jaraguari", 
      state: "MS", 
      totalBids: 6, 
      totalContracts: 5, 
      totalServiceOrders: 3,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 5, 
      name: "Nova Alvorada do Sul", 
      state: "MS", 
      totalBids: 10, 
      totalContracts: 7, 
      totalServiceOrders: 5,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 6, 
      name: "Ribas do Rio Pardo", 
      state: "MS", 
      totalBids: 12, 
      totalContracts: 9, 
      totalServiceOrders: 6,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 7, 
      name: "Rio Brilhante", 
      state: "MS", 
      totalBids: 9, 
      totalContracts: 7, 
      totalServiceOrders: 4,
      lastUpdate: "27/04/2024"
    },
    { 
      id: 8, 
      name: "Rochedo", 
      state: "MS", 
      totalBids: 5, 
      totalContracts: 4, 
      totalServiceOrders: 2,
      lastUpdate: "27/04/2024"
    },
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Municípios</h1>
          <p className="text-muted-foreground">Gerencie os municípios e seus processos</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
          <Link href="/municipios/adicionar">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Município
          </Link>
        </Button>
      </div>

      <div className="flex items-center mb-6 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar município..." className="pl-8" />
        </div>
        <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
          Filtrar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {municipios.map((municipio) => (
          <Link href={`/municipios/${municipio.id}`} key={municipio.id}>
            <Card className="hover:bg-[#EC610D]/5 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#EC610D]" />
                  <CardTitle className="text-xl">{municipio.name}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{municipio.state}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="font-medium">{municipio.totalBids}</p>
                    <p className="text-muted-foreground">Licitações</p>
                  </div>
                  <div>
                    <p className="font-medium">{municipio.totalContracts}</p>
                    <p className="text-muted-foreground">Contratos</p>
                  </div>
                  <div>
                    <p className="font-medium">{municipio.totalServiceOrders}</p>
                    <p className="text-muted-foreground">OS</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <p className="text-xs text-muted-foreground">Última atualização: {municipio.lastUpdate}</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
