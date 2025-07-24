"use client";

import { Calendar, Edit, FileJson, FileText, Home, Link as LinkIcon, Loader2, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { getServiceOrderById } from "@/app/actions/soActions";

import { updateServiceOrderEmployees } from "@/app/actions/soActions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MultiSelect } from "@/components/ui/multi-select";
import { toast } from "@/components/ui/use-toast";

// Tipos para os dados recebidos
type ServiceOrderWithRelations = Awaited<ReturnType<typeof getServiceOrderById>>;

type ServiceOrderDetailProps = {
  initialServiceOrder: NonNullable<ServiceOrderWithRelations>;
  allEmployees: { id: string; name: string | null }[];
};

export function ServiceOrderDetail({ initialServiceOrder, allEmployees }: ServiceOrderDetailProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [serviceOrder, setServiceOrder] = useState(initialServiceOrder);

  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>(
    serviceOrder.service_order_employees.map((e: { employee_id: any }) => e.employee_id),
  );

  const handleUpdateTeam = async () => {
    setIsUpdating(true);
    const { error } = await updateServiceOrderEmployees(serviceOrder.id, selectedEmployeeIds);

    if (error) {
      toast({ title: "Erro ao atualizar equipe", description: error, type: "error" });
    }
    else {
      toast({ title: "Equipe atualizada com sucesso!" });
      router.refresh();
    }
    setIsUpdating(false);
    const closeButton = document.querySelector("[data-radix-dialog-close]");
    if (closeButton instanceof HTMLElement) {
      closeButton.click();
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString)
      return "Não informada";
    return new Date(dateString).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Em andamento": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Pausada": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Cancelada": return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Planejada": return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
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
            <BreadcrumbLink href={`/municipios/${serviceOrder.municipality_id}`}>
              <MapPin className="h-4 w-4 mr-1" />
              {serviceOrder.municipalities?.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#">
              OS
              {serviceOrder.number}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">
              OS
              {serviceOrder.number}
            </h1>
            <Badge className={getStatusColor(serviceOrder.status)}>{serviceOrder.status}</Badge>
          </div>
          <p className="text-muted-foreground">{serviceOrder.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            {" "}
            Editar
          </Button>
          <Button>
            <LinkIcon className="mr-2 h-4 w-4" />
            {" "}
            Relatório
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detalhes da Ordem de Serviço</CardTitle>
            <CardDescription>Informações gerais e de solicitação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Solicitante</p>
                  <p className="text-muted-foreground">{serviceOrder.requester || "Não informado"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Data da Solicitação</p>
                  <p className="text-muted-foreground">{formatDate(serviceOrder.request_date)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-1 flex-shrink-0 text-green-500" />
                <div>
                  <p className="font-medium">Data de Conclusão</p>
                  <p className="text-muted-foreground">{formatDate(serviceOrder.completion_date)}</p>
                </div>
              </div>
            </div>
            {serviceOrder.bids && (
              <div className="flex items-start gap-3 text-sm pt-4 border-t">
                <FileJson className="h-5 w-5 mt-1 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-medium">Licitação Referente</p>
                  <Button variant="link" className="p-0 h-auto text-[#EC610D]" asChild>
                    <Link href={`/municipios/${serviceOrder.municipality_id}/licitacoes/${serviceOrder.bid_id}`}>
                      {serviceOrder.bids.number}
                      {" "}
                      -
                      {serviceOrder.bids.object}
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Equipe Responsável</CardTitle>
              <CardDescription>Funcionários designados</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  {" "}
                  Editar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Editar Equipe Responsável</DialogTitle>
                  <DialogDescription>Selecione os funcionários para esta Ordem de Serviço.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <MultiSelect
                    options={allEmployees.map(e => ({ value: e.id, label: e.name || "Sem nome" }))}
                    selected={selectedEmployeeIds}
                    onChange={setSelectedEmployeeIds}
                    placeholder="Selecione os funcionários..."
                  />
                </div>
                <DialogFooter>
                  <DialogTrigger asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogTrigger>
                  <Button onClick={handleUpdateTeam} disabled={isUpdating}>
                    {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceOrder.service_order_employees.length > 0
              ? (
                  serviceOrder.service_order_employees.map(({ profiles: employee }: { profiles: any }) => (
                    employee && (
                      <div key={employee.id} className="flex items-center gap-4">
                        <Avatar>
                          <AvatarImage src={employee.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{employee.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.role}</p>
                        </div>
                      </div>
                    )
                  ))
                )
              : (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum funcionário designado.</p>
                )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
