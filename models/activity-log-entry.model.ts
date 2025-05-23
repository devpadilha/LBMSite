import { LogEntry } from "./log-entry.model";
import { LucideIcon } from "lucide-react";

/**
 * Modelo de entrada de log de atividade para exibição na UI
 * Estende o modelo base LogEntry com propriedades específicas para a interface
 */
export interface ActivityLogEntry extends Omit<LogEntry, 'id'> {
  id: number;
  type: string;
  icon: LucideIcon;
  description: string;
  time: string;
}

/**
 * Funções utilitárias para transformar LogEntry em ActivityLogEntry
 */
export const activityLogUtils = {
  /**
   * Determina o tipo de atividade com base na fonte do log
   */
  getTypeFromSource: (source: string): string => {
    switch (source) {
      case "auth":
        return "login";
      case "reports":
        return "report";
      case "settings":
        return "settings";
      case "employees":
        return "user";
      case "municipalities":
        return "municipality";
      case "serviceOrders":
        return "serviceOrder";
      default:
        return "other";
    }
  },

  /**
   * Formata o timestamp para exibição amigável
   */
  formatTimestamp: (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // Verifica se é hoje
    if (date.toDateString() === now.toDateString()) {
      return `Hoje, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Verifica se é ontem
    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
    
    // Caso contrário, retorna a data formatada
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
};