"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Construction } from "lucide-react"
import Link from "next/link"

export default function WorkInProgressPage() {
  return (
    <div className="flex items-center justify-center h-screen overflow-hidden bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Construction className="h-12 w-12 text-[#EC610D]" />
          </div>
          <CardTitle className="text-2xl">Página em Construção</CardTitle>
          <CardDescription>
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            Nossa equipe está trabalhando para implementar esta funcionalidade.
            Agradecemos sua paciência e compreensão.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild className="bg-[#EC610D] hover:bg-[#EC610D]/90">
            <Link href="/dashboard">
              Voltar para o Dashboard
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}