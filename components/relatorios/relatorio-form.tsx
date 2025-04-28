"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"

export function RelatorioForm() {
  const [date, setDate] = useState<Date>()

  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="tipo">Tipo de Relatório</Label>
        <Select>
          <SelectTrigger id="tipo">
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="municipios">Municípios</SelectItem>
            <SelectItem value="licitacoes">Licitações</SelectItem>
            <SelectItem value="contratos">Contratos</SelectItem>
            <SelectItem value="os">Ordens de Serviço</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="municipio">Município</Label>
        <Select>
          <SelectTrigger id="municipio">
            <SelectValue placeholder="Selecione o município" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="1">São Paulo</SelectItem>
            <SelectItem value="2">Rio de Janeiro</SelectItem>
            <SelectItem value="3">Belo Horizonte</SelectItem>
            <SelectItem value="4">Salvador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Período</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <Label htmlFor="dataInicio">Data Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="dataInicio">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="dataFim">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Campos a incluir</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="campo1" defaultChecked />
            <Label htmlFor="campo1">Dados básicos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campo2" defaultChecked />
            <Label htmlFor="campo2">Valores</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campo3" defaultChecked />
            <Label htmlFor="campo3">Status</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campo4" />
            <Label htmlFor="campo4">Responsáveis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campo5" />
            <Label htmlFor="campo5">Histórico</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="campo6" />
            <Label htmlFor="campo6">Anexos</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="formato">Formato de Saída</Label>
        <Select defaultValue="pdf">
          <SelectTrigger id="formato">
            <SelectValue placeholder="Selecione o formato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="excel">Excel</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full">Gerar Relatório</Button>
    </form>
  )
}
