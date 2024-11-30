import { Button } from "@/components/ui/button"
import { GithubIcon } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="bg-background border-b">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <a href="/" className="text-2xl font-bold text-primary">
                            Color Generator
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* <Button variant="ghost">Home</Button>
                        <Button variant="ghost">About</Button>
                        <Button variant="ghost">Contact</Button> */}
                        <Button variant="outline" size="icon">
                            <a
                                href="https://github.com/Mochrks/web-colors-generator"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                <GithubIcon className="h-5 w-5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}
