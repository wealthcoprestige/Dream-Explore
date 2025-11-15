import imageCompression from "browser-image-compression";

const imageOptions = {
  maxSizeMB: 1, // Max file size in MB
  maxWidthOrHeight: 1920, // Max width or height
  useWebWorker: true, // Use web worker for better performance
};

const MAX_FILENAME_LENGTH = 90; // Keep it under 100 to be safe

/**
 * Truncates a filename if it's too long, preserving the extension.
 * @param filename The original filename.
 * @returns A shortened filename if necessary.
 */
const truncateFilename = (filename: string): string => {
  if (filename.length <= MAX_FILENAME_LENGTH) {
    return filename;
  }

  const extension = filename.slice(filename.lastIndexOf("."));
  const baseName = filename.slice(0, filename.lastIndexOf("."));
  const truncatedBaseName = baseName.slice(
    0,
    MAX_FILENAME_LENGTH - extension.length
  );

  return `${truncatedBaseName}${extension}`;
};

/**
 * Compresses an image file and ensures the filename is not too long.
 * @param file The file to process.
 * @returns A promise that resolves to the processed file.
 */
export const compressFile = async (file: File): Promise<File> => {
  const isImage = file.type.startsWith("image/");
  let processedFile = file;

  if (isImage) {
    try {
      processedFile = await imageCompression(file, imageOptions);
    } catch (error) {
      console.error("Image compression failed, using original file:", error);
      processedFile = file; // Fallback to original file
    }
  }

  const shortFilename = truncateFilename(processedFile.name);
  // Return a new File object with the potentially shortened name
  return new File([processedFile], shortFilename, { type: processedFile.type });
};