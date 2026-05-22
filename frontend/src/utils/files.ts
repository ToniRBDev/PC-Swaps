export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIZE_LABEL = '5 MB';

export function validateImageSize(file: File) {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`La imagen no puede superar los ${MAX_IMAGE_SIZE_LABEL}`);
  }
}
