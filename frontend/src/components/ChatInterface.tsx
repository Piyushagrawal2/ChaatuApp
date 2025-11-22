import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatSidebar from './chat/ChatSidebar';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatMessage from './chat/ChatMessage';
import CustomModelDialog from './chat/CustomModelDialog';
import { useUser } from '@clerk/nextjs';

const ChatInterface = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, attachments?: string[] }[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentModel, setCurrentModel] = useState('valerio-v1.2');
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
    const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
    const [customModelConfig, setCustomModelConfig] = useState<{ name: string, apiKey: string } | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = (content: string, attachments: File[]) => {
        const attachmentNames = attachments.map(f => f.name);

        const newMessages = [
            ...messages,
            { role: 'user' as const, content, attachments: attachmentNames }
        ];
        setMessages(newMessages);

        // Simulate AI response
        setTimeout(() => {
            let responseContent = "I've received your message.";

            if (customModelConfig && currentModel === 'custom') {
                responseContent = `[Using ${customModelConfig.name}] ${responseContent}`;
            }

            if (isWebSearchEnabled) {
                responseContent += " I also searched the web for relevant information.";
            }
            if (attachments.length > 0) {
                responseContent += ` I see you attached ${attachments.length} file(s).`;
            }

            setMessages(prev => [
                ...prev,
                { role: 'assistant' as const, content: responseContent }
            ]);
        }, 1000);
    };

    const handleCustomModelSubmit = (name: string, apiKey: string) => {
        setCustomModelConfig({ name, apiKey });
        setCurrentModel('custom');
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <ChatSidebar isOpen={isSidebarOpen} />

            <main className="flex-1 flex flex-col relative">
                <ChatHeader
                    isSidebarOpen={isSidebarOpen}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                    currentModel={currentModel === 'custom' && customModelConfig ? customModelConfig.name : currentModel}
                    onModelSelect={setCurrentModel}
                    onCustomModelClick={() => setIsCustomModelDialogOpen(true)}
                />

                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full p-4" ref={scrollRef}>
                        <div className="max-w-3xl mx-auto space-y-6 py-8">
                            {messages.length === 0 ? (
                                <EmptyState userName={user?.firstName || 'User'} />
                            ) : (
                                messages.map((msg, i) => (
                                    <ChatMessage
                                        key={i}
                                        role={msg.role}
                                        content={msg.content}
                                        attachments={msg.attachments}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <ChatInput
                    onSend={handleSend}
                    isWebSearchEnabled={isWebSearchEnabled}
                    onToggleWebSearch={() => setIsWebSearchEnabled(!isWebSearchEnabled)}
                />

                <CustomModelDialog
                    isOpen={isCustomModelDialogOpen}
                    onClose={() => setIsCustomModelDialogOpen(false)}
                    onSubmit={handleCustomModelSubmit}
                />
            </main>
        </div>
    );
};

const EmptyState = ({ userName }: { userName: string }) => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-20">
        <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hello {userName}
            </h1>
            <h2 className="text-3xl font-semibold text-muted-foreground">
                How can I help you today?
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
            <SuggestionCard
                icon="🌍"
                title="What's Happen in 24 hours?"
                desc="See what's been happening in the world over the last 24 hours"
            />
            <SuggestionCard
                icon="📈"
                title="Stock market update"
                desc="See what's happening in the stock market in real time"
            />
            <SuggestionCard
                icon="📝"
                title="Deep economic research"
                desc="See research from experts that we have simplified"
            />
        </div>
    </div>
);

const SuggestionCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50 cursor-pointer hover:shadow-md transition-all dark:from-purple-950/10 dark:to-pink-950/10 dark:border-purple-900/20"
    >
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl text-white mb-4 shadow-lg shadow-purple-200 dark:shadow-none">
            {icon}
        </div>
        <h3 className="font-semibold mb-2 text-left">{title}</h3>
        <p className="text-sm text-muted-foreground text-left">{desc}</p>
    </motion.div>
);

export default ChatInterface;
