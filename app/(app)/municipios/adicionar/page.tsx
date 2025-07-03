"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { toast } from "@/components/ui/use-toast"

export default function AdicionarMunicipioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: "",
    estado: "MS",
    populacao: "",
    area: "",
    descricao: "",
    latitude: "",
    longitude: "",
    prefeito: "",
    telefone: "",
    email: "",
    site: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulando o envio para uma API
    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "Município adicionado",
        description: `O município ${formData.nome} foi adicionado com sucesso.`,
      })

      // Redirecionar para a lista de municípios
      router.push("/municipios")
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/municipios/adicionar">Adicionar Município</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Município</h1>
          <p className="text-muted-foreground">Cadastre um novo município no sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/municipios">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Link>
          </Button>
          <Button className="bg-[#EC610D] hover:bg-[#EC610D]/90" onClick={handleSubmit} disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Salvando..." : "Salvar Município"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Preencha os dados básicos do município</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Município</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: Campo Grande"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select defaultValue={formData.estado} onValueChange={(value) => handleSelectChange("estado", value)}>
                    <SelectTrigger id="estado">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                      <SelectItem value="MT">Mato Grosso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="populacao">População</Label>
                  <Input
                    id="populacao"
                    type="number"
                    placeholder="Ex: 900000"
                    value={formData.populacao}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Área (km²)</Label>
                  <Input id="area" type="number" placeholder="Ex: 8000" value={formData.area} onChange={handleChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva informações relevantes sobre o município"
                  rows={4}
                  value={formData.descricao}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Localização</CardTitle>
              <CardDescription>Coordenadas geográficas do município</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" placeholder="Ex: -20.4697" value={formData.latitude} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" placeholder="Ex: -54.6201" value={formData.longitude} onChange={handleChange} />
              </div>
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center border border-dashed">
                {formData.latitude && formData.longitude ? (
                  <div className="w-full h-full">
                    <MunicipioMapPreview
                      latitude={Number.parseFloat(formData.latitude)}
                      longitude={Number.parseFloat(formData.longitude)}
                      nome={formData.nome || "Novo Município"}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Visualização do mapa será exibida após informar as coordenadas
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="border-b">
              <CardTitle>Informações Adicionais</CardTitle>
              <CardDescription>Dados complementares do município</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefeito">Prefeito(a)</Label>
                  <Input
                    id="prefeito"
                    placeholder="Nome do prefeito atual"
                    value={formData.prefeito}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    placeholder="Ex: (67) 3333-4444"
                    value={formData.telefone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ex: contato@municipio.ms.gov.br"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="site">Site Oficial</Label>
                <Input
                  id="site"
                  placeholder="Ex: https://www.municipio.ms.gov.br"
                  value={formData.site}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4">
              <Button type="submit" className="bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Salvando..." : "Salvar Município"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}

// Componente de pré-visualização do mapa para o formulário
function MunicipioMapPreview({ latitude, longitude, nome }: { latitude: number; longitude: number; nome: string }) {
  return (
    <div className="w-full h-full relative rounded-md overflow-hidden">
      <img
        src={`https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=10&size=400x200&markers=${latitude},${longitude},orange`}
        alt={`Mapa de ${nome}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md">{nome}</div>
    </div>
  )
}
