import { useState, useRef } from 'react';
import { ArrowUp, Paperclip, Mic, Globe, X, FileText } from 'lucide-react';
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
        // In a real app, this would handle the Web Speech API or MediaRecorder
    };

    return (
        <div className="p-4 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-3xl mx-auto relative">

                {/* Attachments Preview */}
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex gap-2 mb-2 overflow-x-auto py-2"
                        >
                            {attachments.map((file, i) => (
                                <div key={i} className="flex items-center gap-2 bg-muted/50 border rounded-lg px-3 py-1.5 text-sm">
                                    <FileText size={14} className="text-primary" />
                                    <span className="max-w-[100px] truncate">{file.name}</span>
                                    <button onClick={() => removeAttachment(i)} className="hover:text-destructive">
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative flex items-center gap-2 bg-background rounded-2xl border shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    {/* Left Actions */}
                    <div className="flex items-center gap-1 pl-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-full text-muted-foreground hover:text-primary"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Paperclip size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Attach file</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <input
                            type="file"
                            multiple
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                        />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-9 w-9 rounded-full transition-colors",
                                            isWebSearchEnabled ? "text-blue-500 bg-blue-500/10" : "text-muted-foreground hover:text-primary"
                                        )}
                                        onClick={onToggleWebSearch}
                                    >
                                        <Globe size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Web Search {isWebSearchEnabled ? 'On' : 'Off'}</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Ask anything..."
                        className="flex-1 border-none shadow-none focus-visible:ring-0 min-h-[56px] py-4 px-2 text-base bg-transparent"
                    />

                    {/* Right Actions */}
                    <div className="flex items-center gap-1 pr-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-9 w-9 rounded-full transition-all",
                                            isRecording ? "text-red-500 bg-red-500/10 animate-pulse" : "text-muted-foreground hover:text-primary"
                                        )}
                                        onClick={toggleRecording}
                                    >
                                        <Mic size={18} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Voice Input</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <Button
                            size="icon"
                            className="h-9 w-9 rounded-full transition-all"
                            onClick={handleSend}
                            disabled={!input.trim() && attachments.length === 0}
                        >
                            <ArrowUp size={18} />
                        </Button>
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-3">
                    Valerio can make mistakes. Consider checking important information.
                </p>
            </div>
        </div>
    );
};

export default ChatInput;
