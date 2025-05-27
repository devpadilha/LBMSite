"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Bell, Calendar, Clock, FileText, Key, Lock, Mail, Phone, Shield } from "lucide-react"
import { ProfileActivity } from "@/components/profile/profile-activity"
import { ProfileSecurity } from "@/components/profile/profile-security"
import { ProfileNotifications } from "@/components/profile/profile-notifications"
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload"
import { Employee, User } from "@/models"
import { useState, useEffect } from "react"
import { EmployeeRole, EmployeeStatus } from "@/types/database.types"

export default function ProfilePage() {
  // State to store the employee data
  const [employeeData, setEmployeeData] = useState<Employee>({
    id: 1,
    name: "Administrador",
    email: "admin@lbm.com.br",
    role: EmployeeRole.ADMIN,
    status: EmployeeStatus.ATIVO,
    phone: "(67) 99123-4567",
    department: "Administração",
    position: "Administrador do Sistema",
    permissions: {
      dashboard: true,
      municipalities: true,
      reports: true,
      employees: true,
      settings: true
    }
  });

  // State for statistics
  const [stats, setStats] = useState({
    reportsCreated: 124,
    activeProjects: 8,
    lastLogin: "Hoje, 10:30"
  });

  // You could fetch the employee data from an API here
  useEffect(() => {
    // Example of fetching data
    // async function fetchEmployeeData() {
    //   const response = await fetch('/api/employee/profile');
    //   const data = await response.json();
    //   setEmployeeData(data);
    // }
    // 
    // fetchEmployeeData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
          <Key className="mr-2 h-4 w-4" /> Alterar Senha
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src="/placeholder.svg" alt={employeeData.name} />
                <AvatarFallback className="text-2xl bg-[#EC610D] text-white">
                  {employeeData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <ProfilePhotoUpload />
              <CardTitle className="text-xl mt-4">{employeeData.name}</CardTitle>
              <CardDescription>{employeeData.email}</CardDescription>
              <div className="mt-2">
                <Badge className="bg-[#EC610D] hover:bg-[#EC610D]/90 text-white">{employeeData.role}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#EC610D]" />
                <span>{employeeData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-[#EC610D]" />
                <span>{employeeData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[#EC610D]" />
                <span>{employeeData.position}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-[#EC610D]" />
                <span>Ingressou em Janeiro de 2022</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Relatórios Criados</span>
                </div>
                <span className="font-medium">{stats.reportsCreated}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Projetos Ativos</span>
                </div>
                <span className="font-medium">{stats.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Último Login</span>
                </div>
                <span className="text-sm">{stats.lastLogin}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="bg-muted/60 border">
              <TabsTrigger value="activity" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" />
                Atividade
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
                <Lock className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notificações
              </TabsTrigger>
            </TabsList>
            <TabsContent value="activity" className="space-y-4">
              <ProfileActivity />
            </TabsContent>
            <TabsContent value="security" className="space-y-4">
              <ProfileSecurity />
            </TabsContent>
            <TabsContent value="notifications" className="space-y-4">
              <ProfileNotifications />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
