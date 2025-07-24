"use client";

import { Save } from "lucide-react";
import { useState } from "react";

import type { NotificationPreferences } from "@/models/notification-preferences.model";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";

export function ProfileNotifications() {
  // Estado para gerenciar as preferências de notificação
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    email: {
      bids: true,
      serviceOrders: true,
      reports: true,
      system: true,
    },
    app: {
      bids: true,
      serviceOrders: true,
      reports: true,
      system: true,
    },
    frequency: "realtime",
  });

  // Manipuladores de eventos para atualizar as preferências
  const handleEmailChange = (key: keyof typeof preferences.email, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: value,
      },
    }));
  };

  const handleAppChange = (key: keyof typeof preferences.app, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      app: {
        ...prev.app,
        [key]: value,
      },
    }));
  };

  const handleFrequencyChange = (value: "realtime" | "hourly" | "daily") => {
    setPreferences(prev => ({
      ...prev,
      frequency: value,
    }));
  };

  const savePreferences = () => {
    // Aqui você pode implementar a lógica para salvar as preferências
    // Por exemplo, enviar para uma API
    ("Salvando preferências:", preferences);
  };

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
              <Switch
                id="email-bids"
                checked={preferences.email.bids}
                onCheckedChange={checked => handleEmailChange("bids", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-service-orders" className="flex-1">
                Atualizações de ordens de serviço
              </Label>
              <Switch
                id="email-service-orders"
                checked={preferences.email.serviceOrders}
                onCheckedChange={checked => handleEmailChange("serviceOrders", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-reports" className="flex-1">
                Geração de relatórios
              </Label>
              <Switch
                id="email-reports"
                checked={preferences.email.reports}
                onCheckedChange={checked => handleEmailChange("reports", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-system" className="flex-1">
                Notificações do sistema
              </Label>
              <Switch
                id="email-system"
                checked={preferences.email.system}
                onCheckedChange={checked => handleEmailChange("system", checked)}
              />
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
              <Switch
                id="app-bids"
                checked={preferences.app.bids}
                onCheckedChange={checked => handleAppChange("bids", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-service-orders" className="flex-1">
                Atualizações de ordens de serviço
              </Label>
              <Switch
                id="app-service-orders"
                checked={preferences.app.serviceOrders}
                onCheckedChange={checked => handleAppChange("serviceOrders", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-reports" className="flex-1">
                Geração de relatórios
              </Label>
              <Switch
                id="app-reports"
                checked={preferences.app.reports}
                onCheckedChange={checked => handleAppChange("reports", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="app-system" className="flex-1">
                Notificações do sistema
              </Label>
              <Switch
                id="app-system"
                checked={preferences.app.system}
                onCheckedChange={checked => handleAppChange("system", checked)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Frequência de Notificações</h3>
          <RadioGroup
            value={preferences.frequency}
            onValueChange={value => handleFrequencyChange(value as "realtime" | "hourly" | "daily")}
          >
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
        <Button
          className="bg-[#EC610D] hover:bg-[#EC610D]/90"
          onClick={savePreferences}
        >
          <Save className="mr-2 h-4 w-4" />
          {" "}
          Salvar Preferências
        </Button>
      </CardFooter>
    </Card>
  );
}
