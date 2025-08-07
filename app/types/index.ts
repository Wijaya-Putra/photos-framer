// app/types/index.ts
export interface ImageData {
  file: File;
  url: string;
  make: string;
  model: string;
  focalLength: string;
  aperture: string;
  shutter: string;
  iso: string;
  individualAspect: string;
  individualAlign: 'center' | 'left' | 'right';
  individualPaddingTop: number;
  individualPaddingBottom: number;
  individualPaddingLeft: number;
  individualPaddingRight: number;
  individualPaddingTopText: number;
  individualPaddingBetweenTextLines: number;
  individualPaddingBetweenMetaData: number;
  individualFontSizeMain: number;
  individualFontSizeMeta: number;
  individualJpegQuality: number;
}