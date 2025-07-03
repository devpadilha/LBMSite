import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Definição das rotas públicas
const publicRoutes = [
  "/login",
  "/recuperar-senha", 
  "/redefinir-senha",
  "/finalizar-cadastro",
  "/",
];

export async function middleware(request: NextRequest) {
  // 1. Cria uma resposta inicial. O Supabase irá anexar os cookies de sessão a ela.
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Cria um cliente Supabase para ser usado DENTRO do middleware.
  // Isso é essencial para ler e atualizar a sessão do usuário.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // 3. Obtém a sessão do usuário de forma SEGURA.
  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/api/public'); // Simplificado

  // 4. Lógica de Redirecionamento
  if (isPublicRoute) {
    if (user && (path === '/login' || path === '/')) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Para todas as outras rotas públicas, permite o acesso.
    return response;
  }

  // Se a rota não é pública e o usuário não está logado, redireciona para o login.
  if (!user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path); // Guarda a página de origem
    return NextResponse.redirect(loginUrl);
  }

  // Para todas as outras rotas protegidas, permite o acesso.
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