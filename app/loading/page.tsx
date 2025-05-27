'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingScreen } from '@/components/ui/loading-screen'
import { useAuth } from '@/contexts/auth-context'

export default function LoadingPage() {
  const router = useRouter()
  const { user, isLoading, setIsLoading } = useAuth()

  useEffect(() => {
    // Simular um tempo de carregamento para mostrar a tela de loading
    const timer = setTimeout(() => {
      // Verificar se o usuário está autenticado
      if (user) {
        // Desativar o estado de loading antes de redirecionar para o dashboard
        if (setIsLoading) {
          setIsLoading(false)
        }
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
    }, 2000) // 2 segundos de carregamento

    return () => clearTimeout(timer)
  }, [router, user, setIsLoading])

  return (
    <LoadingScreen message="Preparando seu ambiente..." />
  )
}