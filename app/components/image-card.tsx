'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageData } from './uploader'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

interface Props {
  image: ImageData;
  settingMode: 'global' | 'perCard';
  globalAspect?: string;
  globalAlign?: 'center' | 'left' | 'right';
  globalPaddingAllSides?: number;
  globalPaddingTopText?: number;
  globalPaddingBetweenTextLines?: number;
  globalPaddingBetweenMetaData?: number;
  globalFontSizeMain?: number;
  globalFontSizeMeta?: number;
  globalJpegQuality?: number; // New prop for JPEG quality
  setCanvasRef?: (key: string, node: HTMLCanvasElement | null) => void;
}

// Define the reference width from your Figma design
const FIGMA_REFERENCE_IMAGE_WIDTH = 1866;

// Define minimum legible sizes
const MIN_FONT_SIZE = 10; // Adjust as needed
const MIN_PADDING = 10;   // Adjust as needed

export default function ImageCard({
  image,
  settingMode,
  globalAspect,
  globalAlign,
  globalPaddingAllSides,
  globalPaddingTopText,
  globalPaddingBetweenTextLines,
  globalPaddingBetweenMetaData,
  globalFontSizeMain,
  globalFontSizeMeta,
  globalJpegQuality, // Destructure new prop
  setCanvasRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  // Per-card states (used when settingMode is 'perCard')
  const [localAspect, setLocalAspect] = useState('1:1')
  const [localAlign, setLocalAlign] = useState<'center' | 'left' | 'right'>('center')
  const [localPaddingAllSides, setLocalPaddingAllSides] = useState(46)
  const [localPaddingTopText, setLocalPaddingTopText] = useState(20)
  const [localPaddingBetweenTextLines, setLocalPaddingBetweenTextLines] = useState(10)
  const [localPaddingBetweenMetaData, setLocalPaddingBetweenMetaData] = useState(5);
  const [localFontSizeMain, setLocalFontSizeMain] = useState(36)
  const [localFontSizeMeta, setLocalFontSizeMeta] = useState(26)
  const [localJpegQuality, setLocalJpegQuality] = useState(0.9); // New local state for JPEG quality, default 0.9

  // Determine which base settings to use based on the settingMode prop
  const baseAspect = settingMode === 'global' ? globalAspect : localAspect;
  const baseAlign = settingMode === 'global' ? globalAlign : localAlign;
  const basePaddingAllSides = (settingMode === 'global' ? globalPaddingAllSides : localPaddingAllSides) ?? 46;
  const basePaddingTopText = (settingMode === 'global' ? globalPaddingTopText : localPaddingTopText) ?? 20;
  const basePaddingBetweenTextLines = (settingMode === 'global' ? globalPaddingBetweenTextLines : localPaddingBetweenTextLines) ?? 10;
  const basePaddingBetweenMetaData = (settingMode === 'global' ? globalPaddingBetweenMetaData : localPaddingBetweenMetaData) ?? 5;
  const baseFontSizeMain = (settingMode === 'global' ? globalFontSizeMain : localFontSizeMain) ?? 36;
  const baseFontSizeMeta = (settingMode === 'global' ? globalFontSizeMeta : localFontSizeMeta) ?? 26;
  const baseJpegQuality = (settingMode === 'global' ? globalJpegQuality : localJpegQuality) ?? 0.9; // Use new base variable

  useEffect(() => {
    if (setCanvasRef) {
      setCanvasRef(image.file.name, canvasRef.current);
    }
    return () => {
      if (setCanvasRef) {
        setCanvasRef(image.file.name, null);
      }
    };
  }, [image.file.name, setCanvasRef]);

  useEffect(() => {
    const img = new Image()
    img.src = image.url
    img.onload = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = window.devicePixelRatio || 1

      const imageOriginalWidth = img.width
      const imageOriginalHeight = img.height
      let imageCropWidth = imageOriginalWidth
      let imageCropHeight = imageOriginalHeight

      // Crop logic - applied to the image itself
      if (baseAspect === '1:1') {
        const size = Math.min(imageOriginalWidth, imageOriginalHeight)
        imageCropWidth = size
        imageCropHeight = size
      } else if (baseAspect && baseAspect.includes(':')) {
        const [w, h] = baseAspect.split(':').map(Number)
        const targetRatio = w / h
        if (imageOriginalWidth / imageOriginalHeight > targetRatio) {
          imageCropWidth = imageOriginalHeight * targetRatio
          imageCropHeight = imageOriginalHeight
        } else {
          imageCropWidth = imageOriginalWidth
          imageCropHeight = imageOriginalWidth / targetRatio
        }
      }

      // Calculate scaled padding and font sizes based on the current cropped image width
      // Apply Math.max to ensure minimum sizes
      const scaledPaddingAllSides = Math.max(MIN_PADDING, (basePaddingAllSides / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);
      const scaledPaddingTopText = Math.max(MIN_PADDING, (basePaddingTopText / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);
      const scaledPaddingBetweenTextLines = Math.max(MIN_PADDING, (basePaddingBetweenTextLines / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);
      const scaledPaddingBetweenMetaData = Math.max(0, (basePaddingBetweenMetaData / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);

      const scaledFontSizeMain = Math.max(MIN_FONT_SIZE, (baseFontSizeMain / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);
      const scaledFontSizeMeta = Math.max(MIN_FONT_SIZE, (baseFontSizeMeta / FIGMA_REFERENCE_IMAGE_WIDTH) * imageCropWidth);

      // Calculate overall canvas dimensions using scaled values
      const totalTextBlockHeight = scaledFontSizeMain + scaledPaddingBetweenTextLines + scaledFontSizeMeta;

      const canvasWidth = imageCropWidth + scaledPaddingAllSides * 2;
      const canvasHeight = imageCropHeight + scaledPaddingAllSides * 2 + scaledPaddingTopText + totalTextBlockHeight;


      canvas.width = canvasWidth * scale
      canvas.height = canvasHeight * scale
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      ctx.scale(scale, scale)

      // White background
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)

      // Draw image
      let imageSourceX = 0
      let imageSourceY = 0
      if (baseAspect === '1:1') {
        imageSourceX = (imageOriginalWidth - imageCropWidth) / 2
        imageSourceY = (imageOriginalHeight - imageCropHeight) / 2
      }

      ctx.drawImage(
        img,
        imageSourceX,
        imageSourceY,
        imageCropWidth,
        imageCropHeight,
        scaledPaddingAllSides,
        scaledPaddingAllSides,
        imageCropWidth,
        imageCropHeight
      )

      // Calculate the Y-coordinate for the baseline of the first line of text
      const firstLineTextBaselineY = scaledPaddingAllSides + imageCropHeight + scaledPaddingTopText + scaledFontSizeMain;

      // --- Text Alignment Logic ---
      let shotOnLineStartX: number = 0;
      let metaLineStartX: number = 0;

      const shotOnPrefix = 'Shot on ';
      const makerModelText = `${image.make} ${image.model}`;

      ctx.font = `${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      const shotOnPrefixWidth = ctx.measureText(shotOnPrefix).width;
      ctx.font = `bold ${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      const makerModelWidth = ctx.measureText(makerModelText).width;
      const fullShotOnLineTextWidth = shotOnPrefixWidth + makerModelWidth;

      const metadataSpacer = ' '.repeat(Math.ceil(scaledPaddingBetweenMetaData / (scaledFontSizeMeta / 2)));
      const metadataTextContent = `${image.focalLength}${metadataSpacer}${image.aperture}${metadataSpacer}${image.shutter}${metadataSpacer}ISO${image.iso}`;

      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      const metadataTextWidth = ctx.measureText(metadataTextContent).width;

      if (baseAlign === 'left') {
        shotOnLineStartX = scaledPaddingAllSides;
        metaLineStartX = scaledPaddingAllSides;
      } else if (baseAlign === 'center') {
        shotOnLineStartX = canvasWidth / 2 - fullShotOnLineTextWidth / 2;
        metaLineStartX = canvasWidth / 2 - metadataTextWidth / 2;
      } else if (baseAlign === 'right') {
        shotOnLineStartX = canvasWidth - scaledPaddingAllSides - fullShotOnLineTextWidth;
        metaLineStartX = canvasWidth - scaledPaddingAllSides - metadataTextWidth;
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = '#000'; // Ensure text color is black

      // Draw "Shot on " part (regular font)
      ctx.font = `${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillText(shotOnPrefix, shotOnLineStartX, firstLineTextBaselineY);

      // Draw Maker and Model part (bold font)
      ctx.font = `bold ${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillText(makerModelText, shotOnLineStartX + shotOnPrefixWidth, firstLineTextBaselineY);

      // Calculate the Y-coordinate for the baseline of the metadata text
      const secondLineTextBaselineY = firstLineTextBaselineY + scaledPaddingBetweenTextLines + scaledFontSizeMeta;

      // Draw Metadata text
      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      ctx.fillText(
        metadataTextContent,
        metaLineStartX,
        secondLineTextBaselineY
      );

      setReady(true)
    }
  }, [
    image,
    baseAspect,
    baseAlign,
    basePaddingAllSides,
    basePaddingTopText,
    basePaddingBetweenTextLines,
    basePaddingBetweenMetaData,
    baseFontSizeMain,
    baseFontSizeMeta,
    baseJpegQuality, // Dependency added for redraw on quality change
  ])

  const download = () => {
    const link = document.createElement('a')
    // Changed to JPEG export with quality and .jpeg extension
    link.download = `framed-${image.file.name.split('.')[0]}.jpeg`
    link.href = canvasRef.current!.toDataURL('image/jpeg', baseJpegQuality)
    link.click()
  }

  return (
    <div className="p-4 border rounded-lg shadow-md">
      {settingMode === 'perCard' && (
        <div className="flex flex-wrap gap-2 mb-4 items-center">

          {/* Aspect Ratio */}
            <Select value={localAspect} onValueChange={(value) => setLocalAspect(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select an aspect ratio" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Aspect Ratio</SelectLabel>
                    <SelectItem value="original">Original</SelectItem>
                    <SelectItem value="1:1">1:1</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

          {/* Text Alignment */}
          <Select value={localAlign} onValueChange={(value) => setLocalAlign(value as 'center' | 'left' | 'right')}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                <SelectLabel>Text Alignment</SelectLabel>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>

          {/* Canvas Padding */}
          <div>
            <Label className="mr-2">Canvas Padding</Label>
            <Input
              type="number"
              value={localPaddingAllSides}
              onChange={(e) => setLocalPaddingAllSides(Number(e.target.value))}
              className="border p-1 w-20 rounded"
            />
          </div>

          {/* Padding Top Text (Image to Main Text) */}
          <div>
            <Label className="mr-2">Gap Image to Text</Label>
            <Input
              type="number"
              value={localPaddingTopText}
              onChange={(e) => setLocalPaddingTopText(Number(e.target.value))}
              className="border p-1 w-20 rounded"
            />
          </div>

          {/* Padding Between Text Lines (Main Text to Meta Text) */}
          <div>
            <Label className="mr-2">Gap Main to Meta Text</Label>
            <Input
              type="number"
              value={localPaddingBetweenTextLines}
              onChange={(e) => setLocalPaddingBetweenTextLines(Number(e.target.value))}
              className="border p-1 w-20 rounded"
            />
          </div>

          {/* Padding Between Metadata Items */}
          <div>
            <Label className="mr-2">Gap Between Meta Data</Label>
            <Input
              type="number"
              value={localPaddingBetweenMetaData}
              onChange={(e) => setLocalPaddingBetweenMetaData(Number(e.target.value))}
              className="border p-1 w-20 rounded"
            />
          </div>

          {/* Main Font */}
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label className="mr-2">Main Font (Base)</Label>
            <Input
              type="number"
              value={localFontSizeMain}
              onChange={(e) => setLocalFontSizeMain(Number(e.target.value))}
              className="border p-1 w-16 rounded"
            />
          </div>

          {/* Meta Font */}
          <div className="grid w-full max-w-sm items-center gap-3">
            <Label className="mr-2">Meta Font (Base)</Label>
            <Input
              type="number"
              value={localFontSizeMeta}
              onChange={(e) => setLocalFontSizeMeta(Number(e.target.value))}
              className="border p-1 w-16 rounded"
            />
          </div>

          {/* JPEG Quality Control */}
          <div>
            <Label className="mr-2">JPEG Quality (0.1-1.0)</Label>
            <Input
              type="number"
              step="0.1" // Allows stepping by 0.1
              min="0.1"
              max="1.0"
              value={localJpegQuality}
              onChange={(e) => setLocalJpegQuality(Number(e.target.value))}
              className="border p-1 w-20 rounded"
            />
          </div>

        </div>
      )}

      <canvas ref={canvasRef} className="w-full max-w-full h-auto rounded shadow" />

      {ready && (
        <Button
          onClick={download}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Download
        </Button>
      )}
    </div>
  )
}