/**
 * Modelo de ordem de serviço
 */
import { Municipality } from './municipality.model';

export interface ServiceOrder {
  id: number;
  number: string;
  municipality: Municipality | { id: number; name: string };
  description: string;
  status: string;
  completionDate: string;
  requestDate?: string;
  requester?: string;
  details?: string;
  contract?: {
    id: number;
    number: string;
  };
  responsibleEmployees?: {
    id: number;
    name: string;
    role: string;
    avatar?: string;
  }[];
}