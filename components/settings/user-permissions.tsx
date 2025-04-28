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
      name: "Administrator",
      email: "admin@lbm.com.br",
      role: "Admin",
      status: "Active",
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
      role: "Manager",
      status: "Active",
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
      role: "User",
      status: "Active",
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
      role: "User",
      status: "Inactive",
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
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
      case "Manager":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "User":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "Inactive":
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
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users and their permissions</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account and set permissions.</DialogDescription>
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  <Plus className="mr-2 h-4 w-4" /> Create User
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
                  <p className="font-medium">User</p>
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
