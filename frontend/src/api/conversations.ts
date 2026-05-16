import { apiRequest } from './client';

export interface ConversationUserResponse {
  idUsuario: number;
  nombreUsuario: string;
  imagenUsuario?: string;
}

export interface MessageResponse {
  idMensaje: number;
  idEmisor: number;
  contenido: string;
  fechaEnvio: string;
  leido: boolean;
}

export interface ConversationResponse {
  idConversacion: number;
  idArticulo: number;
  vendedor: ConversationUserResponse;
  comprador?: ConversationUserResponse;
  otroUsuario?: ConversationUserResponse;
  participante?: ConversationUserResponse;
  usuario?: ConversationUserResponse;
  mensajes: MessageResponse[];
  fechaInicio: string;
}

export function getMyConversations() {
  return apiRequest<ConversationResponse[]>('/conversaciones');
}

export function startConversation(idArticulo: number) {
  return apiRequest<ConversationResponse>('/conversaciones', {
    body: { idArticulo },
    method: 'POST',
  });
}

export function getConversation(idConversacion: number) {
  return apiRequest<ConversationResponse>(
    `/conversaciones/${idConversacion}`,
  );
}

export function deleteConversation(idConversacion: number) {
  return apiRequest<void>(`/conversaciones/${idConversacion}`, {
    method: 'DELETE',
  });
}

export function sendConversationMessage(
  idConversacion: number,
  contenido: string,
) {
  return apiRequest<MessageResponse>('/mensajes', {
    body: { idConversacion, contenido },
    method: 'POST',
  });
}

export function markConversationAsRead(idConversacion: number) {
  return apiRequest<void>(`/mensajes/conversacion/${idConversacion}/leer`, {
    method: 'PUT',
  });
}
