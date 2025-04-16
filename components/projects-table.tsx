import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: "PROJ-001",
    name: "Instalação Elétrica - São Paulo",
    deadline: "2023-06-15",
    progress: 85,
    status: "crítico",
    daysLeft: 15,
  },
  {
    id: "PROJ-002",
    name: "Reforma Predial - Rio de Janeiro",
    deadline: "2023-07-20",
    progress: 60,
    status: "normal",
    daysLeft: 30,
  },
  {
    id: "PROJ-003",
    name: "Manutenção de Equipamentos - Brasília",
    deadline: "2023-08-10",
    progress: 40,
    status: "normal",
    daysLeft: 45,
  },
]

export function ProjectsTable() {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="p-4 rounded-lg border bg-card">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-sm">{project.name}</h3>
              <p className="text-xs text-muted-foreground">
                Prazo: {new Date(project.deadline).toLocaleDateString("pt-BR")} ({project.daysLeft} dias)
              </p>
            </div>
            <Badge variant={project.status === "crítico" ? "destructive" : "outline"}>
              {project.status === "crítico" ? "Crítico" : "Em andamento"}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between mb-1">
              <span className="text-xs text-muted-foreground">Progresso</span>
              <span className="text-xs font-medium">{project.progress}%</span>
            </div>
            <Progress
              value={project.progress}
              className="h-2"
              indicatorClassName={project.status === "crítico" ? "bg-destructive" : "bg-primary"}
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Link href={`/projetos/${project.id}`}>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                Detalhes
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

