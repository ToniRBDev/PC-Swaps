const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | object | null;
}

export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const headers = new Headers(options.headers);
  const body = prepareBody(options.body, headers);

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

  return (await response.json()) as TResponse;
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
