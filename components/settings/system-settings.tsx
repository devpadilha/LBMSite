"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, Save } from "lucide-react"

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Configurações Gerais</CardTitle>
          <CardDescription>Configure as configurações básicas do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input id="company-name" defaultValue="LBM Engenharia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-email">Email do Sistema</Label>
            <Input id="system-email" defaultValue="sistema@lbm.com.br" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefone de Contato</Label>
            <Input id="contact-phone" defaultValue="(67) 3383-0000" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Av. Afonso Pena, 1500 - Centro, Campo Grande - MS" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Save className="mr-2 h-4 w-4" /> Salvar Alterações
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Configurações Regionais</CardTitle>
          <CardDescription>Configure idioma, fuso horário e formatos de data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select defaultValue="pt-BR">
              <SelectTrigger id="language">
                <SelectValue placeholder="Selecione o idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                <SelectItem value="en-US">English (US)</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">Fuso Horário</Label>
            <Select defaultValue="America/Campo_Grande">
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Selecione o fuso horário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Campo_Grande">America/Campo Grande (GMT-4)</SelectItem>
                <SelectItem value="America/Sao_Paulo">America/São Paulo (GMT-3)</SelectItem>
                <SelectItem value="America/Manaus">America/Manaus (GMT-4)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-format">Formato de Data</Label>
            <Select defaultValue="dd/MM/yyyy">
              <SelectTrigger id="date-format">
                <SelectValue placeholder="Selecione o formato de data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dd/MM/yyyy">DD/MM/AAAA</SelectItem>
                <SelectItem value="MM/dd/yyyy">MM/DD/AAAA</SelectItem>
                <SelectItem value="yyyy-MM-dd">AAAA-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Moeda</Label>
            <Select defaultValue="BRL">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Selecione a moeda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                <SelectItem value="USD">Dólar Americano ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Globe className="mr-2 h-4 w-4" /> Atualizar Configurações Regionais
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recursos do Sistema</CardTitle>
          <CardDescription>Ativar ou desativar recursos do sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-reports" className="flex-1">
              Módulo de Relatórios
            </Label>
            <Switch id="feature-reports" defaultChecked />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-municipalities" className="flex-1">
              Módulo de Municípios
            </Label>
            <Switch id="feature-municipalities" defaultChecked />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-employees" className="flex-1">
              Módulo de Funcionários
            </Label>
            <Switch id="feature-employees" defaultChecked />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-analytics" className="flex-1">
              Analytics & Dashboard
            </Label>
            <Switch id="feature-analytics" defaultChecked />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-api" className="flex-1">
              Acesso à API
            </Label>
            <Switch id="feature-api" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">Salvar Configurações de Recursos</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
