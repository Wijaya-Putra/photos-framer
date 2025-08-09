// /lib/metadata.ts
import * as exifr from 'exifr'

// Helper function to convert GPS Degrees, Minutes, Seconds to Decimal Degrees
function dmsToDecimal(dms: number[], ref: string): number | undefined {
  if (!dms || !ref || dms.length !== 3) return undefined;
  
  let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
  
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  
  return dd;
}

export async function extractMetadata(file: File) {
  try {
    const options = {
      exif: true,
      gps: true,
      interop: true,
      makerNote: true,
    }
    
    const exif = await exifr.parse(file, options)

    let latitude = exif?.latitude;
    let longitude = exif?.longitude;

    if (latitude === undefined && exif?.GPSLatitude) {
      latitude = dmsToDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
    }
    if (longitude === undefined && exif?.GPSLongitude) {
      longitude = dmsToDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);
    }

    return {
      make: exif?.Make || '',
      model: exif?.Model || '',
      focalLength: exif?.FocalLength ? `${exif.FocalLength}mm` : '',
      aperture: exif?.FNumber ? `f/${exif.FNumber}` : '',
      // CORRECTED: Changed exifr.ExposureTime to exif.ExposureTime
      shutter: exif?.ExposureTime ? `1/${Math.round(1 / exif.ExposureTime)}` : '',
      iso: exif?.ISO?.toString() || '',
      dateTimeOriginal: exif?.DateTimeOriginal,
      latitude: latitude,
      longitude: longitude,
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
      latitude: undefined,
      longitude: undefined,
    }
  }
}