import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { EmployeeRole } from "@/types/database.types"

// Rotas públicas compartilhadas (deve ser sincronizado com o frontend)
const publicRoutes = [
  "/login",
  "/recuperar-senha", 
  "/redefinir-senha",
  "/email-confirmado",
  "/cadastro",
  "/"
]

// Rotas de API que não requerem autenticação
const publicApiRoutes = [
  "/api/auth",
  "/api/public"
]

// Rotas que apenas administradores podem acessar
const adminOnlyRoutes = [
  "/employees"
]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isApiRoute = path.startsWith('/api')
  
  // Permitir acesso a rotas de API públicas
  if (isApiRoute && publicApiRoutes.some(route => path.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar autenticação apenas para rotas não públicas
  const isPublicRoute = publicRoutes.some(route => 
    route === '/' ? path === route : path.startsWith(route))
  
  if (isPublicRoute) {
    // Se usuário autenticado tentando acessar rota pública, redirecionar
    const user = request.cookies.get("user")?.value
    if (user && (path === "/login" || path === "/")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }

  // Verificar autenticação para rotas protegidas
  const userCookie = request.cookies.get("user")?.value
  if (!userCookie) {
    // Redirecionar para login com URL de retorno
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verificar permissões para rotas de administrador
  const isAdminRoute = adminOnlyRoutes.some(route => path.startsWith(route))
  if (isAdminRoute) {
    try {
      const userData = JSON.parse(userCookie)
      if (userData.role !== EmployeeRole.ADMIN) {
        // Redirecionar usuários não-admin para o dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return NextResponse.redirect(new URL("/employees", request.url))
    } catch (error) {
      // Se houver erro ao analisar o cookie, redirecionar para login
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public routes (definidas acima)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}