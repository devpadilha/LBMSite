export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      bids: {
        Row: {
          approval_date: string | null
          created_at: string
          description: string | null
          edital_number: string | null
          edital_source_url: string | null
          estimated_value: number | null
          id: string
          modality: Database["public"]["Enums"]["bid_modality"] | null
          municipality_id: string
          object: string
          opening_date: string | null
          status: Database["public"]["Enums"]["bid_status"]
          updated_at: string | null
        }
        Insert: {
          approval_date?: string | null
          created_at?: string
          description?: string | null
          edital_number?: string | null
          edital_source_url?: string | null
          estimated_value?: number | null
          id?: string
          modality?: Database["public"]["Enums"]["bid_modality"] | null
          municipality_id: string
          object: string
          opening_date?: string | null
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string | null
        }
        Update: {
          approval_date?: string | null
          created_at?: string
          description?: string | null
          edital_number?: string | null
          edital_source_url?: string | null
          estimated_value?: number | null
          id?: string
          modality?: Database["public"]["Enums"]["bid_modality"] | null
          municipality_id?: string
          object?: string
          opening_date?: string | null
          status?: Database["public"]["Enums"]["bid_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
        ]
      }
      casbin: {
        Row: {
          id: number
          ptype: string | null
          rule: string[] | null
        }
        Insert: {
          id?: number
          ptype?: string | null
          rule?: string[] | null
        }
        Update: {
          id?: number
          ptype?: string | null
          rule?: string[] | null
        }
        Relationships: []
      }
      municipalities: {
        Row: {
          created_at: string
          description: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          mayor: string | null
          name: string
          official_site: string | null
          phone: string | null
          state: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mayor?: string | null
          name: string
          official_site?: string | null
          phone?: string | null
          state: string
        }
        Update: {
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          mayor?: string | null
          name?: string
          official_site?: string | null
          phone?: string | null
          state?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          contract: Database["public"]["Enums"]["profile_contract"] | null
          id: string
          name: string
          role: Database["public"]["Enums"]["profile_role"]
          status: Database["public"]["Enums"]["profile_status"]
        }
        Insert: {
          avatar_url?: string | null
          contract?: Database["public"]["Enums"]["profile_contract"] | null
          id: string
          name: string
          role?: Database["public"]["Enums"]["profile_role"]
          status?: Database["public"]["Enums"]["profile_status"]
        }
        Update: {
          avatar_url?: string | null
          contract?: Database["public"]["Enums"]["profile_contract"] | null
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["profile_role"]
          status?: Database["public"]["Enums"]["profile_status"]
        }
        Relationships: []
      }
      service_order_employees: {
        Row: {
          employee_id: string
          service_order_id: string
        }
        Insert: {
          employee_id: string
          service_order_id: string
        }
        Update: {
          employee_id?: string
          service_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_order_employees_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_employees_service_order_id_fkey"
            columns: ["service_order_id"]
            isOneToOne: false
            referencedRelation: "service_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      service_orders: {
        Row: {
          bid_id: string | null
          completion_date: string | null
          created_at: string
          description: string
          id: string
          municipality_id: string
          number: string | null
          request_date: string
          requester: string
          status: Database["public"]["Enums"]["so_status"]
          udated_at: string | null
        }
        Insert: {
          bid_id?: string | null
          completion_date?: string | null
          created_at?: string
          description: string
          id?: string
          municipality_id: string
          number?: string | null
          request_date: string
          requester: string
          status?: Database["public"]["Enums"]["so_status"]
          udated_at?: string | null
        }
        Update: {
          bid_id?: string | null
          completion_date?: string | null
          created_at?: string
          description?: string
          id?: string
          municipality_id?: string
          number?: string | null
          request_date?: string
          requester?: string
          status?: Database["public"]["Enums"]["so_status"]
          udated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_order_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_order_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_casbin_permission: {
        Args: { user_id_to_check: string; resource: string; action: string }
        Returns: boolean
      }
      delete_casbin_g_rule_for_user: {
        Args: { user_id_to_delete: string }
        Returns: undefined
      }
      get_my_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      bid_modality:
        | "Pregao"
        | "Concorrencia"
        | "Concurso"
        | "Leilao"
        | "Dialogo Competitivo"
      bid_status:
        | "Planejada"
        | "Em andamento"
        | "Concluida"
        | "Suspensa"
        | "Cancelada"
      profile_contract: "CLT" | "PJ" | "Estagio" | "Temporario"
      profile_role: "Administrador" | "Gerente" | "Usuario"
      profile_status: "Ativo" | "Inativo" | "Ferias" | "Licenca" | "Pendente"
      so_status:
        | "Planejada"
        | "Em andamento"
        | "Concluida"
        | "Pausada"
        | "Cancelada"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      bid_modality: [
        "Pregao",
        "Concorrencia",
        "Concurso",
        "Leilao",
        "Dialogo Competitivo",
      ],
      bid_status: [
        "Planejada",
        "Em andamento",
        "Concluida",
        "Suspensa",
        "Cancelada",
      ],
      profile_contract: ["CLT", "PJ", "Estagio", "Temporario"],
      profile_role: ["Administrador", "Gerente", "Usuario"],
      profile_status: ["Ativo", "Inativo", "Ferias", "Licenca", "Pendente"],
      so_status: [
        "Planejada",
        "Em andamento",
        "Concluida",
        "Pausada",
        "Cancelada",
      ],
    },
  },
} as const
