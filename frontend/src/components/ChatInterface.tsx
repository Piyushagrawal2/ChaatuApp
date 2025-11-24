import { useRef, useEffect, useCallback, lazy, Suspense } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatSidebar from './chat/ChatSidebar';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatMessage from './chat/ChatMessage';
import { useUser } from '@clerk/nextjs';
import { api } from '@/services/api';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
    setMessages,
    addMessage,
    setCurrentChatId,
    setModel,
    setCustomModelConfig,
    toggleWebSearch,
    resetChat
} from '@/store/chatSlice';
import {
    toggleSidebar,
    setSidebarOpen,
    closeCustomModelDialog,
    openCustomModelDialog
} from '@/store/uiSlice';

const CustomModelDialog = lazy(() => import('./chat/CustomModelDialog'));

const ChatInterface = () => {
    const { user } = useUser();
    const dispatch = useDispatch();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Redux Selectors
    const {
        messages,
        currentChatId,
        model: currentModel,
        isWebSearchEnabled,
        customModelConfig
    } = useSelector((state: RootState) => state.chat);

    const {
        isSidebarOpen,
        isCustomModelDialogOpen
    } = useSelector((state: RootState) => state.ui);

    // Local state for sidebar refresh trigger (can be moved to Redux later if needed)
    // For now, we can keep it local or use a Redux action to trigger refresh
    // Let's keep it simple and rely on Redux state updates to drive UI
    // But ChatSidebar needs a trigger to re-fetch list.
    // We can add a 'lastUpdated' timestamp to chatSlice to trigger re-fetches.
    // For now, I'll keep a local trigger for simplicity in migration, or better yet,
    // let's make ChatSidebar listen to currentChatId changes to refresh list if needed.

    const handleSend = useCallback(async (content: string, attachments: File[]) => {
        const attachmentNames = attachments.map(f => f.name);

        // Optimistic update
        dispatch(addMessage({ role: 'user', content, attachments: attachmentNames }));

        try {
            let chatId = currentChatId;
            if (!chatId) {
                const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
                const newChat = await api.createChat(title, user?.id || 'anonymous');
                chatId = newChat.id;
                dispatch(setCurrentChatId(chatId));
                // Trigger sidebar refresh by updating a timestamp in Redux?
                // Or just let Sidebar re-render.
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

                dispatch(addMessage({ role: 'assistant', content: responseContent }));
            }, 1000);
        } catch (error) {
            console.error("Failed to save message", error);
        }
    }, [currentChatId, customModelConfig, currentModel, isWebSearchEnabled, user, dispatch]);

    const handleCustomModelSubmit = useCallback((name: string, apiKey: string) => {
        dispatch(setCustomModelConfig({ name, apiKey }));
        dispatch(setModel('custom'));
        dispatch(closeCustomModelDialog());
    }, [dispatch]);

    const handleNewChat = useCallback(() => {
        dispatch(resetChat());
    }, [dispatch]);

    const loadChat = useCallback(async (chatId: string) => {
        try {
            const chat = await api.getChat(chatId);
            dispatch(setCurrentChatId(chat.id));
            dispatch(setMessages(chat.messages?.map((m: any) => ({
                role: m.role,
                content: m.content,
                attachments: [] // Add attachment logic if backend supports it
            })) || []));

            if (window.innerWidth < 768) {
                dispatch(setSidebarOpen(false));
            }
        } catch (error) {
            console.error("Failed to load chat", error);
        }
    }, [dispatch]);

    const handleToggleSidebar = useCallback(() => {
        dispatch(toggleSidebar());
    }, [dispatch]);

    const handleToggleWebSearch = useCallback(() => {
        dispatch(toggleWebSearch());
    }, [dispatch]);

    const handleModelSelect = useCallback((model: string) => {
        dispatch(setModel(model));
    }, [dispatch]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <ChatHeader
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={handleToggleSidebar}
                currentModel={currentModel === 'custom' && customModelConfig ? customModelConfig.name : currentModel}
                onModelSelect={handleModelSelect}
                onCustomModelClick={() => dispatch(openCustomModelDialog())}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <ChatSidebar
                    onNewChat={handleNewChat}
                    onSelectChat={loadChat}
                    refreshTrigger={currentChatId ? 1 : 0} // Simple trigger for now
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
                        onToggleWebSearch={handleToggleWebSearch}
                    />

                    <Suspense fallback={null}>
                        <CustomModelDialog
                            isOpen={isCustomModelDialogOpen}
                            onClose={() => dispatch(closeCustomModelDialog())}
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

export default ChatInterface;
