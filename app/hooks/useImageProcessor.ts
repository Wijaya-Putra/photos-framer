// app/hooks/useImageProcessor.ts
'use client'

import { useState, useRef, useCallback } from 'react';
import { extractMetadata } from '../lib/metadata'; // Corrected Path
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageData } from '../types'; // Corrected Path

export function useImageProcessor() {
  const [images, setImages] = useState<ImageData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // (The rest of the file is unchanged)
  // ...
  const [globalAspect, setGlobalAspect] = useState('1:1');
  const [globalAlign, setGlobalAlign] = useState<'center' | 'left' | 'right'>('center');
  const [globalPaddingTop, setGlobalPaddingTop] = useState(46);
  const [globalPaddingBottom, setGlobalPaddingBottom] = useState(46);
  const [globalPaddingLeft, setGlobalPaddingLeft] = useState(46);
  const [globalPaddingRight, setGlobalPaddingRight] = useState(46);
  const [globalPaddingTopText, setGlobalPaddingTopText] = useState(70);
  const [globalPaddingBetweenTextLines, setGlobalPaddingBetweenTextLines] = useState(12);
  const [globalPaddingBetweenMetaData, setGlobalPaddingBetweenMetaData] = useState(12);
  const [globalFontSizeMain, setGlobalFontSizeMain] = useState(36);
  const [globalFontSizeMeta, setGlobalFontSizeMeta] = useState(26);
  const [globalJpegQuality, setGlobalJpegQuality] = useState(0.9);
  const [activeMode, setActiveMode] = useState<'global' | 'individual'>('global');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const setCanvasRef = useCallback((key: string, node: HTMLCanvasElement | null) => {
    canvasRefs.current[key] = node;
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const processed = await Promise.all(
      files.map(async (file) => {
        const metadata = await extractMetadata(file);
        return {
          file,
          url: URL.createObjectURL(file),
          make: metadata.make || '',
          model: metadata.model || '',
          focalLength: metadata.focalLength || '',
          aperture: metadata.aperture || '',
          shutter: metadata.shutter || '',
          iso: metadata.iso || '',
          individualAspect: globalAspect,
          individualAlign: globalAlign,
          individualPaddingTop: globalPaddingTop,
          individualPaddingBottom: globalPaddingBottom,
          individualPaddingLeft: globalPaddingLeft,
          individualPaddingRight: globalPaddingRight,
          individualPaddingTopText: globalPaddingTopText,
          individualPaddingBetweenTextLines: globalPaddingBetweenTextLines,
          individualPaddingBetweenMetaData: globalPaddingBetweenMetaData,
          individualFontSizeMain: globalFontSizeMain,
          individualFontSizeMeta: globalFontSizeMeta,
          individualJpegQuality: globalJpegQuality,
        };
      })
    );

    setImages(processed);
    canvasRefs.current = {};
    if (processed.length > 0) {
      setSelectedImageId(processed[0].file.name);
    } else {
      setSelectedImageId(null);
    }
  };

  const downloadAllToZip = async () => {
    if (images.length === 0) {
      alert('No images to download.');
      return;
    }

    const zip = new JSZip();
    let processedCount = 0;

    for (const imgData of images) {
      const canvas = canvasRefs.current[imgData.file.name];
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', imgData.individualJpegQuality)
        );
        if (blob) {
          zip.file(`framed-${imgData.file.name.replace(/\.[^/.]+$/, "")}.jpeg`, blob);
          processedCount++;
        }
      }
    }

    if (processedCount > 0) {
      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, 'framed_images.zip');
        alert(`Successfully downloaded ${processedCount} images.`);
      });
    } else {
      alert('No images were successfully processed for download.');
    }
  };

  const handleIndividualSettingChange = useCallback((
    imageId: string,
    settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso'>,
    newValue: any
  ) => {
    setImages(prevImages => prevImages.map(img => {
      if (img.file.name === imageId) {
        return { ...img, [settingName]: newValue };
      }
      return img;
    }));
  }, []);

  const globalSettings = {
    aspect: globalAspect, setAspect: setGlobalAspect,
    align: globalAlign, setAlign: setGlobalAlign,
    paddingTop: globalPaddingTop, setPaddingTop: setGlobalPaddingTop,
    paddingBottom: globalPaddingBottom, setPaddingBottom: setGlobalPaddingBottom,
    paddingLeft: globalPaddingLeft, setPaddingLeft: setGlobalPaddingLeft,
    paddingRight: globalPaddingRight, setPaddingRight: setGlobalPaddingRight,
    paddingTopText: globalPaddingTopText, setPaddingTopText: setGlobalPaddingTopText,
    paddingBetweenTextLines: globalPaddingBetweenTextLines, setPaddingBetweenTextLines: setGlobalPaddingBetweenTextLines,
    paddingBetweenMetaData: globalPaddingBetweenMetaData, setPaddingBetweenMetaData: setGlobalPaddingBetweenMetaData,
    fontSizeMain: globalFontSizeMain, setFontSizeMain: setGlobalFontSizeMain,
    fontSizeMeta: globalFontSizeMeta, setFontSizeMeta: setGlobalFontSizeMeta,
    jpegQuality: globalJpegQuality, setJpegQuality: setGlobalJpegQuality,
  };

  return {
    images,
    fileInputRef,
    activeMode,
    setActiveMode,
    selectedImageId,
    setSelectedImageId,
    globalSettings,
    handleUploadClick,
    handleUpload,
    downloadAllToZip,
    handleIndividualSettingChange,
    setCanvasRef,
  };
}