import Head from 'next/head';
import ChatInterface from '@/components/ChatInterface';

export default function ChatPage() {
    return (
        <>
            <Head>
                <title>Chat - Valerio.ai</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ChatInterface />
        </>
    );
}
