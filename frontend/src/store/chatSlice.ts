import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    currentChatId: string | null;
    isLoading: boolean;
    model: string;
    customModelConfig: CustomModelConfig | null;
    isWebSearchEnabled: boolean;
}

const initialState: ChatState = {
    messages: [],
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
    setCurrentChatId,
    setLoading,
    setModel,
    setCustomModelConfig,
    toggleWebSearch,
    resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
