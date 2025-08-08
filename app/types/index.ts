// app/types/index.ts

export type TemplateName = 'classic' | 'memoir';

export interface ImageData {
  file: File;
  url: string;
  make: string;
  model: string;
  focalLength: string;
  aperture: string;
  shutter: string;
  iso: string;
  dateTimeOriginal?: Date;
  dominantColors: string[]; // This will hold the extracted colors
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
  individualLocation: string;
}