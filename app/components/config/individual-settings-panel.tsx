// app/components/config/individual-settings-panel.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { Download, ImageIcon, Palette } from "lucide-react"
import ImageCard from "../image-card"
import { ImageData } from "@/app/types"

interface IndividualSettingsPanelProps {
  images: ImageData[];
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
  // This is the corrected type definition
  onIndividualSettingChange: (imageId: string, settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso'>, newValue: any) => void;
  globalSettings: {
    aspect: string;
    align: 'center' | 'left' | 'right';
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
    paddingTopText: number;
    paddingBetweenTextLines: number;
    paddingBetweenMetaData: number;
    fontSizeMain: number;
    fontSizeMeta: number;
    jpegQuality: number;
  };
}

export default function IndividualSettingsPanel({
  images,
  selectedImageId,
  setSelectedImageId,
  setCanvasRef,
  onIndividualSettingChange,
  globalSettings,
}: IndividualSettingsPanelProps) {

  const selectedImage = images.find(img => img.file.name === selectedImageId);

  const handleDownloadIndividual = () => {
    if (selectedImage) {
      const canvas = document.querySelector(`canvas[data-image-id="${selectedImage.file.name}-individual-preview"]`) as HTMLCanvasElement;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `framed-${selectedImage.file.name.split('.')[0]}.jpeg`;
        link.href = canvas.toDataURL('image/jpeg', selectedImage.individualJpegQuality);
        link.click();
      } else {
        alert('Preview canvas not found for download.');
      }
    } else {
      alert('No image selected for individual download.');
    }
  };

  return (
    <div className="space-y-6">
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="individual-padding-top">Padding Top</Label>
                    <Input id="individual-padding-top" type="number" value={selectedImage.individualPaddingTop} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTop', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="individual-padding-bottom">Padding Bottom</Label>
                    <Input id="individual-padding-bottom" type="number" value={selectedImage.individualPaddingBottom} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBottom', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="individual-padding-left">Padding Left</Label>
                    <Input id="individual-padding-left" type="number" value={selectedImage.individualPaddingLeft} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingLeft', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="individual-padding-right">Padding Right</Label>
                    <Input id="individual-padding-right" type="number" value={selectedImage.individualPaddingRight} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingRight', Number(e.target.value))} />
                  </div>
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
                <div className="space-y-2">
                  <Label htmlFor="individual-font-size-main">Main Font Size</Label>
                  <Input id="individual-font-size-main" type="number" value={selectedImage.individualFontSizeMain} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMain', Number(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="individual-font-size-meta">Meta Font Size</Label>
                  <Input id="individual-font-size-meta" type="number" value={selectedImage.individualFontSizeMeta} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMeta', Number(e.target.value))} />
                </div>
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
                  key={`${selectedImage.file.name}-individual-preview`}
                  image={selectedImage}
                  settingMode={'perCard'}
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
                  setCanvasRef={(key, node) => {
                    if (node) {
                      node.setAttribute('data-image-id', `${selectedImage.file.name}-individual-preview`);
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
            Individual settings override global settings
          </span>
        </div>
        {selectedImage && (
          <Button variant="outline" size="sm" onClick={() => {
            if (selectedImage) {
              onIndividualSettingChange(selectedImage.file.name, 'individualAspect', globalSettings.aspect);
              onIndividualSettingChange(selectedImage.file.name, 'individualAlign', globalSettings.align);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTop', globalSettings.paddingTop);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBottom', globalSettings.paddingBottom);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingLeft', globalSettings.paddingLeft);
              onIndividualSettingChange(selectedImage.file.name, 'individualPaddingRight', globalSettings.paddingRight);
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