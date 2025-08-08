// app/components/App.tsx
'use client'

import { useImageProcessor } from '@/app/hooks/use-image-processor';
import PhotoMetadataFramerUI from './photo-metadata-framer-ui';
import { usePalette } from 'color-thief-react';
import { useEffect } from 'react';
import { ImageData } from '../types';

// A small component to handle color fetching for a single image
const ColorFetcher = ({ image, onColorsFetched }: { image: ImageData, onColorsFetched: (colors: string[]) => void }) => {
  const { data: colors } = usePalette(image.url, 3, 'hex', { crossOrigin: 'anonymous', quality: 10 });

  useEffect(() => {
    if (colors) {
      onColorsFetched(colors);
    }
  }, [colors, onColorsFetched]);

  return null; // This component doesn't render anything
};

export default function App() {
  const {
    images,
    fileInputRef,
    filesUploaded,
    clearImages,
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
    updateImageWithColors,
  } = useImageProcessor();

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        multiple
        accept="image/*"
      />

      {/* Logic for fetching colors for each uploaded image */}
      {images.map(image => (
        <ColorFetcher 
          key={image.file.name}
          image={image}
          onColorsFetched={(colors) => updateImageWithColors(image.file.name, colors)}
        />
      ))}
      
      {/* The main UI */}
      <PhotoMetadataFramerUI
        images={images}
        onUploadClick={handleUploadClick}
        filesUploaded={filesUploaded}
        clearImages={clearImages}
        onDownloadAll={downloadAllToZip}
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        globalSettings={globalSettings}
        resetGlobalSettings={resetGlobalSettings}
        selectedImageId={selectedImageId}
        setSelectedImageId={setSelectedImageId}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        setCanvasRef={setCanvasRef}
        onIndividualSettingChange={handleIndividualSettingChange}
      />
    </div>
  );
}