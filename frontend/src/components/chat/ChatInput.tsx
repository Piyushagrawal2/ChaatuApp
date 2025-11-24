import { useState, useRef } from 'react';
import { ArrowUp, Paperclip, Mic, Globe, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ChatInputProps {
    onSend: (message: string, attachments: File[]) => void;
    isWebSearchEnabled: boolean;
    onToggleWebSearch: () => void;
}

const ChatInput = ({ onSend, isWebSearchEnabled, onToggleWebSearch }: ChatInputProps) => {
    const [input, setInput] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [attachments, setAttachments] = useState<File[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        if (!input.trim() && attachments.length === 0) return;
        onSend(input, attachments);
        setInput('');
        setAttachments([]);
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const toggleRecording = () => {
        setIsRecording(!isRecording);
    };

    return (
        <div className="p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
            <div className="max-w-3xl mx-auto relative">

                {/* Attachments Preview */}
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex gap-2 mb-3 overflow-x-auto py-2 px-1"
                        >
                            {attachments.map((file, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center gap-2 bg-muted/80 backdrop-blur-sm border rounded-xl px-3 py-2 text-sm shadow-sm"
                                >
                                    <FileText size={14} className="text-primary" />
                                    <span className="max-w-[100px] truncate font-medium">{file.name}</span>
                                    <button onClick={() => removeAttachment(i)} className="hover:text-destructive transition-colors ml-1">
                                        <X size={14} />
                                    </button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div
                    animate={{
                        boxShadow: isFocused ? "0 4px 20px -2px rgba(0, 0, 0, 0.1)" : "0 2px 10px -2px rgba(0, 0, 0, 0.05)",
                        borderColor: isFocused ? "hsl(var(--primary) / 0.3)" : "hsl(var(--border))"
                    }}
                    className={cn(
                        "relative flex items-end gap-2 bg-background/80 backdrop-blur-xl rounded-[26px] border p-2 transition-all duration-300",
                        isFocused && "ring-1 ring-primary/20"
                    )}
                >
                    {/* Left Actions */}
                    <div className="flex items-center gap-1 pb-1 pl-1">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip size={19} strokeWidth={2} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Attach file</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />

                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-9 w-9 rounded-full transition-all",
                                            isWebSearchEnabled
                                                ? "text-blue-500 bg-blue-500/10 hover:bg-blue-500/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                        )}
                                        onClick={onToggleWebSearch}
                                    >
                                        <Globe size={19} strokeWidth={2} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Web Search {isWebSearchEnabled ? 'On' : 'Off'}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-1 border-none shadow-none focus-visible:ring-0 min-h-[52px] py-3.5 px-2 text-base bg-transparent placeholder:text-muted-foreground/60"
                    />

                    {/* Right Actions */}
                    <div className="flex items-center gap-2 pb-1 pr-1">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-9 w-9 rounded-full transition-all",
                                            isRecording
                                                ? "text-red-500 bg-red-500/10 animate-pulse hover:bg-red-500/20"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
                                        )}
                                        onClick={toggleRecording}
                                    >
                                        <Mic size={19} strokeWidth={2} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Voice Input</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            size="icon"
                            className={cn(
                                "h-9 w-9 rounded-full transition-all shadow-sm",
                                (input.trim() || attachments.length > 0)
                                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 hover:shadow-md"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                            onClick={handleSend}
                            disabled={!input.trim() && attachments.length === 0}
                        >
                            <ArrowUp size={18} strokeWidth={2.5} />
                        </Button>
                    </div>
                </motion.div>

                <p className="text-center text-[11px] text-muted-foreground/60 mt-3 font-medium tracking-wide">
                    Chaatu can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;
