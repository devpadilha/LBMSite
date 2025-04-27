"use client"

import { useEffect, useRef } from "react"

interface MunicipioMapProps {
  latitude: number
  longitude: number
  nome: string
}

export function MunicipioMap({ latitude, longitude, nome }: MunicipioMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Esta é uma implementação simplificada
    // Em produção, você usaria uma biblioteca como Leaflet, Google Maps ou MapBox
    if (mapRef.current) {
      const mapElement = mapRef.current

      // Simulação de um mapa com um elemento de fundo e um marcador
      mapElement.style.backgroundImage = `url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${longitude},${latitude},9,0/600x300?access_token=pk.placeholder')`
      mapElement.style.backgroundSize = "cover"
      mapElement.style.backgroundPosition = "center"

      // Adicionar um marcador
      const marker = document.createElement("div")
      marker.className = "absolute w-6 h-6 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2"
      marker.style.top = "50%"
      marker.style.left = "50%"
      marker.style.border = "2px solid white"

      // Adicionar um tooltip
      const tooltip = document.createElement("div")
      tooltip.className = "absolute -translate-x-1/2 bg-background px-2 py-1 rounded text-xs font-medium shadow-md"
      tooltip.style.top = "calc(50% - 30px)"
      tooltip.style.left = "50%"
      tooltip.textContent = nome

      mapElement.appendChild(marker)
      mapElement.appendChild(tooltip)
    }
  }, [latitude, longitude, nome])

  return (
    <div
      ref={mapRef}
      className="w-full h-full relative rounded-md overflow-hidden border"
      aria-label={`Mapa mostrando a localização de ${nome}`}
    >
      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Carregando mapa...</div>
    </div>
  )
}
