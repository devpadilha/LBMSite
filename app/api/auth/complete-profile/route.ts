import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { password, access_token } = await request.json();
  const cookieStore = cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
        async set(name: string, value: string, options) {
          (await cookieStore).set({ name, value, ...options });
        },
        async remove(name: string, options) {
          (await cookieStore).set({ name, value: '', ...options });
        },
      },
    }
  );
  
  const { data: { session } } = await supabase.auth.setSession({
    access_token,
    refresh_token: '', 
  });

  if (!session?.user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
  }

  const user = session.user;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
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
    return NextResponse.json({ error: `Erro ao atualizar perfil: ${updateProfileError.message}` }, { status: 500 });
  }

  return NextResponse.json({ message: 'Cadastro finalizado com sucesso! Você já pode fazer o login.' });
}