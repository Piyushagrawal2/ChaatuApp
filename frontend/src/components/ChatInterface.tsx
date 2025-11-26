"use client";

import { useRef, useEffect, useCallback, lazy, Suspense, useState } from 'react';
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
    resetChat,
    setChats,
    addChat,
    replaceChatId,
    removeChat
} from '@/store/chatSlice';
import {
    setSidebarOpen,
    closeCustomModelDialog,
    openCustomModelDialog
} from '@/store/uiSlice';

const CustomModelDialog = lazy(() => import('./chat/CustomModelDialog'));

const ChatInterface = () => {
    const { user } = useUser();
    const dispatch = useDispatch();
    const scrollRef = useRef<HTMLDivElement>(null);

    // ensure we only render lazy/Suspense after client hydration
    const [isHydrated, setIsHydrated] = useState(false);
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Fetch chats on mount
    useEffect(() => {
        if (user?.id) {
            api.getChats(user.id)
                .then(chats => dispatch(setChats(chats)))
                .catch(err => console.error("Failed to fetch chats:", err));
        }
    }, [user?.id, dispatch]);

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

    const handleSend = useCallback(async (content: string, attachments: File[]) => {
        const attachmentNames = attachments.map(f => f.name);

        // Optimistic update
        dispatch(addMessage({ role: 'user', content, attachments: attachmentNames }));

        try {
            let chatId = currentChatId;
            if (!chatId) {
                const title = content.length > 30 ? content.substring(0, 30) + "..." : content;
                const tempId = `temp-${Date.now()}`;

                // Optimistic chat creation
                dispatch(addChat({
                    id: tempId,
                    title,
                    created_at: new Date().toISOString(),
                    messages: []
                }));
                dispatch(setCurrentChatId(tempId));

                try {
                    const newChat = await api.createChat(title, user?.id || 'anonymous');
                    dispatch(replaceChatId({ tempId, realId: newChat.id }));
                    chatId = newChat.id;
                } catch (error) {
                    dispatch(removeChat(tempId));
                    throw error;
                }
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

            if (typeof window !== 'undefined' && window.innerWidth < 768) {
                dispatch(setSidebarOpen(false));
            }
        } catch (error) {
            console.error("Failed to load chat", error);
        }
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

                    {/* Only render lazy dialog after client hydration to avoid Suspense hydration race */}
                    {isHydrated && (
                        <Suspense fallback={null}>
                            <CustomModelDialog
                                isOpen={isCustomModelDialogOpen}
                                onClose={() => dispatch(closeCustomModelDialog())}
                                onSubmit={handleCustomModelSubmit}
                            />
                        </Suspense>
                    )}
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
