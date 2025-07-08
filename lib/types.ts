import { Database } from '@/types/database.types'

// Tipos brutos do banco de dados (seu código aqui está perfeito)
export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileRole = Database['public']['Enums']['profile_role']
export type ProfileStatus = Database['public']['Enums']['profile_status']

export interface User {
  id: string;
  email?: string;
  name: string | null;
  role: ProfileRole | null;
  avatar_url: string | null;
  status: ProfileStatus | null;
}

// Tipos "aumentados" para a UI
export type ProfileWithRole = Profile & {
  email: string;
  casbin_role: string | null;
}

export type RolePermissions = Record<ProfileRole, Record<string, boolean>>