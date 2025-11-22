import { motion } from 'framer-motion';
import {
    Plus, Search, LayoutDashboard, Folder, History, Compass, Bot,
    Settings, HelpCircle, LogOut, Zap
} from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatSidebarProps {
    isOpen: boolean;
}

const ChatSidebar = ({ isOpen }: ChatSidebarProps) => {
    const { user } = useUser();
    const { signOut } = useClerk();

    return (
        <motion.aside
            initial={{ width: 280 }}
            animate={{ width: isOpen ? 280 : 0 }}
            className="relative flex flex-col border-r bg-muted/30 overflow-hidden"
        >
            <div className="p-4 min-w-[280px]">
                <div className="flex items-center gap-2 mb-6 px-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        <Bot size={20} />
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

            <div className="mt-auto p-4 border-t bg-background/50 backdrop-blur flex items-center justify-between gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-muted/50 h-14">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start overflow-hidden">
                                <span className="font-medium truncate w-full text-left">
                                    {user?.fullName || 'User'}
                                </span>
                                <span className="text-xs text-muted-foreground truncate w-full text-left">
                                    {user?.primaryEmailAddress?.emailAddress || 'user@example.com'}
                                </span>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.aside>
    );
};

const SidebarItem = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
        <Icon size={18} />
        {label}
    </Button>
);

export default ChatSidebar;
