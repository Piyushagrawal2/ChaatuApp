const API_URL = 'http://localhost:8000';

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

export interface Chat {
    id: string;
    title: string;
    created_at: string;
    messages?: Message[];
}

export const api = {
    createChat: async (title: string, userId: string): Promise<Chat> => {
        const res = await fetch(`${API_URL}/chats/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, user_id: userId }),
        });
        if (!res.ok) throw new Error('Failed to create chat');
        return res.json();
    },

    getChats: async (userId: string): Promise<Chat[]> => {
        const res = await fetch(`${API_URL}/chats/?user_id=${userId}`);
        if (!res.ok) throw new Error('Failed to fetch chats');
        return res.json();
    },

    getChat: async (chatId: string): Promise<Chat> => {
        const res = await fetch(`${API_URL}/chats/${chatId}`);
        if (!res.ok) throw new Error('Failed to fetch chat');
        return res.json();
    },

    addMessage: async (chatId: string, role: string, content: string): Promise<Message> => {
        const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, content }),
        });
        if (!res.ok) throw new Error('Failed to add message');
        return res.json();
    }
};
