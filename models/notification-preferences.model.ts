/**
 * Modelo para preferências de notificação do usuário
 */

export interface NotificationPreferences {
  // Notificações por Email
  email: {
    bids: boolean;         // Novas licitações e contratos
    serviceOrders: boolean; // Atualizações de ordens de serviço
    reports: boolean;      // Geração de relatórios
    system: boolean;       // Notificações do sistema
  };
  
  // Notificações no Aplicativo
  app: {
    bids: boolean;         // Novas licitações e contratos
    serviceOrders: boolean; // Atualizações de ordens de serviço
    reports: boolean;      // Geração de relatórios
    system: boolean;       // Notificações do sistema
  };
  
  // Frequência de Notificações
  frequency: 'realtime' | 'hourly' | 'daily';
}