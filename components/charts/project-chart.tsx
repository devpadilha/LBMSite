"use client"

import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for project progress
const data = [
  {
    name: "Instalação Elétrica",
    concluído: 85,
    restante: 15,
  },
  {
    name: "Reforma Predial",
    concluído: 60,
    restante: 40,
  },
  {
    name: "Manutenção",
    concluído: 40,
    restante: 60,
  },
  {
    name: "Instalação de Rede",
    concluído: 95,
    restante: 5,
  },
  {
    name: "Sistema de Segurança",
    concluído: 75,
    restante: 25,
  },
]

export function ProjectChart() {
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

  // Show loading state until component is mounted
  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center w-full">
          <div className="h-4 w-full bg-muted rounded mb-2"></div>
          <div className="h-4 w-full bg-muted rounded mb-2"></div>
          <div className="h-4 w-full bg-muted rounded mb-2"></div>
          <div className="h-4 w-full bg-muted rounded mb-2"></div>
          <div className="h-4 w-full bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === "dark"
  const textColor = isDark ? "#FFFFFF" : "#000000"
  const gridColor = isDark ? "#333333" : "#DDDDDD"

  // Calculate appropriate bar size based on window size and data length
  const barSize = Math.min(Math.max(windowSize.height / (data.length * 4), 10), 20)

  // Custom tooltip formatter
  const tooltipFormatter = (value, name) => {
    const formattedName = name === "concluído" ? "Concluído" : "Restante"
    return [`${value}%`, formattedName]
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
        barSize={barSize}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={true} vertical={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: textColor }}
          stroke={textColor}
          tickFormatter={(value) => `${value}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: textColor }}
          stroke={textColor}
          width={120}
          tickMargin={5}
        />
        <Tooltip
          formatter={tooltipFormatter}
          contentStyle={{
            backgroundColor: isDark ? "#333333" : "#FFFFFF",
            color: textColor,
            border: `1px solid ${gridColor}`,
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
          cursor={{ fill: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          wrapperStyle={{
            paddingTop: "10px",
            color: textColor,
          }}
        />
        <Bar
          dataKey="concluído"
          stackId="a"
          fill="#EC610D"
          name="Concluído (%)"
          radius={[0, 4, 4, 0]}
          animationDuration={1000}
          animationEasing="ease-out"
        />
        <Bar
          dataKey="restante"
          stackId="a"
          fill={isDark ? "#555555" : "#DDDDDD"}
          name="Restante (%)"
          radius={[0, 4, 4, 0]}
          animationDuration={1000}
          animationEasing="ease-out"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

