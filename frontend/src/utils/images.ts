import { API_ORIGIN } from '../api/client';

/**
 * Convierte una ruta de imagen del backend en una URL utilizable por el navegador.
 *
 * @param image - Ruta relativa, URL absoluta o valor vacio de imagen.
 * @returns URL absoluta de la imagen o `undefined` cuando no hay imagen.
 */
export function getBackendImageUrl(image?: string) {
  if (!image) {
    return undefined;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, '')}`;
}
