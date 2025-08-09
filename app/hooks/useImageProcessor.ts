// app/hooks/use-image-processor.ts
'use client'

import { useRef } from 'react';
import { useImageStore } from '@/app/store/useImageStore';

export function useImageProcessor() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        images,
        filesUploaded,
        activeMode,
        selectedImageId,
        selectedTemplate,
        globalSettings,
        setCanvasRef,
        resetGlobalSettings,
        clearImages,
        handleUpload,
        downloadAllToZip,
        handleIndividualSettingChange,
        setActiveMode,
        setSelectedImageId,
        setSelectedTemplate,
    } = useImageStore();

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        await handleUpload(files);
    };

    return {
        images,
        fileInputRef,
        filesUploaded,
        activeMode,
        setActiveMode,
        selectedImageId,
        setSelectedImageId,
        selectedTemplate,
        setSelectedTemplate,
        globalSettings,
        resetGlobalSettings,
        handleUploadClick,
        handleUpload: onFileUpload,
        downloadAllToZip,
        handleIndividualSettingChange,
        setCanvasRef,
        clearImages,
    };
}