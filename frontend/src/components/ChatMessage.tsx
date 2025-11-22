import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
}

const ChatMessage = ({ role, content }: ChatMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-4 p-4",
                role === 'assistant' ? "bg-muted/50" : "bg-background"
            )}
        >
            <Avatar className="h-8 w-8 border">
                {role === 'assistant' ? (
                    <>
                        <AvatarImage src="/bot-avatar.png" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot size={16} />
                        </AvatarFallback>
                    </>
                ) : (
                    <>
                        <AvatarImage src="/user-avatar.png" />
                        <AvatarFallback className="bg-secondary text-secondary-foreground">
                            <User size={16} />
                        </AvatarFallback>
                    </>
                )}
            </Avatar>

            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                        {role === 'assistant' ? 'Chhatu AI' : 'You'}
                    </span>
                </div>
                <div className="text-sm leading-relaxed text-foreground/90">
                    {content}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
