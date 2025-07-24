/**
 * Serviço de Autenticação para Next.js com Supabase
 * Este arquivo contém Server Actions para lidar com todas as operações de
 * autenticação e perfil do usuário, utilizando o Supabase Auth e
 * a biblioteca @supabase/ssr para gerenciamento de sessão.
 */

"use server";

import type { User } from "@/lib/types";

import { createClient } from "@/utils/supabase/server";

export async function signIn(formData: FormData): Promise<{ error: string | null }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Erro no signIn:", error.message);
    return { error: "Credenciais inválidas ou usuário não confirmado." };
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ status: "Ativo" })
      .eq("id", data.user.id);

    if (profileError) {
      console.error(`Falha ao atualizar status para 'active' para o usuário ${data.user.id}:`, profileError.message);
    }
  }

  return { error: null };
}

export async function signOut(): Promise<{ error: string | null }> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ status: "Inativo" }) // Define o status como 'inactive'
        .eq("id", user.id);

      if (profileError) {
        console.error(`Falha ao atualizar status para 'inactive' para o usuário ${user.id}:`, profileError.message);
      }
    }

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      throw new Error(signOutError.message);
    }

    return { error: null };
  }
  catch (e: any) {
    console.error("Erro no signOut:", e.message);
    return { error: "Falha ao fazer logout." };
  }
}

export async function sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
  const supabase = createClient();
  const redirectUrl = new URL("/auth/redefinir-senha", process.env.NEXT_PUBLIC_SITE_URL).href;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error("Erro ao enviar email de redefinição de senha:", error.message);
  }

  return { error: null };
}

export async function getCurrentUserWithProfile(): Promise<User | null> {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, role, avatar_url, status")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error(`Perfil não encontrado para o usuário ${user.id}:`, profileError.message);
    return {
      id: user.id,
      email: user.email,
      name: "Usuário",
      role: null,
      avatar_url: null,
      status: null, // Status nulo se o perfil não for encontrado.
    };
  }

  return {
    id: user.id,
    email: user.email,
    name: profile.name,
    role: profile.role,
    avatar_url: profile.avatar_url,
    status: profile.status, // Retornando o status do perfil
  };
}
