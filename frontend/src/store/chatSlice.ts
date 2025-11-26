import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from '@/services/api';

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    attachments?: string[];
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
    customModelConfig: CustomModelConfig | null;
    isWebSearchEnabled: boolean;
}

const initialState: ChatState = {
    messages: [],
    chats: [],
    currentChatId: null,
    isLoading: false,
    model: 'chaatu-v1.2',
    customModelConfig: null,
    isWebSearchEnabled: false,
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
        setChats: (state, action: PayloadAction<Chat[]>) => {
            state.chats = action.payload;
        },
        addChat: (state, action: PayloadAction<Chat>) => {
            state.chats.unshift(action.payload);
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
        setCustomModelConfig: (state, action: PayloadAction<CustomModelConfig | null>) => {
            state.customModelConfig = action.payload;
        },
        toggleWebSearch: (state) => {
            state.isWebSearchEnabled = !state.isWebSearchEnabled;
        },
        resetChat: (state) => {
            state.messages = [];
            state.currentChatId = null;
        },
    },
});

export const {
    setMessages,
    addMessage,
    setChats,
    addChat,
    replaceChatId,
    removeChat,
    setCurrentChatId,
    setLoading,
    setModel,
    setCustomModelConfig,
    toggleWebSearch,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
