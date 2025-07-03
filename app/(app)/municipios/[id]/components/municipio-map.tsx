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
    if (!mapRef.current) return

    // Limpar o conteúdo anterior
    const mapElement = mapRef.current
    while (mapElement.firstChild) {
      mapElement.removeChild(mapElement.firstChild)
    }

    // Criar o contêiner do mapa
    const mapContainer = document.createElement("div")
    mapContainer.className = "w-full h-full relative"
    mapElement.appendChild(mapContainer)

    // Adicionar a imagem do mapa (usando OpenStreetMap que não requer token)
    const mapImage = document.createElement("img")
    mapImage.className = "w-full h-full object-cover rounded-md"
    mapImage.alt = `Mapa de ${nome}`
    // Usando OpenStreetMap para evitar problemas de autenticação
    mapImage.src = `https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=10&size=600x300&markers=${latitude},${longitude},orange`
    mapImage.onerror = () => {
      // Fallback se a imagem falhar
      mapImage.style.display = "none"
      fallbackMessage.style.display = "flex"
    }
    mapContainer.appendChild(mapImage)

    // Adicionar um marcador visual sobre a imagem
    const marker = document.createElement("div")
    marker.className =
      "absolute w-6 h-6 bg-[#EC610D] rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-white"
    marker.style.top = "50%"
    marker.style.left = "50%"
    marker.style.zIndex = "10"
    mapContainer.appendChild(marker)

    // Adicionar um tooltip
    const tooltip = document.createElement("div")
    tooltip.className = "absolute -translate-x-1/2 bg-white px-2 py-1 rounded text-xs font-medium shadow-md"
    tooltip.style.top = "calc(50% - 30px)"
    tooltip.style.left = "50%"
    tooltip.style.zIndex = "20"
    tooltip.textContent = nome
    mapContainer.appendChild(tooltip)

    // Adicionar uma mensagem de fallback (inicialmente oculta)
    const fallbackMessage = document.createElement("div")
    fallbackMessage.className =
      "absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50 rounded-md"
    fallbackMessage.textContent = "Não foi possível carregar o mapa"
    fallbackMessage.style.display = "none"
    mapContainer.appendChild(fallbackMessage)
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
