// app/components/photo-metadata-framer.tsx (or PhotoMetadataFramerUI.tsx)
'use client'

// Import ImageData from App.tsx (or uploader.tsx if you didn't rename it)
import { ImageData } from './App'; // Adjust path based on your file structure, e.g., '../uploader' if App.tsx is named uploader.tsx

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
} from "lucide-react"
import ImageCard from './image-card' // Import ImageCard here

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
    paddingAllSides: number; setPaddingAllSides: (value: number) => void;
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
        {/* Header (No change) */}
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
                  globalSettings={globalSettings} // Pass global settings to IndividualSettingsPanel for "Copy from Global"
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

        {/* Display ImageCards - these are always rendered by PhotoMetadataFramerUI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <ImageCard
              key={img.file.name}
              image={img}
              // Pass global or individual settings based on activeMode
              settingMode={activeMode === 'global' ? 'global' : 'perCard'} // Ensure 'perCard' for individual
              globalAspect={globalSettings.aspect}
              globalAlign={globalSettings.align}
              globalPaddingAllSides={globalSettings.paddingAllSides}
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

// GlobalSettingsPanel (no changes from previous correction)
function GlobalSettingsPanel({
  aspect, setAspect,
  align, setAlign,
  paddingAllSides, setPaddingAllSides,
  paddingTopText, setPaddingTopText,
  paddingBetweenTextLines, setPaddingBetweenTextLines,
  paddingBetweenMetaData, setPaddingBetweenMetaData,
  fontSizeMain, setFontSizeMain,
  fontSizeMeta, setFontSizeMeta,
  jpegQuality, setJpegQuality,
}: PhotoMetadataFramerUIProps['globalSettings']) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Layout Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
              <Select value={aspect} onValueChange={setAspect}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                  <SelectItem value="3:2">3:2 (Classic)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-align">Text Alignment</Label>
              <Select value={align} onValueChange={setAlign}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Spacing Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sliders className="h-4 w-4" />
              Spacing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="canvas-padding">Canvas Padding</Label>
              <Input id="canvas-padding" type="number" value={paddingAllSides} onChange={(e) => setPaddingAllSides(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-gap">Gap Image to Text</Label>
              <Input id="image-gap" type="number" value={paddingTopText} onChange={(e) => setPaddingTopText(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-gap">Gap Main to Meta Text</Label>
              <Input id="meta-gap" type="number" value={paddingBetweenTextLines} onChange={(e) => setPaddingBetweenTextLines(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data-gap">Gap Between Meta Data</Label>
              <Input id="data-gap" type="number" value={paddingBetweenMetaData} onChange={(e) => setPaddingBetweenMetaData(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>

        {/* Typography & Quality */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography & Quality
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="main-font">Main Font Size</Label>
              <Input id="main-font" type="number" value={fontSizeMain} onChange={(e) => setFontSizeMain(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="meta-font">Meta Font Size</Label>
              <Input id="meta-font" type="number" value={fontSizeMeta} onChange={(e) => setFontSizeMeta(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jpeg-quality">JPEG Quality (0.1-1.0)</Label>
              <Input id="jpeg-quality" type="number" step="0.1" min="0.1" max="1.0" value={jpegQuality} onChange={(e) => setJpegQuality(Number(e.target.value))} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-green-600" />
          <span className="font-medium text-green-800">Global settings will be applied to all uploaded images</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          // Reset to defaults
          setAspect('1:1');
          setAlign('center');
          setPaddingAllSides(46);
          setPaddingTopText(20);
          setPaddingBetweenTextLines(10);
          setPaddingBetweenMetaData(5);
          setFontSizeMain(36);
          setFontSizeMeta(26);
          setJpegQuality(0.9);
        }}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}

// IndividualSettingsPanel (Updated to use real data and render ImageCard preview)
function IndividualSettingsPanel({
  images,
  selectedImageId,
  setSelectedImageId,
  setCanvasRef,
  onIndividualSettingChange,
  globalSettings, // Added globalSettings prop
}: Pick<PhotoMetadataFramerUIProps, 'images' | 'selectedImageId' | 'setSelectedImageId' | 'setCanvasRef' | 'onIndividualSettingChange' | 'globalSettings'>) {

  const selectedImage = images.find(img => img.file.name === selectedImageId);

  const handleDownloadIndividual = () => {
    if (selectedImage) {
      // Find the canvas specifically for the individual preview in this panel
      const canvas = document.querySelector(`canvas[data-image-id="${selectedImage.file.name}-individual-preview"]`) as HTMLCanvasElement;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `framed-${selectedImage.file.name.split('.')[0]}-individual.png`;
        link.href = canvas.toDataURL('image/png', selectedImage.individualJpegQuality); // Use individual quality
        link.click();
      } else {
        alert('Preview canvas not found for download. Please ensure the image is loaded.');
      }
    } else {
      alert('No image selected for individual download.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Image Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Select Image to Configure</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <Card
              key={image.file.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedImageId === image.file.name ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedImageId(image.file.name)}
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-slate-200 rounded-lg mb-3 overflow-hidden">
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={image.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm font-medium truncate">{image.file.name}</p>
                {selectedImageId === image.file.name && <Badge className="mt-2">Currently Editing</Badge>}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Individual Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Frame Settings for Selected Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedImage ? (
              <>
                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <Label htmlFor="individual-aspect-ratio">Aspect Ratio</Label>
                  <Select value={selectedImage.individualAspect} onValueChange={(value) => onIndividualSettingChange(selectedImage.file.name, 'individualAspect', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1:1">1:1 (Square)</SelectItem>
                      <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                      <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
                      <SelectItem value="3:2">3:2 (Classic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Text Alignment */}
                <div className="space-y-2">
                  <Label htmlFor="individual-text-align">Text Alignment</Label>
                  <Select value={selectedImage.individualAlign} onValueChange={(value) => onIndividualSettingChange(selectedImage.file.name, 'individualAlign', value as 'center' | 'left' | 'right')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="right">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {/* Padding */}
                <div className="space-y-2">
                  <Label htmlFor="individual-padding-all-sides">Canvas Padding</Label>
                  <Input id="individual-padding-all-sides" type="number" value={selectedImage.individualPaddingAllSides} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingAllSides', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-padding-top-text">Gap Image to Text</Label>
                  <Input id="individual-padding-top-text" type="number" value={selectedImage.individualPaddingTopText} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTopText', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-padding-between-text-lines">Gap Main to Meta Text</Label>
                  <Input id="individual-padding-between-text-lines" type="number" value={selectedImage.individualPaddingBetweenTextLines} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenTextLines', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-padding-between-meta-data">Gap Between Meta Data</Label>
                  <Input id="individual-padding-between-meta-data" type="number" value={selectedImage.individualPaddingBetweenMetaData} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenMetaData', Number(e.target.value))} />
                </div>
                {/* Font Sizes */}
                <div className="space-y-2">
                  <Label htmlFor="individual-font-size-main">Main Font Size</Label>
                  <Input id="individual-font-size-main" type="number" value={selectedImage.individualFontSizeMain} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMain', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-font-size-meta">Meta Font Size</Label>
                  <Input id="individual-font-size-meta" type="number" value={selectedImage.individualFontSizeMeta} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMeta', Number(e.target.value))} />
                </div>
                {/* JPEG Quality */}
                <div className="space-y-2">
                  <Label htmlFor="individual-jpeg-quality">JPEG Quality (0.1-1.0)</Label>
                  <Input id="individual-jpeg-quality" type="number" step="0.1" min="0.1" max="1.0" value={selectedImage.individualJpegQuality} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualJpegQuality', Number(e.target.value))} />
                </div>
              </>
            ) : (
              <p className="text-center text-slate-500">Select an image to view/edit its settings.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedImage ? (
              <>
                <ImageCard
                  key={selectedImage.file.name + '-individual-preview'} // Unique key for preview
                  image={selectedImage}
                  settingMode={'perCard'} // Force per-card settings for preview
                  // Pass global settings, but they won't be used due to settingMode='perCard'
                  globalAspect={globalSettings.aspect}
                  globalAlign={globalSettings.align}
                  globalPaddingAllSides={globalSettings.paddingAllSides}
                  globalPaddingTopText={globalSettings.paddingTopText}
                  globalPaddingBetweenTextLines={globalSettings.paddingBetweenTextLines}
                  globalPaddingBetweenMetaData={globalSettings.paddingBetweenMetaData}
                  globalFontSizeMain={globalSettings.fontSizeMain}
                  globalFontSizeMeta={globalSettings.fontSizeMeta}
                  globalJpegQuality={globalSettings.jpegQuality}
                  setCanvasRef={(key, node) => {
                    // This canvas ref is for the *preview* ImageCard within the individual settings panel
                    // It's separate from the main canvasRefs in App.tsx
                    // We attach a data-attribute to it for direct DOM query for individual download
                    if (node) {
                      node.setAttribute('data-image-id', selectedImage.file.name + '-individual-preview');
                    }
                  }}
                />
                <Button className="w-full mt-4 gap-2" onClick={handleDownloadIndividual}>
                  <Download className="h-4 w-4" />
                  Download This Image
                </Button>
              </>
            ) : (
              <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-slate-500">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2" />
                  <p className="text-sm">Select an image to see preview</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">
            Individual settings override global settings for selected images
          </span>
        </div>
        {selectedImage && (
          <Button variant="outline" size="sm" onClick={() => {
            // Copy current global settings to the selected image's individual settings
            if (selectedImage) { // Ensure selectedImage is not null
              onIndividualSettingChange(selectedImage.file.name, 'individualAspect', globalSettings.aspect);
              onIndividualSettingChange(selectedImage.file.name, 'individualAlign', globalSettings.align);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingAllSides', globalSettings.paddingAllSides);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTopText', globalSettings.paddingTopText);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenTextLines', globalSettings.paddingBetweenTextLines);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenMetaData', globalSettings.paddingBetweenMetaData);
              onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMain', globalSettings.fontSizeMain);
              onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMeta', globalSettings.fontSizeMeta);
              onIndividualSettingChange(selectedImage.file.name, 'individualJpegQuality', globalSettings.jpegQuality);
            }
          }}>
            Copy from Global
          </Button>
        )}
      </div>
    </div>
  );
}