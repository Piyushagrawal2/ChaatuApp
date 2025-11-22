import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CustomModelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (modelName: string, apiKey: string) => void;
}

const CustomModelDialog = ({ isOpen, onClose, onSubmit }: CustomModelDialogProps) => {
    const [modelName, setModelName] = useState('');
    const [apiKey, setApiKey] = useState('');

    const handleSubmit = () => {
        if (modelName && apiKey) {
            onSubmit(modelName, apiKey);
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Connect Open Source Model</DialogTitle>
                    <DialogDescription>
                        Enter the model name and your API key from your provider (e.g., OpenRouter, Ollama).
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="model-name" className="text-right">
                            Model Name
                        </Label>
                        <Input
                            id="model-name"
                            placeholder="e.g., mistralai/mistral-7b"
                            className="col-span-3"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="api-key" className="text-right">
                            API Key
                        </Label>
                        <Input
                            id="api-key"
                            type="password"
                            placeholder="sk-..."
                            className="col-span-3"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleSubmit}>Connect & Start Chat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CustomModelDialog;
