// Modelo para configurações do sistema

export interface SystemSettings {
  // Configurações Gerais
  general: {
    companyName: string;
    systemEmail: string;
    contactPhone: string;
    address: string;
  };
  
  // Configurações Regionais
  regional: {
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  
  // Recursos do Sistema
  features: {
    reports: boolean;
    municipalities: boolean;
    employees: boolean;
    analytics: boolean;
    api: boolean;
  };
}

// Modelo para configurações de backup
export interface BackupSettings {
  autoBackup: boolean;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  backupTime: string;
  retentionDays: number;
  storageLocation: 'local' | 'cloud' | 'both';
  recentBackups: BackupEntry[];
}

export interface BackupEntry {
  id: string;
  type: string;
  date: string;
  time: string;
  size?: string;
  path?: string;
}

// Modelo para logs do sistema
export interface SystemLogs {
  entries: SystemLogEntry[];
  filters: {
    startDate: string;
    endDate: string;
    level: 'info' | 'warning' | 'error' | 'all';
    source: string;
  };
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  source: string;
  details?: string;
}