// app/components/upload-card.tsx
import { Upload } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';

interface UploadCardProps {
    onUploadClick: () => void;
}

export function UploadCard({ onUploadClick }: UploadCardProps) {
    return (
        <Card className="border-dashed border-2 border-slate-300 hover:border-blue-400 transition-colors">
            <CardContent className="p-8">
                <div className="text-center space-y-4">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                    <div>
                        <Button size="lg" className="gap-2" onClick={onUploadClick}>
                            <Upload className="h-4 w-4" />
                            Upload Images
                        </Button>
                        <p className="text-sm text-slate-500 mt-2">Drag and drop your images here or click to browse</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}