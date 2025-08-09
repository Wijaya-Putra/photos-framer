// app/components/title.tsx
import { FileImage } from 'lucide-react';

export function Title() {
    return (
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                <FileImage className="h-8 w-8 text-blue-600" />
                Photo Metadata Framer
            </h1>
            <p className="text-slate-600">Add beautiful metadata frames to your photos with ease</p>
        </div>
    );
}