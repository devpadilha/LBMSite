"use client";

import { HardDrive, Save, Server, Settings, Shield } from "lucide-react";
import { useState } from "react";

import type { BackupSettings as BackupSettingsModel, SystemLogs as SystemLogsModel, SystemSettings as SystemSettingsModel } from "@/models/system-settings.model";

import { BackupSettings } from "@/components/settings/backup-settings";
import { SystemLogs } from "@/components/settings/system-logs";
import { SystemSettings } from "@/components/settings/system-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [allSettings, setAllSettings] = useState({
    system: {} as SystemSettingsModel,
    backup: {} as BackupSettingsModel,
    logs: {} as SystemLogsModel,
  });

  const saveAllSettings = () => {
    // Here you would save all settings to your backend
    console.log("Saving all settings:", allSettings);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">Configure as configurações e preferências do sistema</p>
        </div>
        <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" onClick={saveAllSettings}>
          <Save className="mr-2 h-4 w-4" />
          {" "}
          Salvar Todas as Alterações
        </Button>
      </div>

      <div className="flex flex-col space-y-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Acesso de Administrador Necessário</CardTitle>
            <CardDescription>
              Estas configurações só podem ser modificadas por usuários com privilégios administrativos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between bg-[#EC610D]/10 text-[#EC610D] p-3 rounded-md">
              <div className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                <div>
                  <p className="font-medium">Acesso de Administrador</p>
                  <p className="text-sm">Você tem acesso total a todas as configurações</p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
              >
                Admin
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="system" className="space-y-4">
          <TabsList className="grid grid-cols-3 gap-2 bg-muted/60 border">
            <TabsTrigger value="system" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Sistema
            </TabsTrigger>
            <TabsTrigger value="backup" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
              <HardDrive className="h-4 w-4 mr-2" />
              Backup
            </TabsTrigger>
            <TabsTrigger value="logs" className="data-[state=active]:bg-[#EC610D] data-[state=active]:text-white">
              <Server className="h-4 w-4 mr-2" />
              Logs
            </TabsTrigger>
          </TabsList>
          <TabsContent value="system" className="space-y-4">
            <SystemSettings />
          </TabsContent>
          <TabsContent value="backup" className="space-y-4">
            <BackupSettings />
          </TabsContent>
          <TabsContent value="logs" className="space-y-4">
            <SystemLogs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
