/**
 * Modelo de usuário do sistema
 */
import { EmployeeRole } from "@/types/database.types";

export interface User {
  id: number;
  name: string;
  email: string;
  role: EmployeeRole;
  status: string;
  permissions: {
    dashboard: boolean;
    municipalities: boolean;
    reports: boolean;
    employees: boolean;
    settings: boolean;
  };
}