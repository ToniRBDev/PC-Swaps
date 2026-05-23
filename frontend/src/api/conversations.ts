import { apiRequest } from './client';

/**
 * Informacion basica de un usuario que participa en una conversacion.
 *
 * Resume los datos necesarios para identificar y mostrar a un participante del
 * chat sin cargar su perfil completo.
 */
export interface ConversationUserResponse {
  idUsuario: number;
  nombreUsuario: string;
  imagenUsuario?: string;
}

/**
 * Mensaje individual dentro de una conversacion.
 *
 * Representa el contenido enviado, su autor, la fecha de envio y el estado de
 * lectura que muestra la interfaz del chat.
 */
export interface MessageResponse {
  idMensaje: number;
  idEmisor: number;
  contenido: string;
  fechaEnvio: string;
  leido: boolean;
}

/**
 * Conversacion asociada a un articulo publicado.
 *
 * Agrupa el articulo relacionado, los participantes disponibles segun la
 * respuesta del backend y el historial de mensajes de la conversacion.
 */
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

/**
 * Obtiene las conversaciones abiertas del usuario autenticado.
 *
 * @returns Lista de conversaciones del usuario actual.
 */
export function getMyConversations() {
  return apiRequest<ConversationResponse[]>('/conversaciones');
}

/**
 * Crea o recupera una conversacion asociada a un articulo concreto.
 *
 * @param idArticulo - Identificador del articulo sobre el que se conversa.
 * @returns Conversacion creada o ya existente para ese articulo.
 */
export function startConversation(idArticulo: number) {
  return apiRequest<ConversationResponse>('/conversaciones', {
    body: { idArticulo },
    method: 'POST',
  });
}

/**
 * Recupera el detalle de una conversacion por su identificador.
 *
 * @param idConversacion - Identificador de la conversacion.
 * @returns Conversacion completa con sus mensajes.
 */
export function getConversation(idConversacion: number) {
  return apiRequest<ConversationResponse>(
    `/conversaciones/${idConversacion}`,
  );
}

/**
 * Elimina una conversacion del usuario autenticado.
 *
 * @param idConversacion - Identificador de la conversacion que se elimina.
 */
export function deleteConversation(idConversacion: number) {
  return apiRequest<void>(`/conversaciones/${idConversacion}`, {
    method: 'DELETE',
  });
}

/**
 * Envia un nuevo mensaje dentro de una conversacion existente.
 *
 * @param idConversacion - Identificador de la conversacion destino.
 * @param contenido - Texto del mensaje que se enviara.
 * @returns Mensaje creado por el backend.
 */
export function sendConversationMessage(
  idConversacion: number,
  contenido: string,
) {
  return apiRequest<MessageResponse>('/mensajes', {
    body: { idConversacion, contenido },
    method: 'POST',
  });
}

/**
 * Marca como leidos los mensajes recibidos de una conversacion.
 *
 * @param idConversacion - Identificador de la conversacion que se marca como leida.
 */
export function markConversationAsRead(idConversacion: number) {
  return apiRequest<void>(`/mensajes/conversacion/${idConversacion}/leer`, {
    method: 'PUT',
  });
}
