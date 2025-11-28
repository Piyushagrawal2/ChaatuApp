const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
export const API_BASE_URL = API_URL;

const buildUrl = (path: string) => `${API_URL}${path}`;

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
        const detail = await response.text();
        throw new Error(detail || 'Request failed');
    }
    return response.json() as Promise<T>;
};

export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
}

export interface Chat {
    id: string;
    title: string;
    created_at: string;
    messages?: Message[];
}

export interface UploadResponse {
    id: string;
    filename: string;
    size: number;
    conversation_id: string;
    mime_type: string;
    url: string;
}

export const api = {
    createChat: async (title: string, userId: string): Promise<Chat> => {
        const res = await fetch(buildUrl('/chats/'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, user_id: userId }),
        });
        return handleResponse<Chat>(res);
    },

    getChats: async (userId: string): Promise<Chat[]> => {
        const res = await fetch(buildUrl(`/chats/?user_id=${encodeURIComponent(userId)}`));
        return handleResponse<Chat[]>(res);
    },

    getChat: async (chatId: string): Promise<Chat> => {
        const res = await fetch(buildUrl(`/chats/${chatId}`));
        return handleResponse<Chat>(res);
    },

    deleteChat: async (chatId: string): Promise<void> => {
        const res = await fetch(buildUrl(`/chats/${chatId}`), {
            method: 'DELETE',
        });
        if (!res.ok && res.status !== 204) {
            throw new Error('Failed to delete chat');
        }
    },

    addMessage: async (chatId: string, role: string, content: string): Promise<Message> => {
        const res = await fetch(buildUrl(`/chats/${chatId}/messages`), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role, content }),
        });
        return handleResponse<Message>(res);
    },

    uploadDocument: async (conversationId: string, file: File, signal?: AbortSignal): Promise<UploadResponse> => {
        const formData = new FormData();
        formData.append('conversation_id', conversationId);
        formData.append('file', file);

        const res = await fetch(buildUrl('/documents/upload'), {
            method: 'POST',
            body: formData,
            signal,
        });
        return handleResponse<UploadResponse>(res);
    },
};
