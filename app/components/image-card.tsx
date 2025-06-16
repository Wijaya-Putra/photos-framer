// app/components/image-card.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { ImageData } from './App';

interface Props {
  image: ImageData;
  settingMode: 'global' | 'perCard';
  globalAspect: string;
  globalAlign: 'center' | 'left' | 'right';
  globalPaddingAllSides: number;
  globalPaddingTopText: number;
  globalPaddingBetweenTextLines: number;
  globalPaddingBetweenMetaData: number;
  globalFontSizeMain: number;
  globalFontSizeMeta: number;
  globalJpegQuality: number;
  setCanvasRef?: (key: string, node: HTMLCanvasElement | null) => void;
}

const FIGMA_REFERENCE_IMAGE_WIDTH = 1866;
const MIN_FONT_SIZE = 10;
const MIN_PADDING = 10;

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
  globalJpegQuality,
  setCanvasRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  const baseAspect = settingMode === 'global' ? globalAspect : image.individualAspect;
  const baseAlign = settingMode === 'global' ? globalAlign : image.individualAlign;
  const basePaddingAllSides = settingMode === 'global' ? globalPaddingAllSides : image.individualPaddingAllSides;
  const basePaddingTopText = settingMode === 'global' ? globalPaddingTopText : image.individualPaddingTopText;
  const basePaddingBetweenTextLines = settingMode === 'global' ? globalPaddingBetweenTextLines : image.individualPaddingBetweenTextLines;
  const basePaddingBetweenMetaData = settingMode === 'global' ? globalPaddingBetweenMetaData : image.individualPaddingBetweenMetaData;
  const baseFontSizeMain = settingMode === 'global' ? globalFontSizeMain : image.individualFontSizeMain;
  const baseFontSizeMeta = settingMode === 'global' ? globalFontSizeMeta : image.individualFontSizeMeta;
  const baseJpegQuality = settingMode === 'global' ? globalJpegQuality : image.individualJpegQuality;


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

      const imgNaturalWidth = img.naturalWidth;
      const imgNaturalHeight = img.naturalHeight;
      let cropW = imgNaturalWidth;
      let cropH = imgNaturalHeight;

      console.log(`[ImageCard - ${image.file.name}] Original Image Natural Dims: ${imgNaturalWidth}x${imgNaturalHeight}`);
      console.log(`[ImageCard - ${image.file.name}] Current baseAspect: "${baseAspect}"`);

      if (baseAspect === '1:1') {
        const size = Math.min(imgNaturalWidth, imgNaturalHeight);
        cropW = size;
        cropH = size;
        console.log(`[ImageCard - ${image.file.name}] *** 1:1 Aspect Selected *** Calculated Crop Dims (square): ${cropW}x${cropH}`);
      } else if (baseAspect && baseAspect.includes(':')) {
        const [w, h] = baseAspect.split(':').map(Number);
        const targetRatio = w / h;
        if (imgNaturalWidth / imgNaturalHeight > targetRatio) {
          cropW = imgNaturalHeight * targetRatio;
          cropH = imgNaturalHeight;
        } else {
          cropW = imgNaturalWidth;
          cropH = imgNaturalWidth / targetRatio;
        }
        console.log(`[ImageCard - ${image.file.name}] Selected Custom Aspect (${baseAspect}). Calculated Crop Dims: ${cropW}x${cropH}`);
      } else {
        console.log(`[ImageCard - ${image.file.name}] No specific aspect ratio selected. Using original image dimensions for crop: ${cropW}x${cropH}`);
      }

      cropW = Math.floor(cropW);
      cropH = Math.floor(cropH);
      console.log(`[ImageCard - ${image.file.name}] Final Cropped Image Dims (for drawImage source/dest): ${cropW}x${cropH}`);


      const scaledPadding = Math.max(MIN_PADDING, (basePaddingAllSides / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledPaddingTopText = Math.max(MIN_PADDING, (basePaddingTopText / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledPaddingBetweenTextLines = Math.max(MIN_PADDING, (basePaddingBetweenTextLines / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledPaddingBetweenMetaData = Math.max(MIN_PADDING, (basePaddingBetweenMetaData / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);

      const scaledFontSizeMain = Math.max(MIN_FONT_SIZE, (baseFontSizeMain / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);
      const scaledFontSizeMeta = Math.max(MIN_FONT_SIZE, (baseFontSizeMeta / FIGMA_REFERENCE_IMAGE_WIDTH) * cropW);

      const totalTextHeight = scaledPaddingTopText +
                              scaledFontSizeMain +
                              scaledPaddingBetweenTextLines +
                              scaledFontSizeMeta;

      const canvasInternalW = cropW + scaledPadding * 2;
      const canvasInternalH = cropH + scaledPadding * 2 + totalTextHeight;

      canvas.width = Math.floor(canvasInternalW * scale); // Device pixels
      canvas.height = Math.floor(canvasInternalH * scale); // Device pixels

      ctx.scale(scale, scale);

      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasInternalW, canvasInternalH);

      let sx = Math.floor((imgNaturalWidth - cropW) / 2);
      let sy = Math.floor((imgNaturalHeight - cropH) / 2);

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
      );
      console.log(`[ImageCard - ${image.file.name}] drawImage parameters: sx=${sx}, sy=${sy}, sWidth=${cropW}, sHeight=${cropH}, dX=${scaledPadding}, dY=${scaledPadding}, dWidth=${cropW}, dHeight=${cropH}`);
      console.log(`[ImageCard - ${image.file.name}] Canvas Internal Drawing Dims (CSS px before device scaling): ${canvasInternalW}x${canvasInternalH}`);
      console.log(`[ImageCard - ${image.file.name}] Canvas Element Internal Resolution (device px): ${canvas.width}x${canvas.height}`);


      const textBlockYStart = scaledPadding + cropH + scaledPaddingTopText;
      const firstLineBaselineY = textBlockYStart + scaledFontSizeMain;
      const secondLineBaselineY = firstLineBaselineY + scaledPaddingBetweenTextLines + scaledFontSizeMeta;

      let shotOnLineStartX: number;
      let metaLineStartX: number;

      const shotOnPrefix = 'Shot on ';
      const makerModelText = `${image.make} ${image.model}`;

      ctx.font = `${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      const shotOnPrefixWidth = ctx.measureText(shotOnPrefix).width;
      ctx.font = `bold ${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      const makerModelWidth = ctx.measureText(makerModelText).width;
      const fullShotOnLineTextWidth = shotOnPrefixWidth + makerModelWidth;

      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      // MODIFIED: Added "ISO " prefix back to image.iso if it exists
      const metadataItems = [
        image.focalLength,
        image.aperture,
        image.shutter,
        image.iso ? `ISO ${image.iso}` : '' // Conditionally add "ISO "
      ].filter(Boolean);

      let fullMetadataLineTextWidth = 0;
      const gap = scaledPaddingBetweenMetaData;

      metadataItems.forEach((item, index) => {
        fullMetadataLineTextWidth += ctx.measureText(item).width;
        if (index < metadataItems.length - 1) {
          fullMetadataLineTextWidth += gap;
        }
      });


      if (baseAlign === 'left') {
        shotOnLineStartX = scaledPadding;
        metaLineStartX = scaledPadding;
      } else if (baseAlign === 'center') {
        shotOnLineStartX = canvasInternalW / 2 - fullShotOnLineTextWidth / 2;
        metaLineStartX = canvasInternalW / 2 - fullMetadataLineTextWidth / 2;
      } else if (baseAlign === 'right') {
        shotOnLineStartX = canvasInternalW - scaledPadding - fullShotOnLineTextWidth;
        metaLineStartX = canvasInternalW - scaledPadding - fullMetadataLineTextWidth;
      } else {
        shotOnLineStartX = canvasInternalW / 2 - fullShotOnLineTextWidth / 2;
        metaLineStartX = canvasInternalW / 2 - fullMetadataLineTextWidth / 2;
      }

      ctx.textAlign = 'left';
      ctx.fillStyle = '#000';

      ctx.font = `${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillText(shotOnPrefix, shotOnLineStartX, firstLineBaselineY);

      ctx.font = `bold ${scaledFontSizeMain}px 'Open Sans', sans-serif`;
      ctx.fillText(makerModelText, shotOnLineStartX + shotOnPrefixWidth, firstLineBaselineY);

      ctx.font = `${scaledFontSizeMeta}px 'Open Sans', sans-serif`;
      let currentX = metaLineStartX;
      metadataItems.forEach((item, index) => {
        ctx.fillText(item, currentX, secondLineBaselineY);
        const itemWidth = ctx.measureText(item).width;
        currentX += itemWidth;
        if (index < metadataItems.length - 1) {
          currentX += gap;
        }
      });


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
    baseJpegQuality,
  ])

  return (
    <div className="p-4 border rounded-lg shadow-md">
      <canvas ref={canvasRef} className="w-full max-w-full h-auto rounded shadow" />
    </div>
  )
}