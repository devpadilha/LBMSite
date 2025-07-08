'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { getEnforcer } from '@/lib/casbin'
import { revalidatePath } from 'next/cache'
import { Profile, ProfileWithRole, RolePermissions, ProfileRole } from '@/lib/types'
import { PostgrestError } from '@supabase/supabase-js'

// =================================================================================
// FUNÇÃO DE SEGURANÇA HELPER
// =================================================================================
/**
 * Verifica se o usuário autenticado tem uma permissão específica.
 * Centraliza a lógica de segurança para evitar repetição de código.
 * Lança um erro se a verificação falhar, interrompendo a execução da action.
 * @param resource O recurso que está sendo acessado (ex: 'employees', 'permissions').
 * @param action A ação sendo executada (ex: 'create', 'update', 'delete').
 */
async function checkPermission(resource: string, action: string) {
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


// =================================================================================
// ACTIONS DE LEITURA
// =================================================================================

export async function getEmployeeProfiles(): Promise<(Profile & { email: string })[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Usuário não autenticado.")

  const enforcer = await getEnforcer()
  const canViewEmployees = await enforcer.enforce(user.id, 'employees', 'access')
  if (!canViewEmployees) return [] 
  
  const adminSupabase = createAdminClient()
  const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers()
  if (authError) throw new Error('Falha ao buscar usuários do Auth: ' + authError.message)
  
  const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]))

  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
  if (profilesError) throw new Error('Falha ao buscar perfis: ' + profilesError.message)

  const employeeProfiles = profiles.map(profile => ({
    ...profile,
    email: authUsersMap.get(profile.id)?.email ?? 'Email não encontrado',
  }))

  return employeeProfiles
}

export async function getProfilesAndPermissions(): Promise<{
  profiles: ProfileWithRole[]
  rolePermissions: RolePermissions
}> {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  const enforcer = await getEnforcer()

  const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers()
  if (authError) throw new Error('Falha ao buscar usuários do Auth: ' + authError.message)
  
  const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]))

  const { data: profiles, error: profilesError } = await supabase.from('profiles').select('*')
  if (profilesError) throw new Error('Falha ao buscar perfis: ' + profilesError.message)
  if (!profiles) throw new Error('Nenhum perfil encontrado.')

  const [casbinRolePolicies] = await Promise.all([
    enforcer.getGroupingPolicy(),
  ])

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

// =================================================================================
// ACTIONS DE ESCRITA
// =================================================================================

/**
 * Convida um novo usuário. Apenas usuários com permissão podem executar.
 */
export async function inviteUser(email: string, name: string, role: ProfileRole): Promise<{ error: string | null }> {
  try {
    await checkPermission('employees', 'create');

    const adminSupabase = createAdminClient()
    const redirectTo = "https://lbmsite.vercel.app/finalizar-cadastro"

    const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
      email,
      { data: { name, role }, redirectTo }
    );

    if (error) {
      if (error.message.includes('User already registered')) {
        throw new Error('Este email já está cadastrado no sistema.')
      }
      throw new Error('Ocorreu um erro inesperado ao enviar o convite.');
    }

    const userId = data.user.id;
    
    const { error: casbinError } = await adminSupabase
      .from("casbin")
      .insert({ ptype: "g", rule: [userId, role] });

    if (casbinError) {
      throw new Error(`Usuário convidado, mas falha ao definir permissão: ${casbinError.message}`);
    }

    revalidatePath('/funcionarios');
    return { error: null };
  } catch (e: any) {
    console.error("Falha na Action 'inviteUser':", e.message);
    return { error: e.message };
  }
}

/**
 * Deleta um usuário do sistema (auth e perfil) E remove a regra do Casbin.
 */
export async function deleteUser(userId: string): Promise<{ error: string | null }> {
  try {
    await checkPermission('employees', 'delete');
    
    const adminSupabase = createAdminClient()
    const { error: rpcError } = await adminSupabase.rpc('delete_casbin_g_rule_for_user', {
      user_id_to_delete: userId
    });

    if (rpcError) {
      throw new Error(`Falha ao remover a regra de permissão do usuário: ${rpcError.message}`);
    }
    console.log(`Regra do Casbin para o usuário ${userId} removida com sucesso.`);

    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      throw new Error(`Regra de permissão removida, mas falha ao deletar o usuário: ${deleteAuthError.message}`);
    }

    revalidatePath('/funcionarios');
    return { error: null };
  } catch (e: any) {
    console.error("Falha na Action 'deleteUser':", e.message);
    return { error: e.message };
  }
}

/**
 * Atualiza o papel de um usuário. Apenas usuários com permissão podem executar.
 */
export async function updateUserRole(userId: string, newRole: ProfileRole): Promise<{ error: string | null }> {
    try {
        await checkPermission('permissions', 'update');

        const enforcer = await getEnforcer();
        const supabase = await createClient();

        // Lógica original para atualizar o perfil e o Casbin
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
        if (error) throw new Error('Falha ao atualizar papel no Supabase: ' + error.message);

        await enforcer.deleteRolesForUser(userId);
        await enforcer.addRoleForUser(userId, newRole);
        await enforcer.savePolicy();

        revalidatePath('/admin/permissions');
        return { error: null };
    } catch (e: any) {
        console.error("Falha na Action 'updateUserRole':", e.message);
        return { error: e.message };
    }
}

/**
 * Adiciona ou remove uma permissão de um papel. Apenas usuários com permissão podem executar.
 */
export async function updateRolePermission(role: ProfileRole, permission: string, hasAccess: boolean): Promise<{ error: string | null }> {
    try {
        // ADICIONADO: Verificação de segurança CRÍTICA.
        await checkPermission('permissions', 'update');

        if (role === 'admin') {
          throw new Error("As permissões da role 'admin' não podem ser alteradas por esta interface.");
        }
        
        const enforcer = await getEnforcer();
        const action = 'access';

        // Lógica original para adicionar/remover política
        if (hasAccess) {
            await enforcer.addPolicy(role, permission, action);
        } else {
            await enforcer.removePolicy(role, permission, action);
        }
        await enforcer.savePolicy();

        revalidatePath('/admin/permissions');
        return { error: null };
    } catch (e: any) {
        console.error("Falha na Action 'updateRolePermission':", e.message);
        return { error: e.message };
    }
}