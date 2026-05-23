/**
 * Mensaje almacenado en el estado local de conversaciones.
 *
 * Representa la version que usa el frontend para saber si el mensaje fue
 * enviado por el usuario actual y si ya se ha leido.
 */
export interface ConversationMessage {
  idMensaje: number;
  contenido: string;
  fecha: string;
  enviadoPorMi: boolean;
  leido: boolean;
}

/**
 * Conversacion simplificada mantenida por el contexto local.
 *
 * Esta estructura resume los datos necesarios para mostrar conversaciones en la
 * interfaz sin depender directamente del contrato completo de la API.
 */
export interface Conversation {
  idConversacion: number;
  idArticulo: number;
  vendedor: string;
  fechaInicio: string;
  mensajes: ConversationMessage[];
}
