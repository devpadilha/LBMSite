"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

// Sample data for employee distribution
const data = [
  { name: "Instalação Elétrica", value: 8, color: "#EC610D" },
  { name: "Reforma Predial", value: 6, color: "#374151" },
  { name: "Manutenção", value: 4, color: "#6B7280" },
  { name: "Instalação de Rede", value: 3, color: "#9CA3AF" },
  { name: "Outros Projetos", value: 3, color: "#D1D1D1" },
]

export function EmployeeDistributionChart() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })

  // Handle window resize for responsive chart
  const handleResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [])

  // Set up event listeners and mounted state
  useEffect(() => {
    setMounted(true)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [handleResize])

  // Custom label renderer for the pie chart
  const renderCustomizedLabel = ({ 
    cx, 
    cy, 
    midAngle, 
    innerRadius, 
    outerRadius, 
    percent, 
  }: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
  }) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    // Only show label if segment is large enough
    if (percent < 0.05) return null

    return (
      <text
        x={x}
        y={y}
        fill="#FFFFFF"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-32 w-32 bg-muted rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"

  // Adjust colors for dark mode if needed
  const chartData = data.map((item) => ({
    ...item,
    color: isDark && item.color === "#D1D1D1" ? "#555555" : item.color,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={Math.min(windowSize.width / 12, 80)}
          innerRadius={Math.min(windowSize.width / 24, 40)}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={2}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} stroke={isDark ? "#333333" : "#FFFFFF"} strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} funcionários`, "Quantidade"]}
          contentStyle={{
            backgroundColor: isDark ? "#333333" : "#FFFFFF",
            color: isDark ? "#FFFFFF" : "#000000",
            border: `1px solid ${isDark ? "#555555" : "#DDDDDD"}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          iconSize={10}
          wrapperStyle={{
            paddingTop: "20px",
            fontSize: "12px",
            color: isDark ? "#FFFFFF" : "#000000",
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
