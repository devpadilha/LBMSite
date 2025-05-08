import { getCookie } from "./cookie-utils"
import { getCurrentUser } from "./auth-service"

// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const user = getCookie("user")
  return !!user
}

// Função para obter os dados do usuário
export function getUserData() {
  if (typeof window === "undefined") return null

  const userStr = getCookie("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}

// Função assíncrona para obter os dados do usuário (recomendada)
export async function getUserDataAsync() {
  return await getCurrentUser()
}

// Importar funções do serviço de autenticação independente de provedor
import { login as authServiceLogin, logout as authServiceLogout, register as authServiceRegister, resetPassword as authServiceResetPassword } from "./auth-service"

// Função para login com email e senha
export async function login(email: string, password: string) {
  if (typeof window === "undefined") return { error: "Ambiente inválido" }

  const { user, error } = await authServiceLogin(email, password)

  if (error) {
    return { error }
  }
  
  return { user }
}

// Função para logout
export async function logout() {
  if (typeof window === "undefined") return

  await authServiceLogout()
}

// Função para registro
export async function register(name: string, email: string, password: string) {
  if (typeof window === "undefined") return { error: "Ambiente inválido" }

  const { success, error } = await authServiceRegister(name, email, password)

  if (error) {
    return { error }
  }
  
  return { success }
}

// Função para redefinição de senha
export async function resetPassword(email: string, redirectUrl?: string) {
  if (typeof window === "undefined") return { error: "Ambiente inválido" }

  const { success, error } = await authServiceResetPassword(email, redirectUrl)

  if (error) {
    return { error }
  }
  
  return { success }
}
