const AUTH_TOKEN_KEY = 'pcswaps_token';
const AUTH_USER_ID_KEY = 'pcswaps_user_id';

/**
 * Recupera el token de autenticacion guardado en el navegador.
 *
 * @returns Token de sesion actual o `null` si no existe.
 */
export function getSessionToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

/**
 * Recupera el identificador del usuario guardado en la sesion local.
 *
 * @returns Identificador numerico del usuario o `null` si no hay sesion.
 */
export function getSessionUserId() {
  const value = localStorage.getItem(AUTH_USER_ID_KEY);
  return value ? Number(value) : null;
}

/**
 * Guarda los datos minimos de sesion tras iniciar sesion correctamente.
 *
 * @param token - Token de autenticacion devuelto por el backend.
 * @param idUsuario - Identificador del usuario autenticado.
 */
export function saveSession(token: string, idUsuario: number) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_ID_KEY, String(idUsuario));
}

/**
 * Elimina del navegador los datos de sesion del usuario.
 */
export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_ID_KEY);
}
