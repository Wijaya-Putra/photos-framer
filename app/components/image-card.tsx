// app/components/image-card.tsx
'use client'

import { useEffect, useRef } from 'react'
import { ImageData } from '../types';

interface Props {
  image: ImageData;
  settingMode: 'global' | 'perCard';
  globalAspect: string;
  globalAlign: 'center' | 'left' | 'right';
  globalPaddingTop: number;
  globalPaddingBottom: number;
  globalPaddingLeft: number;
  globalPaddingRight: number;
  globalPaddingTopText: number;
  globalPaddingBetweenTextLines: number;
  globalPaddingBetweenMetaData: number;
  globalFontSizeMain: number;
  globalFontSizeMeta: number;
  globalJpegQuality: number;
  setCanvasRef?: (key: string, node: HTMLCanvasElement | null) => void;
}

// Your Figma design's reference width. All px values are relative to this.
const FIGMA_REFERENCE_IMAGE_WIDTH = 1866;

// The target width for the high-resolution output canvas.
// This ensures sharp text regardless of the original image size.
const TARGET_CANVAS_WIDTH = 3000;

export default function ImageCard({
  image,
  settingMode,
  globalAspect,
  globalAlign,
  globalPaddingTop,
  globalPaddingBottom,
  globalPaddingLeft,
  globalPaddingRight,
  globalPaddingTopText,
  globalPaddingBetweenTextLines,
  globalPaddingBetweenMetaData,
  globalFontSizeMain,
  globalFontSizeMeta,
  globalJpegQuality,
  setCanvasRef,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Consolidate settings based on the current mode
  const settings = {
    aspect: settingMode === 'global' ? globalAspect : image.individualAspect,
    align: settingMode === 'global' ? globalAlign : image.individualAlign,
    paddingTop: settingMode === 'global' ? globalPaddingTop : image.individualPaddingTop,
    paddingBottom: settingMode === 'global' ? globalPaddingBottom : image.individualPaddingBottom,
    paddingLeft: settingMode === 'global' ? globalPaddingLeft : image.individualPaddingLeft,
    paddingRight: settingMode === 'global' ? globalPaddingRight : image.individualPaddingRight,
    paddingTopText: settingMode === 'global' ? globalPaddingTopText : image.individualPaddingTopText,
    paddingBetweenTextLines: settingMode === 'global' ? globalPaddingBetweenTextLines : image.individualPaddingBetweenTextLines,
    paddingBetweenMetaData: settingMode === 'global' ? globalPaddingBetweenMetaData : image.individualPaddingBetweenMetaData,
    fontSizeMain: settingMode === 'global' ? globalFontSizeMain : image.individualFontSizeMain,
    fontSizeMeta: settingMode === 'global' ? globalFontSizeMeta : image.individualFontSizeMeta,
  };

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
    const img = new Image();
    img.src = image.url;
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // --- 1. Calculate Cropped Image Dimensions ---
      const { naturalWidth: imgW, naturalHeight: imgH } = img;
      let cropW = imgW;
      let cropH = imgH;

      if (settings.aspect && settings.aspect.includes(':')) {
        const [w, h] = settings.aspect.split(':').map(Number);
        const targetRatio = w / h;
        if (imgW / imgH > targetRatio) {
          cropW = imgH * targetRatio;
          cropH = imgH;
        } else {
          cropW = imgW;
          cropH = imgW / targetRatio;
        }
      }
      cropW = Math.floor(cropW);
      cropH = Math.floor(cropH);

      // --- 2. Calculate Proportional Sizes (based on Figma) ---
      const figmaScale = cropW / FIGMA_REFERENCE_IMAGE_WIDTH;
      const p = { // 'p' for proportions
        top: settings.paddingTop * figmaScale,
        bottom: settings.paddingBottom * figmaScale,
        left: settings.paddingLeft * figmaScale,
        right: settings.paddingRight * figmaScale,
        topText: settings.paddingTopText * figmaScale,
        betweenText: settings.paddingBetweenTextLines * figmaScale,
        betweenMeta: settings.paddingBetweenMetaData * figmaScale,
        fontMain: settings.fontSizeMain * figmaScale,
        fontMeta: settings.fontSizeMeta * figmaScale,
      };

      // --- 3. Determine Canvas Layout and High-Res Scale ---
      const totalTextHeight = p.topText + p.fontMain + p.betweenText + p.fontMeta;
      const internalW = cropW + p.left + p.right;
      const internalH = cropH + p.top + p.bottom + totalTextHeight;
      const renderScale = TARGET_CANVAS_WIDTH / internalW;

      canvas.width = internalW * renderScale;
      canvas.height = internalH * renderScale;
      
      // Scale the context to draw in high resolution
      ctx.scale(renderScale, renderScale);
      
      // --- 4. Draw Elements ---
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, internalW, internalH);

      const sx = Math.floor((imgW - cropW) / 2);
      const sy = Math.floor((imgH - cropH) / 2);
      ctx.drawImage(img, sx, sy, cropW, cropH, p.left, p.top, cropW, cropH);

      // --- 5. Draw Text ---
      ctx.fillStyle = '#000';
      const textBlockYStart = p.top + cropH + p.topText;
      const firstLineBaselineY = textBlockYStart + p.fontMain;
      const secondLineBaselineY = firstLineBaselineY + p.betweenText + p.fontMeta;

      const shotOnPrefix = 'Shot on ';
      const makerModelText = `${image.make} ${image.model}`;
      
      ctx.font = `${p.fontMain}px 'Open Sans', sans-serif`;
      const shotOnPrefixWidth = ctx.measureText(shotOnPrefix).width;
      ctx.font = `bold ${p.fontMain}px 'Open Sans', sans-serif`;
      const makerModelWidth = ctx.measureText(makerModelText).width;
      const fullShotOnLineTextWidth = shotOnPrefixWidth + makerModelWidth;

      const metadataItems = [
        image.focalLength, image.aperture, image.shutter, image.iso ? `ISO ${image.iso}` : ''
      ].filter(Boolean);
      
      ctx.font = `${p.fontMeta}px 'Open Sans', sans-serif`;
      const metaWidths = metadataItems.map(item => ctx.measureText(item).width);
      const totalMetaGapWidth = (metadataItems.length - 1) * p.betweenMeta;
      const fullMetadataLineTextWidth = metaWidths.reduce((a, b) => a + b, 0) + totalMetaGapWidth;

      let shotOnLineStartX, metaLineStartX;
      if (settings.align === 'left') {
        shotOnLineStartX = p.left;
        metaLineStartX = p.left;
      } else if (settings.align === 'right') {
        shotOnLineStartX = internalW - p.right - fullShotOnLineTextWidth;
        metaLineStartX = internalW - p.right - fullMetadataLineTextWidth;
      } else { // Center
        shotOnLineStartX = (internalW - fullShotOnLineTextWidth) / 2;
        metaLineStartX = (internalW - fullMetadataLineTextWidth) / 2;
      }
      
      ctx.textAlign = 'left';
      ctx.font = `${p.fontMain}px 'Open Sans', sans-serif`;
      ctx.fillText(shotOnPrefix, shotOnLineStartX, firstLineBaselineY);
      ctx.font = `bold ${p.fontMain}px 'Open Sans', sans-serif`;
      ctx.fillText(makerModelText, shotOnLineStartX + shotOnPrefixWidth, firstLineBaselineY);

      ctx.font = `${p.fontMeta}px 'Open Sans', sans-serif`;
      let currentX = metaLineStartX;
      metadataItems.forEach((item, index) => {
        ctx.fillText(item, currentX, secondLineBaselineY);
        currentX += metaWidths[index] + p.betweenMeta;
      });
    }
  }, [image, settings, globalJpegQuality]); // Rerun when image or any setting changes

  return (
    // Removed shadow-md from this div
    <div className="p-4 border rounded-lg bg-white">
      {/* Removed rounded and shadow from the canvas */}
      <canvas ref={canvasRef} className="w-full max-w-full h-auto" />
    </div>
  )
}