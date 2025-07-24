"use client";

import { Building, CheckCircle, FileText, LogIn, Settings, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import type { ActivityLogEntry } from "@/models";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfileActivity() {
  // State to store activity logs
  const [activities, setActivities] = useState<ActivityLogEntry[]>([
    {
      id: 1,
      type: "login",
      description: "Entrou no sistema",
      time: "Hoje, 10:30",
      icon: LogIn,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "auth",
      message: "Entrou no sistema",
      user: "admin@lbm.com.br",
    },
    {
      id: 2,
      type: "report",
      description: "Gerou relatório mensal para Campo Grande",
      time: "Hoje, 09:45",
      icon: FileText,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "reports",
      message: "Gerou relatório mensal para Campo Grande",
      user: "admin@lbm.com.br",
    },
    {
      id: 3,
      type: "settings",
      description: "Atualizou configurações do sistema",
      time: "Ontem, 16:15",
      icon: Settings,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "settings",
      message: "Atualizou configurações do sistema",
      user: "admin@lbm.com.br",
    },
    {
      id: 4,
      type: "user",
      description: "Adicionou novo funcionário: Maria Silva",
      time: "Ontem, 14:30",
      icon: UserPlus,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "employees",
      message: "Adicionou novo funcionário: Maria Silva",
      user: "admin@lbm.com.br",
    },
    {
      id: 5,
      type: "municipality",
      description: "Adicionou novo município: Bonito",
      time: "25/04/2024, 11:20",
      icon: Building,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "municipalities",
      message: "Adicionou novo município: Bonito",
      user: "admin@lbm.com.br",
    },
    {
      id: 6,
      type: "serviceOrder",
      description: "Aprovou ordem de serviço #OS-042/2024",
      time: "25/04/2024, 10:05",
      icon: CheckCircle,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "serviceOrders",
      message: "Aprovou ordem de serviço #OS-042/2024",
      user: "admin@lbm.com.br",
    },
    {
      id: 7,
      type: "login",
      description: "Entrou no sistema",
      time: "25/04/2024, 08:30",
      icon: LogIn,
      timestamp: new Date().toISOString(),
      level: "info",
      source: "auth",
      message: "Entrou no sistema",
      user: "admin@lbm.com.br",
    },
  ]);

  // You could fetch the activity logs from an API here
  useEffect(() => {
    // Example of fetching data
    // async function fetchActivityLogs() {
    //   const response = await fetch('/api/logs/user');
    //   const data = await response.json();
    //
    //   // Transform LogEntry to ActivityLogEntry
    //   const transformedData: ActivityLogEntry[] = data.map(log => ({
    //     ...log,
    //     type: activityLogUtils.getTypeFromSource(log.source),
    //     icon: getIconFromType(activityLogUtils.getTypeFromSource(log.source)),
    //     description: log.message,
    //     time: activityLogUtils.formatTimestamp(log.timestamp)
    //   }));
    //
    //   setActivities(transformedData);
    // }
    //
    // fetchActivityLogs();
  }, []);

  // Helper function to get icon based on activity type
  const getIconFromType = (type: string) => {
    switch (type) {
      case "login":
        return LogIn;
      case "report":
        return FileText;
      case "settings":
        return Settings;
      case "user":
        return UserPlus;
      case "municipality":
        return Building;
      case "serviceOrder":
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "login":
        return "text-[#EC610D] bg-[#EC610D]/10";
      case "report":
        return "text-amber-500 bg-amber-100 dark:bg-amber-900/20";
      case "settings":
        return "text-purple-500 bg-purple-100 dark:bg-purple-900/20";
      case "user":
        return "text-green-500 bg-green-100 dark:bg-green-900/20";
      case "municipality":
        return "text-[#EC610D] bg-[#EC610D]/10";
      case "serviceOrder":
        return "text-teal-500 bg-teal-100 dark:bg-teal-900/20";
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Atividade Recente</CardTitle>
        <CardDescription>Seu histórico de atividades dos últimos 7 dias</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-[#EC610D]/20" />
          <div className="space-y-6">
            {activities.map(activity => (
              <div key={activity.id} className="relative pl-9">
                <div className={`absolute left-0 p-2 rounded-full ${getIconColor(activity.type)}`}>
                  <activity.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{activity.description}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
