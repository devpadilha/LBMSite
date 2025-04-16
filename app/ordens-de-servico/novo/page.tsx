"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"

export default function NewServiceOrderPage() {
  const [formData, setFormData] = useState({
    municipality: "",
    description: "",
    requester: "",
    contract: "",
    priority: "normal",
    deadline: undefined as Date | undefined,
    responsible: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deadline: date }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to a database
    console.log("Form submitted:", formData)
    // Redirect to the main page
    window.location.href = "/ordens-de-servico"
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/ordens-de-servico" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de ordens
      </Link>

      <Card className="bg-card relative">
        {/* Adicionando a marca d'água */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-5">
          <div className="w-full h-full bg-contain bg-center bg-no-repeat" 
               style={{backgroundImage: "url('/images/lbm-logo.png')"}}></div>
        </div>
        
        <CardHeader>
          <CardTitle className="text-2xl">Nova Ordem de Serviço</CardTitle>
          <CardDescription>Preencha os dados para criar uma nova ordem de serviço</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="municipality">Município</Label>
                <Input
                  id="municipality"
                  name="municipality"
                  value={formData.municipality}
                  onChange={handleChange}
                  placeholder="Digite o município"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requester">Solicitante</Label>
                <Input
                  id="requester"
                  name="requester"
                  value={formData.requester}
                  onChange={handleChange}
                  placeholder="Nome do solicitante"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contract">Contrato</Label>
                <Select
                  value={formData.contract}
                  onValueChange={(value) => handleSelectChange("contract", value)}
                >
                  <SelectTrigger id="contract">
                    <SelectValue placeholder="Selecione o contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONT-2023-001">CONT-2023-001</SelectItem>
                    <SelectItem value="CONT-2023-002">CONT-2023-002</SelectItem>
                    <SelectItem value="CONT-2023-003">CONT-2023-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridade</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsible">Responsável</Label>
                <Input
                  id="responsible"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleChange}
                  placeholder="Nome do responsável"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo</Label>
                <DatePicker 
                  date={formData.deadline} 
                  setDate={handleDateChange}
                  placeholder="Selecione o prazo"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva detalhadamente o serviço a ser realizado"
                rows={4}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Informações adicionais relevantes"
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Link href="/ordens-de-servico">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">Criar Ordem de Serviço</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}