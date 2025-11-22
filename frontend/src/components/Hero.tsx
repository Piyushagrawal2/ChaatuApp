import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
    return (
        <section id="overview" className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
            <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="container relative z-10 mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary"
                >
                    <Sparkles size={16} />
                    <span>Next Generation AI Assistant</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
                >
                    Experience the Future of <br />
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Conversational AI
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
                >
                    Unlock the power of advanced artificial intelligence with Chaatu.
                    Seamlessly interact, generate content, and solve complex problems in real-time.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-col items-center justify-center gap-4 sm:flex-row"
                >
                    <Link href="/chat">
                        <Button size="lg" className="h-12 rounded-full px-8 text-base shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40">
                            Get Started Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Button variant="outline" size="lg" className="h-12 rounded-full px-8 text-base hover:bg-secondary/50">
                        View Demo
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
