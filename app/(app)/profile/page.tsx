import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Activity, Calendar, Clock, FileText, Key, Mail, Phone, Shield } from "lucide-react"
import { ProfilePhotoUpload } from "@/components/profile/profile-photo-upload"

import { getCurrentUserWithProfile } from "@/lib/auth-service"
import { getRoleBadgeColor } from "@/utils/colors"
import { ProfileTabs } from "@/components/profile/profile-tabs"

// A página agora é um Server Component 'async'
export default async function ProfilePage() {
  const user = await getCurrentUserWithProfile()

  if (!user) {
    redirect("/login")
  }

  const initials = user.name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'U'
  
  // Dados mocados para estatísticas - idealmente, viriam de outra action.
  const stats = {
    reportsCreated: 124,
    activeProjects: 8,
    lastLogin: "Hoje, 10:30"
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas configurações de conta e preferências</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" asChild>
           {/* O link deve apontar para a página de alteração de senha */}
          <Link href="/profile/change-password">
            <Key className="mr-2 h-4 w-4" /> Alterar Senha
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card de Informações Pessoais (Renderizado no Servidor) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-2">
                {/* A imagem do avatar viria do perfil do usuário */}
                <AvatarImage src={user.avatar_url || ""} alt={user.name || "Usuário"} />
                <AvatarFallback className="text-2xl bg-[#EC610D] text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <ProfilePhotoUpload />
              <CardTitle className="text-xl mt-4">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <div className="mt-2">
                {user.role && (
                  <Badge className={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-[#EC610D]" />
                <span>{user.email || "N/A"}</span>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4">
              {/* Seção de estatísticas */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Relatórios Criados</span>
                </div>
                <span className="font-medium">{stats.reportsCreated}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Projetos Ativos</span>
                </div>
                <span className="font-medium">{stats.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#EC610D]" />
                  <span className="text-sm">Último Login</span>
                </div>
                <span className="text-sm">{stats.lastLogin}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conteúdo com Abas (Renderizado como Client Component) */}
        <div className="lg:col-span-2">
          <ProfileTabs />
        </div>
      </div>
    </div>
  )
}
