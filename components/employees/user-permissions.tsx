"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Lock, Loader2, Plus, Shield, UserPlus } from "lucide-react"
import { EmployeeRole, EmployeeStatus } from "@/types/database.types"
import { Employee } from "@/models"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"

export function UserPermissions() {
  const [users, setUsers] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [savingPermissions, setSavingPermissions] = useState(false)
  const [addingUser, setAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: EmployeeRole.USUARIO,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          name,
          email,
          phone,
          role,
          status,
          permissions
        `)
        .order('name')

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        type: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string | EmployeeRole) => {
    switch (role) {
      case EmployeeRole.ADMIN:
        return "bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
      case EmployeeRole.GERENTE:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case EmployeeRole.USUARIO:
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string | EmployeeStatus) => {
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

  const handlePermissionChange = async (userId: number, permission: keyof Employee["permissions"], value: boolean) => {
    try {
      // Atualiza a UI imediatamente para feedback rápido
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              permissions: {
                ...user.permissions,
                [permission]: value,
              },
            }
          }
          return user
        }),
      )
      
      // Encontra o usuário para obter as permissões atualizadas
      const updatedUser = users.find(user => user.id === userId)
      if (!updatedUser) return
      
      // Atualiza no banco de dados
      const { error } = await supabase
        .from('users')
        .update({
          permissions: updatedUser.permissions
        })
        .eq('id', userId)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao atualizar permissão:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a permissão.",
        type: "error",
      })
      // Recarrega os dados em caso de erro para garantir consistência
      fetchUsers()
    }
  }
  
  const handleRoleChange = async (userId: number, role: EmployeeRole) => {
    try {
      // Atualiza a UI imediatamente
      setUsers(
        users.map((user) => {
          if (user.id === userId) {
            return {
              ...user,
              role,
            }
          }
          return user
        }),
      )
      
      // Atualiza no banco de dados
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)

      if (error) throw error
      
      toast({
        title: "Sucesso",
        description: "Função do usuário atualizada com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao atualizar função:', error)
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a função do usuário.",
        type: "error",
      })
      // Recarrega os dados em caso de erro
      fetchUsers()
    }
  }
  
  const saveAllPermissions = async () => {
    try {
      setSavingPermissions(true)
      
      // Atualiza todas as permissões de uma vez
      for (const user of users) {
        const { error } = await supabase
          .from('users')
          .update({
            permissions: user.permissions
          })
          .eq('id', user.id)
          
        if (error) throw error
      }
      
      toast({
        title: "Sucesso",
        description: "Todas as permissões foram salvas com sucesso.",
      })
    } catch (error) {
      console.error('Erro ao salvar permissões:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar as permissões.",
        type: "error",
      })
    } finally {
      setSavingPermissions(false)
    }
  }
  
  const handleAddUser = async () => {
    try {
      setAddingUser(true)
      
      if (!newUser.name || !newUser.email) {
        toast({
          title: "Erro",
          description: "Nome e email são obrigatórios.",
          type: "error",
        })
        return
      }
      
      // Cria permissões padrão baseadas na função
      const defaultPermissions = {
        dashboard: true,
        municipalities: newUser.role !== EmployeeRole.USUARIO,
        reports: newUser.role !== EmployeeRole.USUARIO,
        employees: newUser.role === EmployeeRole.ADMIN,
        settings: newUser.role === EmployeeRole.ADMIN,
      }
      
      // Insere o novo usuário
      const { data, error } = await supabase
        .from('users')
        .insert({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: EmployeeStatus.ATIVO,
          permissions: defaultPermissions
        })
        .select()

      if (error) throw error
      
      toast({
        title: "Sucesso",
        description: "Usuário adicionado com sucesso.",
      })
      
      // Limpa o formulário e recarrega os usuários
      setNewUser({
        name: "",
        email: "",
        role: EmployeeRole.USUARIO,
      })
      fetchUsers()
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o usuário.",
        type: "error",
      })
    } finally {
      setAddingUser(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Gerenciamento de Usuários</CardTitle>
            <CardDescription>Gerencie usuários e suas permissões</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
                <UserPlus className="mr-2 h-4 w-4" /> Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                <DialogDescription>Crie uma nova conta de usuário e defina permissões.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nome
                  </Label>
                  <Input 
                    id="name" 
                    className="col-span-3" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input 
                    id="email" 
                    type="email" 
                    className="col-span-3" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Função
                  </Label>
                  <Select 
                    value={newUser.role} 
                    onValueChange={(value: EmployeeRole) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EmployeeRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={EmployeeRole.GERENTE}>Gerente</SelectItem>
                      <SelectItem value={EmployeeRole.USUARIO}>Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  className="bg-[#EC610D] hover:bg-[#EC610D]/90"
                  onClick={handleAddUser}
                  disabled={addingUser}
                >
                  {addingUser ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Criando...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" /> Criar Usuário
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#EC610D]" />
              <span className="ml-2 text-lg">Carregando usuários...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-lg font-medium">Nenhum usuário encontrado</p>
              <p className="text-sm text-muted-foreground">Adicione usuários para gerenciar suas permissões</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Dashboard</TableHead>
                  <TableHead>Municípios</TableHead>
                  <TableHead>Relatórios</TableHead>
                  <TableHead>Funcionários</TableHead>
                  <TableHead>Configurações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select 
                        value={user.role} 
                        onValueChange={(value: EmployeeRole) => handleRoleChange(user.id, value)}
                        disabled={user.role === EmployeeRole.ADMIN && users.filter(u => u.role === EmployeeRole.ADMIN).length <= 1}
                      >
                        <SelectTrigger className="w-[110px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={EmployeeRole.ADMIN}>Admin</SelectItem>
                          <SelectItem value={EmployeeRole.GERENTE}>Gerente</SelectItem>
                          <SelectItem value={EmployeeRole.USUARIO}>Usuário</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.permissions.dashboard}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, "dashboard", !!checked)}
                        disabled={user.role === EmployeeRole.ADMIN}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.permissions.municipalities}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, "municipalities", !!checked)}
                        disabled={user.role === EmployeeRole.ADMIN}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.permissions.reports}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, "reports", !!checked)}
                        disabled={user.role === EmployeeRole.ADMIN}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.permissions.employees}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, "employees", !!checked)}
                        disabled={user.role === EmployeeRole.ADMIN}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={user.permissions.settings}
                        onCheckedChange={(checked) => handlePermissionChange(user.id, "settings", !!checked)}
                        disabled={user.role === EmployeeRole.ADMIN}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="bg-[#EC610D] hover:bg-[#EC610D]/90"
            onClick={saveAllPermissions}
            disabled={savingPermissions || loading || users.length === 0}
          >
            {savingPermissions ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" /> Salvar Alterações de Permissões
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Informações sobre Funções</CardTitle>
          <CardDescription>Descrição das funções disponíveis no sistema</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-[#EC610D]/20 text-[#EC610D]">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Administrador</p>
                  <p className="text-sm text-muted-foreground">Acesso total ao sistema com todas as permissões</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
              >
                Função do Sistema
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Gerente</p>
                  <p className="text-sm text-muted-foreground">
                    Acesso à maioria dos recursos, exceto configurações do sistema
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
              >
                Função do Sistema
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Usuário</p>
                  <p className="text-sm text-muted-foreground">Acesso básico para visualizar dados e relatórios</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
              >
                Função do Sistema
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
