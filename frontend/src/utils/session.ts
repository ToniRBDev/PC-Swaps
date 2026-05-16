const AUTH_TOKEN_KEY = 'pcswaps_token';
const AUTH_USER_ID_KEY = 'pcswaps_user_id';

export function getSessionToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveSession(token: string, idUsuario: number) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_ID_KEY, String(idUsuario));
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_ID_KEY);
}
