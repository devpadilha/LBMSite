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
import { ReportType, ReportFilter, Report } from "@/models/report.model"
import { RelatorioPreview } from "./relatorio-preview"

export function RelatorioForm() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reportFilter, setReportFilter] = useState<ReportFilter>({
    startDate: '',
    endDate: '',
    municipalityId: undefined,
    bidId: undefined,
    status: '',
    type: ''
  })
  
  // Estado para controlar as opções de exibição
  const [displayOptions, setDisplayOptions] = useState({
    showBasicData: true,
    showValues: true,
    showStatus: true,
    showResponsibles: false,
    showHistory: false,
    showAttachments: false
  })
  
  // Estado para o formato de saída
  const [outputFormat, setOutputFormat] = useState('pdf')
  
  // Estado para controlar a visualização do relatório
  const [showPreview, setShowPreview] = useState(false)
  
  // Estado para armazenar o relatório gerado
  const [generatedReport, setGeneratedReport] = useState<Report | undefined>()

  // Função para gerar o relatório
  const generateReport = () => {
    // Criar um objeto Report com base nos filtros e opções selecionados
    const report: Report = {
      id: Math.floor(Math.random() * 1000), // ID aleatório para simulação
      title: `Relatório de ${reportFilter.type === 'bid' ? 'Licitações' : reportFilter.type === 'municipality' ? 'Municípios' : 'Desempenho'}`,
      description: `Relatório gerado em ${new Date().toLocaleDateString('pt-BR')}`,
      type: reportFilter.type as ReportType || 'bid',
      createdAt: new Date().toISOString(),
      filters: reportFilter,
      displayOptions: {
        showCharts: true,
        showTables: true,
        ...displayOptions
      },
      stats: {
        totalItems: 15, // Valores simulados
        totalValue: 2500000,
        averageValue: 166666
      }
    };
    
    setGeneratedReport(report);
    setShowPreview(true);
  };
  
  return (
    <div className="space-y-8">
      <form className="space-y-6 p-4 border rounded-lg">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Relatório</Label>
          <Select 
            onValueChange={(value: ReportType) => {
              setReportFilter(prev => ({ ...prev, type: value }))
            }}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="municipality">Municípios</SelectItem>
              <SelectItem value="bid">Licitações</SelectItem>
              <SelectItem value="performance">Desempenho</SelectItem>
            </SelectContent>
          </Select>
        </div>

      <div className="space-y-2">
        <Label htmlFor="municipio">Município</Label>
        <Select
          onValueChange={(value) => {
            const municipalityId = value === 'todos' ? undefined : parseInt(value)
            setReportFilter(prev => ({ ...prev, municipalityId }))
          }}
        >
          <SelectTrigger id="municipio">
            <SelectValue placeholder="Selecione o município" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="1">Campo Grande</SelectItem>
            <SelectItem value="2">Sidrolândia</SelectItem>
            <SelectItem value="3">Terenos</SelectItem>
            <SelectItem value="4">Jaraguari</SelectItem>
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
                  {startDate ? format(startDate, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={startDate} 
                  onSelect={(date) => {
                    setStartDate(date)
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd")
                      setReportFilter(prev => ({ ...prev, startDate: formattedDate }))
                    }
                  }} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dataFim">Data Fim</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal" id="dataFim">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar 
                  mode="single" 
                  selected={endDate} 
                  onSelect={(date) => {
                    setEndDate(date)
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd")
                      setReportFilter(prev => ({ ...prev, endDate: formattedDate }))
                    }
                  }} 
                  initialFocus 
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Campos a incluir</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo1" 
              checked={displayOptions.showBasicData}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showBasicData: !!checked }))
              }}
            />
            <Label htmlFor="campo1">Dados básicos</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo2" 
              checked={displayOptions.showValues}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showValues: !!checked }))
              }}
            />
            <Label htmlFor="campo2">Valores</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo3" 
              checked={displayOptions.showStatus}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showStatus: !!checked }))
              }}
            />
            <Label htmlFor="campo3">Status</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo4" 
              checked={displayOptions.showResponsibles}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showResponsibles: !!checked }))
              }}
            />
            <Label htmlFor="campo4">Responsáveis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo5" 
              checked={displayOptions.showHistory}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showHistory: !!checked }))
              }}
            />
            <Label htmlFor="campo5">Histórico</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="campo6" 
              checked={displayOptions.showAttachments}
              onCheckedChange={(checked) => {
                setDisplayOptions(prev => ({ ...prev, showAttachments: !!checked }))
              }}
            />
            <Label htmlFor="campo6">Anexos</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="formato">Formato de Saída</Label>
        <Select 
          defaultValue="pdf"
          onValueChange={(value) => setOutputFormat(value)}
        >
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

      <Button 
        className="w-full"
        onClick={(e) => {
          e.preventDefault()
          generateReport()
        }}
      >
        Gerar Relatório
      </Button>
    </form>
    
    {showPreview && generatedReport && (
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pré-visualização do Relatório</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowPreview(false)}
          >
            Fechar Pré-visualização
          </Button>
        </div>
        <RelatorioPreview report={generatedReport} />
      </div>
    )}
  </div>
  )
}
