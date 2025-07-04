// app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return NextResponse.json(
      { error: 'DATABASE_URL não encontrada.' },
      { status: 500 }
    );
  }

  const client = new Client({
    connectionString: connectionString,
  });

  try {
    console.log('Tentando conectar ao banco de dados...');
    await client.connect();
    console.log('Conexão bem-sucedida!');

    // Apenas para ter certeza que podemos fazer uma query
    const res = await client.query('SELECT NOW()');
    console.log('Query executada:', res.rows[0]);

    await client.end();
    
    return NextResponse.json({
      message: 'Conexão com o banco de dados bem-sucedida!',
      timestamp: res.rows[0].now,
    });
  } catch (error: any) {
    console.error('Erro de conexão com o banco de dados:', error);
    return NextResponse.json(
      {
        error: 'Falha ao conectar com o banco de dados.',
        errorMessage: error.message,
        errorCode: error.code,
      },
      { status: 500 }
    );
  }
}