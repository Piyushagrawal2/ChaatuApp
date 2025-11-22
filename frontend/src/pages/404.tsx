import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Custom404() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-background text-foreground">
            <h1 className="text-6xl font-bold text-primary">404</h1>
            <p className="mt-4 text-xl text-muted-foreground">Page Not Found</p>
            <Link href="/" className="mt-8">
                <Button>Go Home</Button>
            </Link>
        </div>
    );
}
