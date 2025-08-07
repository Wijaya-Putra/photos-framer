// app/components/config/global-settings-panel.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { Layout, Sliders, Type, RotateCcw } from "lucide-react"

interface GlobalSettingsPanelProps {
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
}

export default function GlobalSettingsPanel({
  aspect, setAspect,
  align, setAlign,
  paddingTop, setPaddingTop,
  paddingBottom, setPaddingBottom,
  paddingLeft, setPaddingLeft,
  paddingRight, setPaddingRight,
  paddingTopText, setPaddingTopText,
  paddingBetweenTextLines, setPaddingBetweenTextLines,
  paddingBetweenMetaData, setPaddingBetweenMetaData,
  fontSizeMain, setFontSizeMain,
  fontSizeMeta, setFontSizeMeta,
  jpegQuality, setJpegQuality,
}: GlobalSettingsPanelProps) {
  
  const resetToDefaults = () => {
    setAspect('1:1');
    setAlign('center');
    setPaddingTop(46);
    setPaddingBottom(46);
    setPaddingLeft(46);
    setPaddingRight(46);
    setPaddingTopText(70);
    setPaddingBetweenTextLines(12);
    setPaddingBetweenMetaData(12);
    setFontSizeMain(36);
    setFontSizeMeta(26);
    setJpegQuality(0.9);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Frame Layout
          </CardTitle>
          <Button variant="outline" size="sm" onClick={resetToDefaults}>
            <RotateCcw className="h-4 w-4 mr-2"/>
            Reset
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
            <Select value={aspect} onValueChange={setAspect}>
              <SelectTrigger><SelectValue /></SelectTrigger>
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
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            Spacing & Padding
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="canvas-padding-top">Padding Top</Label>
              <Input id="canvas-padding-top" type="number" value={paddingTop} onChange={(e) => setPaddingTop(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canvas-padding-bottom">Padding Bottom</Label>
              <Input id="canvas-padding-bottom" type="number" value={paddingBottom} onChange={(e) => setPaddingBottom(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canvas-padding-left">Padding Left</Label>
              <Input id="canvas-padding-left" type="number" value={paddingLeft} onChange={(e) => setPaddingLeft(Number(e.target.value))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canvas-padding-right">Padding Right</Label>
              <Input id="canvas-padding-right" type="number" value={paddingRight} onChange={(e) => setPaddingRight(Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="image-gap">Gap Between Image and Text</Label>
            <Input id="image-gap" type="number" value={paddingTopText} onChange={(e) => setPaddingTopText(Number(e.target.value))} />
          </div>
          {/* --- RESTORED FIELDS --- */}
          <div className="space-y-2">
            <Label htmlFor="meta-gap">Title to Metadata Gap</Label>
            <Input id="meta-gap" type="number" value={paddingBetweenTextLines} onChange={(e) => setPaddingBetweenTextLines(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data-gap">Metadata Line Spacing</Label>
            <Input id="data-gap" type="number" value={paddingBetweenMetaData} onChange={(e) => setPaddingBetweenMetaData(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Type className="h-4 w-4" />
            Typography & Quality
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="main-font">Title Font Size</Label>
            <Input id="main-font" type="number" value={fontSizeMain} onChange={(e) => setFontSizeMain(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta-font">Metadata Font Size</Label>
            <Input id="meta-font" type="number" value={fontSizeMeta} onChange={(e) => setFontSizeMeta(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jpeg-quality">Export Quality (0.1-1.0)</Label>
            <Input id="jpeg-quality" type="number" step="0.1" min="0.1" max="1.0" value={jpegQuality} onChange={(e) => setJpegQuality(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}