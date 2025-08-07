// app/components/PhotoMetadataFramerUI.tsx
'use client'

import { ImageData } from '@/app/types';

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import {
  Upload,
  Download,
  Globe,
  ImageIcon,
  Settings,
  Palette,
  Type,
  Layout,
  Sliders,
  FileImage,
  DownloadCloud,
} from "lucide-react";
import ImageCard from './image-card';
import GlobalSettingsPanel from './config/global-settings-panel';
import IndividualSettingsPanel from './config/individual-settings-panel';

// Define the prop types for PhotoMetadataFramerUI
interface PhotoMetadataFramerUIProps {
  images: ImageData[];
  onUploadClick: () => void;
  onDownloadAll: () => void;
  activeMode: 'global' | 'individual';
  setActiveMode: (mode: 'global' | 'individual') => void;
  globalSettings: {
    aspect: string; setAspect: (value: string) => void;
    align: 'center' | 'left' | 'right'; setAlign: (value: 'center' | 'left' | 'right') => void;
    paddingTop: number; setPaddingTop: (value: number) => void;
    paddingBottom: number; setPaddingBottom: (value: number) => void;
    paddingLeft: number; setPaddingLeft: (value: number) => void;
    paddingRight: number; setPaddingRight: (value: number) => void;
    paddingTopText: number; setPaddingTopText: (value: number) => void;
    paddingBetweenTextLines: number; setPaddingBetweenTextLines: (value: number) => void;
    paddingBetweenMetaData: number; setPaddingBetweenMetaData: (value: number) => void;
    fontSizeMain: number; setFontSizeMain: (value: number) => void;
    fontSizeMeta: number; setFontSizeMeta: (value: number) => void;
    jpegQuality: number; setJpegQuality: (value: number) => void;
  };
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
  // This is the corrected line
  onIndividualSettingChange: (
    imageId: string,
    settingName:
      | "individualAspect"
      | "individualAlign"
      | "individualPaddingTop"
      | "individualPaddingBottom"
      | "individualPaddingLeft"
      | "individualPaddingRight"
      | "individualPaddingTopText"
      | "individualPaddingBetweenTextLines"
      | "individualPaddingBetweenMetaData"
      | "individualFontSizeMain"
      | "individualFontSizeMeta"
      | "individualJpegQuality",
    newValue: any
  ) => void;
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
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <FileImage className="h-8 w-8 text-blue-600" />
            Photo Metadata Framer
          </h1>
          <p className="text-slate-600">Add beautiful metadata frames to your photos with ease</p>
        </div>

        {/* Upload Section */}
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

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeMode} onValueChange={setActiveMode as (value: string) => void} className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="global" className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4" />
                  Global Settings
                  <Badge variant="secondary" className="ml-1">
                    Apply to All
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="individual" className="flex items-center gap-2 text-sm">
                  <ImageIcon className="h-4 w-4" />
                  Individual Settings
                  <Badge variant="outline" className="ml-1">
                    Per Photo
                  </Badge>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="global" className="mt-6">
                <GlobalSettingsPanel {...globalSettings} />
              </TabsContent>
              <TabsContent value="individual" className="mt-6">
                <IndividualSettingsPanel
                  images={images}
                  selectedImageId={selectedImageId}
                  setSelectedImageId={setSelectedImageId}
                  setCanvasRef={setCanvasRef}
                  onIndividualSettingChange={onIndividualSettingChange}
                  globalSettings={globalSettings}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Download Section */}
        {images.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DownloadCloud className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-slate-900">Ready to Download</h3>
                    <p className="text-sm text-slate-600">All your framed images in one ZIP file</p>
                  </div>
                </div>
                <Button size="lg" className="gap-2" onClick={onDownloadAll}>
                  <Download className="h-4 w-4" />
                  Download All Framed Images
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Display ImageCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.file.name}
              image={img}
              settingMode={activeMode === 'global' ? 'global' : 'perCard'}
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
              setCanvasRef={setCanvasRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}