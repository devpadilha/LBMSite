"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Até R$ 100 mil", value: 35, color: "#3b82f6" },
  { name: "R$ 100 mil a R$ 500 mil", value: 45, color: "#EC610D" },
  { name: "R$ 500 mil a R$ 1 milhão", value: 15, color: "#2A3C56" },
  { name: "Acima de R$ 1 milhão", value: 5, color: "#8b5cf6" },
]

export function GraficoContratosPorValor() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 0, right: 0, bottom: 30, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="40%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} contratos`, "Quantidade"]} />
        <Legend layout="horizontal" align="center" verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  )
}
