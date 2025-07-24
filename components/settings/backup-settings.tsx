"use client";

import { Database, Download, HardDrive, Upload } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BackupSettings() {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const startBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Backup do Banco de Dados</CardTitle>
          <CardDescription>Configure backups automáticos e realize backups manuais</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {isBackingUp && (
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Backup em andamento...</span>
                <span className="text-sm">
                  {backupProgress}
                  %
                </span>
              </div>
              <Progress value={backupProgress} className="bg-[#EC610D]/20" indicatorClassName="bg-[#EC610D]" />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Backups Automáticos</h3>
              <p className="text-sm text-muted-foreground">Agende backups regulares do banco de dados</p>
            </div>
            <Switch id="auto-backup" defaultChecked />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backup-frequency">Frequência de Backup</Label>
              <Select defaultValue="daily">
                <SelectTrigger id="backup-frequency">
                  <SelectValue placeholder="Selecione a frequência" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">A cada hora</SelectItem>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-time">Horário do Backup</Label>
              <Input id="backup-time" type="time" defaultValue="02:00" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup-retention">Retenção de Backup (dias)</Label>
            <Input id="backup-retention" type="number" defaultValue="30" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="backup-location">Local de Armazenamento do Backup</Label>
            <Select defaultValue="local">
              <SelectTrigger id="backup-location">
                <SelectValue placeholder="Selecione o local" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="local">Armazenamento Local</SelectItem>
                <SelectItem value="cloud">Armazenamento em Nuvem</SelectItem>
                <SelectItem value="both">Ambos (Local e Nuvem)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          <Button onClick={startBackup} disabled={isBackingUp} className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Database className="mr-2 h-4 w-4" />
            {" "}
            Fazer Backup Agora
          </Button>
          <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
            <Upload className="mr-2 h-4 w-4" />
            {" "}
            Restaurar de Backup
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Backups Recentes</CardTitle>
          <CardDescription>Visualize e gerencie seus backups recentes do banco de dados</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-[#EC610D]" />
                <div>
                  <p className="font-medium">Backup Completo</p>
                  <p className="text-sm text-muted-foreground">27 de abril de 2024 - 02:00</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
                <Download className="h-4 w-4 mr-1" />
                {" "}
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-[#EC610D]" />
                <div>
                  <p className="font-medium">Backup Completo</p>
                  <p className="text-sm text-muted-foreground">26 de abril de 2024 - 02:00</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
                <Download className="h-4 w-4 mr-1" />
                {" "}
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center gap-3">
                <HardDrive className="h-5 w-5 text-[#EC610D]" />
                <div>
                  <p className="font-medium">Backup Completo</p>
                  <p className="text-sm text-muted-foreground">25 de abril de 2024 - 02:00</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
                <Download className="h-4 w-4 mr-1" />
                {" "}
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-[#EC610D]/10 text-[#EC610D] border-[#EC610D]/20">
        <Database className="h-4 w-4" />
        <AlertTitle>Importante</AlertTitle>
        <AlertDescription>
          Backups regulares são essenciais para a segurança dos dados. Recomendamos manter pelo menos 30 dias de
          histórico de backup.
        </AlertDescription>
      </Alert>
    </div>
  );
}
