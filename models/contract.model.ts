/**
 * Modelo de contrato do sistema
 */
import { Municipality } from './municipality.model';

export interface Contract {
  id: number;
  number: string;
  title: string;
  municipality: Municipality | { id: number; name: string };
  startDate: string;
  endDate: string;
  value: number;
  status: "ativo" | "concluído" | "cancelado" | "em análise";
  description: string;
  parties: {
    contractor: string;
    contracted: string;
  };
  attachments?: string[];
  lastUpdate?: string;
}