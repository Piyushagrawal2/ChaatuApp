import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming shadcn Tabs exist, if not I'll use div
import { Upload, Plus, Database, FileText } from 'lucide-react';
import ChatSidebar from '../chat/ChatSidebar';
import ChatHeader from '../chat/ChatHeader';
import { ConnectionList } from './ConnectionList';
import { FileList } from './FileList';
import { AddConnectionDropdown } from './AddConnectionDropdown';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import DocumentUpload from '../DocumentUpload';

export const DataPage = () => {
    const router = useRouter();
    const { user } = useUser();


    return (
        <div className="flex flex-col h-screen overflow-hidden bg-background">
            <ChatHeader
                currentModel="GPT-4o" // Placeholder or fetch from store
                onModelSelect={() => { }} // No-op for now
                onCustomModelClick={() => { }}
            />

            <div className="flex flex-1 overflow-hidden">
                <ChatSidebar
                    onNewChat={() => router.push('/')}
                    onSelectChat={(id) => router.push(`/chat/${id}`)}
                />

                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-5xl mx-auto space-y-8">

                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold tracking-tight">Chatbot data</h1>
                            <div className="flex items-center gap-4">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Upload className="w-4 h-4" />
                                            Upload File
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DocumentUpload
                                            conversationId="global"
                                            onUploadComplete={() => {
                                                // Reload data (will implement reload logic later)
                                                window.location.reload();
                                            }} />
                                    </DialogContent>
                                </Dialog>

                                <AddConnectionDropdown />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Tabs defaultValue="files" className="w-full">
                                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                                    <TabsTrigger
                                        value="files"
                                        className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                    >
                                        Files
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="connections"
                                        className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                    >
                                        Connections
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="files" className="mt-4">
                                    <FileList />
                                </TabsContent>
                                <TabsContent value="connections" className="mt-4">
                                    <ConnectionList />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
