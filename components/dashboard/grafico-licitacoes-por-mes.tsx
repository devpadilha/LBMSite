"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Nov", licitacoes: 12, contratos: 8 },
  { name: "Dez", licitacoes: 15, contratos: 10 },
  { name: "Jan", licitacoes: 18, contratos: 12 },
  { name: "Fev", licitacoes: 14, contratos: 9 },
  { name: "Mar", licitacoes: 20, contratos: 15 },
  { name: "Abr", licitacoes: 22, contratos: 14 },
]

export function GraficoLicitacoesPorMes() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value, name) => [value, name === "licitacoes" ? "Licitações" : "Contratos"]} />
        <Legend formatter={(value) => (value === "licitacoes" ? "Licitações" : "Contratos")} />
        <Bar dataKey="licitacoes" fill="#EC610D" radius={[4, 4, 0, 0]} />
        <Bar dataKey="contratos" fill="#2A3C56" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
