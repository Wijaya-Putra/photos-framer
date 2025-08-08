// app/components/PhotoMetadataFramerUI.tsx
'use client'

import React from 'react';
import { ImageData, TemplateName } from '@/app/types';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Upload,
  Download,
  Globe,
  ImageIcon,
  Settings,
  FileImage,
  DownloadCloud,
  RotateCcw,
  Palette,
} from "lucide-react";
import GlobalSettingsPanel from './config/global-settings-panel';
import IndividualSettingsPanel from './config/individual-settings-panel';
import FileUploadSummary from './file-upload-summary';
import ImageCard from './image-card';
import ClassicTemplate from './templates/classic-template';
import MemoirTemplate from './templates/memoir-template';

const templateMap: Record<TemplateName, React.ComponentType<any>> = {
  classic: ClassicTemplate,
  memoir: MemoirTemplate,
};

interface PhotoMetadataFramerUIProps {
  images: ImageData[];
  onUploadClick: () => void;
  filesUploaded: boolean;
  clearImages: () => void;
  onDownloadAll: () => void;
  activeMode: 'global' | 'individual';
  setActiveMode: (mode: 'global' | 'individual') => void;
  globalSettings: any;
  resetGlobalSettings: () => void;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  selectedTemplate: TemplateName;
  setSelectedTemplate: (template: TemplateName) => void;
  setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
  onIndividualSettingChange: (imageId: string, settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso' | 'dateTimeOriginal' | 'dominantColors'>, newValue: any) => void;
}

export default function PhotoMetadataFramerUI({
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
}: PhotoMetadataFramerUIProps) {

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
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <FileImage className="h-8 w-8 text-blue-600" />
            Photo Metadata Framer
          </h1>
          <p className="text-slate-600">Add beautiful metadata frames to your photos with ease</p>
        </div>

        {filesUploaded ? (
          <FileUploadSummary images={images} onClear={clearImages} />
        ) : (
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
                  <RotateCcw className="h-4 w-4 mr-2"/>
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
                  <Badge variant="outline" className="ml-1">
                    Per Photo
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="global" className="flex items-center gap-2 text-sm h-10">
                  <Globe className="h-4 w-4" />
                  Global Settings
                  <Badge variant="secondary" className="ml-1">
                    Apply to All
                  </Badge>
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