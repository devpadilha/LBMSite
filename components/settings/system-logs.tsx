"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Search, Trash2 } from "lucide-react"

interface LogEntry {
  id: number
  timestamp: string
  level: "info" | "warning" | "error"
  source: string
  message: string
  user: string
}

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: "2024-04-27 10:30:45",
      level: "info",
      source: "Autenticação",
      message: "Usuário admin logado com sucesso",
      user: "admin@lbm.com.br",
    },
    {
      id: 2,
      timestamp: "2024-04-27 10:15:22",
      level: "warning",
      source: "Banco de Dados",
      message: "Alta carga no banco de dados detectada",
      user: "Sistema",
    },
    {
      id: 3,
      timestamp: "2024-04-27 09:45:10",
      level: "info",
      source: "Relatórios",
      message: "Relatório mensal gerado com sucesso",
      user: "admin@lbm.com.br",
    },
    {
      id: 4,
      timestamp: "2024-04-26 16:30:05",
      level: "error",
      source: "API",
      message: "Falha ao conectar ao serviço externo",
      user: "Sistema",
    },
    {
      id: 5,
      timestamp: "2024-04-26 14:22:18",
      level: "info",
      source: "Municípios",
      message: "Novo município adicionado: Bonito",
      user: "admin@lbm.com.br",
    },
    {
      id: 6,
      timestamp: "2024-04-26 11:05:33",
      level: "warning",
      source: "Armazenamento",
      message: "Espaço de armazenamento abaixo de 20%",
      user: "Sistema",
    },
    {
      id: 7,
      timestamp: "2024-04-25 17:45:12",
      level: "info",
      source: "Autenticação",
      message: "Senha alterada com sucesso",
      user: "joao.silva@lbm.com.br",
    },
    {
      id: 8,
      timestamp: "2024-04-25 15:10:45",
      level: "error",
      source: "Backup",
      message: "Backup automático falhou",
      user: "Sistema",
    },
  ]

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "warning":
        return "bg-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/30 border-[#EC610D]/30"
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
    }
  }

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLevel = levelFilter === "all" || log.level === levelFilter

    return matchesSearch && matchesLevel
  })

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Logs do Sistema</CardTitle>
        <CardDescription>Visualize e analise logs de atividade do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar logs..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por nível" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Níveis</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Aviso</SelectItem>
              <SelectItem value="error">Erro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Nível</TableHead>
                <TableHead>Fonte</TableHead>
                <TableHead className="w-[40%]">Mensagem</TableHead>
                <TableHead>Usuário</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getLevelBadgeColor(log.level)}>
                        {log.level === "info" ? "INFO" : log.level === "warning" ? "AVISO" : "ERRO"}
                      </Badge>
                    </TableCell>
                    <TableCell>{log.source}</TableCell>
                    <TableCell>{log.message}</TableCell>
                    <TableCell>{log.user}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    Nenhum log encontrado com os critérios selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button variant="outline" className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10">
          <Download className="mr-2 h-4 w-4" /> Exportar Logs
        </Button>
        <Button variant="outline" className="text-destructive hover:bg-destructive/10">
          <Trash2 className="mr-2 h-4 w-4" /> Limpar Logs
        </Button>
      </CardFooter>
    </Card>
  )
}
