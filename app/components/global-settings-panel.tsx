// components/global-settings-panel.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Globe, Layout, Sliders, Type } from "lucide-react"

interface GlobalSettingsPanelProps {
  aspect: string; setAspect: (value: string) => void;
  align: 'center' | 'left' | 'right'; setAlign: (value: 'center' | 'left' | 'right') => void;
  paddingAllSides: number; setPaddingAllSides: (value: number) => void;
  paddingTopText: number; setPaddingTopText: (value: number) => void;
  paddingBetweenTextLines: number; setPaddingBetweenTextLines: (value: number) => void;
  paddingBetweenMetaData: number; setPaddingBetweenMetaData: (value: number) => void;
  fontSizeMain: number; setFontSizeMain: (value: number) => void;
  fontSizeMeta: number; setFontSizeMeta: (value: number) => void;
  jpegQuality: number; setJpegQuality: (value: number) => void;
}

export default function GlobalSettingsPanel({
  aspect, setAspect,
  align, setAlign,
  paddingAllSides, setPaddingAllSides,
  paddingTopText, setPaddingTopText,
  paddingBetweenTextLines, setPaddingBetweenTextLines,
  paddingBetweenMetaData, setPaddingBetweenMetaData,
  fontSizeMain, setFontSizeMain,
  fontSizeMeta, setFontSizeMeta,
  jpegQuality, setJpegQuality,
}: GlobalSettingsPanelProps) {
  // Function to reset all global settings to their default values
  const resetToDefaults = () => {
    setAspect('1:1');
    setAlign('center');
    setPaddingAllSides(46);
    setPaddingTopText(20);
    setPaddingBetweenTextLines(10);
    setPaddingBetweenMetaData(5);
    setFontSizeMain(36);
    setFontSizeMeta(26);
    setJpegQuality(0.9);
  };

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
                  <SelectItem value="original">Original</SelectItem>
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
        <Button variant="outline" size="sm" onClick={resetToDefaults}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  )
}