import { apiRequest } from './client';

/**
 * Credenciales necesarias para iniciar sesion.
 *
 * Representa los datos que el formulario de login envia al backend para
 * autenticar a un usuario registrado.
 */
export interface LoginRequest {
  correoElectronico: string;
  password: string;
}

/**
 * Datos devueltos por el backend tras un inicio de sesion correcto.
 *
 * Incluye el token que se guardara en la sesion del cliente y el identificador
 * del usuario autenticado.
 */
export interface LoginResponse {
  token: string;
  idUsuario: number;
}

/**
 * Envia las credenciales al backend para autenticar al usuario.
 *
 * @param credentials - Correo electronico y contrasena del usuario.
 * @returns Token de sesion e identificador del usuario autenticado.
 */
export function login(credentials: LoginRequest) {
  return apiRequest<LoginResponse>('/auth/login', {
    body: credentials,
    method: 'POST',
  });
}
