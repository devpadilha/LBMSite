import type { Database } from "@/types/database.types";

// Tipos brutos do banco de dados
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileRole = Database["public"]["Enums"]["profile_role"];
export type ProfileStatus = Database["public"]["Enums"]["profile_status"];

export type BidStatus = Database["public"]["Enums"]["bid_status"];
export type BidModality = Database["public"]["Enums"]["bid_modality"];

export type SOStatus = Database["public"]["Enums"]["so_status"];

// =================================================================================
// USUARIOS
// =================================================================================

export type User = {
  id: string;
  email?: string;
  name: string | null;
  role: ProfileRole | null;
  avatar_url: string | null;
  status: ProfileStatus | null;
};

// Tipos "aumentados" para a UI
export type ProfileWithRole = Profile & {
  email: string;
  casbin_role: string | null;
};

export type RolePermissions = Record<ProfileRole, Record<string, boolean>>;

// =================================================================================
// MUNICIPIOS
// =================================================================================

export type MunicipalityFormData = {
  name: string;
  state: string;
  description?: string;
  mayor?: string;
  phone?: string;
  email?: string;
  official_site?: string;
  latitude?: number;
  longitude?: number;
};

export type MunicipalitiesToList = {
  id: string;
  name: string;
  state: string;
  created_at: string;
  total_bids: number;
  total_service_orders: number;
};

// =================================================================================
// LICITAÇÕES
// =================================================================================

export type BidFormData = {
  municipality_id: string;
  number: string;
  object: string;
  description?: string;
  status: BidStatus;
  modality?: BidModality;
  estimated_value?: number;
  opening_date?: string;
  approval_date?: string;
};

// =================================================================================
// ORDENS DE SERVIÇO
// =================================================================================

export type ServiceOrderFormData = {
  municipality_id: string;
  bid_id?: string;
  employees_ids?: string[];
  number: string;
  description: string;
  status: SOStatus;
  requester?: string;
  request_date?: string;
  completion_date?: string;
};
