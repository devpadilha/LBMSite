/**
 * Modelo de licitação do sistema
 */
import { Municipality } from './municipality.model';
import { Contract } from './contract.model';
import { ServiceOrder } from './service-order.model';

export interface Bid {
  id: number;
  number: string;
  object: string;
  status: string;
  date: string;
  description: string;
  modalidade: string;
  estimatedValue: string;
  openingDate: string;
  approvalDate: string;
  municipality: Municipality | { id: number; name: string };
  contract?: Contract | { id: number; number: string };
  serviceOrders?: ServiceOrder[] | Array<{ id: number; number: string; description: string; status: string }>;
  lastUpdate?: string;
}