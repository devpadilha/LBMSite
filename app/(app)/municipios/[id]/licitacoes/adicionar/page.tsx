"use client";

import { ArrowLeft, Home, Loader2, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { BidModality, BidStatus } from "@/lib/types";

import { createBid } from "@/app/actions/bidActions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const bidStatusOptions: BidStatus[] = [
  "Planejada",
  "Em andamento",
  "Concluida",
  "Suspensa",
  "Cancelada",
];

const bidModalityOptions: BidModality[] = [
  "Pregao",
  "Concorrencia",
  "Concurso",
  "Leilao",
  "Dialogo Competitivo",
];

export default function AdicionarLicitacaoPage({ params: { id: municipalityId } }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    number: "",
    object: "",
    description: "",
    status: "Planejada",
    modality: "Pregao",
    estimated_value: "",
    opening_date: "",
    approval_date: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "status" | "modality", value: string) => {
    if (name === "status") {
      setFormData(prev => ({ ...prev, status: value as BidStatus }));
    }
    if (name === "modality") {
      setFormData(prev => ({ ...prev, modality: value as BidModality }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      municipality_id: municipalityId,
      estimated_value: formData.estimated_value ? Number.parseFloat(formData.estimated_value) : undefined,
      // Garante que datas vazias sejam enviadas como null
      opening_date: formData.opening_date || undefined,
      approval_date: formData.approval_date || undefined,
    };

    const { error } = await createBid(submissionData as any);

    if (error) {
      toast({ title: "Erro ao salvar", description: error, type: "error" });
    }
    else {
      toast({ title: "Licitação salva!", description: "O novo processo licitatório foi registrado com sucesso." });
      router.push(`/municipios/${municipalityId}`);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-1" />
              Início
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/municipios/${municipalityId}`}>
              <MapPin className="h-4 w-4 mr-1" />
              Município
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Nova Licitação</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Adicionar Nova Licitação</h1>
          <p className="text-muted-foreground">Preencha os detalhes do novo processo licitatório.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/municipios/${municipalityId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {" "}
            Voltar
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Dados da Licitação</CardTitle>
            <CardDescription>Informações principais do processo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="number">Número da Licitação</Label>
                <Input id="number" name="number" value={formData.number} onChange={handleChange} placeholder="Ex: 001/2025" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="object">Objeto</Label>
                <Input id="object" name="object" value={formData.object} onChange={handleChange} placeholder="Ex: Aquisição de material de escritório" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição do Objeto</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Detalhe o que será licitado..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={value => handleSelectChange("status", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {bidStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade</Label>
                <Select name="modality" value={formData.modality} onValueChange={value => handleSelectChange("modality", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {bidModalityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_value">Valor Estimado (R$)</Label>
                <Input id="estimated_value" name="estimated_value" type="number" step="0.01" value={formData.estimated_value} onChange={handleChange} placeholder="Ex: 15000.00" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opening_date">Data de Abertura</Label>
                <Input id="opening_date" name="opening_date" type="date" value={formData.opening_date} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="approval_date">Data de Homologação</Label>
                <Input id="approval_date" name="approval_date" type="date" value={formData.approval_date} onChange={handleChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-6">
            <Button type="submit" className="bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isSubmitting}>
              {isSubmitting
                ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {" "}
                      Salvando...
                    </>
                  )
                : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {" "}
                      Salvar Licitação
                    </>
                  )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
