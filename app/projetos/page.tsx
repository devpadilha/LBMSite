import { Badge } from "@/components/ui/badge"
import { DataTable } from "@/components/data-table"

export default function ProjectsPage() {
  // Sample data - in a real app, this would come from a database
  const projects = [
    {
      id: "PROJ-001",
      name: "Instalação Elétrica - São Paulo",
      description: "Instalação completa de rede elétrica em prédio comercial",
      deadline: "2023-06-15",
      status: "ativo",
      employees: 8,
      progress: 85,
      client: "Construtora ABC",
    },
    {
      id: "PROJ-002",
      name: "Reforma Predial - Rio de Janeiro",
      description: "Reforma estrutural em edifício residencial",
      deadline: "2023-07-20",
      status: "ativo",
      employees: 6,
      progress: 60,
      client: "Condomínio Vista Mar",
    },
    {
      id: "PROJ-003",
      name: "Manutenção de Equipamentos - Brasília",
      description: "Manutenção preventiva em equipamentos hospitalares",
      deadline: "2023-08-10",
      status: "ativo",
      employees: 4,
      progress: 40,
      client: "Hospital Central",
    },
    {
      id: "PROJ-004",
      name: "Instalação de Rede - Belo Horizonte",
      description: "Instalação de rede de fibra óptica em campus universitário",
      deadline: "2023-05-30",
      status: "ativo",
      employees: 3,
      progress: 95,
      client: "Universidade Federal",
    },
    {
      id: "PROJ-005",
      name: "Sistema de Segurança - Salvador",
      description: "Implementação de sistema de segurança em shopping center",
      deadline: "2023-09-15",
      status: "inativo",
      employees: 0,
      progress: 100,
      client: "Shopping Bahia",
    },
  ]

  const activeProjects = projects.filter((p) => p.status === "ativo")

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Nome" },
    { key: "client", label: "Cliente", className: "hidden md:table-cell" },
    { key: "deadline", label: "Prazo", className: "hidden lg:table-cell" },
    { key: "employees", label: "Funcionários", className: "hidden md:table-cell" },
    { key: "progress", label: "Progresso" },
    { key: "status", label: "Status" },
  ]

  const renderCell = (project: { 
    id: string;
    name: string;
    description: string;
    deadline: string;
    status: string;
    employees: number;
    progress: number;
    client: string;
  }, column: string) => {
    switch (column) {
      case "id":
        return <span className="font-medium">{project.id}</span>
      case "deadline":
        return new Date(project.deadline).toLocaleDateString("pt-BR")
      case "status":
        return (
          <Badge variant={project.status === "ativo" ? "default" : "secondary"} className="bg-orange-500 text-white">
            {project.status === "ativo" ? "Ativo" : "Inativo"}
          </Badge>
        )
      case "progress":
        return `${project.progress}%`
      default:
        return project[column as keyof typeof project]
    }
  }

  return (
    <DataTable
      title="Projetos"
      description="Gerencie todos os projetos da LBM Engenharia"
      searchPlaceholder="Buscar projetos..."
      newItemText="Novo Projeto"
      newItemPath="/projetos/novo"
      columns={columns}
      data={activeProjects}
      renderCell={renderCell}
      detailsPath={(id) => `/projetos/${id}`}
    />
  )
}

