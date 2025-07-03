/**
 * Serviço de Autenticação para Next.js com Supabase
 * Este arquivo contém Server Actions para lidar com todas as operações de
 * autenticação e perfil do usuário, utilizando o Supabase Auth e
 * a biblioteca @supabase/ssr para gerenciamento de sessão.
 */

'use server';

import { createClient } from '@/utils/supabase/server';
// DEPOIS: Importamos os tipos do nosso hub central
import { User, ProfileRole } from '@/lib/types';

/**
 * Realiza o login do usuário utilizando o provedor de autenticação do Supabase.
 * @param formData - Os dados do formulário contendo email e senha.
 * @returns Um objeto com sucesso ou uma mensagem de erro.
 */
export async function signIn(formData: FormData): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient(); // Não precisa de 'await' aqui

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro no signIn:', error.message);
    return { error: 'Credenciais inválidas ou usuário não confirmado.' };
  }

  return { error: null };
}

/**
 * Registra um novo usuário no Supabase Auth.
 * @param formData - Os dados do formulário contendo nome, email e senha.
 * @returns Um objeto indicando o resultado da operação.
 */
export async function signUp(formData: FormData): Promise<{ success: boolean; error: string | null; requiresConfirmation: boolean }> {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
        role: 'user' as ProfileRole, // Define um papel padrão no cadastro
      },
    },
  });

  if (error) {
    console.error('Erro no signUp:', error.message);
    return { success: false, error: error.message, requiresConfirmation: false };
  }

  const requiresConfirmation = !data.user && !data.session;
  return { success: true, error: null, requiresConfirmation };
}

/**
 * Realiza o logout do usuário, invalidando a sessão no Supabase.
 */
export async function signOut(): Promise<{ error: string | null }> {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro no signOut:', error.message);
    return { error: 'Falha ao fazer logout.' };
  }
  
  return { error: null };
}

/**
 * Envia um email de redefinição de senha para o usuário.
 * @param email - O email do usuário que esqueceu a senha.
 */
export async function sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
  const supabase = createClient();

  // A URL para a qual o usuário será redirecionado.
  // Deve ser a página que criamos para o usuário definir a nova senha.
  const redirectUrl = new URL('/auth/redefinir-senha', process.env.NEXT_PUBLIC_SITE_URL).href;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Erro ao enviar email de redefinição de senha:', error.message);
    // Não informe ao cliente se o email existe ou não, por segurança.
  }

  // Sempre retorne sucesso na UI para evitar enumeração de usuários.
  return { error: null };
}

/**
 * Obtém o usuário atualmente autenticado e seu perfil correspondente.
/**
 * Obtém o usuário atualmente autenticado e seu perfil correspondente.
 * @returns O objeto de usuário combinado (User) ou null se não estiver logado.
 */
export async function getCurrentUserWithProfile(): Promise<User | null> {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role, avatar_url, created_at')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error(`Perfil não encontrado para o usuário ${user.id}:`, profileError.message);
    // Retorna os dados básicos do Auth, pois o perfil pode não ter sido criado ainda.
    return {
      id: user.id,
      email: user.email,
      name: 'Usuário',
      role: null,
      avatar_url: null,
      created_at: user.created_at,
    };
  }
  
  // Combina os dados de Auth e Profile em um único objeto de usuário da aplicação.
  return {
    id: user.id,
    email: user.email,
    name: profile.name,
    role: profile.role,
    avatar_url: profile.avatar_url,
    created_at: profile.created_at,
  };
}
