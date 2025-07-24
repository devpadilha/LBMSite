"use client";

import type React from "react";

import { Upload } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function ProfilePhotoUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    setIsUploading(true);
    // Simulação de upload
    setTimeout(() => {
      setIsUploading(false);
      // Aqui você implementaria a lógica real de upload
    }, 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 bg-[#EC610D]/10 hover:bg-[#EC610D]/20 text-[#EC610D] border-[#EC610D]/20"
        >
          <Upload className="h-4 w-4 mr-2" />
          {" "}
          Alterar foto
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar foto de perfil</DialogTitle>
          <DialogDescription>
            Escolha uma nova imagem para seu perfil. Recomendamos uma imagem quadrada de pelo menos 300x300 pixels.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex justify-center">
            {previewUrl
              ? (
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-[#EC610D]">
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )
              : (
                  <div className="w-40 h-40 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-[#EC610D]/50">
                    <Upload className="h-10 w-10 text-[#EC610D]/50" />
                  </div>
                )}
          </div>
          <div className="flex justify-center">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-[#EC610D]/20 text-[#EC610D] hover:bg-[#EC610D]/10"
            >
              Selecionar imagem
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleUpload}
            disabled={!previewUrl || isUploading}
            className="bg-[#EC610D] hover:bg-[#EC610D]/90"
          >
            {isUploading ? "Enviando..." : "Salvar foto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
