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
export function logout() {
  if (typeof window === "undefined") return

  localStorage.removeItem("user")
  window.location.href = "/login"
}
