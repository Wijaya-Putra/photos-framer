// color.d.ts
declare module 'color.js' {
  interface ColorJSOptions {
    amount?: number;
    format?: 'hex' | 'rgb' | 'array';
  }

  export function prominent(
    source: string | HTMLImageElement,
    options?: ColorJSOptions
  ): Promise<string[]>;
}