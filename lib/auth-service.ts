/**
 * Serviço de autenticação independente de provedor de banco de dados
 * Implementa uma camada de abstração para operações de autenticação
 */

import { supabase } from "./supabase";
import { setCookie, removeCookie, getUserDataFromCookie } from "./cookie-utils";

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Interface para o provedor de autenticação
export interface AuthProvider {
  signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }>;
  signUp(name: string, email: string, password: string): Promise<{ success: boolean; error: string | null }>;
  signOut(): Promise<{ error: string | null }>;
  resetPassword(email: string, redirectUrl?: string): Promise<{ success: boolean; error: string | null }>;
  getCurrentSession(): Promise<{ user: User | null; error: string | null }>;
  getUserProfile(userId: string): Promise<{ profile: User | null; error: string | null }>;
}

// Implementação do provedor de autenticação SEM usar Supabase Auth
class CookieAuthProvider implements AuthProvider {
  async signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    try {
      // Buscar usuário pelo email
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, email, role, password_hash")
        .eq("email", email)
        .single()

      if (error) {
        return { user: null, error: error.message }
      }

      if (!data) {
        return { user: null, error: "Usuário não encontrado" }
      }

      // Verificar senha
      const { verifyPassword } = await import("./crypto")
      const passwordOk = await verifyPassword(password, data.password_hash)

      if (!passwordOk) {
        return { user: null, error: "Credenciais inválidas" }
      }

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }

      return { user, error: null }
    } catch (err: any) {
      console.error("Erro ao fazer login:", err)
      return { user: null, error: "Erro interno ao processar login" }
    }
  }

  async signUp(name: string, email: string, password: string): Promise<{ success: boolean; error: string | null }> {
    try {
      // Verificar se já existe usuário com o email
      const { data: existing } = await supabase
        .from("employees")
        .select("id")
        .eq("email", email)
        .maybeSingle()

      if (existing) {
        return { success: false, error: "Email já cadastrado" }
      }

      const { hashPassword } = await import("./crypto")
      const password_hash = await hashPassword(password)

      const { error } = await supabase.from("employees").insert({ name, email, password_hash })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, error: null }
    } catch (err: any) {
      console.error("Erro ao registrar:", err)
      return { success: false, error: "Erro interno ao processar registro" }
    }
  }

  async signOut(): Promise<{ error: string | null }> {
    try {
      // Apenas sucesso, remoção do cookie será feita externamente
      return { error: null }
    } catch (err: any) {
      console.error("Erro ao fazer logout:", err)
      return { error: "Erro interno ao processar logout" }
    }
  }

  async resetPassword(email: string, redirectUrl?: string): Promise<{ success: boolean; error: string | null }> {
    try {
      const { data, error: fetchError } = await supabase
        .from("employees")
        .select("id")
        .eq("email", email)
        .single()

      if (fetchError) {
        return { success: false, error: fetchError.message }
      }

      if (!data) {
        return { success: false, error: "Usuário não encontrado" }
      }

      // Para simplificação, gerar uma nova senha temporária e enviar link seria feito aqui.
      // No momento, apenas indicar sucesso.
      console.warn("resetPassword chamado – implemente lógica de email se necessário")
      return { success: true, error: null }
    } catch (err: any) {
      console.error("Erro ao redefinir senha:", err)
      return { success: false, error: "Erro interno ao processar solicitação" }
    }
  }

  async getCurrentSession(): Promise<{ user: User | null; error: string | null }> {
    try {
      const userData = getUserDataFromCookie()
      return { user: userData as User | null, error: null }
    } catch (err: any) {
      console.error("Erro ao obter sessão:", err)
      return { user: null, error: "Erro interno ao verificar sessão" }
    }
  }

  async getUserProfile(userId: string): Promise<{ profile: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("employees")
        .select("id, name, email, role")
        .eq("id", userId)
        .single()

      if (error) {
        return { profile: null, error: error.message }
      }

      if (!data) {
        return { profile: null, error: "Perfil não encontrado" }
      }

      const profile: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }

      return { profile, error: null }
    } catch (err: any) {
      console.error("Erro ao buscar perfil:", err)
      return { profile: null, error: "Erro interno ao buscar perfil" }
    }
  }
}

// Exportar uma instância do provedor de autenticação
export const authService = new CookieAuthProvider()

// Funções auxiliares independentes de provedor
export async function login(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
  const { user, error } = await authService.signIn(email, password);
  
  if (user) {
    // Salvar dados do usuário em cookie (não mais em localStorage)
    setCookie("user", JSON.stringify(user), { maxAge: 2592000 }); // 30 dias
  }
  
  return { user, error };
}

export async function logout(): Promise<void> {
  await authService.signOut();
  
  // Remover cookie do usuário
  removeCookie("user");
  
  // Redirecionar para a página de login
  window.location.href = "/login";
}

export async function register(name: string, email: string, password: string): Promise<{ success: boolean; error: string | null }> {
  return await authService.signUp(name, email, password);
}

export async function resetPassword(email: string, redirectUrl?: string): Promise<{ success: boolean; error: string | null }> {
  return await authService.resetPassword(email, redirectUrl);
}

export async function getCurrentUser(): Promise<User | null> {
  const { user } = await authService.getCurrentSession();
  return user;
}