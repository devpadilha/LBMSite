"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export default function EmailConfirmadoPage() {
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-2">
          <Image 
            src={require('@/public/logo-lbm.png')}
            alt="LBM Engenharia" 
            width={184} 
            height={184}
            unoptimized
            priority
          />
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Email Confirmado</CardTitle>
          <CardDescription className="text-center">Seu email foi confirmado com sucesso!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            Sua conta foi ativada e você já pode acessar o sistema com suas credenciais.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/login" passHref>
            <Button className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90">
              Ir para o Login
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>
          Ao continuar, você concorda com os{" "}
          <Link href="#" className="text-[#EC610D] hover:underline">
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link href="#" className="text-[#EC610D] hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>
    </div>
  )
}