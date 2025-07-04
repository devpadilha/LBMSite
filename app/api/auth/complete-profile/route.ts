import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// A função DEVE se chamar POST em maiúsculas.
export async function POST(request: Request) {
  try {
    const { password, access_token } = await request.json();

    if (!password || !access_token) {
      return NextResponse.json({ error: 'Senha e token de acesso são obrigatórios.' }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    
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
    
    const { data: { session }, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token: '', 
    });

    if (sessionError || !session?.user) {
      return NextResponse.json({ error: 'Sessão inválida ou expirada.' }, { status: 401 });
    }

    const user = session.user;

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { password: password }
    );

    if (updateUserError) {
      return NextResponse.json({ error: `Erro ao atualizar senha: ${updateUserError.message}` }, { status: 500 });
    }

    const { error: updateProfileError } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'inactive' })
      .eq('id', user.id);

    if (updateProfileError) {
      console.error(`Falha ao atualizar perfil para inativo para o usuário ${user.id}:`, updateProfileError.message);
    }

    return NextResponse.json({ message: 'Cadastro finalizado com sucesso!' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}