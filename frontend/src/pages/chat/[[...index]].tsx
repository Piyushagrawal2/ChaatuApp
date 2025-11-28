import Head from 'next/head';
import ChatInterface from '@/components/ChatInterface';
import { useRouter } from 'next/router';

export default function ChatPage() {
    const router = useRouter();
    // index is an array of path segments, e.g., ['chat-id'] or undefined
    const { index } = router.query;
    const chatId = Array.isArray(index) ? index[0] : undefined;

    return (
        <>
            <Head>
                <title>Chat {chatId ? `- ${chatId}` : ''} - Chaatu.ai</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ChatInterface />
        </>
    );
}
