import Image from "next/image";
import Link from "next/link";

import { getEnforcer } from "@/lib/casbin";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";

import { SidebarClient } from "./sidebar-client";

type SidebarProps = {
  className?: string;
};

export async function Sidebar({ className }: SidebarProps) {
  const supabase = createClient();
  const enforcer = await getEnforcer();

  // 1. Busca o usuário da sessão segura do servidor
  const { data: { user } } = await (await supabase).auth.getUser();

  // Se não houver usuário, não renderizamos nada.
  if (!user) {
    return null;
  }

  // 2. Verificamos as permissões no servidor ANTES de renderizar
  const canViewReports = await enforcer.enforce(user.id, "reports", "read");
  const canViewEmployees = await enforcer.enforce(user.id, "employees", "read");
  const canViewSettings = await enforcer.enforce(user.id, "settings", "read");

  // 3. Construímos a lista de rotas dinamicamente com base nas permissões
  const routes = [
    {
      name: "Dashboard",
      href: "/dashboard",
      iconName: "dashboard",
    },
    {
      name: "Municípios",
      href: "/municipios",
      iconName: "municipalities",
    },
  ];

  // A depender da permissão, exibe na sidebar o icone correspondente
  if (canViewReports) {
    routes.push({
      name: "Relatórios",
      href: "/relatorios",
      iconName: "reports",
    });
  }

  if (canViewEmployees) {
    routes.push({
      name: "Funcionários",
      href: "/funcionarios",
      iconName: "employees",
    });
  }

  if (canViewSettings) {
    routes.push({
      name: "Configurações",
      href: "/configuracoes",
      iconName: "settings",
    });
  }

  return (
    <div className={cn("flex max-w-[280px] flex-col border-r border-b bg-card", className)}>
      <div className="px-4 py-6 flex flex-col h-full">
        <Link href="/dashboard" className="flex items-center justify-center gap-2 mb-6">
          <Image
            src="/logo-lbm.png"
            alt="LBM Engenharia"
            width={128}
            height={128}
          />
        </Link>
        <div className="text-xs text-muted-foreground mb-4 px-2">Painel de Administração</div>
        <SidebarClient routes={routes} />
      </div>
    </div>
  );
}
