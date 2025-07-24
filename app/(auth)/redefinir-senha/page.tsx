"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Esta verificação continua importante para garantir que o usuário
    // chegou aqui através de um link válido.
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get("access_token")) {
      toast({
        title: "Link inválido ou expirado",
        description: "Por favor, solicite um novo link de redefinição de senha.",
        type: "error", // Usando a variante correta para erros
      });
      router.push("/login");
    }
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [id === "password" ? "password" : "confirmPassword"]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.confirmPassword) {
      toast({
        title: "As senhas não coincidem",
        description: "Por favor, verifique os campos e tente novamente.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Criamos o cliente Supabase para o lado do cliente.
      const supabase = createClient();

      // 2. Chamamos o método seguro para atualizar o usuário.
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Senha redefinida com sucesso!",
        description: "Você já pode fazer login com sua nova senha.",
      });

      // Limpar qualquer item de localStorage que o fluxo antigo possa ter deixado
      window.localStorage.removeItem("reset_password_email");

      router.push("/login");
    }
    catch (error: any) {
      toast({
        title: "Erro na redefinição",
        description: error.message || "Ocorreu um erro inesperado.",
        type: "error",
      });
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex justify-center mb-6">
        {/* ... Logo ... */}
      </div>

      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Redefinir senha</CardTitle>
          <CardDescription>
            Digite sua nova senha. Ela deve ser diferente da anterior.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* ... Campos de Senha e Confirmar Senha (inalterados) ... */}
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-[#EC610D] hover:bg-[#EC610D]/90"
              disabled={isLoading}
            >
              {isLoading ? "Redefinindo..." : "Redefinir senha"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
