// app/components/image-card.tsx
'use client'

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
  globalLocation: string;
  setCanvasRef?: (key: string, node: HTMLCanvasElement | null) => void;
  TemplateComponent: React.ComponentType<any>;
}

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
  globalLocation,
  setCanvasRef,
  TemplateComponent,
}: Props) {
  return (
    <TemplateComponent
      image={image}
      settingMode={settingMode}
      globalAspect={globalAspect}
      globalAlign={globalAlign}
      globalPaddingTop={globalPaddingTop}
      globalPaddingBottom={globalPaddingBottom}
      globalPaddingLeft={globalPaddingLeft}
      globalPaddingRight={globalPaddingRight}
      globalPaddingTopText={globalPaddingTopText}
      globalPaddingBetweenTextLines={globalPaddingBetweenTextLines}
      globalPaddingBetweenMetaData={globalPaddingBetweenMetaData}
      globalFontSizeMain={globalFontSizeMain}
      globalFontSizeMeta={globalFontSizeMeta}
      globalJpegQuality={globalJpegQuality}
      globalLocation={globalLocation}
      setCanvasRef={setCanvasRef}
    />
  );
}