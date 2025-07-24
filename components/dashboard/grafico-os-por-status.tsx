"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Concluídas", value: 45, color: "#22c55e" },
  { name: "Em andamento", value: 30, color: "#3b82f6" },
  { name: "Pendentes", value: 15, color: "#f59e0b" },
  { name: "Planejadas", value: 10, color: "#8b5cf6" },
];

export function GraficoOSPorStatus() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={value => [`${value} OS`, "Quantidade"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
