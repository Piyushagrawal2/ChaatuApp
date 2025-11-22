import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const plans = [
    {
        name: "Free",
        price: "$0",
        description: "Perfect for getting started",
        features: ["Basic Chat Access", "Standard Response Speed", "5 Daily Queries", "Community Support"]
    },
    {
        name: "Pro",
        price: "$19",
        description: "For power users",
        features: ["Unlimited Chat Access", "Fast Response Speed", "Priority Support", "Advanced Models", "API Access"],
        popular: true
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large teams",
        features: ["Dedicated Server", "Custom Model Fine-tuning", "SLA Support", "SSO Integration", "Audit Logs"]
    }
];

const Pricing = () => {
    return (
        <section id="pricing" className="py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold md:text-4xl">Simple Pricing</h2>
                    <p className="text-muted-foreground">Choose the plan that fits your needs.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={plan.popular ? "relative md:-mt-8" : ""}
                        >
                            <Card className={`h-full flex flex-col ${plan.popular ? 'border-primary shadow-2xl shadow-primary/10' : 'shadow-lg'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-0 right-0 mx-auto w-fit rounded-full bg-primary px-4 py-1 text-xs font-medium text-primary-foreground">
                                        Most Popular
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <div className="mt-2 flex items-baseline gap-1">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.price !== "Custom" && <span className="text-muted-foreground">/month</span>}
                                    </div>
                                    <CardDescription>{plan.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check size={16} className="text-primary" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                                        Choose {plan.name}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
