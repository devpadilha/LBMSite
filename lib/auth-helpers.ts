import { createClient } from '@/utils/supabase/server'
import { getEnforcer } from '@/lib/casbin'

/**
 * Verifica se o usuário autenticado tem uma permissão específica.
 * Centraliza a lógica de segurança para evitar repetição de código.
 * Lança um erro se a verificação falhar, interrompendo a execução da action.
 * @param resource O recurso que está sendo acessado (ex: 'employees', 'permissions').
 * @param action A ação sendo executada (ex: 'create', 'update', 'delete').
 */
export async function checkPermission(resource: string, action: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
  
    if (!user) {
      throw new Error("Acesso negado: Usuário não autenticado.")
    }
  
    const enforcer = await getEnforcer()
    const hasPermission = await enforcer.enforce(user.id, resource, action)
  
    if (!hasPermission) {
      throw new Error(`Acesso negado: Voce nao tem permissao para '${action}' em '${resource}'.`)
    }
    // Se tiver permissão, a função simplesmente termina e a action continua.
    return { user, enforcer } // Retorna o usuário e o enforcer para uso posterior, se necessário.
  }