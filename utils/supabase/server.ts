// utils/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cria um cliente Supabase para ser usado em contextos de servidor no App Router.
 * (Server Components, Server Actions, Route Handlers).
 * Ele lê e escreve cookies usando a função `cookies()` de `next/headers`.
 * @returns Um cliente Supabase autenticado para a requisição atual.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value, ...options })
          } catch (error) {
            // A chamada `set` pode falhar em Server Components que são renderizados
            // estaticamente, o que é um comportamento esperado.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            (await cookieStore).set({ name, value: '', ...options })
          } catch (error) {
            // A chamada `set` pode falhar em Server Components estáticos.
          }
        },
      },
    }
  )
}

/**
 * Cria um Admin Client do Supabase com permissões elevadas (usando a service_role key).
 * Este cliente pode ignorar as políticas de RLS e é usado para operações administrativas.
 * Ele não precisa de cookies de usuário.
 * @returns Um Admin Client do Supabase.
 */
export const createAdminClient = () => {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('A variável de ambiente SUPABASE_SERVICE_ROLE_KEY não está definida.');
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
