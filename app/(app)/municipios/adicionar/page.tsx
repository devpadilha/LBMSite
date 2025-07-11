"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, MapPin } from "lucide-react"
import Link from "next/link"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { toast } from "@/components/ui/use-toast"
import { createMunicipality } from "@/app/actions/municipalityActions" 

// Um hook customizado para "atrasar" a busca (debounce) e não sobrecarregar a API
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

const estadosBrasileiros = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export default function AdicionarMunicipioPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeocoding, setIsGeocoding] = useState(false)

  // Estado do formulário limpo, sem população e área
  const [formData, setFormData] = useState({
    name: "",
    state: "MS",
    description: "",
    latitude: "",
    longitude: "",
    mayor: "",
    phone: "",
    email: "",
    official_site: "",
  })

  // Usamos o debounce para acionar a busca de geolocalização
  const debouncedName = useDebounce(formData.name, 800)

  // Função para buscar as coordenadas na API do Nominatim
  const fetchCoordinates = useCallback(async () => {
    if (!debouncedName || !formData.state) return

    setIsGeocoding(true)
    const query = `${debouncedName}, ${formData.state}, Brazil`
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`

    try {
      const response = await fetch(url)
      const data = await response.json()
      if (data && data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: data[0].lat,
          longitude: data[0].lon,
        }))
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error)
      toast({
        title: "Erro de Geocodificação",
        description: "Não foi possível encontrar as coordenadas para este município.",
        type: "error"
      })
    } finally {
      setIsGeocoding(false)
    }
  }, [debouncedName, formData.state])

  // useEffect para chamar a busca de coordenadas quando o nome ou estado (debounced) mudar
  useEffect(() => {
    fetchCoordinates()
  }, [fetchCoordinates])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, state: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepara os dados para a Server Action
    const submissionData = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    }

    // Chama a Server Action
    const { error } = await createMunicipality(submissionData)

    if (error) {
      toast({
        title: "Erro ao salvar",
        description: error,
        type: "error"
      })
    } else {
      toast({
        title: "Município salvo!",
        description: `O município ${formData.name} foi salvo com sucesso.`,
      })
      router.push("/municipios")
    }

    setIsSubmitting(false)
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
      </Breadcrumb>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Município</h1>
          <p className="text-muted-foreground">Cadastre um novo município no sistema</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/municipios"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
        </Button>
      </div>


      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações do Município</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do Município</Label>
                  <Input id="name" name="name" placeholder="Ex: Ponta Grossa" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Select name="state" value={formData.state} onValueChange={handleSelectChange}>
                    <SelectTrigger id="state"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {estadosBrasileiros.map((estado) => (
                        <SelectItem key={estado.sigla} value={estado.sigla}>
                          {estado.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" name="description" placeholder="Descreva o município..." value={formData.description} onChange={handleChange} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localização Geográfica</CardTitle>
              <CardDescription>Atualizada automaticamente</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[200px] bg-muted rounded-md flex items-center justify-center border border-dashed text-center">
                {isGeocoding ? (
                  <p className="text-sm text-muted-foreground flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Buscando...</p>
                ) : formData.latitude && formData.longitude ? (
                  <LocalizacaoEncontrada
                    latitude={parseFloat(formData.latitude)}
                    longitude={parseFloat(formData.longitude)}
                    nome={formData.name || "Localização"}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground p-4"><MapPin className="mx-auto mb-2 h-6 w-6" />Digite um nome e selecione um estado para buscar a localização.</p>
                )}
              </div>
            </CardContent>
          </Card>


          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Informações Adicionais</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <div>
                <Label htmlFor="mayor">Prefeito(a)</Label>
                <Input id="mayor" name="mayor" value={formData.mayor} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="official_site">Site Oficial</Label>
                <Input id="official_site" name="official_site" value={formData.official_site} onChange={handleChange} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-4 mt-4">
              <Button type="submit" className="bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isSubmitting || isGeocoding}>
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

function LocalizacaoEncontrada({ latitude, longitude, nome }: { latitude: number; longitude: number; nome: string }) {
  // Constrói o link direto para o Google Maps com controle de zoom
  const googleMapsUrl = `https://www.google.com/maps/@${latitude},${longitude},12z`;

  return (
    <div className="w-full h-full p-4 flex flex-col items-center justify-center text-center bg-green-50 dark:bg-green-900/10 border-green-200">
      <MapPin className="h-10 w-10 text-green-600 mb-3" />
      <p className="font-semibold text-green-800 dark:text-green-300">Localização Encontrada!</p>
      <p className="text-xs text-muted-foreground mb-4">{`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`}</p>

      <Button
        asChild
        variant="outline"
        className="w-full"
      >
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
          Ver no Google Maps
        </a>
      </Button>
    </div>
  );
}