import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { ThemeToggle } from '@/components/ThemeToggle';

const Navbar = () => {
    const { isSignedIn } = useAuth();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-white/5 backdrop-blur-lg"
        >
            <div className="container mx-auto flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        <MessageSquare size={24} />
                    </div>
                    <span>Chaatu.ai</span>
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="#overview" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Overview
                    </Link>
                    <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Features
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        Pricing
                    </Link>
                    <Link href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                        About
                    </Link>
                    <ThemeToggle />
                </div>

                <div className="flex items-center gap-4">
                    <SignedIn>
                        <Link href="/chat">
                            <Button variant="outline" className="mr-4">
                                Go to Chat
                            </Button>
                        </Link>
                        <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
