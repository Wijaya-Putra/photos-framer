// app/components/App.tsx
'use client'

import { useImageProcessor } from '@/app/hooks/use-image-processor';
import PhotoMetadataFramerUI from './photo-metadata-framer-ui';

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
    globalSettings,
    handleUploadClick,
    handleUpload,
    downloadAllToZip,
    handleIndividualSettingChange,
    setCanvasRef,
  } = useImageProcessor();

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
      <PhotoMetadataFramerUI
        images={images}
        onUploadClick={handleUploadClick}
        filesUploaded={filesUploaded}
        clearImages={clearImages}
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
  );
}