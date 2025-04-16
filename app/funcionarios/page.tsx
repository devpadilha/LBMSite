import { PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function EmployeesPage() {
  // Sample data - in a real app, this would come from a database
  const employees = [
    {
      id: "FUNC-001",
      name: "João Silva",
      position: "Técnico de Informática",
      department: "TI",
      email: "joao.silva@empresa.com",
      phone: "(11) 98765-4321",
      hireDate: "2020-03-15",
    },
    {
      id: "FUNC-002",
      name: "Maria Santos",
      position: "Engenheira de Redes",
      department: "Infraestrutura",
      email: "maria.santos@empresa.com",
      phone: "(21) 98765-4321",
      hireDate: "2019-06-10",
    },
    {
      id: "FUNC-003",
      name: "Carlos Oliveira",
      position: "Técnico de Manutenção",
      department: "Manutenção",
      email: "carlos.oliveira@empresa.com",
      phone: "(31) 98765-4321",
      hireDate: "2021-01-20",
    },
    {
      id: "FUNC-004",
      name: "Ana Pereira",
      position: "Gerente de Projetos",
      department: "Projetos",
      email: "ana.pereira@empresa.com",
      phone: "(61) 98765-4321",
      hireDate: "2018-09-05",
    },
    {
      id: "FUNC-005",
      name: "Roberto Almeida",
      position: "Técnico de Segurança",
      department: "Segurança",
      email: "roberto.almeida@empresa.com",
      phone: "(71) 98765-4321",
      hireDate: "2022-02-15",
    },
  ]

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Funcionários</CardTitle>
            <CardDescription>Gerencie o quadro de funcionários da empresa</CardDescription>
          </div>
          <Link href="/funcionarios/novo">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Novo Funcionário
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="hidden md:table-cell">Cargo</TableHead>
                  <TableHead className="hidden md:table-cell">Departamento</TableHead>
                  <TableHead className="hidden lg:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Telefone</TableHead>
                  <TableHead className="hidden lg:table-cell">Data de Contratação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.position}</TableCell>
                    <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.email}</TableCell>
                    <TableCell className="hidden lg:table-cell">{employee.phone}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(employee.hireDate).toLocaleDateString("pt-BR")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

