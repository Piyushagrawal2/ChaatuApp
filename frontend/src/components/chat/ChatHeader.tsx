import { Menu, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatHeaderProps {
    isSidebarOpen: boolean;
    onToggleSidebar: () => void;
    currentModel: string;
    onModelSelect: (model: string) => void;
}

const models = [
    { id: 'valerio-v1.2', name: 'Valerio V 1.2', description: 'Fastest & Most Capable' },
    { id: 'gpt-4', name: 'GPT-4 Turbo', description: 'Complex Reasoning' },
    { id: 'claude-3', name: 'Claude 3 Opus', description: 'Creative Writing' },
    { id: 'gemini-pro', name: 'Gemini Pro', description: 'Multimodal Tasks' },
];

const ChatHeader = ({ isSidebarOpen, onToggleSidebar, currentModel, onModelSelect }: ChatHeaderProps) => {
    const selectedModel = models.find(m => m.id === currentModel) || models[0];

    return (
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
                    <Menu size={20} />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="gap-2 font-medium hover:bg-muted/50">
                            {selectedModel.name}
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default ChatHeader;
