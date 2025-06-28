'use server'

import { createClient } from '@/utils/supabase/server'
import { getEnforcer } from '@/lib/casbin'
import { revalidatePath } from 'next/cache'
// DEPOIS: Importamos o tipo 'Database' gerado, que é a nossa única fonte da verdade.
import { Database } from '@/types/database.types'

// DEPOIS: Extraímos os tipos diretamente do 'Database' gerado, garantindo 100% de sincronia.
// Se você mudar a tabela no Supabase e re-gerar os tipos, estes serão atualizados automaticamente.
type Profile = Database['public']['Tables']['profiles']['Row']
type ProfileRole = Database['public']['Enums']['profile_role']

// O tipo ProfileWithRole combina os dados do seu banco (Profile) com o
// papel que o Casbin está gerenciando atualmente para aquele usuário.
export type ProfileWithRole = Profile & { casbin_role: string | null }

// DEPOIS: Tipamos as chaves do Record com o Enum 'ProfileRole' para mais segurança.
export type RolePermissions = Record<ProfileRole, Record<string, boolean>>

/**
 * Busca todos os perfis do banco de dados e combina com as informações de
 * papéis e permissões gerenciadas pelo Casbin.
 * @returns Um objeto contendo a lista de perfis com seus papéis do Casbin e um mapa de permissões por papel.
 */
export async function getProfilesAndPermissions(): Promise<{
  profiles: ProfileWithRole[]
  rolePermissions: RolePermissions
}> {
  const supabase = createClient()
  const enforcer = await getEnforcer()

  // 1. Buscar todos os perfis do Supabase.
  // O 'data' aqui agora é automaticamente inferido como 'Profile[] | null' pelo TypeScript!
  const { data: profiles, error } = await (await supabase).from('profiles').select('*')
  if (error) throw new Error('Falha ao buscar perfis: ' + error.message)
  if (!profiles) throw new Error('Nenhum perfil encontrado.')

  // 2. Buscar todas as políticas de papéis (grouping) e permissões do Casbin.
  const [casbinRolePolicies, casbinPermissionPolicies] = await Promise.all([
    enforcer.getGroupingPolicy(), // Retorna [['user_id_1', 'admin'], ['user_id_2', 'manager']]
    enforcer.getPolicy(), // Retorna [['admin', 'dashboard', 'access']]
  ])

  // 3. Combinar dados do Supabase com papéis do Casbin para a UI.
  const profilesWithRoles: ProfileWithRole[] = profiles.map((profile) => {
    const rolePolicy = casbinRolePolicies.find((rule) => rule[0] === profile.id)
    return {
      ...profile,
      casbin_role: rolePolicy ? rolePolicy[1] : null,
    }
  })

  // 4. Estruturar as permissões por papel para exibir na UI.
  const definedRoles: ProfileRole[] = ['admin', 'manager', 'user']
  const definedPermissions = ['dashboard', 'municipalities', 'reports', 'employees', 'settings']
  
  const rolePermissions = {} as RolePermissions

  for (const role of definedRoles) {
    rolePermissions[role] = {}
    for (const permission of definedPermissions) {
      rolePermissions[role][permission] = await enforcer.enforce(role, permission, 'access')
    }
  }

  return { profiles: profilesWithRoles, rolePermissions }
}

/**
 * Atualiza o papel de um usuário tanto no banco de dados (para RLS) quanto no Casbin (para lógica de aplicação).
 * @param userId O ID do usuário a ser atualizado.
 * @param newRole O novo papel a ser atribuído.
 */
export async function updateUserRole(userId: string, newRole: ProfileRole) {
  const supabase = createClient()
  const enforcer = await getEnforcer()

  // 1. Atualiza a coluna 'role' na tabela 'profiles' do Supabase.
  // A chamada de 'update' é totalmente type-safe.
  const { error } = await (await supabase).from('profiles').update({ role: newRole }).eq('id', userId)
  if (error) throw new Error('Falha ao atualizar papel no Supabase: ' + error.message)

  // 2. Atualiza as políticas de papel no Casbin.
  await enforcer.deleteRolesForUser(userId) // Remove papéis antigos para garantir consistência.
  await enforcer.addRoleForUser(userId, newRole)
  await enforcer.savePolicy() // Salva as alterações no banco de dados.

  // 3. Revalida o cache da página para que a UI reflita a mudança.
  revalidatePath('/admin/permissions') // Use o caminho correto da sua página de gerenciamento.
}

/**
 * Adiciona ou remove uma permissão de um papel específico no Casbin.
 * @param role O papel a ser modificado.
 * @param permission O recurso/permissão (ex: 'dashboard').
 * @param hasAccess Booleano indicando se a permissão deve ser concedida ou revogada.
 */
export async function updateRolePermission(role: ProfileRole, permission: string, hasAccess: boolean) {
  const enforcer = await getEnforcer()
  const action = 'access' // Ação padrão que estamos usando para controlar o acesso.

  if (hasAccess) {
    await enforcer.addPolicy(role, permission, action)
  } else {
    await enforcer.removePolicy(role, permission, action)
  }
  await enforcer.savePolicy()

  revalidatePath('/admin/permissions') // Use o caminho correto da sua página de gerenciamento.
}
