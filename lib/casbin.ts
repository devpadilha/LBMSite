import { newEnforcer, Enforcer } from 'casbin';
import PostgresAdapter from 'casbin-pg-adapter';
import path from 'path';

// Variável global para armazenar a instância do enforcer
let enforcer: Enforcer;

async function initializeEnforcer() {
  // Caminho para o arquivo de modelo
  const modelPath = path.join(process.cwd(), 'model.conf');

  // Conecta ao banco de dados Supabase usando a string de conexão
  // IMPORTANTE: Armazene sua string de conexão em variáveis de ambiente!
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  
  const adapter = await PostgresAdapter.newAdapter({
    connectionString: connectionString,
  });

  // Cria a instância do enforcer com o modelo e o adaptador
  const e = await newEnforcer(modelPath, adapter);

  // Carrega as políticas do banco de dados para a memória
  await e.loadPolicy();
  
  return e;
}

export async function getEnforcer() {
  if (!enforcer) {
    enforcer = await initializeEnforcer();
  }
  return enforcer;
}