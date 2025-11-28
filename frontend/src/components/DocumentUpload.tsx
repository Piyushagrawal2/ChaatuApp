import { useCallback, useMemo, useRef, useState } from 'react';
import { CloudUpload, FileText, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from 'nanoid/non-secure';
import { API_BASE_URL } from '@/services/api';
import { RootState } from '@/store/store';
import { addMessage, setUploadProgress } from '@/store/chatSlice';

const ACCEPTED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ACCEPTED_EXTENSIONS = ['pdf', 'doc', 'docx'];

interface DocumentUploadProps {
    conversationId: string | null;
}

const DocumentUpload = ({ conversationId }: DocumentUploadProps) => {
    const dispatch = useDispatch();
    const uploadProgress = useSelector((state: RootState) => state.chat.uploadProgress);
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const isDisabled = !conversationId || isUploading;

    const helperText = useMemo(() => {
        if (!conversationId) {
            return 'Start a conversation to upload supporting documents.';
        }
        return 'PDF or Word documents. Max size 15MB.';
    }, [conversationId]);

    const validateFile = (file: File) => {
        if (!ACCEPTED_TYPES.includes(file.type)) {
            const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
            if (!ACCEPTED_EXTENSIONS.includes(ext)) {
                throw new Error('Only PDF and DOC/DOCX files are allowed.');
            }
        }
        const maxSize = 15 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error('File size exceeds the 15MB limit.');
        }
    };

    const uploadFile = (file: File) => new Promise<void>((resolve, reject) => {
        if (!conversationId) {
            reject(new Error('No conversation selected'));
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL.replace(/\/$/, '')}/documents/upload`);
        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const percent = Math.round((event.loaded / event.total) * 100);
                dispatch(setUploadProgress(percent));
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                dispatch(setUploadProgress(100));
                dispatch(addMessage({
                    id: nanoid(),
                    role: 'system',
                    content: `Attached document: ${file.name}`,
                    status: 'complete',
                    attachments: [file.name],
                }));
                resolve();
            } else {
                reject(new Error(xhr.responseText || 'Upload failed'));
            }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        const formData = new FormData();
        formData.append('conversation_id', conversationId);
        formData.append('file', file);
        xhr.send(formData);
    });

    const handleFiles = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        try {
            validateFile(file);
            setError(null);
            setIsUploading(true);
            await uploadFile(file);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Failed to upload file');
            }
        } finally {
            setIsUploading(false);
            dispatch(setUploadProgress(null));
        }
    }, [dispatch, conversationId]);

    const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        setIsDragging(false);
        if (isDisabled) return;
        handleFiles(event.dataTransfer.files);
    }, [handleFiles, isDisabled]);

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        if (!isDisabled) {
            setIsDragging(true);
        }
    }, [isDisabled]);

    const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
    }, []);

    const onFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        handleFiles(event.target.files);
    }, [handleFiles]);

    return (
        <div
            className={[
                'rounded-2xl border border-dashed p-4 transition-colors',
                isDragging ? 'border-primary bg-primary/5' : 'border-border',
                isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer',
            ].join(' ')}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragLeave={onDragLeave}
            onClick={() => !isDisabled && inputRef.current?.click()}
        >
            <input
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={onFileChange}
                disabled={isDisabled}
            />

            <div className="flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-3">
                    <CloudUpload className="text-primary" size={24} />
                </div>
                <div className="flex-1">
                    <p className="font-medium text-sm">Upload supporting documents</p>
                    <p className="text-xs text-muted-foreground">{helperText}</p>

                    {isUploading && (
                        <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                <span>Uploading...</span>
                                <span>{uploadProgress ?? 0}%</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted">
                                <div
                                    className="h-2 rounded-full bg-primary transition-all"
                                    style={{ width: `${uploadProgress ?? 0}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle size={14} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <FileText size={14} />
                <span>Drag & drop or click to browse</span>
            </div>
        </div>
    );
};

export default DocumentUpload;

