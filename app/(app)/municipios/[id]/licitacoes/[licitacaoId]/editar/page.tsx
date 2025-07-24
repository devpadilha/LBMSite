"use client";

import { ArrowLeft, Home, Loader2, MapPin, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { Enums, Tables } from "@/types/database.types";

import { getBidById, updateBid } from "@/app/actions/bidActions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

// Tipos
type Bid = Tables<"bids">;
type BidStatus = Enums<"bid_status">;
type BidModality = Enums<"bid_modality">;
type BidWithMunicipality = Bid & { municipalities: Tables<"municipalities"> | null };

const bidStatusOptions: BidStatus[] = ["Planejada", "Em andamento", "Concluida", "Suspensa", "Cancelada"];
const bidModalityOptions: BidModality[] = ["Pregao", "Concorrencia", "Concurso", "Leilao", "Dialogo Competitivo"];

// A assinatura agora recebe os dois parâmetros da nova URL
export default function EditarLicitacaoPage({ params }: { params: { municipalityId: string; licitacaoId: string } }) {
  const router = useRouter();
  // Capturamos os dois IDs
  const { municipalityId, licitacaoId } = params;

  const [bid, setBid] = useState<BidWithMunicipality | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    edital_number: "",
    object: "",
    description: "",
    status: "Planejada" as BidStatus,
    modality: "Pregao" as BidModality,
    estimated_value: "",
    opening_date: "",
    approval_date: "",
    edital_source_url: "",
  });

  useEffect(() => {
    async function fetchBidData() {
      // Usa o licitacaoId para buscar os dados
      const fetchedBid = await getBidById(licitacaoId);
      if (fetchedBid && fetchedBid.municipalities) {
        setBid(fetchedBid);
        setFormData({
          edital_number: fetchedBid.edital_number || "",
          object: fetchedBid.object || "",
          description: fetchedBid.description || "",
          status: fetchedBid.status,
          modality: fetchedBid.modality || "Pregao",
          estimated_value: fetchedBid.estimated_value?.toString() || "",
          opening_date: fetchedBid.opening_date ? fetchedBid.opening_date.split("T")[0] : "",
          approval_date: fetchedBid.approval_date ? fetchedBid.approval_date.split("T")[0] : "",
          edital_source_url: fetchedBid.edital_source_url || "",
        });
      }
      else {
        router.push("/not-found");
      }
      setIsLoading(false);
    }

    fetchBidData();
  }, [licitacaoId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: "status" | "modality", value: string) => {
    setFormData(prev => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submissionData = {
      ...formData,
      estimated_value: formData.estimated_value ? Number.parseFloat(formData.estimated_value) : null,
      opening_date: formData.opening_date || null,
      approval_date: formData.approval_date || null,
    };

    const { error } = await updateBid(licitacaoId, municipalityId, submissionData);

    if (error) {
      toast({ title: "Erro ao atualizar", description: error.message, type: "error" });
    }
    else {
      toast({ title: "Licitação atualizada!", description: "As alterações foram salvas com sucesso." });
      router.push(`/municipios/${municipalityId}/licitacoes/${licitacaoId}`);
      router.refresh();
    }

    setIsSubmitting(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!bid)
    return null;

  return (
    <div className="p-6">
      <Breadcrumb className="mb-6">
        {/* O Breadcrumb agora usa os IDs dos params */}
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
              {bid.municipalities?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/municipios/${municipalityId}/licitacoes/${licitacaoId}`}>
              Licitação
              {bid.edital_number || "Sem Número"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Editar</BreadcrumbLink></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Editar Licitação</h1>
          <p className="text-muted-foreground">Altere os detalhes do processo licitatório.</p>
        </div>
        <Button variant="outline" asChild>
          {/* O botão voltar também usa a nova URL */}
          <Link href={`/municipios/${municipalityId}/licitacoes/${licitacaoId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {" "}
            Voltar
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* O restante do formulário continua o mesmo */}
        <Card>
          <CardHeader>
            <CardTitle>Dados da Licitação</CardTitle>
            <CardDescription>Informações principais do processo.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edital_number">Número do Edital</Label>
                <Input id="edital_number" name="edital_number" value={formData.edital_number} onChange={handleChange} placeholder="Ex: 001/2025" />
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
            <div className="space-y-2">
              <Label htmlFor="edital_source_url">Link da Fonte Oficial do Edital</Label>
              <Input id="edital_source_url" name="edital_source_url" value={formData.edital_source_url} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" value={formData.status} onValueChange={value => handleSelectChange("status", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{bidStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade</Label>
                <Select name="modality" value={formData.modality} onValueChange={value => handleSelectChange("modality", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{bidModalityOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
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
                      Salvar Alterações
                    </>
                  )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
