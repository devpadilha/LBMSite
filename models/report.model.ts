/**
 * Modelo de relatório
 */
import { Municipality } from './municipality.model';
import { Bid } from './bid.model';

export type ReportType = 'municipality' | 'bid' | 'performance';

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  municipalityId?: number;
  bidId?: number;
  status?: string;
  type?: string;
}

export interface Report {
  id: number;
  title: string;
  description: string;
  type: ReportType;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  // Conteúdo do relatório
  content?: string;
  // Filtros aplicados
  filters?: ReportFilter;
  // Dados relacionados
  municipalities?: Municipality[] | Array<{ id: number; name: string }>;
  bids?: Bid[] | Array<{ id: number; number: string; object: string }>;
  // Estatísticas
  stats?: {
    totalItems?: number;
    totalValue?: number;
    averageValue?: number;
    [key: string]: any;
  };
  // Configurações de exibição
  displayOptions?: {
    showCharts?: boolean;
    showTables?: boolean;
    chartType?: 'bar' | 'line' | 'pie';
    [key: string]: any;
  };
}

export interface ReportTemplate {
  id: number;
  name: string;
  description: string;
  type: ReportType;
  icon?: string;
  defaultFilters?: ReportFilter;
}