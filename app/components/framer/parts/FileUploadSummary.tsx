// app/components/FileUploadSummary.tsx
'use client';

import { ImageData } from '@/app/types';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { CheckCircle, File, Upload } from 'lucide-react';

interface FileUploadSummaryProps {
  images: ImageData[];
  onClear: () => void;
}

export default function FileUploadSummary({ images, onClear }: FileUploadSummaryProps) {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          {images.length} {images.length === 1 ? 'Image' : 'Images'} Uploaded
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <ul className="space-y-2 text-sm text-slate-700 max-h-32 overflow-y-auto pr-2">
            {images.map(image => (
              <li key={image.file.name} className="flex items-center gap-2">
                <File className="h-4 w-4 shrink-0" />
                <span className="truncate">{image.file.name}</span>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="gap-2 w-full" onClick={onClear}>
            <Upload className="h-4 w-4" />
            Upload New Images
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}