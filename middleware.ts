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

  const isPublicRoute = publicRoutes.includes(path);

  if (user) {
    if (path === '/' || path === '/login') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return response;
  }

  if (!user) {
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  return response;
}

export const config = {
  matcher: [
    /*
     * Faz o match de todos os caminhos exceto os arquivos estáticos,
     * imagens de otimização e o favicon.
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};