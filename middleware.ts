import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Definição das rotas públicas
const publicRoutes = [
  "/login",
  "/recuperar-senha", 
  "/redefinir-senha",
  "/finalizar-cadastro",
];

export async function middleware(request: NextRequest) {
  // O response é criado no início e atualizado pelo Supabase se necessário
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Obtém o usuário e o caminho da requisição
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // Adiciona logs para depuração
  console.log(`[MIDDLEWARE_LOG] Path: ${path}`);
  console.log(`[MIDDLEWARE_LOG] User: ${user ? user.id : 'Nenhum usuário autenticado'}`);

  const isPublicRoute = publicRoutes.includes(path);

  // CASO 1: Usuário está LOGADO
  if (user) {
    // Se o usuário logado tentar acessar a home, login ou finalizar-cadastro,
    // redireciona para o dashboard.
    if (path === '/' || path === '/login' || path === '/finalizar-cadastro') {
      console.log(`[MIDDLEWARE_LOG] Usuário logado em rota pública restrita. Redirecionando para /dashboard...`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Se for qualquer outra rota (pública ou privada), permite o acesso.
    console.log(`[MIDDLEWARE_LOG] Usuário logado. Permitindo acesso a ${path}.`);
    return response;
  }

  // CASO 2: Usuário NÃO está LOGADO
  if (!user) {
    // Se a rota NÃO é pública, redireciona para o login.
    if (!isPublicRoute) {
      console.log(`[MIDDLEWARE_LOG] Usuário não logado em rota privada. Redirecionando para /login...`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Se nenhuma das condições acima foi atendida (ex: usuário não logado em rota pública),
  // permite o acesso. Isso cobre o caso do /finalizar-cadastro.
  console.log(`[MIDDLEWARE_LOG] Nenhuma regra de redirecionamento aplicada. Permitindo acesso a ${path}.`);
  return response;
}

export const config = {
  matcher: [
    /*
     * Faz o match de todos os caminhos exceto os arquivos estáticos,
     * imagens de otimização e o favicon.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};