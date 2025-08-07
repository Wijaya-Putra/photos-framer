// app/components/App.tsx
'use client'

import { useImageProcessor } from '@/app/hooks/useImageProcessor'; // Corrected Path
import PhotoMetadataFramerUI from './PhotoMetadataFramerUI';

export default function App() {
  const {
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