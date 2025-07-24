import { Toaster } from "@/components/ui/use-toast"; // 1. Importe o Toaster

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      {children}
      <Toaster />
    </div>
  );
}
