import { apiRequest } from './client';
import type { UserProfile } from '../types/user';

/**
 * Datos necesarios para registrar un nuevo usuario.
 *
 * Representa el payload completo del formulario de registro antes de crear la
 * cuenta en el backend.
 */
export interface CreateUserRequest {
  nombre: string;
  apellidos: string;
  dni: string;
  correoElectronico: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  password: string;
}

/**
 * Datos editables del perfil del usuario autenticado.
 *
 * Contiene solo los campos que el usuario puede modificar desde la pantalla de
 * perfil, excluyendo credenciales e imagen.
 */
export interface UpdateUserRequest {
  nombreUsuario: string;
  direccion?: string;
  numTelefono?: string;
}

/**
 * Datos de contacto de un usuario visibles para otros usuarios.
 *
 * Se utiliza en contextos como conversaciones o paginas de vendedor, donde se
 * necesita mostrar informacion publica o de contacto sin cargar todo el perfil.
 */
export interface UserContactResponse {
  idUsuario: number;
  nombreUsuario: string;
  correoElectronico?: string;
  direccion?: string;
  numTelefono?: string;
  imagenUsuario?: string;
}

/**
 * Datos necesarios para cambiar la contrasena del usuario autenticado.
 *
 * Agrupa la contrasena actual, usada como comprobacion, y la nueva contrasena
 * que se quiere guardar.
 */
export interface ChangePasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}

/**
 * Registra un nuevo usuario y devuelve su perfil creado.
 *
 * @param user - Datos de registro del nuevo usuario.
 * @returns Perfil creado por el backend.
 */
export function createUser(user: CreateUserRequest) {
  return apiRequest<UserProfile>('/usuarios/registro', {
    body: user,
    method: 'POST',
  });
}

/**
 * Recupera el perfil del usuario autenticado.
 *
 * @returns Perfil completo del usuario actual.
 */
export function getMyProfile() {
  return apiRequest<UserProfile>('/usuarios/me');
}

/**
 * Obtiene los datos publicos o de contacto de otro usuario.
 *
 * @param idUsuario - Identificador del usuario consultado.
 * @returns Datos de contacto disponibles para ese usuario.
 */
export function getUserContact(idUsuario: number) {
  return apiRequest<UserContactResponse>(`/usuarios/${idUsuario}/contacto`);
}

/**
 * Actualiza los datos editables del perfil del usuario autenticado.
 *
 * @param user - Nuevos datos del perfil.
 * @returns Perfil actualizado.
 */
export function updateMyProfile(user: UpdateUserRequest) {
  return apiRequest<UserProfile>('/usuarios/me', {
    body: user,
    method: 'PUT',
  });
}

/**
 * Sube una nueva imagen de perfil usando multipart/form-data.
 *
 * @param file - Archivo de imagen que se subira como imagen de perfil.
 * @returns Perfil actualizado con la nueva imagen.
 */
export function updateMyProfileImage(file: File) {
  const formData = new FormData();
  formData.append('archivo', file);

  return apiRequest<UserProfile>('/usuarios/me/imagen', {
    body: formData,
    method: 'PUT',
  });
}

/**
 * Cambia la contrasena del usuario autenticado validando la contrasena actual.
 *
 * @param passwords - Contrasena actual y nueva contrasena.
 */
export function changeMyPassword(passwords: ChangePasswordRequest) {
  return apiRequest<void>('/usuarios/me/password', {
    body: passwords,
    method: 'PUT',
  });
}
