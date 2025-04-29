// Função para verificar se o usuário está autenticado
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false

  const user = localStorage.getItem("user")
  return !!user
}

// Função para obter os dados do usuário
export function getUserData() {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}

// Função para fazer logout
import { supabase } from "./supabase"

// Função para login com email e senha
export async function login(email: string, password: string) {
  if (typeof window === "undefined") return { error: "Ambiente inválido" }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Salva os dados do usuário no localStorage
  localStorage.setItem("user", JSON.stringify(data.user))
  
  // Salva os dados do usuário em um cookie para o middleware
  document.cookie = `user=${JSON.stringify(data.user)}; path=/; max-age=2592000`; // 30 dias
  
  return { user: data.user }
}

// Função para logout usando o Supabase
export async function logout() {
  if (typeof window === "undefined") return

  await supabase.auth.signOut()
  
  // Remover dados do usuário do localStorage
  localStorage.removeItem("user")
  
  // Remover cookie do usuário
  document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  
  window.location.href = "/login"
}
