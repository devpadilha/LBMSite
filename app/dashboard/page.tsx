"use client"

import { useState } from "react"
import { BarChart3, Calendar, ClipboardList, FolderOpen, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectChart } from "@/components/charts/project-chart"
import { EmployeeDistributionChart } from "@/components/charts/employee-distribution-chart"
import { ActivityTimeline } from "@/components/activity-timeline"
import { ProjectsTable } from "@/components/projects-table"

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState("month")

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral dos projetos e atividades</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Tabs value={timeframe} onValueChange={setTimeframe} className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mês</TabsTrigger>
              <TabsTrigger value="year">Ano</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ordens</CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <ClipboardList className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500 font-medium">
                +5.2%
                <span className="text-muted-foreground font-normal ml-1">em relação ao mês anterior</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projetos Ativos</CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <FolderOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500 font-medium">
                +2
                <span className="text-muted-foreground font-normal ml-1">novos projetos este mês</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500 font-medium">
                +2
                <span className="text-muted-foreground font-normal ml-1">novos este mês</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Municípios Atendidos</CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <div className="flex items-center pt-1">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <p className="text-xs text-green-500 font-medium">
                +3
                <span className="text-muted-foreground font-normal ml-1">em relação ao trimestre anterior</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1 card-hover-effect">
          <CardHeader>
            <CardTitle>Progresso dos Projetos</CardTitle>
            <CardDescription>Visão geral do andamento dos projetos ativos</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ProjectChart />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2 lg:col-span-1 card-hover-effect">
          <CardHeader>
            <CardTitle>Distribuição de Funcionários</CardTitle>
            <CardDescription>Alocação de recursos humanos por projeto</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <EmployeeDistributionChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mt-6">
        <Card className="col-span-1 md:col-span-2 card-hover-effect">
          <CardHeader>
            <CardTitle>Projetos com Prazo Próximo</CardTitle>
            <CardDescription>Projetos que precisam de atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <ProjectsTable />
          </CardContent>
          <CardFooter>
            <Link href="/projetos" className="text-sm text-primary hover:underline">
              Ver todos os projetos
            </Link>
          </CardFooter>
        </Card>

        <Card className="col-span-1 card-hover-effect">
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Últimas atualizações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityTimeline />
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              Ver calendário completo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

