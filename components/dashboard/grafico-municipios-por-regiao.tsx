"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Sudeste", value: 18, color: "#EC610D" },
  { name: "Nordeste", value: 12, color: "#2A3C56" },
  { name: "Sul", value: 8, color: "#3b82f6" },
  { name: "Norte", value: 4, color: "#22c55e" },
  { name: "Centro-Oeste", value: 6, color: "#8b5cf6" },
];

export function GraficoMunicipiosPorRegiao() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={value => [`${value} municípios`, "Quantidade"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
