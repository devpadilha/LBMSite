"use server";

import { revalidatePath } from "next/cache";

import type { MunicipalitiesToList, MunicipalityFormData } from "@/lib/types";

import { checkPermission } from "@/lib/auth-helpers";
import { createAdminClient } from "@/utils/supabase/server";

// =================================================================================
// ACTIONS DE LEITURA
// =================================================================================

export async function getMunicipalities(): Promise<MunicipalitiesToList[]> {
  try {
    await checkPermission("municipalities", "read");

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("municipalities")
      .select("id, name, state, created_at")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Erro do Supabase: ${error.message}`);
    }

    return data || [];
  }
  catch (e: any) {
    console.error("Falha ao buscar municípios:", e.message);
    return [];
  }
}

export async function getMunicipalitiesWithCounts(): Promise<MunicipalitiesToList[]> {
  const supabase = createAdminClient();

  // Esta é a query chave. Usamos (count) para contar os registros relacionados.
  const { data, error } = await supabase
    .from('municipalities')
    .select(`
      id,
      name,
      state,
      created_at,
      bids ( count ),
      service_orders ( count )
    `);

  if (error) {
    console.error("Erro ao buscar municípios com contagens:", error);
    return [];
  }

  // O resultado do Supabase é um pouco aninhado, ex: { bids: [{ count: 5 }] }
  // Nós vamos "achatar" os dados para o formato que nosso componente espera.
  const formattedData = data.map(municipality => {
    return {
      id: municipality.id,
      name: municipality.name,
      state: municipality.state,
      created_at: municipality.created_at,
      total_bids: municipality.bids[0]?.count ?? 0,
      total_service_orders: municipality.service_orders[0]?.count ?? 0,
    };
  });

  return formattedData;
}

export async function getMunicipalityDetailsById(municipalityId: string) {
  try {
    await checkPermission("municipalities", "read");
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("municipalities")
      .select(`
        *,
        bids:bids (*),
        service_orders:service_orders (*),
        bids_count:bids(count),
        service_orders_count:service_orders(count)
      `)
      .eq("id", municipalityId);

    if (error) {
      throw new Error(`Erro na query do Supabase: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.error(`Município com ID ${municipalityId} não foi encontrado no banco de dados.`);
      return null;
    }

    // Retorna o primeiro (e único) resultado
    return data[0];
  }
  catch (error: any) {
    console.error("Falha na action 'getMunicipalityDetailsById':", error.message);
    return null;
  }
}

// =================================================================================
// ACTIONS DE ESCRITA
// =================================================================================

export async function createMunicipality(formData: MunicipalityFormData): Promise<{ error: string | null }> {
  try {
    await checkPermission("municipalities", "create");

    const supabase = createAdminClient();

    const { error } = await supabase.from("municipalities").insert({
      ...formData,
    });

    if (error) {
      throw new Error(`Erro do Supabase: ${error.message}`);
    }

    revalidatePath("/municipios");

    return { error: null };
  }
  catch (e: any) {
    // Retorna a mensagem de erro do checkAdminRole ou do Supabase para o Toast no frontend.
    return { error: e.message };
  }
}
