import { motion } from 'framer-motion';
import { Zap, Shield, Globe, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const features = [
    {
        icon: Zap,
        title: "Lightning Fast",
        description: "Experience real-time responses with our optimized AI engine."
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Your data is encrypted and protected with enterprise-grade security."
    },
    {
        icon: Globe,
        title: "Global Knowledge",
        description: "Access a vast database of information from around the world."
    },
    {
        icon: Cpu,
        title: "Advanced Reasoning",
        description: "Solve complex problems with state-of-the-art logical capabilities."
    }
];

const Features = () => {
    return (
        <section id="features" className="py-24 bg-secondary/30">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Why Choose Chaatu?</h2>
                    <p className="text-muted-foreground">Discover the capabilities that set us apart.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="h-full border-none bg-background/50 shadow-lg backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                                <CardHeader>
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <feature.icon size={24} />
                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
