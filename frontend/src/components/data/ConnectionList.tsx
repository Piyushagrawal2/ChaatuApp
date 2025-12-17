import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';

interface ConnectionData {
    id: string;
    name: string;
    source_type: string;
    status: string;
    last_synced_at: string;
    created_at: string;
    added_by: string;
}

export const ConnectionList = () => {
    const { user } = useUser();
    const [connections, setConnections] = useState<ConnectionData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasources/connections?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setConnections(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch connections", err);
                setLoading(false);
            });
    }, [user?.id]);

    if (loading) {
        return <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>;
    }

    if (connections.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No connections found.</div>;
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Added by</TableHead>
                        <TableHead>Date added</TableHead>
                        <TableHead>Last synced</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {connections.map((conn) => (
                        <TableRow key={conn.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                {/* Placeholder for icon based on source_type */}
                                <div className="w-4 h-4 bg-gray-200 rounded-sm" />
                                {conn.name}
                            </TableCell>
                            <TableCell>{conn.added_by}</TableCell>
                            <TableCell>{new Date(conn.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{new Date(conn.last_synced_at).toLocaleDateString()}</TableCell>
                            <TableCell>{conn.status}</TableCell>
                            <TableCell>
                                <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
