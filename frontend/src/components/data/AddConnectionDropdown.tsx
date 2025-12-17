import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

const CONNECTIONS = [
    { name: 'Amazon S3', icon: '📦' },
    { name: 'Confluence', icon: '📘' },
    { name: 'Dropbox', icon: '📂' },
    { name: 'Freshdesk', icon: '🎧' },
    { name: 'Jira', icon: 'tasks' },
    { name: 'Google Cloud Storage', icon: '☁️' },
    { name: 'Gmail', icon: '✉️' },
    { name: 'Google Drive', icon: 'Drive' },
    { name: 'HubSpot', icon: '🟠' },
    { name: 'Notion', icon: 'N' },
    { name: 'OneDrive', icon: '☁️' },
    { name: 'Salesforce', icon: '☁️' },
    { name: 'Slack', icon: '#️⃣' },
];

import { useUser } from '@clerk/nextjs';
import { api } from '@/services/api'; // I might need to add createConnection to api service or fetch directly

export const AddConnectionDropdown = () => {
    const { user } = useUser();

    const handleConnect = async (name: string) => {
        if (!user?.id) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasources/connections`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${user.firstName}'s ${name}`,
                    source_type: name,
                    user_id: user.id
                })
            });
            if (res.ok) {
                // Reload to show new connection using window.location for simplicity as we don't have global state for this yet
                window.location.reload();
            } else {
                console.error("Failed to create connection");
            }
        } catch (error) {
            console.error("Error creating connection", error);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    Add Connection
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px] max-h-[400px] overflow-auto">
                {CONNECTIONS.map((conn) => (
                    <DropdownMenuItem key={conn.name} onClick={() => handleConnect(conn.name)} className="cursor-pointer gap-2">
                        <span className="w-4 h-4 text-center">{conn.icon}</span>
                        {conn.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
