import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rotas que não precisam de autenticação
const publicRoutes = [
  "/login", 
  "/recuperar-senha", 
  "/redefinir-senha", 
  "/email-confirmado"
]

export function middleware(request: NextRequest) {
  console.log("Middleware executado")
  // Verificar se o usuário está autenticado usando o cookie
  const user = request.cookies.get("user")
  const isAuthenticated = !!user

  // Obter o caminho da URL
  const path = request.nextUrl.pathname

  // Verificar se a rota é pública
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route))

  // Se o usuário não estiver autenticado e a rota não for pública, redirecionar para o login
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Se o usuário estiver autenticado e tentar acessar uma rota pública, redirecionar para o dashboard
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  return NextResponse.next()
}

// Configurar em quais caminhos o middleware deve ser executado
export const config = {
  matcher: [
    /*

     * Match all request paths except for the ones starting with:

     * - api (API routes)

     * - _next/static (static files)

     * - _next/image (image optimization files)

     * - favicon.ico (favicon file)

     */
    "/((?!api|_next/static|_next/image|favicon.ico|email-confirmado).*)",
  ],
};