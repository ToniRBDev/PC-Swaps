/**
 * Tamano maximo permitido para imagenes subidas por el usuario.
 */
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Etiqueta legible del limite de tamano de imagen.
 */
export const MAX_IMAGE_SIZE_LABEL = '5 MB';

/**
 * Valida que una imagen no supere el tamano maximo permitido.
 *
 * @param file - Archivo seleccionado por el usuario.
 * @throws Error cuando el archivo supera el limite configurado.
 */
export function validateImageSize(file: File) {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(`La imagen no puede superar los ${MAX_IMAGE_SIZE_LABEL}`);
  }
}
