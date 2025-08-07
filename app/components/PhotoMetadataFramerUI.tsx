// app/components/PhotoMetadataFramerUI.tsx
'use client'

import { ImageData } from '@/app/types';
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Upload, Globe, ImageIcon, Settings, FileImage } from "lucide-react";
import GlobalSettingsPanel from './config/global-settings-panel';
import IndividualSettingsPanel from './config/individual-settings-panel';

interface PhotoMetadataFramerUIProps {
  images: ImageData[];
  onUploadClick: () => void;
  onDownloadAll: () => void;
  activeMode: 'global' | 'individual';
  setActiveMode: (mode: 'global' | 'individual') => void;
  globalSettings: any;
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
  onIndividualSettingChange: (imageId: string, settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso'>, newValue: any) => void;
}

export default function PhotoMetadataFramerUI({
  images,
  onUploadClick,
  onDownloadAll,
  activeMode,
  setActiveMode,
  globalSettings,
  selectedImageId,
  setSelectedImageId,
  setCanvasRef,
  onIndividualSettingChange,
}: PhotoMetadataFramerUIProps) {

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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as 'global' | 'individual')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="individual" className="flex items-center gap-2 text-sm">
                  <ImageIcon className="h-4 w-4" />
                  Individual Settings
                  <Badge variant="outline" className="ml-1">
                    Per Photo
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="global" className="flex items-center gap-2 text-sm">
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
                />
              </TabsContent>
              <TabsContent value="global" className="mt-6">
                <GlobalSettingsPanel {...globalSettings} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}