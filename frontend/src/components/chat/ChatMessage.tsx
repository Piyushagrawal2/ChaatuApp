import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User, FileText } from 'lucide-react';

interface ChatMessageProps {
    role: 'user' | 'assistant';
    content: string;
    attachments?: string[]; // Array of file names for demo
}

const ChatMessage = ({ role, content, attachments }: ChatMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-4 p-4 rounded-xl transition-colors",
                role === 'assistant' ? "bg-muted/50" : "bg-background hover:bg-muted/20"
            )}
        >
            <Avatar className="h-8 w-8 border mt-1">
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
                        {role === 'assistant' ? 'Chaatu AI' : 'You'}
                    </span>
                </div>

                {attachments && attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                        {attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-background border rounded-md px-3 py-2 text-sm text-muted-foreground">
                                <FileText size={14} />
                                <span>{file}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {content}
                </div>
            </div>
        </motion.div>
    );
};

export default ChatMessage;
