export function Footer() {
    return (
        <footer className="bg-background border-t py-4">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                    © 2023 Color Generator. All rights reserved. | Created by{" "}
                    <a
                        href="https://github.com/mochrks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        @mochrks
                    </a>
                </p>
            </div>
        </footer>
    )
}

