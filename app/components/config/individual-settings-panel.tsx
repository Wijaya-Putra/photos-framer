// app/components/config/individual-settings-panel.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Separator } from "../ui/separator"
import { Download, ImageIcon, Palette, RotateCcw } from "lucide-react"
import ImageCard from "../image-card"
import { ImageData } from "@/app/types"

interface IndividualSettingsPanelProps {
  images: ImageData[];
  selectedImageId: string | null;
  setSelectedImageId: (id: string | null) => void;
  setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
  onIndividualSettingChange: (imageId: string, settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso'>, newValue: any) => void;
  globalSettings: any;
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
  
  const handleResetToDefaults = () => {
    if (selectedImage) {
      onIndividualSettingChange(selectedImage.file.name, 'individualAspect', '1:1');
      onIndividualSettingChange(selectedImage.file.name, 'individualAlign', 'center');
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTop', 46);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBottom', 46);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingLeft', 46);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingRight', 46);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTopText', 70);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenTextLines', 12);
      onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenMetaData', 12);
      onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMain', 36);
      onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMeta', 26);
      onIndividualSettingChange(selectedImage.file.name, 'individualJpegQuality', 0.9);
    }
  };

  return (
    <div className="space-y-6">
      {selectedImage ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Editing: <span className="font-bold text-blue-600 truncate max-w-[200px] md:max-w-xs">{selectedImage.file.name}</span>
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={handleResetToDefaults}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="individual-aspect-ratio">Aspect Ratio</Label>
                        <Select value={selectedImage.individualAspect} onValueChange={(value) => onIndividualSettingChange(selectedImage.file.name, 'individualAspect', value)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="left">Left</SelectItem>
                                <SelectItem value="center">Center</SelectItem>
                                <SelectItem value="right">Right</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Separator/>

                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="individual-padding-top-text">Gap Between Image and Text</Label>
                            <Input id="individual-padding-top-text" type="number" value={selectedImage.individualPaddingTopText} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingTopText', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="individual-padding-between-text-lines">Title to Metadata Gap</Label>
                            <Input id="individual-padding-between-text-lines" type="number" value={selectedImage.individualPaddingBetweenTextLines} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenTextLines', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="individual-padding-between-meta-data">Metadata Line Spacing</Label>
                            <Input id="individual-padding-between-meta-data" type="number" value={selectedImage.individualPaddingBetweenMetaData} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualPaddingBetweenMetaData', Number(e.target.value))} />
                        </div>
                    </div>
                </div>

                <Separator/>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="individual-font-size-main">Title Font Size</Label>
                        <Input id="individual-font-size-main" type="number" value={selectedImage.individualFontSizeMain} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMain', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="individual-font-size-meta">Metadata Font Size</Label>
                        <Input id="individual-font-size-meta" type="number" value={selectedImage.individualFontSizeMeta} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualFontSizeMeta', Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="individual-jpeg-quality">Export Quality</Label>
                        <Input id="individual-jpeg-quality" type="number" step="0.1" min="0.1" max="1.0" value={selectedImage.individualJpegQuality} onChange={(e) => onIndividualSettingChange(selectedImage.file.name, 'individualJpegQuality', Number(e.target.value))} />
                    </div>
                </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
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
          </div>
        </div>
      ) : (
        <div className="text-center py-10 text-slate-500">
            <ImageIcon className="h-12 w-12 mx-auto mb-4" />
            <p className="font-semibold">No Image Selected</p>
            <p className="text-sm">Upload an image to start editing its settings.</p>
        </div>
      )}
    </div>
  );
}