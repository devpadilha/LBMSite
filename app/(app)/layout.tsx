import { ModeToggle } from "@/components/mode-toggle";
import { Sidebar } from "@/components/sidebar";
import { Toaster } from "@/components/ui/use-toast"; // 1. Importe o Toaster
import { UserNav } from "@/components/user-nav";
import { getCurrentUserWithProfile } from "@/lib/auth-service";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUserWithProfile();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-card sticky top-0 z-10">
          <div className="flex h-12 items-center px-2 md:px-4 justify-end">
            <div className="flex items-center gap-2">
              <UserNav user={user} />
            </div>
          </div>
        </header>
        <main className="flex-1 m-3 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-card rounded-2xl shadow-lg">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}
