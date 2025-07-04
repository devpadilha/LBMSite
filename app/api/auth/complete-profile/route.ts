// app/api/auth/complete-profile/route.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: 'Senha é obrigatória.' }, { status: 400 });
  }
  
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
      },
    }
  );
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: 'Sessão inválida ou expirada. Não foi possível encontrar o usuário.' }, { status: 401 });
  }

  // Cliente ADMIN para realizar operações privilegiadas
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
    console.error(`Falha ao atualizar perfil para inativo para o usuário ${user.id}:`, updateProfileError.message);
  }

  return NextResponse.json({ message: 'Cadastro finalizado com sucesso!' });
}