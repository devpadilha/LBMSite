import { newEnforcer, Enforcer } from 'casbin';
import PostgresAdapter from 'casbin-pg-adapter'; 
import path from 'path';

// Variável global para armazenar a instância do enforcer e evitar múltiplas inicializações.
let enforcer: Enforcer | undefined;

async function initializeEnforcer() {
  const modelPath = path.join(process.cwd(), 'model.conf');
  console.log(modelPath)

  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('A variável de ambiente DATABASE_URL não está definida.');
  }
  
  // A conexão direta com o banco de dados.
  const adapter = await PostgresAdapter.newAdapter({
    connectionString: connectionString,
    migrate: false,
  });

  const e = await newEnforcer(modelPath, adapter);

  await e.loadPolicy();
  
  return e;
}

export async function getEnforcer() {
  if (!enforcer) {
    console.log("Inicializando o enforcer do Casbin...");
    enforcer = await initializeEnforcer();
    console.log("Enforcer do Casbin inicializado com sucesso.");
  }
  return enforcer;
}
