import { motion } from 'framer-motion';
import ReactMarkdown, { Components } from 'react-markdown';
import type { CSSProperties, ReactNode } from 'react';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User, FileText, LinkIcon } from 'lucide-react';
import type { SourceCitation } from '@/store/chatSlice';

interface ChatMessageProps {
    role: 'user' | 'assistant' | 'system';
    content: string;
    attachments?: string[];
    sources?: SourceCitation[];
}

const ChatMessage = ({ role, content, attachments, sources }: ChatMessageProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "flex w-full gap-4 p-4 rounded-2xl transition-colors border",
                role === 'assistant' ? "bg-muted/40" : "bg-background hover:bg-muted/10"
            )}
        >
            <Avatar className="h-10 w-10 border mt-1">
                {role === 'assistant' ? (
                    <AvatarFallback className="bg-primary text-primary-foreground">
                        🤖
                    </AvatarFallback>
                ) : role === 'system' ? (
                    <AvatarFallback className="bg-muted text-muted-foreground">
                        ℹ️
                    </AvatarFallback>
                ) : (
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                        <User size={18} />
                    </AvatarFallback>
                )}
            </Avatar>

            <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                        {role === 'assistant' ? 'Chaatu AI' : role === 'system' ? 'System' : 'You'}
                    </span>
                </div>

                {attachments && attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-2 bg-background border rounded-md px-3 py-2 text-xs text-muted-foreground">
                                <FileText size={14} />
                                <span className="truncate max-w-[140px]">{file}</span>
                            </div>
                        ))}
                    </div>
                )}

                <article className="prose prose-sm prose-invert dark:prose-invert text-foreground/90 max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {content}
                    </ReactMarkdown>
                </article>

                {sources && sources.length > 0 && (
                    <div className="rounded-2xl bg-card/70 border p-3">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Sources</p>
                        <div className="space-y-2">
                            {sources.map((source) => (
                                <a
                                    key={source.id}
                                    href={source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-start gap-2 text-sm text-primary hover:underline"
                                >
                                    <LinkIcon size={14} className="mt-0.5" />
                                    <div>
                                        <p className="font-medium">{source.title}</p>
                                        {source.snippet && (
                                            <p className="text-xs text-muted-foreground">{source.snippet}</p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default ChatMessage;

const syntaxTheme = oneDark as Record<string, CSSProperties>;

const markdownComponents: Components = {
    code(codeProps) {
        const {
            inline,
            className,
            children,
            ...props
        } = codeProps as { inline?: boolean; className?: string; children: ReactNode };
        const match = /language-(\w+)/.exec(className || '');
        if (!inline && match) {
            return (
                <SyntaxHighlighter
                    style={syntaxTheme}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                >
                    {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
            );
        }
        return (
            <code className={className} {...props}>
                {children}
            </code>
        );
    },
};
