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

import { Employee } from "@/models"
import { EmployeeRole, EmployeeStatus } from "@/types/database.types"

export function UserPermissions() {
  const [employees, setUsers] = useState<Employee[]>([
    {
      id: 1,
      name: "Administrator",
      email: "admin@lbm.com.br",
      phone: "11 99999-9999",
      role: EmployeeRole.ADMIN,
      status: EmployeeStatus.ATIVO,
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
      phone: "11 99999-9999",
      role: EmployeeRole.GERENTE,
      status: EmployeeStatus.ATIVO,
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
      phone: "11 99999-9999",
      role: EmployeeRole.USUARIO,
      status: EmployeeStatus.ATIVO,
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
      phone: "11 99999-9999",
      role: EmployeeRole.USUARIO,
      status: EmployeeStatus.INATIVO,
      permissions: {
        dashboard: true,
        municipalities: false,
        reports: false,
        employees: false,
        settings: false,
      },
    },
  ])

  const getRoleBadgeColor = (role: string | EmployeeRole) => {
    switch (role) {
      case EmployeeRole.ADMIN:
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
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

  const handlePermissionChange = (userId: number, permission: keyof Employee["permissions"], value: boolean) => {
    setUsers(
      employees.map((employee) => {
        if (employee.id === userId) {
          return {
            ...employee,
            permissions: {
              ...employee.permissions,
              [permission]: value,
            },
          }
        }
        return employee
      }),
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Employee Management</CardTitle>
            <CardDescription>Manage employees and their permissions</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>Create a new employee account and set permissions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
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
                    Role
                  </Label>
                  <Select>
                    <SelectTrigger id="role" className="col-span-3">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={EmployeeRole.ADMIN}>Admin</SelectItem>
                      <SelectItem value={EmployeeRole.GERENTE}>Manager</SelectItem>
                      <SelectItem value={EmployeeRole.USUARIO}>Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" /> Create Employee
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Dashboard</TableHead>
                <TableHead>Municipalities</TableHead>
                <TableHead>Reports</TableHead>
                <TableHead>Employees</TableHead>
                <TableHead>Settings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRoleBadgeColor(employee.role)}>
                      {employee.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadgeColor(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.permissions.dashboard}
                      onCheckedChange={(checked) => handlePermissionChange(employee.id, "dashboard", !!checked)}
                      disabled={employee.role === EmployeeRole.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.permissions.municipalities}
                      onCheckedChange={(checked) => handlePermissionChange(employee.id, "municipalities", !!checked)}
                      disabled={employee.role === EmployeeRole.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.permissions.reports}
                      onCheckedChange={(checked) => handlePermissionChange(employee.id, "reports", !!checked)}
                      disabled={employee.role === EmployeeRole.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.permissions.employees}
                      onCheckedChange={(checked) => handlePermissionChange(employee.id, "employees", !!checked)}
                      disabled={employee.role === EmployeeRole.ADMIN}
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={employee.permissions.settings}
                      onCheckedChange={(checked) => handlePermissionChange(employee.id, "settings", !!checked)}
                      disabled={employee.role === EmployeeRole.ADMIN}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <Button>
            <Lock className="mr-2 h-4 w-4" /> Save Permission Changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Configure system roles and their default permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Administrator</p>
                  <p className="text-sm text-muted-foreground">Full system access with all permissions</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
              >
                System Role
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Manager</p>
                  <p className="text-sm text-muted-foreground">Access to most features except system settings</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
              >
                System Role
              </Badge>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-md">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">Employee</p>
                  <p className="text-sm text-muted-foreground">Basic access to view data and reports</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
              >
                System Role
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
