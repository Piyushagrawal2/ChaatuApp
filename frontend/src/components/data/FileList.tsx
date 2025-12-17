import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/services/api'; // I'll need to extend api service
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'; // Assuming shadcn Table exists
import { FileText, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileData {
    id: string;
    filename: string;
    size: number;
    created_at: string;
    connection: string;
    added_by: string;
}

export const FileList = () => {
    const { user } = useUser();
    const [files, setFiles] = useState<FileData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;

        // Fetch files
        // I will need to implement api.getFiles
        // For now using mock or direct fetch
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasources/files?user_id=${user.id}`)
            .then(res => res.json())
            .then(data => {
                setFiles(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch files", err);
                setLoading(false);
            });
    }, [user?.id]);

    if (loading) {
        return <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
        </div>;
    }

    if (files.length === 0) {
        return <div className="text-center py-10 text-muted-foreground">No files found.</div>;
    }

    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Connection</TableHead>
                        <TableHead>Added by</TableHead>
                        <TableHead>Date added</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {files.map((file) => (
                        <TableRow key={file.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                {file.filename}
                            </TableCell>
                            <TableCell>{file.connection}</TableCell>
                            <TableCell>{file.added_by}</TableCell>
                            <TableCell>{new Date(file.created_at).toLocaleDateString()}</TableCell>
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
