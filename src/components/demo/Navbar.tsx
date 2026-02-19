import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GithubIcon, Moon, Sun, Palette, Sparkles } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse-soft" />
            </div>
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">Color</span>
              <span className="text-foreground">Gen</span>
              <span className="text-xs font-medium text-muted-foreground ml-1 align-super">
                Pro
              </span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-xl hover:bg-white/10 transition-all duration-300"
              id="theme-toggle"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-5 w-5 text-purple-500 transition-transform duration-300 hover:-rotate-12" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-white/10 transition-all duration-300"
              asChild
              id="github-link"
            >
              <a
                href="https://github.com/Mochrks/web-colors-generator"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
