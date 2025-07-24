"use server";

import { revalidatePath } from "next/cache";

import type { Profile, ProfileRole, ProfileWithRole, RolePermissions } from "@/lib/types";

import { checkPermission } from "@/lib/auth-helpers";
import { getEnforcer } from "@/lib/casbin";
import { createAdminClient, createClient } from "@/utils/supabase/server";

// =================================================================================
// ACTIONS DE LEITURA
// =================================================================================

export async function getEmployeeProfiles(): Promise<(Profile & { email: string })[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user)
      throw new Error("Usuário não autenticado.");

    const enforcer = await getEnforcer();
    const canViewEmployees = await enforcer.enforce(user.id, "employees", "read");
    if (!canViewEmployees)
      return [];

    const adminSupabase = createAdminClient();
    const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers();
    if (authError)
      throw new Error(`Falha ao buscar usuários do Auth: ${authError.message}`);

    const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]));

    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*");
    if (profilesError)
      throw new Error(`Falha ao buscar perfis: ${profilesError.message}`);

    const employeeProfiles = profiles.map(profile => ({
      ...profile,
      email: authUsersMap.get(profile.id)?.email ?? "Email não encontrado",
    }));

    return employeeProfiles;
  }
  catch (e: any) {
    console.error("Falha na Action 'getEmployeeProfiles':", e.message);
    // Retorna um array vazio para não quebrar a UI em caso de erro.
    return [];
  }
}

export async function getProfilesAndPermissions(): Promise<{
  profiles: ProfileWithRole[];
  rolePermissions: RolePermissions;
}> {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const enforcer = await getEnforcer();

    const { data: authUsersData, error: authError } = await adminSupabase.auth.admin.listUsers();
    if (authError)
      throw new Error(`Falha ao buscar usuários do Auth: ${authError.message}`);

    const authUsersMap = new Map(authUsersData.users.map(user => [user.id, user]));

    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*");
    if (profilesError)
      throw new Error(`Falha ao buscar perfis: ${profilesError.message}`);
    if (!profiles)
      throw new Error("Nenhum perfil encontrado.");

    const [casbinRolePolicies] = await Promise.all([
      enforcer.getGroupingPolicy(),
    ]);

    const profilesWithRoles: ProfileWithRole[] = profiles.map((profile) => {
      const authUser = authUsersMap.get(profile.id);
      const rolePolicy = casbinRolePolicies.find(rule => rule[0] === profile.id);

      return {
        ...profile,
        email: authUser?.email ?? "Email não encontrado",
        casbin_role: rolePolicy ? rolePolicy[1] : null,
      };
    });

    const definedRoles: ProfileRole[] = ["Administrador", "Gerente", "Usuario"];
    const definedPermissions = ["dashboard", "municipalities", "reports", "employees", "settings"];
    const rolePermissions = {} as RolePermissions;

    for (const role of definedRoles) {
      rolePermissions[role] = {};
      for (const permission of definedPermissions) {
        rolePermissions[role][permission] = await enforcer.enforce(role, permission, "read");
      }
    }

    return { profiles: profilesWithRoles, rolePermissions };
  }
  catch (e: any) {
    console.error("Falha na Action 'getProfilesAndPermissions':", e.message);
    // Retorna um estado vazio e seguro para a UI.
    return {
      profiles: [],
      rolePermissions: {
        Administrador: { dashboard: false, municipalities: false, reports: false, employees: false, settings: false },
        Gerente: { dashboard: false, municipalities: false, reports: false, employees: false, settings: false },
        Usuario: { dashboard: false, municipalities: false, reports: false, employees: false, settings: false },
      },
    };
  }
}

// =================================================================================
// ACTIONS DE ESCRITA
// =================================================================================

export async function inviteUser(email: string, name: string, role: ProfileRole): Promise<{ error: string | null }> {
  try {
    await checkPermission("employees", "create");

    const adminSupabase = createAdminClient();
    const redirectTo = "https://lbmsite.vercel.app/finalizar-cadastro";

    const { data, error } = await adminSupabase.auth.admin.inviteUserByEmail(
      email,
      { data: { name, role }, redirectTo },
    );

    if (error) {
      console.error("ERRO DETALHADO DO SUPABASE (inviteUserByEmail):", error);

      if (error.message.includes("User already registered")) {
        throw new Error("Este email já está cadastrado no sistema.");
      }
      throw new Error(`Falha no Supabase: ${error.message}`);
    }

    const userId = data.user.id;

    const { error: casbinError } = await adminSupabase
      .from("casbin")
      .insert({ ptype: "g", rule: [userId, role] });

    if (casbinError) {
      throw new Error(`Usuário convidado, mas falha ao definir permissão: ${casbinError.message}`);
    }

    revalidatePath("/funcionarios");
    return { error: null };
  }
  catch (e: any) {
    console.error("Falha na Action 'inviteUser':", e.message);
    return { error: e.message };
  }
}

export async function deleteUser(userId: string): Promise<{ error: string | null }> {
  try {
    await checkPermission("employees", "delete");

    const adminSupabase = createAdminClient();
    const { error: rpcError } = await adminSupabase.rpc("delete_casbin_g_rule_for_user", {
      user_id_to_delete: userId,
    });

    if (rpcError) {
      throw new Error(`Falha ao remover a regra de permissão do usuário: ${rpcError.message}`);
    }

    const { error: deleteAuthError } = await adminSupabase.auth.admin.deleteUser(userId);

    if (deleteAuthError) {
      throw new Error(`Regra de permissão removida, mas falha ao deletar o usuário: ${deleteAuthError.message}`);
    }

    revalidatePath("/funcionarios");
    return { error: null };
  }
  catch (e: any) {
    console.error("Falha na Action 'deleteUser':", e.message);
    return { error: e.message };
  }
}

export async function updateUserRole(userId: string, newRole: ProfileRole): Promise<{ error: string | null }> {
  try {
    await checkPermission("permissions", "update");

    const enforcer = await getEnforcer();
    const supabase = await createClient();

    const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    if (error)
      throw new Error(`Falha ao atualizar papel no Supabase: ${error.message}`);

    await enforcer.deleteRolesForUser(userId);
    await enforcer.addRoleForUser(userId, newRole);
    await enforcer.savePolicy();

    revalidatePath("/admin/permissions");
    return { error: null };
  }
  catch (e: any) {
    console.error("Falha na Action 'updateUserRole':", e.message);
    return { error: e.message };
  }
}

export async function updateRolePermission(role: ProfileRole, permission: string, hasAccess: boolean): Promise<{ error: string | null }> {
  try {
    await checkPermission("permissions", "update");

    if (role === "Administrador") {
      throw new Error("As permissões da role 'admin' não podem ser alteradas por esta interface.");
    }

    const enforcer = await getEnforcer();
    const action = "read";

    if (hasAccess) {
      await enforcer.addPolicy(role, permission, action);
    }
    else {
      await enforcer.removePolicy(role, permission, action);
    }
    await enforcer.savePolicy();

    revalidatePath("/admin/permissions");
    return { error: null };
  }
  catch (e: any) {
    console.error("Falha na Action 'updateRolePermission':", e.message);
    return { error: e.message };
  }
}
