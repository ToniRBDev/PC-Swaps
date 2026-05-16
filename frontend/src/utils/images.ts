import { API_ORIGIN } from '../api/client';

export function getBackendImageUrl(image?: string) {
  if (!image) {
    return undefined;
  }

  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return `${API_ORIGIN}/${image.replace(/^\/+/, '')}`;
}
