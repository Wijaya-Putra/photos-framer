// app/store/use-image-store.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ImageData, TemplateName } from '@/app/types';
import { extractMetadata } from '../lib/metadata';
import { prominent } from 'color.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const defaultGlobalSettings = {
    aspect: '1:1',
    align: 'center' as 'center' | 'left' | 'right',
    paddingTop: 46,
    paddingBottom: 46,
    paddingLeft: 46,
    paddingRight: 46,
    paddingTopText: 71,
    paddingBetweenTextLines: 12,
    paddingBetweenMetaData: 12,
    fontSizeMain: 36,
    fontSizeMeta: 26,
    jpegQuality: 0.9,
    location: 'Tokyo, Japan',
};

type State = {
    images: ImageData[];
    filesUploaded: boolean;
    activeMode: 'global' | 'individual';
    selectedImageId: string | null;
    selectedTemplate: TemplateName;
    globalSettings: typeof defaultGlobalSettings;
    canvasRefs: Record<string, HTMLCanvasElement | null>;
};

type Actions = {
    setImages: (images: ImageData[]) => void;
    setFilesUploaded: (filesUploaded: boolean) => void;
    setActiveMode: (activeMode: 'global' | 'individual') => void;
    setSelectedImageId: (selectedImageId: string | null) => void;
    setSelectedTemplate: (selectedTemplate: TemplateName) => void;
    setGlobalSettings: (settings: Partial<typeof defaultGlobalSettings>) => void;
    setCanvasRef: (key: string, node: HTMLCanvasElement | null) => void;
    resetGlobalSettings: () => void;
    clearImages: () => void;
    handleUpload: (files: File[]) => Promise<void>;
    downloadAllToZip: () => Promise<void>;
    handleIndividualSettingChange: (
        imageId: string,
        settingName: keyof Omit<
            ImageData,
            | 'file'
            | 'url'
            | 'make'
            | 'model'
            | 'focalLength'
            | 'aperture'
            | 'shutter'
            | 'iso'
            | 'dateTimeOriginal'
            | 'dominantColors'
        >,
        newValue: any
    ) => void;
};

export const useImageStore = create(
    immer<State & Actions>((set, get) => ({
        images: [],
        filesUploaded: false,
        activeMode: 'individual',
        selectedImageId: null,
        selectedTemplate: 'classic',
        globalSettings: defaultGlobalSettings,
        canvasRefs: {},

        setImages: (images) => set({ images }),
        setFilesUploaded: (filesUploaded) => set({ filesUploaded }),
        setActiveMode: (activeMode) => set({ activeMode }),
        setSelectedImageId: (selectedImageId) => set({ selectedImageId }),
        setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),
        setGlobalSettings: (settings) =>
            set((state) => {
                state.globalSettings = { ...state.globalSettings, ...settings };
            }),
        setCanvasRef: (key, node) =>
            set((state) => ({
                canvasRefs: { ...state.canvasRefs, [key]: node },
            })),
        resetGlobalSettings: () => set({ globalSettings: defaultGlobalSettings }),
        clearImages: () =>
            set({
                images: [],
                selectedImageId: null,
                filesUploaded: false,
                activeMode: 'individual',
            }),
        handleUpload: async (files) => {
            if (files.length === 0) return;

            get().clearImages();
            set({ filesUploaded: true });

            const initialProcessed = await Promise.all(
                files.map(async (file) => {
                    const metadata = await extractMetadata(file);
                    return {
                        file,
                        url: URL.createObjectURL(file),
                        make: metadata.make || '',
                        model: metadata.model || '',
                        focalLength: metadata.focalLength || '',
                        aperture: metadata.aperture || '',
                        shutter: metadata.shutter || '',
                        iso: metadata.iso || '',
                        dateTimeOriginal: metadata.dateTimeOriginal,
                        dominantColors: [],
                        individualAspect: defaultGlobalSettings.aspect,
                        individualAlign: defaultGlobalSettings.align,
                        individualPaddingTop: defaultGlobalSettings.paddingTop,
                        individualPaddingBottom: defaultGlobalSettings.paddingBottom,
                        individualPaddingLeft: defaultGlobalSettings.paddingLeft,
                        individualPaddingRight: defaultGlobalSettings.paddingRight,
                        individualPaddingTopText: defaultGlobalSettings.paddingTopText,
                        individualPaddingBetweenTextLines:
                            defaultGlobalSettings.paddingBetweenTextLines,
                        individualPaddingBetweenMetaData:
                            defaultGlobalSettings.paddingBetweenMetaData,
                        individualFontSizeMain: defaultGlobalSettings.fontSizeMain,
                        individualFontSizeMeta: defaultGlobalSettings.fontSizeMeta,
                        individualJpegQuality: defaultGlobalSettings.jpegQuality,
                        individualLocation: defaultGlobalSettings.location,
                    };
                })
            );

            set({ images: initialProcessed });

            if (initialProcessed.length > 0) {
                set({ selectedImageId: initialProcessed[0].file.name });
            }

            set({ activeMode: files.length > 1 ? 'global' : 'individual' });

            const imagesWithColors = await Promise.all(
                initialProcessed.map(async (image) => {
                    try {
                        const colors = await prominent(image.url, { amount: 3, format: 'hex' });
                        return { ...image, dominantColors: colors as string[] };
                    } catch (error) {
                        console.error(`Error extracting colors for ${image.file.name}:`, error);
                        return image;
                    }
                })
            );

            set({ images: imagesWithColors });
        },
        downloadAllToZip: async () => {
            const { images, canvasRefs } = get();
            if (images.length === 0) return;
            const zip = new JSZip();
            for (const imgData of images) {
                const canvas = canvasRefs[imgData.file.name];
                if (canvas) {
                    const blob = await new Promise<Blob | null>((resolve) =>
                        canvas.toBlob(resolve, 'image/jpeg', imgData.individualJpegQuality)
                    );
                    if (blob) {
                        zip.file(`framed-${imgData.file.name.replace(/\.[^/.]+$/, "")}.jpeg`, blob);
                    }
                }
            }
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, 'framed_images.zip');
        },
        handleIndividualSettingChange: (imageId, settingName, newValue) => {
            set((state) => {
                const image = state.images.find((img) => img.file.name === imageId);
                if (image) {
                    (image as any)[settingName] = newValue;
                }
            });
        },
    }))
);