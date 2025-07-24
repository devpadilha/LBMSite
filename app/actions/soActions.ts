"use server";

import { revalidatePath } from "next/cache";

import type { ServiceOrderFormData } from "@/lib/types";

import { checkPermission } from "@/lib/auth-helpers";
import { createClient } from "@/utils/supabase/server";

// =================================================================================
// ACTIONS DE LEITURA
// =================================================================================

export async function getServiceOrderById(soId: string) {
  try {
    await checkPermission("service_orders", "read");

    const supabase = createClient();

    const { data, error } = await supabase
      .from("service_orders")
      .select(`
      *,
      municipalities ( name, state ),
      bids ( number, object ),
      service_order_employees (
        employee_id,
        profiles ( id, name, role, avatar_url )
      )
    `)
      .eq("id", soId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
  catch (error: any) {
    console.error("Erro ao buscar Ordem de Serviço:", error.message);
    return null;
  }
}

// =================================================================================
// ACTIONS DE ESCRITA
// =================================================================================

export async function createServiceOrder(formData: ServiceOrderFormData) {
  const supabase = createClient();
  try {
    await checkPermission("service_orders", "create");

    const { employees_ids, ...soData } = formData;

    const { data: newServiceOrder, error: osError } = await supabase
      .from("service_orders")
      .insert({
        ...soData,
        bid_id: soData.bid_id || null,
      })
      .select("id")
      .single();

    if (osError || !newServiceOrder) {
      throw new Error(`Erro ao criar a OS: ${osError?.message}`);
    }

    const newSoId = newServiceOrder.id;

    if (employees_ids && employees_ids.length > 0) {
      const assignments = employees_ids.map(employeeId => ({
        service_order_id: newSoId,
        employee_id: employeeId,
      }));

      const { error: assignmentError } = await supabase
        .from("service_order_employees")
        .insert(assignments);

      if (assignmentError) {
        // Num cenário ideal, deletaríamos a OS criada (rollback).
        // Por simplicidade, apenas lançamos o erro.
        throw new Error(`OS criada, mas falha ao associar funcionários: ${assignmentError.message}`);
      }
    }

    revalidatePath(`/municipios/${formData.municipality_id}`);
    return { error: null };
  }
  catch (e: any) {
    return { error: e.message };
  }
}

export async function updateServiceOrderEmployees(serviceOrderId: string, newEmployeeIds: string[]) {
  try {
    await checkPermission("service_orders", "update");
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("service_order_employees")
      .delete()
      .eq("service_order_id", serviceOrderId);

    if (deleteError)
      throw new Error(`Falha ao limpar equipe antiga: ${deleteError.message}`);

    if (newEmployeeIds.length > 0) {
      const assignments = newEmployeeIds.map(employeeId => ({
        service_order_id: serviceOrderId,
        employee_id: employeeId,
      }));

      const { error: insertError } = await supabase
        .from("service_order_employees")
        .insert(assignments);

      if (insertError)
        throw new Error(`Falha ao associar nova equipe: ${insertError.message}`);
    }

    revalidatePath(`/municipios/.*/ordens-servico/${serviceOrderId}`, "page");
    return { error: null };
  }
  catch (e: any) {
    return { error: e.message };
  }
}
