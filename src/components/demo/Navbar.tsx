import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return true;
  });

  useEffect(() => {
    const saved = localStorage.getItem("color-gen-theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle("dark", newIsDark);
    localStorage.setItem("color-gen-theme", newIsDark ? "dark" : "light");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 apple-blur border-b border-neutral-200/50 dark:border-neutral-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <a
            href="/"
            className="flex items-center gap-3 group cursor-pointer active:scale-95 transition-all duration-300"
          >
            <span className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Colorgen.io
            </span>
          </a>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full w-9 h-9 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-300"
              id="theme-toggle"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-neutral-400" />
              ) : (
                <Moon className="h-4 w-4 text-neutral-500" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
