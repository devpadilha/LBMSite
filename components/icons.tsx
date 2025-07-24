import type { LucideIcon } from "lucide-react";

import {
  BarChart3,
  Building,
  LayoutDashboard,
  Settings,
  Users,

} from "lucide-react";

// Mapeia uma string ao seu componente de ícone correspondente
export const iconMap: Record<string, LucideIcon> = {
  dashboard: LayoutDashboard,
  municipalities: Building,
  reports: BarChart3,
  employees: Users,
  settings: Settings,
};
