/**
 * Modelo de funcionário do sistema
 */
import { EmployeeRole } from "@/types/database.types";

export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  status: string;
  avatar_url?: string;
  permissions: {
    dashboard: boolean;
    municipalities: boolean;
    reports: boolean;
    employees: boolean;
    settings: boolean;
  };
}