import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '@/services/api';

export interface SourceCitation {
    id: string;
    title: string;
    url: string;
    snippet?: string;
}

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error';

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt?: string;
    status?: MessageStatus;
    attachments?: string[];
    sources?: SourceCitation[];
}

export interface CustomModelConfig {
    name: string;
    apiKey: string;
}

interface ChatState {
    messages: Message[];
    chats: Chat[];
    currentChatId: string | null;
    isLoading: boolean;
    model: string;
    temperature: number;
    customModelConfig: CustomModelConfig | null;
    isWebSearchEnabled: boolean;
    uploadProgress: number | null;
    isStreaming: boolean;
}

const initialState: ChatState = {
    messages: [],
    chats: [],
    currentChatId: null,
    isLoading: false,
    model: 'chaatu-v1.2',
    temperature: 0.5,
    customModelConfig: null,
    isWebSearchEnabled: false,
    uploadProgress: null,
    isStreaming: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setMessages: (state, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            state.messages.push(action.payload);
        },
        updateMessage: (state, action: PayloadAction<{ id: string; patch: Partial<Message> }>) => {
            state.messages = state.messages.map(message =>
                message.id === action.payload.id ? { ...message, ...action.payload.patch } : message
            );
        },
        appendToMessage: (state, action: PayloadAction<{ id: string; delta: string }>) => {
            state.messages = state.messages.map(message =>
                message.id === action.payload.id
                    ? { ...message, content: `${message.content}${action.payload.delta}` }
                    : message
            );
        },
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.unshift(action.payload);
        },
        upsertChat: (state, action: PayloadAction<Chat>) => {
            const idx = state.chats.findIndex(chat => chat.id === action.payload.id);
            if (idx >= 0) {
                state.chats[idx] = { ...state.chats[idx], ...action.payload };
            } else {
                state.chats.unshift(action.payload);
            }
        },
        replaceChatId: (state, action: PayloadAction<{ tempId: string; realId: string }>) => {
            const chat = state.chats.find(c => c.id === action.payload.tempId);
            if (chat) {
                chat.id = action.payload.realId;
            }
            if (state.currentChatId === action.payload.tempId) {
                state.currentChatId = action.payload.realId;
            }
        },
        removeChat: (state, action: PayloadAction<string>) => {
            state.chats = state.chats.filter(c => c.id !== action.payload);
            if (state.currentChatId === action.payload) {
                state.currentChatId = null;
                state.messages = [];
            }
        },
        setCurrentChatId: (state, action: PayloadAction<string | null>) => {
            state.currentChatId = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setModel: (state, action: PayloadAction<string>) => {
            state.model = action.payload;
        },
        setTemperature: (state, action: PayloadAction<number>) => {
            state.temperature = action.payload;
        },
        setCustomModelConfig: (state, action: PayloadAction<CustomModelConfig | null>) => {
            state.customModelConfig = action.payload;
        },
        toggleWebSearch: (state) => {
            state.isWebSearchEnabled = !state.isWebSearchEnabled;
        },
        setUploadProgress: (state, action: PayloadAction<number | null>) => {
            state.uploadProgress = action.payload;
        },
        setStreaming: (state, action: PayloadAction<boolean>) => {
            state.isStreaming = action.payload;
        },
        resetChat: (state) => {
            state.messages = [];
            state.currentChatId = null;
            state.isStreaming = false;
            state.uploadProgress = null;
        },
    },
});

export const {
    setMessages,
    addMessage,
    updateMessage,
    appendToMessage,
    setChats,
    addChat,
    upsertChat,
    replaceChatId,
    removeChat,
    setCurrentChatId,
    setLoading,
    setModel,
    setTemperature,
    setCustomModelConfig,
    toggleWebSearch,
    setUploadProgress,
    setStreaming,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
