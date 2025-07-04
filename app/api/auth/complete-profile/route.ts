// app/api/auth/complete-profile/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { password, access_token } = await request.json();

  if (!password || !access_token) {
    return NextResponse.json({ error: 'Senha e token de acesso são obrigatórios.' }, { status: 400 });
  }
  
  const cookieStore = cookies();
  
  // Cliente temporário para validar o token e obter o usuário
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options) {
          (await cookieStore).set({ name, value, ...options })
        },
        async remove(name: string, options) {
          (await cookieStore).set({ name, value: '', ...options })
        },
      },
    }
  );
  
  // Define a sessão usando o token recebido para validar o usuário
  const { data: { session }, error: sessionError } = await supabase.auth.setSession({
    access_token,
    refresh_token: '', 
  });

  if (sessionError || !session?.user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
  }

  const user = session.user;

  // Cliente ADMIN para realizar operações privilegiadas
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // ESSA CHAVE É ESSENCIAL
  );

  // 1. Atualiza a senha do usuário
  const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
    user.id,
    { password: password }
  );

  if (updateUserError) {
    return NextResponse.json({ error: `Erro ao atualizar senha: ${updateUserError.message}` }, { status: 500 });
  }

  // 2. Atualiza o status na sua tabela 'profiles' para 'inactive'
  const { error: updateProfileError } = await supabaseAdmin
    .from('profiles')
    .update({ status: 'inactive' })
    .eq('id', user.id);

  if (updateProfileError) {
    // Mesmo que o perfil não atualize, a senha foi trocada.
    // O ideal seria logar esse erro para análise.
    console.error(`Falha ao atualizar perfil para inativo para o usuário ${user.id}:`, updateProfileError.message);
  }

  return NextResponse.json({ message: 'Cadastro finalizado com sucesso!' });
}