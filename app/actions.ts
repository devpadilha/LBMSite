'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { getEnforcer } from '@/lib/casbin'
import { revalidatePath } from 'next/cache'
import { Profile, ProfileWithRole, RolePermissions, ProfileRole } from '@/lib/types'
import { PostgrestError } from '@supabase/supabase-js'

/**
 * Busca a lista completa de perfis, enriquecida com o email do auth.users.
 * Esta função é para ser usada em tabelas e listas de funcionários.
 * @returns Um array de perfis com email.
 */
export async function getEmployeeProfiles(): Promise<(Profile & { email: string })[]> {
  const supabase = createClient()
  const adminSupabase = createAdminClient()

  // Permissão Casbin: Verifica se o usuário logado pode ler a lista de funcionários.
  const { data: { user } } = await (await supabase).auth.getUser()
  if (!user) throw new Error("Usuário não autenticado.")
  
  const enforcer = await getEnforcer()
  const canViewEmployees = await enforcer.enforce(user.id, 'employees', 'access')
  if (!canViewEmployees) {
    // Se não tiver permissão, retorna uma lista vazia para a UI.
    // O RLS no banco já protegeria, mas isso evita a chamada e melhora a UX.
    return [] 
  }

  // Busca os dados do auth e dos perfis
  const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers()
  if (authError) throw new Error('Falha ao buscar usuários do Auth: ' + authError.message)
  
  const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]))

  const { data: profiles, error: profilesError } = await (await supabase).from('profiles').select('*')
  if (profilesError) throw new Error('Falha ao buscar perfis: ' + profilesError.message)

  // Combina os dados
  const employeeProfiles = profiles.map(profile => ({
    ...profile,
    email: authUsersMap.get(profile.id)?.email ?? 'Email não encontrado',
  }))

  return employeeProfiles
}

/**
 * Atualiza os dados de um perfil de funcionário.
 * @param profileData Os dados do perfil a serem atualizados.
 */
export async function updateEmployeeProfile(profileData: Partial<Profile> & { id: string }): Promise<{ error: PostgrestError | null }> {
  const supabase = createClient()
  const { id, ...updateData } = profileData

  const { error } = await (await supabase)
    .from('profiles')
    .update(updateData)
    .eq('id', id)
  
  if (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { error }
  }

  revalidatePath('/funcionarios') // Use o caminho da sua página de funcionários
  return { error: null }
}

/**
 * Deleta um usuário do sistema (auth.users e o perfil em public.profiles).
 * Esta é uma ação destrutiva e deve ser usada com cuidado.
 * @param userId O ID do usuário a ser deletado.
 */
export async function deleteUser(userId: string): Promise<{ error: Error | null }> {
  const adminSupabase = createAdminClient()

  // A permissão para esta ação é verificada no frontend com Casbin antes de chamar,
  // e a política de RLS no banco de dados também fornece uma camada de proteção.
  const { error } = await adminSupabase.auth.admin.deleteUser(userId)

  if (error) {
    console.error("Erro ao deletar usuário:", error)
    return { error: new Error(error.message) }
  }

  revalidatePath('/funcionarios')
  return { error: null }
}

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
  const adminSupabase = createAdminClient()
  const enforcer = await getEnforcer()

  // 1. Buscar todos os usuários da tabela auth.users usando o Admin Client
  const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers()
  if (authError) throw new Error('Falha ao buscar usuários do Auth: ' + authError.message)
  
  // Criamos um mapa para busca rápida (ID do usuário -> Objeto do usuário)
  const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]))

  // 2. Buscar todos os perfis da tabela public.profiles
  const { data: profiles, error: profilesError } = await (await supabase).from('profiles').select('*')
  if (profilesError) throw new Error('Falha ao buscar perfis: ' + profilesError.message)
  if (!profiles) throw new Error('Nenhum perfil encontrado.')

  // 3. Buscar políticas do Casbin
  const [casbinRolePolicies] = await Promise.all([
    enforcer.getGroupingPolicy(),
  ])

  // 4. COMBINAR TUDO: Mapear os perfis e enriquecê-los com os dados do Auth
  const profilesWithRoles: ProfileWithRole[] = profiles.map((profile) => {
    const authUser = authUsersMap.get(profile.id)
    const rolePolicy = casbinRolePolicies.find((rule) => rule[0] === profile.id)

    return {
      ...profile,
      email: authUser?.email ?? 'Email não encontrado', 
      casbin_role: rolePolicy ? rolePolicy[1] : null,
    }
  })

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

/**
 * Convida um novo usuário para a plataforma por email.
 * @param email O email do novo usuário.
 * @param name O nome do novo usuário, que será usado no email de convite e no perfil.
 * @param role O papel inicial que o usuário terá no sistema.
 * @returns Um objeto indicando sucesso ou erro.
 */
export async function inviteUser(email: string, name: string, role: ProfileRole): Promise<{ error: string | null }> {
  // Apenas o Admin Client pode convidar usuários.
  const adminSupabase = createAdminClient()

  // A função inviteUserByEmail envia um link mágico para o email fornecido.
  const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
    email,
    {
      data: {
        name: name,
        role: role,
      },
    }
  )

  if (error) {
    console.error("Erro ao convidar usuário:", error.message)
    if (error.message.includes('User already registered')) {
      return { error: 'Este email já está cadastrado no sistema.' }
    }
    console.log(error)
    return { error: 'Ocorreu um erro inesperado ao enviar o convite.' }
  }

  revalidatePath('/funcionarios')
  return { error: null }
}