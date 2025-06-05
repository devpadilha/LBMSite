/**
 * Tipos para o sistema de permissões
 */

// Enum para os tipos de permissões disponíveis no sistema
export enum PermissionType {
  DASHBOARD = 1,
  MUNICIPALITIES = 2,
  REPORTS = 3,
  EMPLOYEES = 4,
  SETTINGS = 5
}

// Classe para representar as permissões de um funcionário
export class EmployeePermissions {
  dashboard: boolean = false;
  municipalities: boolean = false;
  reports: boolean = false;
  employees: boolean = false;
  settings: boolean = false;

  constructor(permissions?: Partial<EmployeePermissions>) {
    if (permissions) {
      Object.assign(this, permissions);
    }
  }

  // Método para verificar se o usuário tem uma permissão específica
  hasPermission(permission: keyof EmployeePermissions): boolean {
    return Boolean(this[permission]);
  }

  // Método para definir uma permissão específica
  setPermission(permission: keyof EmployeePermissions, value: boolean): void {
    Object.defineProperty(this, permission, {
      value: value,
      writable: true,
      enumerable: true
    });
  }

  // Método para obter todas as permissões como um objeto
  toObject(): Record<keyof EmployeePermissions, boolean> {
    return {
      dashboard: this.dashboard,
      municipalities: this.municipalities,
      reports: this.reports,
      employees: this.employees,
      settings: this.settings
    };
  }

  // Método para criar permissões padrão com base no papel do funcionário
  static getDefaultByRole(role: string): EmployeePermissions {
    const permissions = new EmployeePermissions();
    
    // Todos os usuários têm acesso ao dashboard
    permissions.dashboard = true;
    
    // Gerentes e admins têm acesso a municípios e relatórios
    if (role === 'admin' || role === 'manager') {
      permissions.municipalities = true;
      permissions.reports = true;
    }
    
    // Apenas admins têm acesso a funcionários e configurações
    if (role === 'admin') {
      permissions.employees = true;
      permissions.settings = true;
    }
    
    return permissions;
  }
}