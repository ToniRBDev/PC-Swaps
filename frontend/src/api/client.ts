import { getSessionToken } from '../utils/session';

/**
 * URL base de la API usada por todas las peticiones del frontend.
 *
 * @remarks
 * Se lee desde `VITE_API_BASE_URL` y, si no existe, usa el backend local por
 * defecto. Tambien elimina barras finales para construir rutas de forma estable.
 */
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api').replace(
    /\/+$/,
    '',
  );

/**
 * Origen del backend sin el sufijo `/api`.
 *
 * Se usa para construir URLs absolutas de recursos servidos por el backend,
 * como imagenes de articulos o perfiles.
 */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Opciones aceptadas por el cliente HTTP de la aplicacion.
 *
 * @remarks
 * Amplia `RequestInit` para permitir objetos como `body`; esos objetos se
 * serializan automaticamente a JSON antes de hacer la peticion.
 */
interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
}

/**
 * Ejecuta una peticion al backend anadiendo token, serializando el body y normalizando errores.
 *
 * @typeParam TResponse - Tipo esperado para la respuesta del backend.
 * @param path - Ruta relativa dentro de la API, por ejemplo `/articulos`.
 * @param options - Opciones de `fetch` y cuerpo opcional de la peticion.
 * @returns Respuesta parseada al tipo indicado.
 * @throws Error con el mensaje devuelto por el backend o un mensaje generico.
 */
export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  const token = getSessionToken();
  const body = prepareBody(options.body, headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body,
    headers,
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();

  if (!text) {
    return undefined as TResponse;
  }

  return JSON.parse(text) as TResponse;
}

/**
 * Prepara el cuerpo de la peticion sin modificar `FormData` ni strings ya construidos.
 *
 * @param body - Cuerpo recibido por `apiRequest`.
 * @param headers - Cabeceras que se ajustan cuando el cuerpo se envia como JSON.
 * @returns Cuerpo compatible con `fetch`.
 */
function prepareBody(
  body: ApiRequestOptions['body'],
  headers: Headers,
): BodyInit | null | undefined {
  if (!body || body instanceof FormData || typeof body === 'string') {
    return body;
  }

  headers.set('Content-Type', 'application/json');
  return JSON.stringify(body);
}

/**
 * Extrae un mensaje de error legible desde la respuesta del backend.
 *
 * @param response - Respuesta HTTP no satisfactoria.
 * @returns Mensaje de error especifico o mensaje generico con el codigo HTTP.
 */
async function getErrorMessage(response: Response) {
  const fallback = `Error ${response.status}: no se ha podido completar la peticion`;

  try {
    const data = (await response.json()) as unknown;

    if (isErrorResponse(data)) {
      return data.message ?? data.error ?? fallback;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Comprueba que la respuesta de error tiene forma de objeto antes de leer sus campos.
 *
 * @param value - Valor desconocido parseado desde la respuesta del backend.
 * @returns `true` si el valor puede contener campos de error.
 */
function isErrorResponse(
  value: unknown,
): value is { error?: string; message?: string } {
  return typeof value === 'object' && value !== null;
}
