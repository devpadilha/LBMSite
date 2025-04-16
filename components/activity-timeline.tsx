import { CalendarClock, FileText, User, Wrench } from "lucide-react"

const activities = [
  {
    id: 1,
    title: "Novo memorial descritivo adicionado",
    project: "Instalação Elétrica",
    user: "Carlos Oliveira",
    time: "Hoje às 14:30",
    icon: FileText,
  },
  {
    id: 2,
    title: "Ordem de serviço #OS-006 concluída",
    project: "",
    user: "Maria Santos",
    time: "Hoje às 11:15",
    icon: Wrench,
  },
  {
    id: 3,
    title: "Novo projeto criado",
    project: "Manutenção Preventiva - Salvador",
    user: "João Silva",
    time: "Ontem às 16:45",
    icon: CalendarClock,
  },
  {
    id: 4,
    title: "Funcionário designado para projeto",
    project: "Reforma Predial",
    user: "Ana Pereira",
    time: "Ontem às 10:20",
    icon: User,
  },
]

export function ActivityTimeline() {
  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <activity.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            {activity.project && <p className="text-xs text-muted-foreground">Projeto: {activity.project}</p>}
            <p className="text-xs text-muted-foreground">
              {activity.time} - por {activity.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

