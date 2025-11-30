"use client";

import { useRef, useEffect, useCallback, lazy, Suspense, useState } from 'react';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatSidebar from './chat/ChatSidebar';
import ChatHeader from './chat/ChatHeader';
import ChatInput from './chat/ChatInput';
import ChatMessage from './chat/ChatMessage';

import { api } from '@/services/api';
import { getChatWebSocketClient, InboundSocketMessage } from '@/services/websocket';
import {
    setMessages,
    addMessage,
    setChats,
    addChat,
    upsertChat,
    setCurrentChatId,
    setModel,
    setCustomModelConfig,
    toggleWebSearch,
    resetChat,
    updateMessage,
    appendToMessage,
    setStreaming,
} from '@/store/chatSlice';
import { RootState } from '@/store/store';
import { closeCustomModelDialog, openCustomModelDialog } from '@/store/uiSlice';

const CustomModelDialog = lazy(() => import('./chat/CustomModelDialog'));

const ChatInterface = () => {
    const { user } = useUser();
    const router = useRouter();
    const dispatch = useDispatch();
    const scrollRef = useRef<HTMLDivElement>(null);
    const wsClientRef = useRef<ReturnType<typeof getChatWebSocketClient> | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);

    const {
        messages,
        currentChatId,
        model,
        temperature,
        customModelConfig,
        isWebSearchEnabled,
    } = useSelector((state: RootState) => state.chat);
    const isCustomModelDialogOpen = useSelector((state: RootState) => state.ui.isCustomModelDialogOpen);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const loadChat = useCallback(async (chatId: string) => {
        try {
            const chat = await api.getChat(chatId);
            dispatch(setCurrentChatId(chat.id));
            dispatch(upsertChat(chat));
            dispatch(setMessages(
                (chat.messages || []).map(message => ({
                    id: message.id,
                    role: message.role as 'user' | 'assistant' | 'system',
                    content: message.content,
                    createdAt: message.created_at,
                    status: 'complete',
                }))
            ));
        } catch (error) {
            console.error('Failed to load chat', error);
        }
    }, [dispatch]);

    useEffect(() => {
        if (!user?.id) return;
        api.getChats(user.id)
            .then(chatsResponse => dispatch(setChats(chatsResponse)))
            .catch(error => console.error('Failed to fetch chats', error));
    }, [user?.id, dispatch]);

    useEffect(() => {
        const { index } = router.query;
        const chatId = Array.isArray(index) ? index[0] : undefined;

        if (chatId && chatId !== currentChatId) {
            loadChat(chatId);
        } else if (!chatId && currentChatId) {
            dispatch(resetChat());
        }
    }, [router.query, router.pathname, currentChatId, loadChat, dispatch]);

    const ensureConversation = useCallback(async (initialMessage: string) => {
        if (currentChatId) return currentChatId;
        const title = initialMessage.trim().slice(0, 40) || 'New chat';
        const chat = await api.createChat(title, user?.id || 'anonymous');
        dispatch(addChat(chat));
        dispatch(setCurrentChatId(chat.id));
        router.push(`/chat/${chat.id}`);
        return chat.id;
    }, [currentChatId, dispatch, router, user?.id]);

    const handleSend = useCallback(async (content: string, attachments: File[]) => {
        if (!content.trim()) return;
        try {
            const conversationId = await ensureConversation(content);
            const attachmentNames = attachments.map(file => file.name);
            dispatch(addMessage({
                id: nanoid(),
                role: 'user',
                content,
                attachments: attachmentNames,
                status: 'complete',
            }));
            await api.addMessage(conversationId, 'user', content);

            const wsClient = getChatWebSocketClient();
            wsClientRef.current = wsClient;
            wsClient.connect(conversationId);
            const assistantMessageId = nanoid();
            dispatch(addMessage({
                id: assistantMessageId,
                role: 'assistant',
                content: '',
                status: 'streaming',
            }));
            dispatch(setStreaming(true));
            wsClient.send({
                event: 'user_message',
                content,
                metadata: {
                    message_id: assistantMessageId,
                    model,
                    temperature,
                    web_search: isWebSearchEnabled,
                },
            });
        } catch (error) {
            console.error('Failed to send message', error);
        }
    }, [dispatch, ensureConversation, model, temperature, isWebSearchEnabled]);

    const handleWebSocketMessage = useCallback((payload: InboundSocketMessage) => {
        switch (payload.event) {
            case 'assistant_message_started':
                dispatch(updateMessage({ id: payload.message_id, patch: { status: 'streaming' } }));
                break;
            case 'assistant_message_chunk':
                dispatch(appendToMessage({ id: payload.message_id, delta: payload.delta }));
                break;
            case 'assistant_message_completed':
                dispatch(updateMessage({
                    id: payload.message_id,
                    patch: {
                        content: payload.content,
                        status: 'complete',
                        sources: (payload.sources || []) as any,
                    },
                }));
                dispatch(setStreaming(false));
                break;
            case 'error':
                dispatch(setStreaming(false));
                break;
            default:
                break;
        }
    }, [dispatch]);

    useEffect(() => {
        if (!currentChatId) return;
        const wsClient = getChatWebSocketClient();
        wsClientRef.current = wsClient;
        wsClient.connect(currentChatId);

        const offMessage = wsClient.on('message', handleWebSocketMessage);
        const offClose = wsClient.on('close', () => dispatch(setStreaming(false)));
        const offError = wsClient.on('error', () => dispatch(setStreaming(false)));

        return () => {
            offMessage();
            offClose();
            offError();
            wsClient.close();
        };
    }, [currentChatId, handleWebSocketMessage, dispatch]);

    useEffect(() => {
        return () => {
            wsClientRef.current?.close();
        };
    }, []);

    const handleCustomModelSubmit = useCallback((name: string, apiKey: string) => {
        dispatch(setCustomModelConfig({ name, apiKey }));
        dispatch(setModel('custom'));
        dispatch(closeCustomModelDialog());
    }, [dispatch]);

    const handleModelSelect = useCallback((nextModel: string) => {
        dispatch(setModel(nextModel));
        if (nextModel !== 'custom') {
            dispatch(setCustomModelConfig(null));
        }
    }, [dispatch]);

    const handleNewChat = useCallback(() => {
        dispatch(resetChat());
        router.push('/chat');
    }, [dispatch, router]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const currentModelName = model === 'custom' && customModelConfig
        ? customModelConfig.name
        : model;

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <ChatHeader
                currentModel={currentModelName}
                onModelSelect={handleModelSelect}
                onCustomModelClick={() => dispatch(openCustomModelDialog())}
            />

            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar
                    onNewChat={handleNewChat}
                    onSelectChat={(chatId) => router.push(`/chat/${chatId}`)}
                />

                <main className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            <div ref={scrollRef} className="max-w-3xl mx-auto space-y-6 py-8">
                                {messages.length === 0 ? (
                                    <EmptyState userName={user?.firstName || 'Friend'} />
                                ) : (
                                    messages.map(message => (
                                        <ChatMessage
                                            key={message.id}
                                            role={message.role}
                                            content={message.content}
                                            attachments={message.attachments}
                                            sources={message.sources}
                                        />
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    <div className="px-4 space-y-4 pb-4">

                        <ChatInput
                            onSend={handleSend}
                            isWebSearchEnabled={isWebSearchEnabled}
                            onToggleWebSearch={() => dispatch(toggleWebSearch())}
                        />
                    </div>

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
                Drop a document or start chatting to begin.
            </h2>
        </div>
    </div>
);

export default ChatInterface;
