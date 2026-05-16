import { apiRequest } from './client';
import type { UserProfile } from '../types/user';

export interface CreateUserRequest {
  nombre: string;
  apellidos: string;
  dni: string;
  correoElectronico: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  password: string;
}

export interface UpdateUserRequest {
  nombreUsuario: string;
  direccion?: string;
  numTelefono?: string;
}

export interface ChangePasswordRequest {
  passwordActual: string;
  passwordNueva: string;
}

export function createUser(user: CreateUserRequest) {
  return apiRequest<UserProfile>('/usuarios/registro', {
    body: user,
    method: 'POST',
  });
}

export function getMyProfile() {
  return apiRequest<UserProfile>('/usuarios/me');
}

export function updateMyProfile(user: UpdateUserRequest) {
  return apiRequest<UserProfile>('/usuarios/me', {
    body: user,
    method: 'PUT',
  });
}

export function updateMyProfileImage(file: File) {
  const formData = new FormData();
  formData.append('archivo', file);

  return apiRequest<UserProfile>('/usuarios/me/imagen', {
    body: formData,
    method: 'PUT',
  });
}

export function changeMyPassword(passwords: ChangePasswordRequest) {
  return apiRequest<void>('/usuarios/me/password', {
    body: passwords,
    method: 'PUT',
  });
}
