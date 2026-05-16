import { apiRequest } from './client';

export interface LoginRequest {
  correoElectronico: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  idUsuario: number;
}

export function login(credentials: LoginRequest) {
  return apiRequest<LoginResponse>('/auth/login', {
    body: credentials,
    method: 'POST',
  });
}
