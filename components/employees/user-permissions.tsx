"use client"

import { useState } from "react"
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
import { Lock, Plus, Shield, UserPlus } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  permissions: {
    dashboard: boolean
    municipalities: boolean
    reports: boolean
    employees: boolean
    settings: boolean
  }
}

export function UserPermissions() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Administrador",
      email: "admin@lbm.com.br",
      role: "Admin",
      status: "Ativo",
      permissions: {
        dashboard: true,
        municipalities: true,
        reports: true,
        employees: true,
        settings: true,
      },
    },
    {
      id: 2,
      name: "João Silva",
      email: "joao.silva@lbm.com.br",
      role: "Gerente",
      status: "Ativo",
      permissions: {
        dashboard: true,
        municipalities: true,
        reports: true,
        employees: true,
        settings: false,
      },
    },
    {
      id: 3,
      name: "Maria Oliveira",
      email: "maria.oliveira@lbm.com.br",
      role: "Usuário",
      status: "Ativo",
      permissions: {
        dashboard: true,
        municipalities: true,
        reports: true,
        employees: false,
        settings: false,
      },
    },
    {
      id: 4,
      name: "Pedro Santos",
      email: "pedro.santos@lbm.com.br",
      role: "Usuário",
      status: "Inativo",
      permissions: {
        dashboard: true,
        municipalities: false,
        reports: false,
        employees: false,
        settings: false,
      },
    },
  ])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
      case "Gerente":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "Usuário":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "Inativo":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const handlePermissionChange = (userId: number, permission: keyof User["permissions"], value: boolean) => {
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
                  <Input id="name" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input id="email" type="email" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Função
                  </Label>
                  <Select>
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Selecione a função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="user">Usuário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-[#EC610D] hover:bg-[#EC610D]/90">
                  <Plus className="mr-2 h-4 w-4" /> Criar Usuário
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="pt-6">
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
                    <Badge variant="outline" className={getRoleBadgeColor(user.role)}>
                      {user.role}
                    </Badge>
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
                      disabled={user.role === "Admin"}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.permissions.municipalities}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, "municipalities", !!checked)}
                      disabled={user.role === "Admin"}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.permissions.reports}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, "reports", !!checked)}
                      disabled={user.role === "Admin"}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.permissions.employees}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, "employees", !!checked)}
                      disabled={user.role === "Admin"}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={user.permissions.settings}
                      onCheckedChange={(checked) => handlePermissionChange(user.id, "settings", !!checked)}
                      disabled={user.role === "Admin"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Lock className="mr-2 h-4 w-4" /> Salvar Alterações de Permissões
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Gerenciamento de Funções</CardTitle>
          <CardDescription>Configure funções do sistema e suas permissões padrão</CardDescription>
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
