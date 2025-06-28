import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Users, UserCog } from "lucide-react"
import { EmployeesTable } from "@/components/profiles/employees-table"
import { UserPermissions } from "@/components/profiles/user-permissions"
import Link from "next/link"

export default function EmployeesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Funcionários</h1>
          <p className="text-muted-foreground">Gerenciamento de funcionários da LBM Engenharia</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
          <Link href="/employees/adicionar">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Funcionário
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="bg-muted/60 border">
          <TabsTrigger value="employees" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            <Users className="h-4 w-4 mr-2" />
            Lista de Funcionários
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
            <UserCog className="h-4 w-4 mr-2" />
            Permissões de Usuários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="employees">
          <div className="flex items-center mb-6 gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar funcionário..." className="pl-8" />
            </div>
            <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
              <Filter className="mr-2 h-4 w-4" /> Filtrar
            </Button>
          </div>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Lista de Funcionários</CardTitle>
              <CardDescription>Gerencie os funcionários da empresa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EmployeesTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <UserPermissions />
        </TabsContent>
      </Tabs>
    </div>
  )
}
