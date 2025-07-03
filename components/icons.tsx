import {
    BarChart3,
    Building,
    LayoutDashboard,
    Settings,
    Users,
    type LucideIcon,
  } from "lucide-react";
  
  // Mapeia uma string ao seu componente de ícone correspondente
  export const iconMap: Record<string, LucideIcon> = {
    dashboard: LayoutDashboard,
    municipalities: Building,
    reports: BarChart3,
    employees: Users,
    settings: Settings,
  };