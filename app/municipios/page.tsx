import { Building, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function MunicipiosPage() {
  // Dados de exemplo - em produção, estes viriam de uma API ou banco de dados
  const municipios = [
    { id: 1, nome: "Campo Grande", estado: "MS", totalLicitacoes: 24, totalContratos: 18, totalOS: 12 },
    { id: 2, nome: "Sidrolândia", estado: "MS", totalLicitacoes: 14, totalContratos: 10, totalOS: 8 },
    { id: 3, nome: "Terenos", estado: "MS", totalLicitacoes: 8, totalContratos: 6, totalOS: 4 },
    { id: 4, nome: "Jaraguari", estado: "MS", totalLicitacoes: 6, totalContratos: 5, totalOS: 3 },
    { id: 5, nome: "Nova Alvorada do Sul", estado: "MS", totalLicitacoes: 10, totalContratos: 7, totalOS: 5 },
    { id: 6, nome: "Ribas do Rio Pardo", estado: "MS", totalLicitacoes: 12, totalContratos: 9, totalOS: 6 },
    { id: 7, nome: "Rio Brilhante", estado: "MS", totalLicitacoes: 9, totalContratos: 7, totalOS: 4 },
    { id: 8, nome: "Rochedo", estado: "MS", totalLicitacoes: 5, totalContratos: 4, totalOS: 2 },
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
                  <CardTitle className="text-xl">{municipio.nome}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{municipio.estado}</p>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="font-medium">{municipio.totalLicitacoes}</p>
                    <p className="text-muted-foreground">Licitações</p>
                  </div>
                  <div>
                    <p className="font-medium">{municipio.totalContratos}</p>
                    <p className="text-muted-foreground">Contratos</p>
                  </div>
                  <div>
                    <p className="font-medium">{municipio.totalOS}</p>
                    <p className="text-muted-foreground">OS</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <p className="text-xs text-muted-foreground">Última atualização: 27/04/2024</p>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
