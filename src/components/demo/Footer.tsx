import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 py-12 bg-neutral-50/50 dark:bg-neutral-900/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-[13px] text-neutral-500 dark:text-neutral-400">
            <span className="font-medium">© {new Date().getFullYear()} ColorGen Core.</span>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
            <span className="flex items-center gap-1.5">
              Built for designers by
              <a
                href="https://github.com/mochrks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-900 dark:text-white hover:underline underline-offset-4 transition-all font-semibold"
              >
                @mochrks
              </a>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Mochrks/web-colors-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
