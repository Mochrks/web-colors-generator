import { Heart, Github, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© 2025 ColorGen Pro.</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse-soft" />{" "}
              by{" "}
              <a
                href="https://github.com/mochrks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors font-medium inline-flex items-center gap-1"
              >
                @mochrks
                <ExternalLink className="h-3 w-3" />
              </a>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Mochrks/web-colors-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
