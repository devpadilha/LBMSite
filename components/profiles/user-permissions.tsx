"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Loader2 } from "lucide-react"
import { getRoleBadgeColor, getStatusBadgeColor } from "@/utils/colors"
import type { ProfileWithRole, RolePermissions, ProfileRole, ProfileStatus } from "@/lib/types"

import {
  getProfilesAndPermissions,
  updateUserRole,
  updateRolePermission,
} from "@/app/actions"
import { toast } from "sonner"

// Objeto de mapeamento para nomes de permissão amigáveis
const PERMISSIONS_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  municipalities: "Municípios",
  reports: "Relatórios",
  employees: "Funcionários",
  settings: "Configurações",
};


export function UserPermissions() {
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermissions>({} as RolePermissions)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const { profiles, rolePermissions } = await getProfilesAndPermissions()
        setProfiles(profiles)
        setRolePermissions(rolePermissions)
      } catch (error) {
        console.error("Erro ao buscar dados:", error)
        toast.error("Erro ao buscar dados")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleRoleChange = async (userId: string, newRole: ProfileRole) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === userId ? { ...p, casbin_role: newRole, role: newRole } : p))
    )
    try {
      await updateUserRole(userId, newRole)
      toast.success("Papel atualizado com sucesso")
    } catch (error) {
      console.error("Falha ao atualizar papel:", error)
      toast.error("Erro ao atualizar papel")
    }
  }

  const handlePermissionChange = async (role: ProfileRole, permission: string, checked: boolean) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: checked,
      },
    }))
    try {
      await updateRolePermission(role, permission, checked)
    } catch (error) {
      console.error("Falha ao atualizar permissão:", error)
      toast.error("Erro ao atualizar permissão")
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#EC610D]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* CARD 1: GERENCIAMENTO DE USUÁRIOS E SEUS PAPÉIS */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Gerenciamento de Usuários</CardTitle>
          <CardDescription>Atribua papéis aos usuários do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[180px]">Função (Papel)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.name}</TableCell>
                  <TableCell>{profile.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(profile.status)}>
                      {profile.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={profile.casbin_role ?? ""}
                      onValueChange={(newRole) => handleRoleChange(profile.id, newRole as ProfileRole)}
                      disabled={profile.role === 'admin'} // Regra de negócio: não se pode alterar o papel do admin principal
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sem papel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="user">Usuário</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CARD 2: GERENCIAMENTO DE FUNÇÕES E SUAS PERMISSÕES */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Gerenciamento de Funções (RBAC)</CardTitle>
          <CardDescription>Configure as permissões para cada função do sistema.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {(Object.keys(rolePermissions) as ProfileRole[]).map((role) => (
            <div key={role} className="p-4 border rounded-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  <Shield className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <p className="font-medium text-lg capitalize">{role}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(rolePermissions[role]).map(([permission, hasAccess]) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${role}-${permission}`}
                      checked={hasAccess}
                      onCheckedChange={(checked) => handlePermissionChange(role, permission, !!checked)}
                      disabled={role === 'admin'} // Regra de negócio: Admin sempre tem todas as permissões
                    />
                    <label
                      htmlFor={`${role}-${permission}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {PERMISSIONS_MAP[permission] ?? permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
