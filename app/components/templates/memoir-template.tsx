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
  }, [image.file.name, setCanvasRef]);

  useEffect(() => {
    // 1. Exit if colors are not ready. The component will re-render when they are.
    if (isLoading) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // 2. Create a new image object.
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image.url;

    // 3. Define the drawing function.
    const drawOnCanvas = () => {
      canvas.width = TARGET_CANVAS_WIDTH;
      canvas.height = TARGET_CANVAS_HEIGHT;
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const imageX = 420;
      const imageY = 120;
      const imageWidth = 1840;
      const imageHeight = 1440;
      ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight);

      ctx.save();
      ctx.translate(280, 120);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = 'right';
      
      ctx.fillStyle = '#000000';
      ctx.font = `400 48px 'Open Sans', sans-serif`;
      const dateText = image.dateTimeOriginal 
        ? image.dateTimeOriginal.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Wednesday, 20 July 2024';
      ctx.fillText(dateText, 0, 0);

      ctx.font = `700 96px 'Open Sans', sans-serif`;
      const locationText = settingMode === 'global' ? globalLocation : image.individualLocation;
      ctx.fillText(locationText, 0, 110);
      ctx.restore();

      const paletteY = 1440;
      const boxSize = 120;
      const boxGap = 20;
      
      image.dominantColors.forEach((color, index) => {
        ctx.fillStyle = color;
        const x = 420 + (index * (boxSize + boxGap));
        ctx.fillRect(x, paletteY, boxSize, boxSize);
      });
    };

    // 4. Execute the drawing function.
    img.onload = drawOnCanvas;
    if (img.complete) {
      drawOnCanvas();
    }
    
    img.onerror = () => console.error("Image failed to load for canvas.");

  }, [image, isLoading, settingMode, globalLocation]);

  return (
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