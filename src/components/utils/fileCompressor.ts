// NOTE: The 'browser-image-compression' library has been removed to fix a build error.
// This means image compression is currently disabled. To re-enable it,
// run `npm install browser-image-compression` and uncomment the original code.

/**
 * Processes a file. Image compression is currently disabled.
 * @param file The file to process.
 * @returns A promise that resolves to the original file.
 */
export const compressFile = async (file: File): Promise<File> => {
  const isImage = file.type.startsWith("image/");
  if (isImage) {
    console.log(
      `Processing image (compression disabled): ${(file.size / 1024 / 1024).toFixed(2)} MB`
    );
  }
  // Return the original file without compression.
  return file;
};