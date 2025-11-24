import { motion } from 'framer-motion';
import {
    Plus, Search, LayoutDashboard, Folder, History, Compass, Bot,
    Settings, LogOut, MessageSquare
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarItem } from './SidebarItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useState } from 'react';
import { api, Chat } from '@/services/api';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface ChatSidebarProps {
    // isOpen is now in Redux
    onNewChat: () => void;
    onSelectChat: (chatId: string) => void;
    refreshTrigger: number;
}

const ChatSidebar = ({ onNewChat, onSelectChat, refreshTrigger }: ChatSidebarProps) => {
    const { user } = useUser();
    const { signOut } = useClerk();
    const [chats, setChats] = useState<Chat[]>([]);
    const isOpen = useSelector((state: RootState) => state.ui.isSidebarOpen);

    useEffect(() => {
        if (user?.id) {
            api.getChats(user.id)
                .then(setChats)
                .catch(err => console.error("Failed to fetch chats:", err));
        }
    }, [user?.id, refreshTrigger]);

    return (
        <motion.aside
            initial={{ width: 80 }}
            animate={{ width: isOpen ? 80 : 0 }}
            className="relative flex flex-col items-center py-4 border-r bg-muted/30 overflow-visible z-50 h-full"
        >

            <div className="flex flex-col gap-2 w-full px-2">
                <SidebarItem icon={Plus} label="New Chat" onClick={onNewChat} />

                <SidebarItem icon={Compass} label="Explore">
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-lg">Explore</h3>
                        <div className="space-y-2">
                            <Button variant="ghost" className="w-full justify-start text-sm">Trending</Button>
                            <Button variant="ghost" className="w-full justify-start text-sm">Most Popular</Button>
                            <Button variant="ghost" className="w-full justify-start text-sm">New Arrivals</Button>
                        </div>
                    </div>
                </SidebarItem>

                <SidebarItem icon={History} label="History">
                    <div className="flex flex-col h-full max-h-[400px]">
                        <div className="p-4 border-b">
                            <h3 className="font-semibold text-lg">Chat History</h3>
                        </div>
                        <ScrollArea className="flex-1 p-2">
                            <div className="space-y-1">
                                {chats.length === 0 ? (
                                    <div className="text-sm text-muted-foreground p-2">No history yet</div>
                                ) : (
                                    chats.map(chat => (
                                        <Button
                                            key={chat.id}
                                            variant="ghost"
                                            className="w-full justify-start text-sm truncate h-auto py-2"
                                            onClick={() => onSelectChat(chat.id)}
                                        >
                                            {chat.title}
                                        </Button>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </SidebarItem>

                <SidebarItem icon={LayoutDashboard} label="Library">
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-lg">Library</h3>
                        <p className="text-sm text-muted-foreground">Your saved prompts and templates will appear here.</p>
                    </div>
                </SidebarItem>

                <SidebarItem icon={Folder} label="Files">
                    <div className="p-4 space-y-4">
                        <h3 className="font-semibold text-lg">Files</h3>
                        <p className="text-sm text-muted-foreground">No files uploaded yet.</p>
                    </div>
                </SidebarItem>
            </div>

            <div className="mt-auto flex flex-col gap-2 w-full px-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.imageUrl} />
                                <AvatarFallback>{user?.firstName?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" side="right" className="w-56 ml-2">
                        <div className="flex items-center gap-2 p-2">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                        <DropdownMenuSeparator />
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

export default ChatSidebar;
