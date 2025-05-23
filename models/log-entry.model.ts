/**
 * Modelo de entrada de log do sistema
 */
export interface LogEntry {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error";
  source: string;
  message: string;
  user: string;
}