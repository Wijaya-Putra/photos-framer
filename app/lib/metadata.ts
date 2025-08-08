// /lib/metadata.ts
import * as exifr from 'exifr'

export async function extractMetadata(file: File) {
  try {
    const exif = await exifr.parse(file)

    return {
      make: exif?.Make || '',
      model: exif?.Model || '',
      focalLength: exif?.FocalLength ? `${exif.FocalLength}mm` : '',
      aperture: exif?.FNumber ? `f/${exif.FNumber}` : '',
      shutter: exif?.ExposureTime ? `1/${Math.round(1 / exif.ExposureTime)}` : '',
      iso: exif?.ISO?.toString() || '',
      dateTimeOriginal: exif?.DateTimeOriginal,
    }
  } catch (error) {
    console.error('Error extracting metadata:', error)
    return {
      make: '',
      model: '',
      focalLength: '',
      aperture: '',
      shutter: '',
      iso: '',
      dateTimeOriginal: undefined,
    }
  }
}