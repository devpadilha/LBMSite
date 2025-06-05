"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
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
import { Edit, Trash2, Loader2, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

import { Employee } from "@/models"
import { EmployeeRole, EmployeeStatus } from "@/types/database.types"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface EmployeesTableProps {
  searchQuery?: string;
  statusFilter?: EmployeeStatus[];
  roleFilter?: EmployeeRole[];
}

export function EmployeesTable({ 
  searchQuery = "", 
  statusFilter = [], 
  roleFilter = [] 
}: EmployeesTableProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select(`
          id,
          name,
          email,
          phone,
          role,
          status,
          permissions,
          avatar_url
        `)
        .order('name', { ascending: true })
      if (error) {
        throw error
      }

      setEmployees(data || [])
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de funcionários.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (employee: Employee) => {
    setEditingEmployee({ ...employee })
  }

  const handleSave = async () => {
    if (!editingEmployee) return
    
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: editingEmployee.name,
          email: editingEmployee.email,
          phone: editingEmployee.phone,
          status: editingEmployee.status,
          avatar_url: editingEmployee.avatar_url
        })
        .eq('id', editingEmployee.id)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Funcionário atualizado com sucesso.",
      })

      fetchEmployees()
      setEditingEmployee(null)
    } catch (error) {
      console.error('Erro ao atualizar funcionário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o funcionário.",
        type: "error",
      })
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

  const handleSelectChange = (field: string, value: string) => {
    if (editingEmployee) {
      setEditingEmployee({
        ...editingEmployee,
        [field]: value,
      })
    }
  }

  const confirmDelete = (id: number) => {
    setEmployeeToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!employeeToDelete) return
    
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeToDelete)

      if (error) throw error

      toast({
        title: "Sucesso",
        description: "Funcionário removido com sucesso.",
      })

      fetchEmployees()
    } catch (error) {
      console.error('Erro ao remover funcionário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível remover o funcionário.",
        type: "error",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEmployeeToDelete(null)
    }
  }
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case EmployeeStatus.ATIVO:
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      case EmployeeStatus.INATIVO:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
      case EmployeeStatus.FERIAS:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case EmployeeStatus.LICENCA:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  // Filtra os funcionários com base nos critérios de busca e filtros
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => {
      // Filtro de busca por texto
      const matchesSearch = searchQuery === "" || 
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (employee.phone && employee.phone.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Filtro por status
      const matchesStatus = statusFilter.length === 0 || statusFilter.includes(employee.status as EmployeeStatus);
      
      // Filtro por função/role
      const matchesRole = roleFilter.length === 0 || roleFilter.includes(employee.role as EmployeeRole);
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [employees, searchQuery, statusFilter, roleFilter]);

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#EC610D]" />
          <span className="ml-2 text-lg">Carregando funcionários...</span>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    Nenhum funcionário encontrado
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center py-4">
                      <AlertCircle className="h-6 w-6 text-muted-foreground mb-2" />
                      <p>Nenhum funcionário corresponde aos critérios de busca</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="hover:bg-[#EC610D]/5">
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar_url || ''} alt={employee.name} />
                        <AvatarFallback className="bg-[#EC610D]/10 text-[#EC610D]">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
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
                                  <Label htmlFor="avatar_url" className="text-right">
                                    Avatar URL
                                  </Label>
                                  <Input
                                    id="avatar_url"
                                    name="avatar_url"
                                    value={editingEmployee.avatar_url || ''}
                                    onChange={handleChange}
                                    className="col-span-3"
                                    placeholder="URL da imagem de perfil"
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="status" className="text-right">
                                    Status
                                  </Label>
                                  <Select 
                                    value={editingEmployee.status} 
                                    onValueChange={(value) => handleSelectChange("status", value)}
                                  >
                                    <SelectTrigger id="status" className="col-span-3">
                                      <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value={EmployeeStatus.ATIVO}>Ativo</SelectItem>
                                      <SelectItem value={EmployeeStatus.INATIVO}>Inativo</SelectItem>
                                      <SelectItem value={EmployeeStatus.FERIAS}>Férias</SelectItem>
                                      <SelectItem value={EmployeeStatus.LICENCA}>Licença</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => confirmDelete(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
