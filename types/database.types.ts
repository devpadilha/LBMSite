/**
 * Tipos gerados a partir do schema do Supabase
 */

// Enum para user_role
export enum EmployeeRole {
  ADMIN = "admin",
  GERENTE = "manager",
  USUARIO = "user"
}

// Enum para usuario_status
export enum EmployeeStatus {
  ATIVO = "active",
  INATIVO = "inactive",
  FERIAS = "vacation",
  LICENCA = "licence",
  PENDENTE = "pending"
}

// Enum para employee_contract
export enum EmployeeContract {
  CLT = "clt",
  PJ = "pj",
  ESTAGIO = "internship",
  TEMPORARIO = "temporary"
}

// Enum para contract_status
export enum ContractStatus {
  ATIVO = "active",
  CONCLUIDO = "completed",
  CANCELADO = "canceled",
  EM_ANALISE = "in_analysis"
}

// Enum para service_order_status
export enum ServiceOrderStatus {
  CONCLUIDA = "completed",
  EM_ANDAMENTO = "in_progress",
  PLANEJADA = "planned",
  CANCELADA = "canceled"
}