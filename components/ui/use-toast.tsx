"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  title: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
  duration?: number;
};

export function toast({ title, description, type = "default", duration = 3000 }: ToastProps) {
  // Implementação simples de toast usando o estado global
  const event = new CustomEvent("toast", {
    detail: {
      title,
      description,
      type,
      duration,
    },
  });
  window.dispatchEvent(event);
}

export function Toaster() {
  const [toasts, setToasts] = useState<(ToastProps & { id: number })[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const detail = (e as CustomEvent<ToastProps>).detail;
      const id = counter;
      setCounter(prev => prev + 1);

      setToasts(prev => [...prev, { ...detail, id }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, detail.duration || 3000);
    };

    window.addEventListener("toast", handleToast);
    return () => window.removeEventListener("toast", handleToast);
  }, [counter]);

  if (toasts.length === 0)
    return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`p-4 rounded-md shadow-md max-w-md transform transition-all duration-300 ease-in-out
            ${
        toast.type === "success"
          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
          : toast.type === "error"
            ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
            : toast.type === "warning"
              ? "bg-[#EC610D]/20 text-[#EC610D]"
              : "bg-white text-gray-800 dark:bg-gray-800 dark:text-gray-200"
        }`}
        >
          <div className="font-medium">{toast.title}</div>
          {toast.description && <div className="text-sm mt-1">{toast.description}</div>}
        </div>
      ))}
    </div>
  );
}
