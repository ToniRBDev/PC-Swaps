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

export function createUser(user: CreateUserRequest) {
  return apiRequest<UserProfile>('/usuarios/registro', {
    body: user,
    method: 'POST',
  });
}
