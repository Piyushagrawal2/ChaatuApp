import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send, Menu, Plus, MessageSquare, Settings,
    LogOut, Search, MoreHorizontal, ArrowUp,
    LayoutDashboard, Folder, History, Compass
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ChatMessage from './ChatMessage';
import { cn } from '@/lib/utils';

const ChatInterface = () => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [
            ...messages,
            { role: 'user' as const, content: input }
        ];
        setMessages(newMessages);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            setMessages([
                ...newMessages,
                { role: 'assistant' as const, content: "I'm a demo AI. I can't actually process that yet, but the UI looks great!" }
            ]);
        }, 1000);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 0 }}
                className="relative flex flex-col border-r bg-muted/30"
            >
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-6 px-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                            <BotIcon />
                        </div>
                        <span className="font-bold text-lg">Valerio.ai</span>
                    </div>

                    <Button className="w-full justify-start gap-2 mb-6" variant="outline">
                        <Plus size={16} />
                        New Chat
                    </Button>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search chat..." className="pl-9 bg-background/50" />
                    </div>

                    <nav className="space-y-1">
                        <SidebarItem icon={Compass} label="Explore" />
                        <SidebarItem icon={LayoutDashboard} label="Library" />
                        <SidebarItem icon={Folder} label="Files" />
                        <SidebarItem icon={History} label="History" />
                    </nav>
                </div>

                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">Marcus Aurelius</p>
                            <p className="text-xs text-muted-foreground truncate">marcaurel@gmail.com</p>
                        </div>
                    </div>
                </div>
            </motion.aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col relative">
                {/* Header */}
                <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <Menu size={20} />
                        </Button>
                        <span className="font-medium">Valerio V 1.2</span>
                    </div>
                </header>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-full p-4" ref={scrollRef}>
                        <div className="max-w-3xl mx-auto space-y-6 py-8">
                            {messages.length === 0 ? (
                                <EmptyState />
                            ) : (
                                messages.map((msg, i) => (
                                    <ChatMessage key={i} role={msg.role} content={msg.content} />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="max-w-3xl mx-auto relative">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask something..."
                            className="pr-12 h-14 text-base rounded-full shadow-sm border-muted-foreground/20 focus-visible:ring-primary/20"
                        />
                        <Button
                            size="icon"
                            className="absolute right-2 top-2 h-10 w-10 rounded-full"
                            onClick={handleSend}
                            disabled={!input.trim()}
                        >
                            <ArrowUp size={20} />
                        </Button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground mt-3">
                        Valerio can make mistakes. Consider checking important information.
                    </p>
                </div>
            </main>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
        <Icon size={18} />
        {label}
    </Button>
);

const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 mt-20">
        <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hello Marcus
            </h1>
            <h2 className="text-3xl font-semibold text-muted-foreground">
                How can I help you today?
            </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4">
            <SuggestionCard
                icon="🌍"
                title="What's Happen in 24 hours?"
                desc="See what's been happening in the world over the last 24 hours"
            />
            <SuggestionCard
                icon="📈"
                title="Stock market update"
                desc="See what's happening in the stock market in real time"
            />
            <SuggestionCard
                icon="📝"
                title="Deep economic research"
                desc="See research from experts that we have simplified"
            />
        </div>
    </div>
);

const SuggestionCard = ({ icon, title, desc }: { icon: string, title: string, desc: string }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/50 border border-purple-100/50 cursor-pointer hover:shadow-md transition-all dark:from-purple-950/10 dark:to-pink-950/10 dark:border-purple-900/20"
    >
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xl text-white mb-4 shadow-lg shadow-purple-200 dark:shadow-none">
            {icon}
        </div>
        <h3 className="font-semibold mb-2 text-left">{title}</h3>
        <p className="text-sm text-muted-foreground text-left">{desc}</p>
    </motion.div>
);

const BotIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="currentColor" />
        <path d="M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="currentColor" />
    </svg>
);

export default ChatInterface;
