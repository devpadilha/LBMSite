"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertCircle, Check, Key, Shield } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ProfileSecurity() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Atualize sua senha para manter sua conta segura</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {passwordChanged && (
            <Alert className="bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30 mb-4">
              <Check className="h-4 w-4" />
              <AlertTitle>Sucesso</AlertTitle>
              <AlertDescription>Sua senha foi alterada com sucesso.</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setPasswordChanged(true)} className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Key className="mr-2 h-4 w-4" /> Atualizar Senha
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
          <CardDescription>Adicione uma camada extra de segurança à sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-medium">Autenticação de Dois Fatores</div>
              <div className="text-sm text-muted-foreground">
                Receba um código de verificação no seu celular ao fazer login
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>
          {twoFactorEnabled && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Não Configurado</AlertTitle>
              <AlertDescription>
                A autenticação de dois fatores requer configuração adicional. Entre em contato com o administrador do
                sistema.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Sessões de Login</CardTitle>
          <CardDescription>Gerencie suas sessões ativas em dispositivos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Escritório Campo Grande - Windows</p>
                <p className="text-sm text-muted-foreground">Sessão atual • Iniciada hoje às 10:30</p>
                <p className="text-xs text-muted-foreground">IP: 187.64.xxx.xxx • Navegador Chrome</p>
              </div>
              <Button variant="outline" size="sm" disabled>
                Atual
              </Button>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">Dispositivo Móvel - Android</p>
                <p className="text-sm text-muted-foreground">Iniciada ontem às 15:45</p>
                <p className="text-xs text-muted-foreground">IP: 187.64.xxx.xxx • Aplicativo Móvel</p>
              </div>
              <Button variant="outline" size="sm">
                Revogar
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
            <Shield className="mr-2 h-4 w-4" /> Sair de todos os outros dispositivos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
