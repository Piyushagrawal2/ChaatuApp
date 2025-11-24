import { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatSidebar from './chat/ChatSidebar';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatMessage from './chat/ChatMessage';
import { useUser } from '@clerk/nextjs';
import { api } from '@/services/api';

const CustomModelDialog = lazy(() => import('./chat/CustomModelDialog'));

const ChatInterface = () => {
    const { user } = useUser();
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string, attachments?: string[] }[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentModel, setCurrentModel] = useState('chaatu-v1.2');
    const [isWebSearchEnabled, setIsWebSearchEnabled] = useState(false);
    const [isCustomModelDialogOpen, setIsCustomModelDialogOpen] = useState(false);
    const [customModelConfig, setCustomModelConfig] = useState<{ name: string, apiKey: string } | null>(null);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [refreshSidebarTrigger, setRefreshSidebarTrigger] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = useCallback(async (content: string, attachments: File[]) => {
        const attachmentNames = attachments.map(f => f.name);

        const newMessages = [
            ...messages,
            { role: 'user' as const, content, attachments: attachmentNames }
        ];
        setMessages(newMessages);

        try {
            let chatId = currentChatId;
            if (!chatId) {
                const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
                const newChat = await api.createChat(title, user?.id || 'anonymous');
                chatId = newChat.id;
                setCurrentChatId(chatId);
                setRefreshSidebarTrigger(prev => prev + 1);
            }

            await api.addMessage(chatId, 'user', content);

            // Simulate AI response
            setTimeout(async () => {
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

                await api.addMessage(chatId!, 'assistant', responseContent);

                setMessages(prev => [
                    ...prev,
                    { role: 'assistant' as const, content: responseContent }
                ]);
            }, 1000);
        } catch (error) {
            console.error("Failed to save message", error);
        }
    }, [messages, customModelConfig, currentModel, isWebSearchEnabled, currentChatId, user]);

    const handleCustomModelSubmit = useCallback((name: string, apiKey: string) => {
        setCustomModelConfig({ name, apiKey });
        setCurrentModel('custom');
    }, []);

    const handleNewChat = useCallback(() => {
        setMessages([]);
        setCurrentChatId(null);
    }, []);

    const loadChat = useCallback(async (chatId: string) => {
        try {
            const chat = await api.getChat(chatId);
            setCurrentChatId(chat.id);
            setMessages(chat.messages?.map((m: any) => ({ role: m.role, content: m.content })) || []);
            if (window.innerWidth < 768) setIsSidebarOpen(false);
        } catch (error) {
            console.error("Failed to load chat", error);
        }
    }, []);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen(prev => !prev);
    }, []);

    const toggleWebSearch = useCallback(() => {
        setIsWebSearchEnabled(prev => !prev);
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <ChatHeader
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={toggleSidebar}
                currentModel={currentModel === 'custom' && customModelConfig ? customModelConfig.name : currentModel}
                onModelSelect={setCurrentModel}
                onCustomModelClick={() => setIsCustomModelDialogOpen(true)}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <ChatSidebar
                    isOpen={isSidebarOpen}
                    onNewChat={handleNewChat}
                    onSelectChat={loadChat}
                    refreshTrigger={refreshSidebarTrigger}
                />

                <main className="flex-1 flex flex-col relative min-w-0">
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
                        onToggleWebSearch={toggleWebSearch}
                    />

                    <Suspense fallback={null}>
                        <CustomModelDialog
                            isOpen={isCustomModelDialogOpen}
                            onClose={() => setIsCustomModelDialogOpen(false)}
                            onSubmit={handleCustomModelSubmit}
                        />
                    </Suspense>
                </main>
            </div>
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

    </div>
);

const SuggestionCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50 cursor-pointer hover:shadow-md transition-colors duration-200 dark:from-purple-950/10 dark:to-pink-950/10 dark:border-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800"
    >
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl text-white mb-4 shadow-lg shadow-purple-200 dark:shadow-none">
            {icon}
        </div>
        <h3 className="font-semibold mb-2 text-left">{title}</h3>
        <p className="text-sm text-muted-foreground text-left">{desc}</p>
    </motion.div>
);

export default ChatInterface;
