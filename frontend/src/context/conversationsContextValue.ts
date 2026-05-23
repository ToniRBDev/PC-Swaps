import { createContext } from 'react';
import type { Conversation } from '../types/conversation';

/**
 * Valor compartido por el contexto de conversaciones.
 *
 * Agrupa el estado local de conversaciones y las operaciones que permiten
 * modificarlo desde componentes como la barra de navegacion o las pantallas de
 * mensajeria.
 */
export interface ConversationsContextValue {
  conversations: Conversation[];
  deleteConversation: (idConversacion: number) => void;
  hasUnreadMessages: boolean;
  markConversationAsRead: (idConversacion: number) => void;
  sendMessage: (idConversacion: number, content: string) => void;
}

/**
 * Contexto React que expone las conversaciones locales de la aplicacion.
 */
export const ConversationsContext =
  createContext<ConversationsContextValue | null>(null);
