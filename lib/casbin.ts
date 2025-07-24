import type { Enforcer } from "casbin";

import { newEnforcer, newModel } from "casbin";
import PostgresAdapter from "casbin-pg-adapter";

import { casbinModel } from "./casbin-model";

let enforcer: Enforcer;

async function initializeEnforcer() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("A variável de ambiente DATABASE_URL não está definida.");
  }

  const m = newModel();
  m.loadModelFromText(casbinModel);

  const adapter = await PostgresAdapter.newAdapter({
    connectionString,
    migrate: false,
  });

  return await newEnforcer(m, adapter);
}

/**
 * Obtém a instância do enforcer, garantindo que as políticas estejam
 * sempre sincronizadas com o banco de dados antes de retornar.
 */
export async function getEnforcer() {
  // Se a instância ainda não existe, crie-a.
  if (!enforcer) {
    enforcer = await initializeEnforcer();
  }

  await enforcer.loadPolicy();

  return enforcer;
}
