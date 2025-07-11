"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Home, MapPin, ArrowLeft, Save, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { createServiceOrder } from "@/app/actions/soActions"
import { ServiceOrderFormData, SOStatus } from "@/lib/types"
import { MultiSelect } from "@/components/ui/multi-select"

type Employee = { id: string; name: string | null };
type Bid = { id: string; number: string; object: string | null };

interface AddServiceOrderFormProps {
    municipalityId: string;
    employees: Employee[];
    bids: Bid[];
}

const osStatusOptions: SOStatus[] = ['Planejada', 'Em andamento', 'Concluida', 'Pausada', 'Cancelada'];

export function AddServiceOrderForm({ municipalityId, employees, bids }: AddServiceOrderFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<Omit<ServiceOrderFormData, 'municipality_id' | 'employees_ids'>>({
        number: "",
        description: "",
        status: "Planejada",
        requester: "",
        request_date: "",
        completion_date: "",
        bid_id: undefined,
    });
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSelectChange = (name: 'status' | 'responsible_employee_id' | 'bid_id', value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const submissionData = {
            ...formData,
            municipality_id: municipalityId,
            employees_ids: selectedEmployees,
            request_date: formData.request_date || undefined,
            completion_date: formData.completion_date || undefined,
        };
        
        const { error } = await createServiceOrder(submissionData);

        if (error) {
            toast({ title: "Erro ao salvar OS", description: error, type: "error" });
        } else {
            toast({ title: "Ordem de Serviço salva!", description: "A nova OS foi registrada com sucesso." });
            router.push(`/municipios/${municipalityId}`);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="p-6">
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem><BreadcrumbLink href="/"><Home className="h-4 w-4 mr-1" />Início</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="/municipios">Municípios</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href={`/municipios/${municipalityId}`}><MapPin className="h-4 w-4 mr-1" />Município</BreadcrumbLink></BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem><BreadcrumbLink href="#">Nova Ordem de Serviço</BreadcrumbLink></BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Adicionar Ordem de Serviço</h1>
                    <p className="text-muted-foreground">Preencha os detalhes da nova OS.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href={`/municipios/${municipalityId}`}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Link>
                </Button>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader><CardTitle>Dados da Ordem de Serviço</CardTitle></CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="number">Número da OS</Label>
                                <Input id="number" name="number" value={formData.number} onChange={handleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {osStatusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição do Serviço</Label>
                            <Input id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Ex: Manutenção preventiva em ar-condicionado" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="responsible_employee_id">Funcionário Responsável</Label>
                                <MultiSelect
                                    options={employees.map(emp => ({ value: emp.id, label: emp.name || 'Sem nome' }))}
                                    selected={selectedEmployees}
                                    onChange={setSelectedEmployees}
                                    placeholder="Selecione os funcionários..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bid_id">Licitação Vinculada (Opcional)</Label>
                                <Select name="bid_id" value={formData.bid_id} onValueChange={(value) => handleSelectChange('bid_id', value)}>
                                    <SelectTrigger><SelectValue placeholder="Selecione uma licitação..." /></SelectTrigger>
                                    <SelectContent>
                                        {bids.map(bid => <SelectItem key={bid.id} value={bid.id}>{bid.number} - {bid.object}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="requester">Solicitante</Label>
                                <Input id="requester" name="requester" value={formData.requester} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="request_date">Data da Solicitação</Label>
                                <Input id="request_date" name="request_date" type="date" value={formData.request_date} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="completion_date">Data de Conclusão</Label>
                                <Input id="completion_date" name="completion_date" type="date" value={formData.completion_date} onChange={handleChange} />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t pt-6">
                        <Button type="submit" className="bg-[#EC610D] hover:bg-[#EC610D]/90" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</> : <><Save className="mr-2 h-4 w-4" /> Salvar Ordem de Serviço</>}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}