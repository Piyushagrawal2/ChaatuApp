import { Menu, ChevronDown, Sparkles, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from '../ThemeToggle';

interface ChatHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    currentModel: string;
    onModelSelect: (model: string) => void;
    onCustomModelClick: () => void;
}

const models = [
    { id: 'Chaatu-v1.2', name: 'Chaatu V 1.2', description: 'Fastest & Most Capable' },
    { id: 'gpt-4', name: 'GPT-4 Turbo', description: 'Complex Reasoning' },
    { id: 'claude-3', name: 'Claude 3 Opus', description: 'Creative Writing' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Multimodal Tasks' },
];

const ChatHeader = ({ isSidebarOpen, onToggleSidebar, currentModel, onModelSelect, onCustomModelClick }: ChatHeaderProps) => {
    const selectedModel = models.find(m => m.id === currentModel);
    const displayName = selectedModel ? selectedModel.name : currentModel;

    return (
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
                    <Menu size={20} />
                </Button>

                <div className="flex items-center gap-2 mr-4">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Bot size={20} />
                    </div>
                    <span className="font-bold text-lg hidden md:block">Chaatu.ai</span>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 font-medium hover:bg-muted/50">
                            {displayName}
                            <ChevronDown size={16} className="text-muted-foreground" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-60">
                        {models.map((model) => (
                            <DropdownMenuItem
                                key={model.id}
                                onClick={() => onModelSelect(model.id)}
                                className="flex flex-col items-start py-2 cursor-pointer"
                            >
                                <div className="flex items-center gap-2 w-full">
                                    <span className="font-medium">{model.name}</span>
                                    {currentModel === model.id && <Sparkles size={14} className="text-primary ml-auto" />}
                                </div>
                                <span className="text-xs text-muted-foreground">{model.description}</span>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onCustomModelClick} className="cursor-pointer">
                            <span className="text-purple-500 font-medium">Open Source / Custom...</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <ThemeToggle />
        </header >
    );
};

export default ChatHeader;
