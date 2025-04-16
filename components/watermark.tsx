import React from "react"

interface WatermarkProps {
  opacity?: number
  className?: string
}

export function Watermark({ opacity = 0.05, className = "" }: WatermarkProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} style={{ opacity }}>
      <div 
        className="w-full h-full bg-contain bg-center bg-no-repeat" 
        style={{ backgroundImage: "url('/images/lbm-logo.png')" }}
      />
    </div>
  )
}