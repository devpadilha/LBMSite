/**
 * Serviço de Autenticação para Next.js com Supabase
 * * Este arquivo contém Server Actions para lidar com todas as operações de
 * autenticação e perfil do usuário, utilizando o Supabase Auth e
 * a biblioteca @supabase/ssr para gerenciamento de sessão.
 * * REMOVIDO:
 * - Lógica manual de cookies (setCookie, removeCookie, getUserDataFromCookie)
 * - Verificação/Hashing de senhas (import de 'crypto')
 * - Chamadas diretas à tabela 'employees' para fins de autenticação.
 * - A classe 'CookieAuthProvider' e a interface 'AuthProvider' foram removidas
 * em favor de Server Actions exportadas diretamente.
 */

'use server'; // Marca todas as funções neste arquivo como Server Actions

import { createClient } from '@/utils/supabase/server';
import { EmployeeRole } from '@/types/database.types';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Interface para o nosso usuário combinado (Auth + Profile)
export interface AppUser {
  id: string; // Vem de auth.users.id
  email?: string; // Vem de auth.users.email
  name: string | null; // Vem da nossa tabela 'profiles'
  role: EmployeeRole | null; // Vem da nossa tabela 'profiles'
}

/**
 * Realiza o login do usuário utilizando o provedor de autenticação do Supabase.
 * @param formData - Os dados do formulário contendo email e senha.
 * @returns Um objeto com os dados do usuário ou um erro.
 */
export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  // A função signInWithPassword já verifica a senha, o status de confirmação
  // do email e gerencia a sessão (cookies) através do middleware.
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Erro no signIn:', error.message);
    // Retorna uma mensagem de erro genérica por segurança
    return { user: null, error: 'Credenciais inválidas ou usuário não confirmado.' };
  }

  return { user: true, error: null };
}

/**
 * Registra um novo usuário no Supabase Auth.
 * A criação do perfil correspondente na tabela 'profiles' é feita
 * automaticamente por um trigger no banco de dados.
 * @param formData - Os dados do formulário contendo nome, email e senha.
 * @returns Um objeto com sucesso/falha e mensagem de erro.
 */
export async function signUp(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  // A função signUp já verifica se o email existe.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Estes dados serão usados pelo trigger 'handle_new_user'
      // para popular a tabela 'profiles'.
      data: {
        name: name,
        role: EmployeeRole.USUARIO, // Define um papel padrão no cadastro
      },
    },
  });

  if (error) {
    console.error('Erro no signUp:', error.message);
    return { success: false, error: error.message };
  }

  // O 'data.user' pode estar nulo se a confirmação de email estiver habilitada.
  // O sucesso aqui significa que o email de confirmação foi enviado.
  if (!data.user && !data.session) {
     return { success: true, error: null, requiresConfirmation: true };
  }


  return { success: true, error: null, requiresConfirmation: false };
}

/**
 * Realiza o logout do usuário, invalidando a sessão no Supabase.
 * A remoção dos cookies é gerenciada pelo middleware do @supabase/ssr.
 */
export async function signOut() {
  const supabase = await createClient();
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
 * @returns Um objeto indicando sucesso ou falha.
 */
export async function resetPasswordForEmail(email: string) {
  const supabase = await createClient();

  // A URL para a qual o usuário será redirecionado após clicar no link do email.
  // Deve ser uma página da sua aplicação que lida com a atualização da senha.
  const redirectUrl = `${new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')}/auth/callback?next=/update-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: redirectUrl,
  });

  if (error) {
    console.error('Erro ao redefinir senha:', error.message);
    // Não informe ao cliente se o email existe ou não, por segurança.
    // Apenas retorne sucesso para evitar enumeração de usuários.
  }

  // Sempre retorne sucesso na UI para evitar que alguém descubra quais emails estão cadastrados.
  return { success: true, error: null };
}

/**
 * Obtém o usuário atualmente autenticado a partir da sessão segura (cookie)
 * e busca seu perfil correspondente na tabela 'profiles'.
 * @returns O objeto de usuário combinado (AppUser) ou null se não estiver logado.
 */
export async function getCurrentUserWithProfile(): Promise<AppUser | null> {
  const supabase = await createClient();
  
  // 1. Pega o usuário da sessão segura do Supabase Auth.
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    if (authError) console.error('Erro ao buscar usuário do Auth:', authError.message);
    return null;
  }

  // 2. Pega os dados adicionais da nossa tabela 'profiles'.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, role')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error(`Perfil não encontrado para o usuário ${user.id}:`, profileError.message);
    // Retorna os dados básicos do Auth mesmo que o perfil não seja encontrado.
    return {
      id: user.id,
      email: user.email,
      name: 'Usuário', // Valor padrão
      role: null,
    };
  }

  // 3. Combina os dados de Auth e Profile em um único objeto.
  const appUser: AppUser = {
    id: user.id,
    email: user.email,
    name: profile.name,
    role: profile.role as EmployeeRole,
  };

  return appUser;
}