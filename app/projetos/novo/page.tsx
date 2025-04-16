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

export default function NewProjectPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    client: "",
    deadline: "",
    status: "ativo",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save the data to a database
    console.log("Form submitted:", formData)
    // Redirect to the projects page
    window.location.href = "/projetos"
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/projetos" className="flex items-center text-sm text-muted-foreground mb-4 hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de projetos
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Novo Projeto</CardTitle>
          <CardDescription>Preencha os dados para criar um novo projeto</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Projeto</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Digite o nome do projeto"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  name="client"
                  placeholder="Nome do cliente"
                  value={formData.client}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Projeto</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Descreva o projeto detalhadamente"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deadline">Prazo de Entrega</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(value) => handleSelectChange("status", value)} defaultValue="ativo">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Link href="/projetos">
              <Button variant="outline">Cancelar</Button>
            </Link>
            <Button type="submit">Criar Projeto</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

