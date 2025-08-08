// app/components/templates/memoir-template.tsx
'use client'

import { useEffect, useRef } from 'react'
import { ImageData } from '../../types';

interface Props {
  image: ImageData;
  settingMode: 'global' | 'perCard';
  globalLocation: string;
  setCanvasRef?: (key: string, node: HTMLCanvasElement | null) => void;
}

const TARGET_CANVAS_WIDTH = 2380;
const TARGET_CANVAS_HEIGHT = 1680;

export default function MemoirTemplate({ image, settingMode, globalLocation, setCanvasRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isLoading = image.dominantColors.length === 0;

  useEffect(() => {
    if (setCanvasRef) {
      setCanvasRef(image.file.name, canvasRef.current);
    }
    if (isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const img = new Image();
    img.src = image.url;

    const drawOnCanvas = () => {
      // --- 1. Setup Canvas and Layout Constants ---
      canvas.width = TARGET_CANVAS_WIDTH;
      canvas.height = TARGET_CANVAS_HEIGHT;
      
      const PADDING = 120;
      const IMAGE_SIZE = TARGET_CANVAS_HEIGHT - (PADDING * 2);
      const IMAGE_X = PADDING;
      const IMAGE_Y = PADDING;
      const RIGHT_ALIGN_X = TARGET_CANVAS_WIDTH - PADDING;

      // --- 2. Draw Background ---
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // --- 3. Draw Image ---
      const { naturalWidth: imgW, naturalHeight: imgH } = img;
      let cropSize = Math.min(imgW, imgH);
      const sx = (imgW - cropSize) / 2;
      const sy = (imgH - cropSize) / 2;
      ctx.drawImage(img, sx, sy, cropSize, cropSize, IMAGE_X, IMAGE_Y, IMAGE_SIZE, IMAGE_SIZE);

      // --- 4. Draw Text (The Definitive Fix) ---
      ctx.save();
      // Move the origin to the top-right corner where the text will be rotated
      ctx.translate(RIGHT_ALIGN_X, PADDING);
      ctx.rotate(Math.PI / 2); // Rotate 90 degrees clockwise
      
      // Set text properties for predictable drawing
      ctx.textAlign = 'left'; 
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#000000';

      const dateFont = `400 48px 'Open Sans', sans-serif`;
      const locationFont = `700 96px 'Open Sans', sans-serif`;
      const gapBetweenTextColumns = 40;

      // Draw Location Text (Rightmost Column)
      ctx.font = locationFont;
      const locationText = settingMode === 'global' ? globalLocation : image.individualLocation;
      ctx.fillText(locationText, 0, 0);

      // Draw Date Text (Column to the left of Location)
      ctx.font = dateFont;
      const dateText = image.dateTimeOriginal 
        ? image.dateTimeOriginal.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Wednesday, 20 July 2024';
      
      // We use a positive Y offset to move the text to the "left" in the final view.
      // The offset is based on the larger font's size plus a gap.
      const locationColumnWidth = 96; // Based on location font size
      const dateYOffset = locationColumnWidth + gapBetweenTextColumns;
      ctx.fillText(dateText, 0, dateYOffset);
      
      ctx.restore();

      // --- 5. Draw Color Palette ---
      const boxSize = 120;
      const boxGap = 20;
      const paletteY = TARGET_CANVAS_HEIGHT - PADDING - boxSize;
      const colorsToDisplay = image.dominantColors.slice(0, 3);
      
      const totalPaletteWidth = (colorsToDisplay.length * boxSize) + ((colorsToDisplay.length - 1) * boxGap);
      const paletteStartX = RIGHT_ALIGN_X - totalPaletteWidth;

      colorsToDisplay.forEach((color, index) => {
        ctx.fillStyle = color;
        const x = paletteStartX + (index * (boxSize + boxGap));
        ctx.fillRect(x, paletteY, boxSize, boxSize);
      });
    };

    img.onload = drawOnCanvas;
    if (img.complete) drawOnCanvas();
  }, [image, isLoading, settingMode, globalLocation, setCanvasRef]);


  return (
    // This part is now just a simple wrapper for the canvas
    <div className="p-4 border rounded-lg bg-white relative min-h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
          <p className="text-slate-500">Processing Image...</p>
        </div>
      )}
      <canvas ref={canvasRef} className={`w-full max-w-full h-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`} />
    </div>
  )
}