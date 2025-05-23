"use client"

import type React from "react"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2 } from "lucide-react"

import { Employee } from "@/models"

export function EmployeesTable() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "João Silva",
      email: "joao.silva@lbm.com.br",
      phone: "(67) 99123-4567",
      department: "Engenharia",
      position: "Engenheiro Civil",
    },
    {
      id: 2,
      name: "Maria Oliveira",
      email: "maria.oliveira@lbm.com.br",
      phone: "(67) 99234-5678",
      department: "Administração",
      position: "Gerente de Projetos",
    },
    {
      id: 3,
      name: "Pedro Santos",
      email: "pedro.santos@lbm.com.br",
      phone: "(67) 99345-6789",
      department: "Engenharia",
      position: "Engenheiro Ambiental",
    },
    {
      id: 4,
      name: "Ana Costa",
      email: "ana.costa@lbm.com.br",
      phone: "(67) 99456-7890",
      department: "Financeiro",
      position: "Analista Financeiro",
    },
    {
      id: 5,
      name: "Carlos Ferreira",
      email: "carlos.ferreira@lbm.com.br",
      phone: "(67) 99567-8901",
      department: "TI",
      position: "Analista de Sistemas",
    },
  ])

  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)

  const handleEdit = (employee: Employee) => {
    setEditingEmployee({ ...employee })
  }

  const handleSave = () => {
    if (editingEmployee) {
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp)))
      setEditingEmployee(null)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingEmployee) {
      setEditingEmployee({
        ...editingEmployee,
        [e.target.name]: e.target.value,
      })
    }
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Departamento</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-[#EC610D]/5">
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.phone}</TableCell>
              <TableCell>{employee.department}</TableCell>
              <TableCell>{employee.position}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(employee)}
                        className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Funcionário</DialogTitle>
                        <DialogDescription>Faça as alterações necessárias nos dados do funcionário.</DialogDescription>
                      </DialogHeader>
                      {editingEmployee && (
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                              Nome
                            </Label>
                            <Input
                              id="name"
                              name="name"
                              value={editingEmployee.name}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="email"
                              name="email"
                              value={editingEmployee.email}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">
                              Telefone
                            </Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={editingEmployee.phone}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="department" className="text-right">
                              Departamento
                            </Label>
                            <Input
                              id="department"
                              name="department"
                              value={editingEmployee.department}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="position" className="text-right">
                              Cargo
                            </Label>
                            <Input
                              id="position"
                              name="position"
                              value={editingEmployee.position}
                              onChange={handleChange}
                              className="col-span-3"
                            />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <Button type="submit" onClick={handleSave} className="bg-[#EC610D] hover:bg-[#EC610D]/90">
                          Salvar alterações
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
