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
    selectedTemplate,
    setSelectedTemplate,
    globalSettings,
    resetGlobalSettings,
    handleUploadClick,
    handleUpload,
    downloadAllToZip,
    handleIndividualSettingChange,
    setCanvasRef,
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