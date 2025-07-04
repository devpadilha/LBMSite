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

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // CASO 1: Usuário está LOGADO
  if (user) {
    // Se o usuário logado tentar acessar a home ou login, redireciona para o dashboard.
    // A rota /finalizar-cadastro FOI REMOVIDA desta condição.
    if (path === '/' || path === '/login') {
      console.log(`[MIDDLEWARE_LOG] Usuário logado em / ou /login. Redirecionando para /dashboard...`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Para todas as outras rotas (incluindo /finalizar-cadastro), permite o acesso.
    return response;
  }

  // CASO 2: Usuário NÃO está LOGADO
  if (!user) {
    if (!isPublicRoute) {
      console.log(`[MIDDLEWARE_LOG] Usuário não logado em rota privada. Redirecionando para /login...`);
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  // Permite o acesso por padrão (ex: usuário não logado em rota pública)
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};