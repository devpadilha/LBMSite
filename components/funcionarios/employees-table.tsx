"use client"

import { useState, useEffect } from "react"
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
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Importando os tipos e ações corretos
import type { Profile } from "@/lib/types"
import { getEmployeeProfiles, updateEmployeeProfile, deleteUser } from "@/app/actions/employeeActions"

// Definindo o tipo para os dados do funcionário com email
type EmployeeProfile = Profile & { email: string }

export function EmployeesTable() {
  const [employees, setEmployees] = useState<EmployeeProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Estado para controlar qual funcionário está sendo editado no modal
  const [editingEmployee, setEditingEmployee] = useState<EmployeeProfile | null>(null)

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const data = await getEmployeeProfiles()
        setEmployees(data)
        console.log(data)
      } catch (error) {
        console.error("Erro ao buscar funcionários:", error)
        toast({ title: "Erro ao carregar dados", description: (error as Error).message, type: "error" })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Abre o modal de edição com os dados do funcionário selecionado
  const handleEditClick = (employee: EmployeeProfile) => {
    setEditingEmployee({ ...employee })
  }

  // Atualiza o estado do formulário de edição
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingEmployee) {
      setEditingEmployee({
        ...editingEmployee,
        [e.target.name]: e.target.value,
      })
    }
  }

  // Submete as alterações para o servidor
  const handleSaveChanges = async () => {
    if (!editingEmployee) return
    
    setIsSubmitting(true)
    const { error } = await updateEmployeeProfile(editingEmployee)
    setIsSubmitting(false)

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, type: "error" })
    } else {
      toast({ title: "Sucesso!", description: "Dados do funcionário atualizados." })
      // Atualiza a UI localmente para feedback instantâneo
      setEmployees(employees.map((emp) => (emp.id === editingEmployee.id ? editingEmployee : emp)))
      setEditingEmployee(null) // Fecha o modal implicitamente (ou use DialogClose)
    }
  }
  
  // Deleta um usuário
  const handleDeleteUser = async (userId: string) => {
    setIsSubmitting(true)
    const { error } = await deleteUser(userId)
    setIsSubmitting(false)

    if (error) {
      toast({ title: "Erro ao deletar", description: error, type: "error" })
    } else {
      toast({ title: "Sucesso!", description: "Usuário deletado do sistema." })
      // Remove o usuário da UI
      setEmployees(employees.filter((emp) => emp.id !== userId))
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin text-[#EC610D]" /></div>
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => (
            <TableRow key={employee.id} className="hover:bg-[#EC610D]/5">
              <TableCell className="font-medium">{employee.name}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.role}</TableCell>
              <TableCell>{employee.status}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {/* Botão e Modal de Edição */}
                  <Dialog onOpenChange={(open) => !open && setEditingEmployee(null)}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditClick(employee)}
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
                          {/* Adicione aqui os campos que podem ser editados */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" name="name" value={editingEmployee.name ?? ''} onChange={handleFormChange} className="col-span-3" />
                          </div>
                          {/* O email não deve ser editável aqui, pois pertence ao auth.users */}
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" value={editingEmployee.email} disabled className="col-span-3" />
                          </div>
                        </div>
                      )}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={handleSaveChanges} disabled={isSubmitting} className="bg-[#EC610D] hover:bg-[#EC610D]/90">
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar alterações"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Botão e Modal de Exclusão */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogDescription>
                          Você tem certeza que deseja deletar o usuário <strong>{employee.name}</strong>? Esta ação é irreversível e removerá o acesso e todos os dados associados.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                           <Button variant="ghost">Cancelar</Button>
                        </DialogClose>
                        <Button onClick={() => handleDeleteUser(employee.id)} variant="destructive" disabled={isSubmitting}>
                          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sim, deletar usuário"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
