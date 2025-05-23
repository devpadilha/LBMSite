/**
 * Modelo de usuário do sistema
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  permissions: {
    dashboard: boolean;
    municipalities: boolean;
    reports: boolean;
    employees: boolean;
    settings: boolean;
  };
}