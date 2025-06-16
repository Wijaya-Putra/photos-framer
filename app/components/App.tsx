'use client'

import { useState, useRef, useCallback } from 'react'
import { extractMetadata } from '@/lib/metadata'
import { Button } from '@/components/ui/button'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import PhotoMetadataFramerUI from './PhotoMetadataFramerUI';

export interface ImageData {
  file: File
  url: string
  make: string
  model: string
  focalLength: string
  aperture: string
  shutter: string
  iso: string
  // New individual settings properties
  individualAspect: string;
  individualAlign: 'center' | 'left' | 'right';
  individualPaddingAllSides: number;
  individualPaddingTopText: number;
  individualPaddingBetweenTextLines: number;
  individualPaddingBetweenMetaData: number;
  individualFontSizeMain: number;
  individualFontSizeMeta: number;
  individualJpegQuality: number;
}

export default function App() {
  const [images, setImages] = useState<ImageData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Global configuration states
  const [globalAspect, setGlobalAspect] = useState('1:1')
  const [globalAlign, setGlobalAlign] = useState<'center' | 'left' | 'right'>('center')
  const [globalPaddingAllSides, setGlobalPaddingAllSides] = useState(46)
  const [globalPaddingTopText, setGlobalPaddingTopText] = useState(20)
  const [globalPaddingBetweenTextLines, setGlobalPaddingBetweenTextLines] = useState(10)
  const [globalPaddingBetweenMetaData, setGlobalPaddingBetweenMetaData] = useState(5)
  const [globalFontSizeMain, setGlobalFontSizeMain] = useState(36)
  const [globalFontSizeMeta, setGlobalFontSizeMeta] = useState(26)
  const [globalJpegQuality, setGlobalJpegQuality] = useState(0.9)

  // State for the main UI mode
  const [activeMode, setActiveMode] = useState<'global' | 'individual'>('global')

  // State for selected image in individual mode
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // Ref to hold canvas elements for each ImageCard
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  // Define setCanvasRef callback
  const setCanvasRef = useCallback((key: string, node: HTMLCanvasElement | null) => {
    canvasRefs.current[key] = node;
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const processed = await Promise.all(
      files.map(async (file) => {
        const metadata = await extractMetadata(file)
        // Initialize individual settings from current global settings (or defaults)
        return {
          file,
          url: URL.createObjectURL(file),
          make: metadata.make || '',
          model: metadata.model || '',
          focalLength: metadata.focalLength || '',
          aperture: metadata.aperture || '',
          shutter: metadata.shutter || '',
          iso: metadata.iso || '',
          // Initialize individual settings
          individualAspect: globalAspect,
          individualAlign: globalAlign,
          individualPaddingAllSides: globalPaddingAllSides,
          individualPaddingTopText: globalPaddingTopText,
          individualPaddingBetweenTextLines: globalPaddingBetweenTextLines,
          individualPaddingBetweenMetaData: globalPaddingBetweenMetaData,
          individualFontSizeMain: globalFontSizeMain,
          individualFontSizeMeta: globalFontSizeMeta,
          individualJpegQuality: globalJpegQuality,
        }
      })
    )

    setImages(processed)
    canvasRefs.current = {}; // Reset refs when new images are uploaded
    if (processed.length > 0) {
      setSelectedImageId(processed[0].file.name); // Automatically select the first image
    } else {
      setSelectedImageId(null);
    }
  }

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
          canvas.toBlob(resolve, 'image/png', imgData.individualJpegQuality) // Use individual quality here
        );
        if (blob) {
          zip.file(`framed-${imgData.file.name}`, blob);
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
    paddingAllSides: globalPaddingAllSides, setPaddingAllSides: setGlobalPaddingAllSides,
    paddingTopText: globalPaddingTopText, setPaddingTopText: setGlobalPaddingTopText,
    paddingBetweenTextLines: globalPaddingBetweenTextLines, setPaddingBetweenTextLines: setGlobalPaddingBetweenTextLines,
    paddingBetweenMetaData: globalPaddingBetweenMetaData, setPaddingBetweenMetaData: setGlobalPaddingBetweenMetaData,
    fontSizeMain: globalFontSizeMain, setFontSizeMain: setGlobalFontSizeMain,
    fontSizeMeta: globalFontSizeMeta, setFontSizeMeta: setGlobalFontSizeMeta,
    jpegQuality: globalJpegQuality, setJpegQuality: setGlobalJpegQuality,
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        multiple
        accept="image/*"
      />
      {/* PhotoMetadataFramerUI is the main UI wrapper */}
      <PhotoMetadataFramerUI
        images={images}
        onUploadClick={handleUploadClick}
        onDownloadAll={downloadAllToZip}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        globalSettings={globalSettings}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        setCanvasRef={setCanvasRef}
        onIndividualSettingChange={handleIndividualSettingChange}
      />
    </div>
  )
}