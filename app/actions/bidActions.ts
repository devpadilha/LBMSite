'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { checkPermission } from '@/lib/auth-helpers'
import { BidFormData } from '@/lib/types';

// =================================================================================
// ACTIONS DE LEITURA
// =================================================================================

export async function getBidById(bidId: string) {
  try {
    await checkPermission('bids', 'read');

    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('bids')
      .select(`
        *,
        municipalities ( name, state ),
        service_orders ( * ) 
      `)
      .eq('id', bidId)
      .single();

    if (error) {
      // Se houver um erro na busca (ex: licitação não existe), nós o registramos.
      console.error("Erro ao buscar licitação no Supabase:", error.message);
      return null;
    }
    return data;

  } catch (error: any) {
    // Captura tanto os erros de permissão do 'checkPermission' quanto outros erros inesperados.
    console.error("Falha na action 'getBidById':", error.message);
    // Você pode decidir retornar null ou relançar o erro dependendo da sua estratégia de UI.
    return null;
  }
}

// =================================================================================
// ACTIONS DE ESCRITA
// =================================================================================

export async function createBid(formData: BidFormData) {
    try {
      // 1. Segurança: Verifica se o usuário tem permissão para criar
      await checkPermission('bids', 'create');
  
      const supabase = createClient();
  
      // 2. Insere os dados no banco
      const { error } = await supabase.from('bids').insert({
        ...formData,
      });
  
      if (error) {
        throw new Error(`Erro do Supabase: ${error.message}`);
      }
  
      // 3. Revalida o cache da página do município para mostrar a nova licitação
      revalidatePath(`/municipios/${formData.municipality_id}`);
  
      return { error: null };
    } catch (e: any) {
      // Retorna a mensagem de erro para o Toast no frontend
      return { error: e.message };
    }
  }