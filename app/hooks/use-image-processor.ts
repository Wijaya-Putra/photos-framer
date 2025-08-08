// app/hooks/use-image-processor.ts
'use client'

import { useState, useRef, useCallback } from 'react';
import { extractMetadata } from '../lib/metadata';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageData, TemplateName } from '../types';
import { prominent } from 'color.js'

export function useImageProcessor() {
  const [images, setImages] = useState<ImageData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filesUploaded, setFilesUploaded] = useState(false);

  const defaultGlobalSettings = {
    aspect: '1:1',
    align: 'center' as 'center' | 'left' | 'right',
    paddingTop: 46,
    paddingBottom: 46,
    paddingLeft: 46,
    paddingRight: 46,
    paddingTopText: 71,
    paddingBetweenTextLines: 12,
    paddingBetweenMetaData: 12,
    fontSizeMain: 36,
    fontSizeMeta: 26,
    jpegQuality: 0.9,
    location: 'Tokyo, Japan',
  };

  const [globalAspect, setGlobalAspect] = useState(defaultGlobalSettings.aspect);
  const [globalAlign, setGlobalAlign] = useState(defaultGlobalSettings.align);
  const [globalPaddingTop, setGlobalPaddingTop] = useState(defaultGlobalSettings.paddingTop);
  const [globalPaddingBottom, setGlobalPaddingBottom] = useState(defaultGlobalSettings.paddingBottom);
  const [globalPaddingLeft, setGlobalPaddingLeft] = useState(defaultGlobalSettings.paddingLeft);
  const [globalPaddingRight, setGlobalPaddingRight] = useState(defaultGlobalSettings.paddingRight);
  const [globalPaddingTopText, setGlobalPaddingTopText] = useState(defaultGlobalSettings.paddingTopText);
  const [globalPaddingBetweenTextLines, setGlobalPaddingBetweenTextLines] = useState(defaultGlobalSettings.paddingBetweenTextLines);
  const [globalPaddingBetweenMetaData, setGlobalPaddingBetweenMetaData] = useState(defaultGlobalSettings.paddingBetweenMetaData);
  const [globalFontSizeMain, setGlobalFontSizeMain] = useState(defaultGlobalSettings.fontSizeMain);
  const [globalFontSizeMeta, setGlobalFontSizeMeta] = useState(defaultGlobalSettings.fontSizeMeta);
  const [globalJpegQuality, setGlobalJpegQuality] = useState(defaultGlobalSettings.jpegQuality);
  const [globalLocation, setGlobalLocation] = useState(defaultGlobalSettings.location);
  
  const [activeMode, setActiveMode] = useState<'global' | 'individual'>('individual');
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>('classic');
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const resetGlobalSettings = () => {
    setGlobalAspect(defaultGlobalSettings.aspect);
    setGlobalAlign(defaultGlobalSettings.align);
    setGlobalPaddingTop(defaultGlobalSettings.paddingTop);
    setGlobalPaddingBottom(defaultGlobalSettings.paddingBottom);
    setGlobalPaddingLeft(defaultGlobalSettings.paddingLeft);
    setGlobalPaddingRight(defaultGlobalSettings.paddingRight);
    setGlobalPaddingTopText(defaultGlobalSettings.paddingTopText);
    setGlobalPaddingBetweenTextLines(defaultGlobalSettings.paddingBetweenTextLines);
    setGlobalPaddingBetweenMetaData(defaultGlobalSettings.paddingBetweenMetaData);
    setGlobalFontSizeMain(defaultGlobalSettings.fontSizeMain);
    setGlobalFontSizeMeta(defaultGlobalSettings.fontSizeMeta);
    setGlobalJpegQuality(defaultGlobalSettings.jpegQuality);
    setGlobalLocation(defaultGlobalSettings.location);
  };

  const setCanvasRef = useCallback((key: string, node: HTMLCanvasElement | null) => {
    canvasRefs.current[key] = node;
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const clearImages = () => {
    images.forEach(image => URL.revokeObjectURL(image.url));
    setImages([]);
    setSelectedImageId(null);
    setFilesUploaded(false);
    setActiveMode('individual');
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    clearImages();
    setFilesUploaded(true);

    const initialProcessed = await Promise.all(
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
          dateTimeOriginal: metadata.dateTimeOriginal,
          dominantColors: [],
          individualAspect: defaultGlobalSettings.aspect,
          individualAlign: defaultGlobalSettings.align,
          individualPaddingTop: defaultGlobalSettings.paddingTop,
          individualPaddingBottom: defaultGlobalSettings.paddingBottom,
          individualPaddingLeft: defaultGlobalSettings.paddingLeft,
          individualPaddingRight: defaultGlobalSettings.paddingRight,
          individualPaddingTopText: defaultGlobalSettings.paddingTopText,
          individualPaddingBetweenTextLines: defaultGlobalSettings.paddingBetweenTextLines,
          individualPaddingBetweenMetaData: defaultGlobalSettings.paddingBetweenMetaData,
          individualFontSizeMain: defaultGlobalSettings.fontSizeMain,
          individualFontSizeMeta: defaultGlobalSettings.fontSizeMeta,
          individualJpegQuality: defaultGlobalSettings.jpegQuality,
          individualLocation: defaultGlobalSettings.location,
        };
      })
    );
    
    setImages(initialProcessed);

    if (initialProcessed.length > 0) {
      setSelectedImageId(initialProcessed[0].file.name);
    }
    
    setActiveMode(files.length > 1 ? 'global' : 'individual');

    const imagesWithColors = await Promise.all(
      initialProcessed.map(async (image) => {
        try {
          // NEW: Using color.js to get the top 3 colors
          const colors = await prominent(image.url, { amount: 3, format: 'hex' });
          return { ...image, dominantColors: colors };
        } catch (error) {
          console.error(`Error extracting colors for ${image.file.name}:`, error);
          return image;
        }
      })
    );
    
    setImages(imagesWithColors);
  };

  const downloadAllToZip = useCallback(async () => {
    if (images.length === 0) return;
    const zip = new JSZip();
    for (const imgData of images) {
      const canvas = canvasRefs.current[imgData.file.name];
      if (canvas) {
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', imgData.individualJpegQuality)
        );
        if (blob) {
          zip.file(`framed-${imgData.file.name.replace(/\.[^/.]+$/, "")}.jpeg`, blob);
        }
      }
    }
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, 'framed_images.zip');
  }, [images]);

  const handleIndividualSettingChange = useCallback((
    imageId: string,
    settingName: keyof Omit<ImageData, 'file' | 'url' | 'make' | 'model' | 'focalLength' | 'aperture' | 'shutter' | 'iso' | 'dateTimeOriginal' | 'dominantColors'>,
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
    location: globalLocation, setLocation: setGlobalLocation,
  };

  return {
    images,
    fileInputRef,
    filesUploaded,
    activeMode,
    setActiveMode,
    selectedImageId,
    setSelectedImageId,
    selectedTemplate,
    setSelectedTemplate,
    globalSettings,
    resetGlobalSettings,
    handleUploadClick,
    handleUpload,
    downloadAllToZip,
    handleIndividualSettingChange,
    setCanvasRef,
    clearImages,
  };
}