"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useTheme as useNextTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Alternar tema"
      onClick={toggleTheme}
      className="relative overflow-hidden"
    >
      <span className="block transition-transform duration-300 ease-in-out"
        style={{ transform: isDark ? "rotate(360deg)" : "rotate(0deg)" }}>
        {isDark ? (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        )}
      </span>
    </Button>
  );
}
