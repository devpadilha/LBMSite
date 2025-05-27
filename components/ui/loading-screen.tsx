'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from './skeleton'
import Image from 'next/image'

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = 'Carregando...' }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      <div className="flex flex-col items-center space-y-6 max-w-md w-full px-4">
        <div className="flex items-center justify-center mb-4">
          <Image 
            src={require('@/public/logo-lbm.png')}
            alt="LBM Engenharia" 
            width={120} 
            height={120}
            unoptimized
            priority
          />
        </div>
        
        <div className="w-full bg-muted rounded-full h-2.5 mb-2">
          <div 
            className="bg-[#EC610D] h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-center text-muted-foreground">{message}</p>
        
        <div className="grid grid-cols-3 gap-4 w-full mt-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  )
}