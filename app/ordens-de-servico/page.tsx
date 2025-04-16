import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"

export default function ServiceOrdersPage() {
    const serviceOrders = [
        {
          id: "OS-001",
          municipality: "São Paulo",
          description: "Manutenção de equipamentos de informática",
          status: "pendente",
        },
        {
          id: "OS-002",
          municipality: "Rio de Janeiro",
          description: "Instalação de rede de fibra óptica",
          status: "concluído",
        },
        {
          id: "OS-003",
          municipality: "Belo Horizonte",
          description: "Reparo em sistema de ar condicionado",
          status: "concluído",
        },
        {
          id: "OS-004",
          municipality: "Brasília",
          description: "Manutenção preventiva em elevadores",
          status: "pendente",
        },
        {
          id: "OS-005",
          municipality: "Salvador",
          description: "Instalação de sistema de segurança",
          status: "pendente",
        },
      ]

  const columns = [
    { key: "id", label: "ID" },
    { key: "municipality", label: "Município" },
    { key: "description", label: "Descrição"},
    { key: "status", label: "Status" },
  ]

  const renderCell = (order: { 
    id: string;
    municipality: string;
    status: string;
    description: string;
  }, column: string) => {
    switch (column) {
      case "id":
        return <span className="font-medium">{order.id}</span>
      case "municipality":
        return <span className="font-medium">{order.municipality}</span>
      case "description":
        return <span className="font-medium">{order.description}</span>
      case "status":
        return (
          <Badge 
            className={order.status === "pendente" 
              ? "bg-slate-600 text-slate-50" 
              : "bg-orange-500 text-white"}
          >
            {order.status === "pendente" ? "Pendente" : "Concluído"}
          </Badge>
        )
      default:
        return order[column as keyof typeof order]
    }
  }

  return (
    <DataTable
      title="Ordens de Serviço"
      description="Gerencie todas as ordens de serviço em um só lugar"
      searchPlaceholder="Buscar ordens..."
      newItemText="Nova Ordem"
      newItemPath="/ordens-de-servico/novo"
      columns={columns}
      data={serviceOrders}
      renderCell={renderCell}
      detailsPath={(id) => `/ordens-de-servico/${id}`}
    />
  )
}

