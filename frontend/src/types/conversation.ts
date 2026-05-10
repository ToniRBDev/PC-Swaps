export interface ConversationMessage {
  idMensaje: number;
  contenido: string;
  fecha: string;
  enviadoPorMi: boolean;
  leido: boolean;
}

export interface Conversation {
  idConversacion: number;
  idArticulo: number;
  vendedor: string;
  fechaInicio: string;
  mensajes: ConversationMessage[];
}
