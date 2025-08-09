// app/components/framer/FramerUI.tsx
'use client'

import React from 'react';
import { ImageData, TemplateName } from '@/app/types';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Upload, Download, Globe, ImageIcon, Settings, FileImage, DownloadCloud, RotateCcw } from "lucide-react";

import GlobalSettingsPanel from './config/GlobalSettingsPanel';
import IndividualSettingsPanel from './config/IndividualSettingsPanel';
import FileUploadSummary from './parts/FileUploadSummary';
import ImageCard from './parts/ImageCard';
import { Title } from './parts/Title';
import { UploadCard } from './parts/UploadCard';
import ClassicTemplate from './templates/ClassicTemplate';
import MemoirTemplate from './templates/MemoirTemplate';

const templateMap: Record<TemplateName, React.ComponentType<any>> = {
  classic: ClassicTemplate,
  memoir: MemoirTemplate,
};

interface FramerUIProps {
    images: ImageData[];
    onUploadClick: () => void;
    filesUploaded: boolean;
    clearImages: () => void;
    onDownloadAll: () => void;
    activeMode: 'global' | 'individual';
    setActiveMode: (mode: 'global' | 'individual') => void;
    globalSettings: any; // Still needed for the ImageCard grid below
    resetGlobalSettings: () => void;
    selectedImageId: string | null;
    setSelectedImageId: (id: string | null) => void;
    selectedTemplate: TemplateName;
    setSelectedTemplate: (template: TemplateName) => void;
    setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
    onIndividualSettingChange: (imageId: string, settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso' | 'dateTimeOriginal' | 'dominantColors'>, newValue: any) => void;
}

export default function FramerUI({
    images,
    onUploadClick,
    filesUploaded,
    clearImages,
    onDownloadAll,
    activeMode,
    setActiveMode,
    globalSettings,
    resetGlobalSettings,
    selectedImageId,
    setSelectedImageId,
    selectedTemplate,
    setSelectedTemplate,
    setCanvasRef,
    onIndividualSettingChange,
}: FramerUIProps) {

    const handleModeChange = (newMode: 'global' | 'individual') => {
        if (activeMode === 'global' && newMode === 'individual' && images.length > 1) {
            clearImages();
        } else {
            setActiveMode(newMode);
        }
    };

    const SelectedTemplateComponent = templateMap[selectedTemplate];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <div className="max-w-7xl mx-auto space-y-6">
                <Title />

                {filesUploaded ? (
                    <FileUploadSummary images={images} onClear={clearImages} />
                ) : (
                    <UploadCard onUploadClick={onUploadClick} />
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Configuration
                        </CardTitle>
                        <CardAction>
                            {activeMode === 'global' && (
                                <Button variant="outline" size="sm" onClick={resetGlobalSettings}>
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Reset Global Config
                                </Button>
                            )}
                        </CardAction>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeMode} onValueChange={(value) => handleModeChange(value as 'global' | 'individual')} className="w-full">
                            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto md:h-12">
                                <TabsTrigger value="individual" className="flex items-center gap-2 text-sm h-10">
                                    <ImageIcon className="h-4 w-4" />
                                    Individual Settings
                                </TabsTrigger>
                                <TabsTrigger value="global" className="flex items-center gap-2 text-sm h-10">
                                    <Globe className="h-4 w-4" />
                                    Global Settings
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="individual" className="mt-6">
                                <IndividualSettingsPanel
                                    images={images}
                                    selectedImageId={selectedImageId}
                                    setSelectedImageId={setSelectedImageId}
                                    onIndividualSettingChange={onIndividualSettingChange}
                                    globalSettings={globalSettings}
                                    setCanvasRef={setCanvasRef}
                                    TemplateComponent={SelectedTemplateComponent}
                                    selectedTemplate={selectedTemplate}
                                    setSelectedTemplate={setSelectedTemplate}
                                />
                            </TabsContent>
                            <TabsContent value="global" className="mt-6">
                                {/* This is the corrected part. No props are needed now. */}
                                <GlobalSettingsPanel
                                    {...globalSettings}
                                    selectedTemplate={selectedTemplate}
                                    setSelectedTemplate={setSelectedTemplate}
                                />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {images.length > 0 && activeMode === 'global' && (
                    <div className="space-y-6">
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <DownloadCloud className="h-8 w-8 text-blue-600" />
                                        <div>
                                            <h3 className="font-semibold text-slate-900">Ready to Download</h3>
                                            <p className="text-sm text-slate-600">All your framed images in one ZIP file</p>
                                        </div>
                                    </div>
                                    <Button size="lg" className="gap-2 w-full md:w-auto" onClick={onDownloadAll}>
                                        <Download className="h-4 w-4" />
                                        Download All Framed Images
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {images.map((img) => (
                                <ImageCard
                                    key={img.file.name}
                                    image={img}
                                    settingMode={'global'}
                                    globalAspect={globalSettings.aspect}
                                    globalAlign={globalSettings.align}
                                    globalPaddingTop={globalSettings.paddingTop}
                                    globalPaddingBottom={globalSettings.paddingBottom}
                                    globalPaddingLeft={globalSettings.paddingLeft}
                                    globalPaddingRight={globalSettings.paddingRight}
                                    globalPaddingTopText={globalSettings.paddingTopText}
                                    globalPaddingBetweenTextLines={globalSettings.paddingBetweenTextLines}
                                    globalPaddingBetweenMetaData={globalSettings.paddingBetweenMetaData}
                                    globalFontSizeMain={globalSettings.fontSizeMain}
                                    globalFontSizeMeta={globalSettings.fontSizeMeta}
                                    globalJpegQuality={globalSettings.jpegQuality}
                                    globalLocation={globalSettings.location}
                                    setCanvasRef={setCanvasRef}
                                    TemplateComponent={SelectedTemplateComponent}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}