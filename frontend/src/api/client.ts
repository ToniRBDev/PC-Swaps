import { getSessionToken } from '../utils/session';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
}

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

function isErrorResponse(
  value: unknown,
): value is { error?: string; message?: string } {
  return typeof value === 'object' && value !== null;
}
