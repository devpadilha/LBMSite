"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Filter, Users, UserCog } from "lucide-react"
import { EmployeesTable } from "@/components/employees/employees-table"
import { UserPermissions } from "@/components/employees/user-permissions"
import Link from "next/link"
import { EmployeeStatus, EmployeeRole } from "@/types/database.types"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus[]>([]);
  const [roleFilter, setRoleFilter] = useState<EmployeeRole[]>([]);

  const handleStatusFilterChange = (status: EmployeeStatus) => {
    setStatusFilter(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };

  const handleRoleFilterChange = (role: EmployeeRole) => {
    setRoleFilter(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

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
              <Input 
                placeholder="Buscar funcionário..." 
                className="pl-8" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
                  <Filter className="mr-2 h-4 w-4" /> Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes(EmployeeStatus.ATIVO)}
                  onCheckedChange={() => handleStatusFilterChange(EmployeeStatus.ATIVO)}
                >
                  Ativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes(EmployeeStatus.INATIVO)}
                  onCheckedChange={() => handleStatusFilterChange(EmployeeStatus.INATIVO)}
                >
                  Inativo
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes(EmployeeStatus.FERIAS)}
                  onCheckedChange={() => handleStatusFilterChange(EmployeeStatus.FERIAS)}
                >
                  Férias
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes(EmployeeStatus.LICENCA)}
                  onCheckedChange={() => handleStatusFilterChange(EmployeeStatus.LICENCA)}
                >
                  Licença
                </DropdownMenuCheckboxItem>
                
                <DropdownMenuLabel className="mt-2">Função</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={roleFilter.includes(EmployeeRole.ADMIN)}
                  onCheckedChange={() => handleRoleFilterChange(EmployeeRole.ADMIN)}
                >
                  Administrador
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={roleFilter.includes(EmployeeRole.GERENTE)}
                  onCheckedChange={() => handleRoleFilterChange(EmployeeRole.GERENTE)}
                >
                  Gerente
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={roleFilter.includes(EmployeeRole.USUARIO)}
                  onCheckedChange={() => handleRoleFilterChange(EmployeeRole.USUARIO)}
                >
                  Usuário
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Lista de Funcionários</CardTitle>
              <CardDescription>Gerencie os funcionários da empresa</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EmployeesTable 
                searchQuery={searchQuery} 
                statusFilter={statusFilter} 
                roleFilter={roleFilter} 
              />
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
