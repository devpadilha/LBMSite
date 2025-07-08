import { Sidebar } from '@/components/sidebar'
import { UserNav } from '@/components/user-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { getCurrentUserWithProfile } from '@/lib/auth-service'
import { Toaster } from '@/components/ui/use-toast' // 1. Importe o Toaster

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUserWithProfile()

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="border-b bg-card sticky top-0 z-10">
          <div className="flex h-16 items-center px-4 md:px-6 justify-end">
            <div className="flex items-center gap-4">
              <ModeToggle />
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      <Toaster />
    </div>
  )
}