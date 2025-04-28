"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save } from "lucide-react"

export function ProfileNotifications() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Preferências de Notificação</CardTitle>
        <CardDescription>Escolha como deseja ser notificado sobre eventos do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notificações por Email</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-bids" className="flex-1">
                Novas licitações e contratos
              </Label>
              <Switch id="email-bids" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-service-orders" className="flex-1">
                Atualizações de ordens de serviço
              </Label>
              <Switch id="email-service-orders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-reports" className="flex-1">
                Geração de relatórios
              </Label>
              <Switch id="email-reports" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-system" className="flex-1">
                Notificações do sistema
              </Label>
              <Switch id="email-system" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Notificações no Aplicativo</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="app-bids" className="flex-1">
                Novas licitações e contratos
              </Label>
              <Switch id="app-bids" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-service-orders" className="flex-1">
                Atualizações de ordens de serviço
              </Label>
              <Switch id="app-service-orders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-reports" className="flex-1">
                Geração de relatórios
              </Label>
              <Switch id="app-reports" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-system" className="flex-1">
                Notificações do sistema
              </Label>
              <Switch id="app-system" defaultChecked />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Frequência de Notificações</h3>
          <RadioGroup defaultValue="realtime">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="realtime" id="realtime" />
              <Label htmlFor="realtime">Tempo real</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hourly" id="hourly" />
              <Label htmlFor="hourly">Resumo por hora</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="daily" id="daily" />
              <Label htmlFor="daily">Resumo diário</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90">
          <Save className="mr-2 h-4 w-4" /> Salvar Preferências
        </Button>
      </CardFooter>
    </Card>
  )
}
