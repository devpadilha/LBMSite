import { Sidebar } from '@/components/sidebar'
import { UserNav } from '@/components/user-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { getCurrentUserWithProfile } from '@/lib/auth-service'

// Este é um Server Component, então podemos torná-lo 'async'.
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 1. Buscamos os dados do usuário no servidor ANTES de renderizar.
  // Não há mais 'isLoading' ou 'flicker'.
  const user = await getCurrentUserWithProfile()

  return (
    <div className="flex min-h-screen">
      {/* 2. A Sidebar é renderizada no servidor com as permissões corretas. */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="flex h-16 items-center px-4 md:px-6 justify-end">
            <div className="flex items-center gap-4">
              <ModeToggle />
              {/* 3. Passamos os dados do usuário como prop para o UserNav. */}
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
