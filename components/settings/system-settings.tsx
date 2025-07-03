"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Globe, Save } from "lucide-react"
import { SystemSettings as SystemSettingsModel } from "@/models/system-settings.model"

export function SystemSettings() {
  const [settings, setSettings] = useState<SystemSettingsModel>({
    general: {
      companyName: "LBM Engenharia",
      systemEmail: "sistema@lbm.com.br",
      contactPhone: "(67) 3383-0000",
      address: "Av. Afonso Pena, 1500 - Centro, Campo Grande - MS",
    },
    regional: {
      language: "pt-BR",
      timezone: "America/Campo_Grande",
      dateFormat: "dd/MM/yyyy",
      currency: "BRL",
    },
    features: {
      reports: true,
      municipalities: true,
      employees: true,
      analytics: true,
      api: false,
    },
  })

  const handleGeneralChange = (field: keyof SystemSettingsModel['general'], value: string) => {
    setSettings({
      ...settings,
      general: {
        ...settings.general,
        [field]: value,
      },
    })
  }

  const handleRegionalChange = (field: keyof SystemSettingsModel['regional'], value: string) => {
    setSettings({
      ...settings,
      regional: {
        ...settings.regional,
        [field]: value,
      },
    })
  }

  const handleFeatureChange = (field: keyof SystemSettingsModel['features'], value: boolean) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [field]: value,
      },
    })
  }

  const saveSettings = () => {
    // Here you would typically save the settings to your backend
    ("Saving settings:", settings)
    // Example API call:
    // await fetch('/api/settings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(settings),
    // })
  }

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
            <Input 
              id="company-name" 
              value={settings.general.companyName}
              onChange={(e) => handleGeneralChange('companyName', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="system-email">Email do Sistema</Label>
            <Input 
              id="system-email" 
              value={settings.general.systemEmail}
              onChange={(e) => handleGeneralChange('systemEmail', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone">Telefone de Contato</Label>
            <Input 
              id="contact-phone" 
              value={settings.general.contactPhone}
              onChange={(e) => handleGeneralChange('contactPhone', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input 
              id="address" 
              value={settings.general.address}
              onChange={(e) => handleGeneralChange('address', e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" onClick={saveSettings}>
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
            <Select 
              value={settings.regional.language}
              onValueChange={(value) => handleRegionalChange('language', value)}
            >
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
            <Select 
              value={settings.regional.timezone}
              onValueChange={(value) => handleRegionalChange('timezone', value)}
            >
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
            <Select 
              value={settings.regional.dateFormat}
              onValueChange={(value) => handleRegionalChange('dateFormat', value)}
            >
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
            <Select 
              value={settings.regional.currency}
              onValueChange={(value) => handleRegionalChange('currency', value)}
            >
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
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" onClick={saveSettings}>
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
            <Switch 
              id="feature-reports" 
              checked={settings.features.reports}
              onCheckedChange={(checked) => handleFeatureChange('reports', checked)}
            />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-municipalities" className="flex-1">
              Módulo de Municípios
            </Label>
            <Switch 
              id="feature-municipalities" 
              checked={settings.features.municipalities}
              onCheckedChange={(checked) => handleFeatureChange('municipalities', checked)}
            />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-employees" className="flex-1">
              Módulo de Funcionários
            </Label>
            <Switch 
              id="feature-employees" 
              checked={settings.features.employees}
              onCheckedChange={(checked) => handleFeatureChange('employees', checked)}
            />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-analytics" className="flex-1">
              Analytics & Dashboard
            </Label>
            <Switch 
              id="feature-analytics" 
              checked={settings.features.analytics}
              onCheckedChange={(checked) => handleFeatureChange('analytics', checked)}
            />
          </div>
          <Separator className="bg-[#EC610D]/10" />
          <div className="flex items-center justify-between">
            <Label htmlFor="feature-api" className="flex-1">
              Acesso à API
            </Label>
            <Switch 
              id="feature-api" 
              checked={settings.features.api}
              onCheckedChange={(checked) => handleFeatureChange('api', checked)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" onClick={saveSettings}>
            Salvar Configurações de Recursos
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
