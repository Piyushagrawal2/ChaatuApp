import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database, FileText, HardDrive, Box, Package, FileStack,
    CheckCircle, Hash, Users, Github, Cloud, Snowflake,
    Share2, Server, Globe, Lock, Zap, Cpu, Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
    {
        id: 1,
        title: "Ingest and extract from large knowledge bases",
        description: "Continually process massive volumes of enterprise data from any source—transforming unstructured documents, databases, and media into rich, retrievable information.",
        visual: "integrations"
    },
    {
        id: 2,
        title: "Flexible data connections",
        description: "Connect to any data source via managed connectors, MCP, API integrations, or upload files directly from the GUI.",
        visual: "connections"
    },
    {
        id: 3,
        title: "Multimodal data support",
        description: "Process and understand text, images, audio, and video content seamlessly within a single workflow.",
        visual: "multimodal"
    },
    {
        id: 4,
        title: "Agentic extraction",
        description: "Deploy autonomous agents to crawl, scrape, and structure data from complex web sources and internal portals.",
        visual: "agentic"
    }
];

const integrations = [
    { name: "Sharepoint", icon: Share2, color: "text-teal-400" },
    { name: "Google Drive", icon: HardDrive, color: "text-blue-400" },
    { name: "Box", icon: Box, color: "text-blue-500" },
    { name: "Dropbox", icon: Package, color: "text-blue-600" },
    { name: "Confluence", icon: FileStack, color: "text-blue-300" },
    { name: "Asana", icon: CheckCircle, color: "text-red-400" },
    { name: "Notion", icon: FileText, color: "text-white" },
    { name: "Slack", icon: Hash, color: "text-purple-400" },
    { name: "Teams", icon: Users, color: "text-indigo-400" },
    { name: "Github", icon: Github, color: "text-white" },
    { name: "Salesforce", icon: Cloud, color: "text-blue-400" },
    { name: "Snowflake", icon: Snowflake, color: "text-cyan-400" },
    { name: "BigQuery", icon: Database, color: "text-blue-500" },
    { name: "Redshift", icon: Database, color: "text-purple-500" },
    { name: "Postgres", icon: Database, color: "text-blue-300" }
];

const FeatureSteps = () => {
    const [activeStep, setActiveStep] = useState(1);

    return (
        <section className="py-24 bg-background text-foreground overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left Column: Steps */}
                    <div className="w-full lg:w-1/2 space-y-8">
                        <div className="mb-8">
                            <span className="text-primary font-mono text-sm tracking-wider uppercase">• Step {activeStep}</span>
                        </div>

                        <div className="space-y-6">
                            {steps.map((step) => (
                                <div
                                    key={step.id}
                                    className={cn(
                                        "cursor-pointer transition-opacity duration-300",
                                        activeStep === step.id ? "opacity-100" : "opacity-40 hover:opacity-60"
                                    )}
                                    onClick={() => setActiveStep(step.id)}
                                >
                                    <h3 className="text-3xl md:text-4xl font-medium mb-4 leading-tight">
                                        {step.title}
                                    </h3>
                                    <AnimatePresence>
                                        {activeStep === step.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <p className="text-base font-light text-muted-foreground pb-4 border-l-2 border-primary/50 pl-4">
                                                    {step.description}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Visuals */}
                    <div className="w-full lg:w-1/2 relative">
                        <div className="relative aspect-square md:aspect-[4/3] bg-secondary/20 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-sm p-8 flex items-center justify-center">

                            {/* Background Grid Effect */}
                            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                            <AnimatePresence mode="wait">
                                {activeStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.4 }}
                                        className="grid grid-cols-3 gap-4 w-full"
                                    >
                                        {integrations.map((item, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="flex items-center gap-3 bg-background/40 border border-white/5 p-3 rounded-xl hover:bg-background/60 transition-colors"
                                            >
                                                <item.icon className={cn("w-5 h-5", item.color)} />
                                                <span className="text-sm font-medium text-muted-foreground">{item.name}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {activeStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="w-full h-full flex items-center justify-center"
                                    >
                                        <div className="relative w-full max-w-sm bg-black/80 rounded-xl border border-white/10 p-6 font-mono text-sm text-green-400 shadow-2xl">
                                            <div className="flex gap-2 mb-4">
                                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                            </div>
                                            <p className="mb-2"><span className="text-purple-400">const</span> <span className="text-blue-400">connect</span> = <span className="text-yellow-400">async</span> () ={'>'} {'{'}</p>
                                            <p className="pl-4 mb-2"><span className="text-purple-400">await</span> chaatu.<span className="text-blue-400">ingest</span>({'{'}</p>
                                            <p className="pl-8 mb-2">source: <span className="text-orange-400">"postgres_db"</span>,</p>
                                            <p className="pl-8 mb-2">sync: <span className="text-blue-400">true</span>,</p>
                                            <p className="pl-8 mb-2">embedding: <span className="text-orange-400">"openai-v3"</span></p>
                                            <p className="pl-4 mb-2">{'}'});</p>
                                            <p>{'}'};</p>
                                        </div>
                                    </motion.div>
                                )}

                                {activeStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="grid grid-cols-2 gap-6 w-full max-w-md"
                                    >
                                        {['Text', 'Audio', 'Image', 'Video'].map((type, i) => (
                                            <motion.div
                                                key={type}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 flex flex-col items-center justify-center gap-4"
                                            >
                                                {i === 0 && <FileText className="w-10 h-10 text-blue-400" />}
                                                {i === 1 && <Zap className="w-10 h-10 text-yellow-400" />}
                                                {i === 2 && <Globe className="w-10 h-10 text-green-400" />}
                                                {i === 3 && <Cpu className="w-10 h-10 text-red-400" />}
                                                <span className="font-semibold text-lg">{type}</span>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}

                                {activeStep === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="relative w-full h-full flex items-center justify-center"
                                    >
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-64 h-64 rounded-full border border-primary/30 animate-[spin_10s_linear_infinite]" />
                                            <div className="absolute w-48 h-48 rounded-full border border-purple-500/30 animate-[spin_15s_linear_infinite_reverse]" />
                                            <div className="absolute w-32 h-32 rounded-full bg-primary/10 blur-xl animate-pulse" />
                                        </div>
                                        <div className="relative z-10 bg-background/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center">
                                            <Bot className="w-12 h-12 mx-auto mb-4 text-primary" />
                                            <h4 className="text-xl font-bold mb-2">Agent Active</h4>
                                            <p className="text-sm text-muted-foreground">Crawling sources...</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSteps;
