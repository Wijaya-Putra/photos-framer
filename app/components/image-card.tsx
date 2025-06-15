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
  globalPadding?: number;
  globalFontSizeMain?: number;
  globalFontSizeMeta?: number;
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
  globalPadding,
  globalFontSizeMain,
  globalFontSizeMeta,
  setCanvasRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  // Per-card states (used when settingMode is 'perCard')
  const [localAspect, setLocalAspect] = useState('1:1')
  const [localAlign, setLocalAlign] = useState<'center' | 'left' | 'right'>('center')
  const [localPadding, setLocalPadding] = useState(46)
  const [localFontSizeMain, setLocalFontSizeMain] = useState(36)
  const [localFontSizeMeta, setLocalFontSizeMeta] = useState(26)

  // Determine which base settings to use based on the settingMode prop
  const baseAspect = settingMode === 'global' ? globalAspect : localAspect;
  const baseAlign = settingMode === 'global' ? globalAlign : localAlign;
  const basePadding = (settingMode === 'global' ? globalPadding : localPadding) ?? 46;
  const baseFontSizeMain = (settingMode === 'global' ? globalFontSizeMain : localFontSizeMain) ?? 36;
  const baseFontSizeMeta = (settingMode === 'global' ? globalFontSizeMeta : localFontSizeMeta) ?? 26;

  const textTopPadding = 20; // Original constant for the gap between image and text

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

      const width = img.width
      const height = img.height
      let cropW = width
      let cropH = height

      // Crop logic - applied to the image itself
      if (baseAspect === '1:1') {
        const size = Math.min(width, height)
        cropW = size
        cropH = size
      } else if (baseAspect && baseAspect.includes(':')) {
        const [w, h] = baseAspect.split(':').map(Number)
        const targetRatio = w / h
        if (width / height > targetRatio) {
          cropW = height * targetRatio
          cropH = height
        } else {
          cropW = width
          cropH = width / targetRatio
        }
      }

      // Calculate scaled padding and font sizes based on the current cropped image width
      // Apply Math.max to ensure minimum sizes
      const scaledPadding = Math.max(MIN_PADDING, (basePadding / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledFontSizeMain = Math.max(MIN_FONT_SIZE, (baseFontSizeMain / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledFontSizeMeta = Math.max(MIN_FONT_SIZE, (baseFontSizeMeta / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      // Apply Math.max to scaledTextTopPadding as well, to ensure a minimum gap
      const scaledTextTopPadding = Math.max(MIN_PADDING, (textTopPadding / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);

      // Calculate overall canvas dimensions using scaled values
      // totalTextHeight now accounts for the baseline adjustment
      const totalTextHeight = scaledFontSizeMain // Height for first line (from baseline to top)
                              + (scaledFontSizeMain - scaledFontSizeMeta * 0.3) // Approximate height from baseline to bottom of descenders if needed, but the original (scaledFontSizeMeta * 0.3) was just a tight line spacing.
                              + scaledFontSizeMeta // Height for second line
                              + scaledTextTopPadding; // Explicit gap

      // Let's refine totalTextHeight for accuracy based on new baseline logic
      // It's the sum of:
      // - The 'gap' between image bottom and the visual top of the first line (scaledTextTopPadding)
      // - The height of the first line (scaledFontSizeMain, roughly for ascenders/main part)
      // - The spacing between the two lines (scaledFontSizeMain, which was there for second line offset, and 0.3 * scaledFontSizeMeta)
      // - The height of the second line (scaledFontSizeMeta)
      const adjustedTotalTextHeight = scaledTextTopPadding + // Gap between image bottom and text block top
                                      scaledFontSizeMain + // Height of the first text line
                                      (scaledFontSizeMain * 0.3) + // Spacing below first line
                                      scaledFontSizeMeta; // Height of the second text line


      const canvasW = cropW + scaledPadding * 2;
      // Re-calculate canvasH using the adjustedTotalTextHeight to ensure enough space
      const canvasH = cropH + scaledPadding * 2 + adjustedTotalTextHeight;


      canvas.width = canvasW * scale
      canvas.height = canvasH * scale
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      ctx.scale(scale, scale)

      // White background
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvasW, canvasH)

      // Draw image
      let sx = 0
      let sy = 0
      if (baseAspect === '1:1') {
        sx = (width - cropW) / 2
        sy = (height - cropH) / 2
      }

      ctx.drawImage(
        img,
        sx,
        sy,
        cropW,
        cropH,
        scaledPadding,
        scaledPadding,
        cropW,
        cropH
      )

      // Calculate the Y-coordinate for the baseline of the first line of text
      // This ensures a clear gap of scaledTextTopPadding between image bottom and the *visible top* of the text.
      const firstLineBaselineY = scaledPadding + cropH + scaledTextTopPadding + scaledFontSizeMain;

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

      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      const metadataTextWidth = ctx.measureText(`${image.focalLength} ${image.aperture} ${image.shutter} ${image.iso}`).width;

      if (baseAlign === 'left') {
        shotOnLineStartX = scaledPadding;
        metaLineStartX = scaledPadding;
      } else if (baseAlign === 'center') {
        shotOnLineStartX = canvasW / 2 - fullShotOnLineTextWidth / 2;
        metaLineStartX = canvasW / 2 - metadataTextWidth / 2;
      } else if (baseAlign === 'right') {
        shotOnLineStartX = canvasW - scaledPadding - fullShotOnLineTextWidth;
        metaLineStartX = canvasW - scaledPadding - metadataTextWidth;
      }

      ctx.textAlign = 'left';

      // Draw "Shot on " part (regular font)
      ctx.font = `${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillStyle = '#000'; // Ensure text color is black
      ctx.fillText(shotOnPrefix, shotOnLineStartX, firstLineBaselineY);

      // Draw Maker and Model part (bold font)
      ctx.font = `bold ${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillStyle = '#000'; // Ensure text color is black
      ctx.fillText(makerModelText, shotOnLineStartX + shotOnPrefixWidth, firstLineBaselineY);

      // Calculate the Y-coordinate for the baseline of the metadata text
      const secondLineBaselineY = firstLineBaselineY + (scaledFontSizeMain * 0.3) + scaledFontSizeMeta; // Adjusted based on new firstLineBaselineY meaning

      // Draw Metadata text
      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      ctx.fillStyle = '#000'; // Ensure text color is black
      ctx.fillText(
        `${image.focalLength} ${image.aperture} ${image.shutter} ${image.iso}`,
        metaLineStartX,
        secondLineBaselineY
      );

      setReady(true)
    }
  }, [
    image,
    baseAspect,
    baseAlign,
    basePadding,
    baseFontSizeMain,
    baseFontSizeMeta,
    textTopPadding
  ])

  const download = () => {
    const link = document.createElement('a')
    link.download = `framed-${image.file.name.split('.')[0]}.png`
    link.href = canvasRef.current!.toDataURL('image/png')
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
            <SelectTrigger className="w-[180px]"> {/* You can adjust the width as needed */}
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

          {/* Padding */}
          <div>
            <Label className="mr-2">Padding (Base)</Label>
            <Input
              type="number"
              value={localPadding}
              onChange={(e) => setLocalPadding(Number(e.target.value))}
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