//    só aceitem valores válidos ('admin', 'active', etc.).
import type { ProfileRole, ProfileStatus } from "@/lib/types";

/**
 * Retorna uma string de classes do Tailwind CSS com base no papel (role) do perfil.
 * @param role O papel do usuário ('admin', 'manager', 'user').
 * @returns Classes CSS para o componente Badge.
 */
export function getRoleBadgeColor(role: ProfileRole): string {
  switch (role) {
    case "Administrador":
      return "bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30";
    case "Gerente":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
    case "Usuario":
      return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400";
    default:
      // Fallback para qualquer caso inesperado.
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
  }
}

/**
 * Retorna uma string de classes do Tailwind CSS com base no status do perfil.
 * @param status O status do usuário ('active', 'inactive', etc.).
 * @returns Classes CSS para o componente Badge.
 */
export function getStatusBadgeColor(status: ProfileStatus): string {
  switch (status) {
    case "Ativo":
      return "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400";
    case "Inativo":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
    case "Ferias":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400";
    case "Licenca":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "Pendente":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-400";
    default:
      // Fallback para qualquer caso inesperado.
      return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400";
  }
}
