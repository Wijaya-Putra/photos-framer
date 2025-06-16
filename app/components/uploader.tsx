// /components/uploader.tsx
'use client'

import { useState, useRef, useCallback } from 'react'
import { extractMetadata } from '@/lib/metadata'
import ImageCard from './image-card'
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

export interface ImageData {
  file: File
  url: string
  make: string
  model: string
  focalLength: string
  aperture: string
  shutter: string
  iso: string
}

export default function Uploader() {
  const [images, setImages] = useState<ImageData[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Global configuration states
  const [aspect, setAspect] = useState('1:1')
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center') // Default to center
  const [paddingAllSides, setPaddingAllSides] = useState(46)
  const [paddingTopText, setPaddingTopText] = useState(20)
  const [paddingBetweenTextLines, setPaddingBetweenTextLines] = useState(10)
  const [paddingBetweenMetaData, setPaddingBetweenMetaData] = useState(5);
  const [fontSizeMain, setFontSizeMain] = useState(36)
  const [fontSizeMeta, setFontSizeMeta] = useState(26)
  const [jpegQuality, setJpegQuality] = useState(0.9); // New global state for JPEG quality, default 0.9

  // State to manage setting mode: 'global' or 'perCard'
  const [settingMode, setSettingMode] = useState<'global' | 'perCard'>('global')

  // Ref to hold canvas elements for each ImageCard when in global mode
  const canvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const processed = await Promise.all(
      files.map(async (file) => {
        const metadata = await extractMetadata(file)

        return {
          file,
          url: URL.createObjectURL(file),
          make: metadata.make || '',
          model: metadata.model || '',
          focalLength: metadata.focalLength || '',
          aperture: metadata.aperture || '',
          shutter: metadata.shutter || '',
          iso: metadata.iso || '',
        }
      })
    )

    setImages(processed)
    canvasRefs.current = {}; // Reset refs when new images are uploaded
  }

  // Callback to store canvas refs from children
  const setCanvasRef = useCallback((key: string, node: HTMLCanvasElement | null) => {
    canvasRefs.current[key] = node;
  }, []);

  const downloadAllToZip = async () => {
    if (images.length === 0) {
      alert('No images to download!');
      return;
    }

    const zip = new JSZip();
    let downloadCount = 0;

    for (const imgData of images) {
        const canvas = canvasRefs.current[imgData.file.name];
        if (canvas) {
            try {
                // Changed to JPEG export with quality and .jpeg extension
                const dataURL = canvas.toDataURL('image/jpeg', jpegQuality);
                const base64Data = dataURL.split(',')[1];
                zip.file(`${imgData.file.name.split('.')[0]}_framed.jpeg`, base64Data, { base64: true });
                downloadCount++;
            } catch (error) {
                console.error(`Failed to process image ${imgData.file.name}:`, error);
            }
        } else {
            console.warn(`Canvas not found for image: ${imgData.file.name}`);
        }
    }

    if (downloadCount > 0) {
        zip.generateAsync({ type: 'blob' })
            .then(function (content) {
                saveAs(content, 'framed_images.zip');
            })
            .catch(error => {
                console.error('Error zipping files:', error);
                alert('Failed to create zip file.');
            });
    } else {
        alert('No images were successfully processed for download.');
    }
  };


  return (
    <div className="space-y-6">
      <Button variant="default" onClick={handleUploadClick}>
        Upload Images
      </Button>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        ref={fileInputRef}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="p-4 border rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Configuration Mode</h2>
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="settingMode"
                value="global"
                checked={settingMode === 'global'}
                onChange={() => setSettingMode('global')}
                className="mr-2"
              />
              Global Settings
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="settingMode"
                value="perCard"
                checked={settingMode === 'perCard'}
                onChange={() => setSettingMode('perCard')}
                className="mr-2"
              />
              Per-Card Settings
            </label>
          </div>

          {/* Configuration Global */}
          {settingMode === 'global' && (
            <>
              <h2 className="text-lg font-semibold mb-4">Global Image Settings</h2>
              <div className="flex flex-col gap-4">

                {/* Aspect Ratio */}
                <div className="flex items-center gap-2">
                  <label>Aspect Ratio:</label>
                  <Select value={aspect} onValueChange={(value) => setAspect(value)}>
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
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-2">
                  <label>Text Align:</label>
                  <Select value={align} onValueChange={(value) => setAlign(value as 'center' | 'left' | 'right')}>
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
                </div>

                <div className='flex flex-row gap-4 flex-wrap'>
                  {/* Canvas Padding */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Canvas Padding:</Label>
                    <Input
                      type="number"
                      value={paddingAllSides}
                      onChange={(e) => setPaddingAllSides(Number(e.target.value))}
                      className="border p-1 w-20 rounded"
                    />
                  </div>

                  {/* Padding Top Text */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Gap Image to Text:</Label>
                    <Input
                      type="number"
                      value={paddingTopText}
                      onChange={(e) => setPaddingTopText(Number(e.target.value))}
                      className="border p-1 w-20 rounded"
                    />
                  </div>

                  {/* Padding Between Text Lines */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Gap Main to Meta Text:</Label>
                    <Input
                      type="number"
                      value={paddingBetweenTextLines}
                      onChange={(e) => setPaddingBetweenTextLines(Number(e.target.value))}
                      className="border p-1 w-20 rounded"
                    />
                  </div>

                  {/* Padding Between Metadata Items */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Gap Between Meta Data:</Label>
                    <Input
                      type="number"
                      value={paddingBetweenMetaData}
                      onChange={(e) => setPaddingBetweenMetaData(Number(e.target.value))}
                      className="border p-1 w-20 rounded"
                    />
                  </div>

                  {/* Main Font Size */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Main Font:</Label>
                    <Input
                      type="number"
                      value={fontSizeMain}
                      onChange={(e) => setFontSizeMain(Number(e.target.value))}
                      className="border p-1 w-16 rounded"
                    />
                  </div>

                  {/* Meta Font Size */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>Meta Font:</Label>
                    <Input
                      type="number"
                      value={fontSizeMeta}
                      onChange={(e) => setFontSizeMeta(Number(e.target.value))}
                      className="border p-1 w-16 rounded"
                    />
                  </div>

                  {/* JPEG Quality Control */}
                  <div className="grid w-auto max-w-sm items-center gap-3">
                    <Label>JPEG Quality (0.1-1.0):</Label>
                    <Input
                      type="number"
                      step="0.1" // Allows stepping by 0.1
                      min="0.1"
                      max="1.0"
                      value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number(e.target.value))}
                      className="border p-1 w-20 rounded"
                    />
                  </div>
                </div>

              </div>
            </>
          )}

          {settingMode === 'global' && images.length > 0 && (
            <button
              onClick={downloadAllToZip}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Download All Framed Images (ZIP)
            </button>
          )}
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <ImageCard
            key={img.file.name}
            image={img}
            settingMode={settingMode}
            globalAspect={aspect}
            globalAlign={align}
            globalPaddingAllSides={paddingAllSides}
            globalPaddingTopText={paddingTopText}
            globalPaddingBetweenTextLines={paddingBetweenTextLines}
            globalPaddingBetweenMetaData={paddingBetweenMetaData}
            globalFontSizeMain={fontSizeMain}
            globalFontSizeMeta={fontSizeMeta}
            globalJpegQuality={jpegQuality} // Pass new global JPEG quality
            setCanvasRef={setCanvasRef}
          />
        ))}
      </div>
    </div>
  )
}