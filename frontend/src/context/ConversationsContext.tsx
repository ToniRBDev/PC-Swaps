import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Conversation, ConversationMessage } from '../types/conversation';
import {
  ConversationsContext,
  type ConversationsContextValue,
} from './conversationsContextValue';

/**
 * Propiedades del proveedor de conversaciones.
 *
 * Envuelve el arbol de componentes que necesita acceder al estado local de
 * conversaciones.
 */
interface ConversationsProviderProps {
  children: ReactNode;
}

/**
 * Proveedor React para el estado local de conversaciones.
 *
 * Mantiene una copia en memoria de las conversaciones, calcula si existen
 * mensajes sin leer y expone acciones para borrar conversaciones, marcarlas
 * como leidas o anadir mensajes enviados por el usuario.
 *
 * @param props - Propiedades del proveedor.
 * @returns Proveedor del contexto de conversaciones.
 */
export function ConversationsProvider({
  children,
}: ConversationsProviderProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const hasUnreadMessages = conversations.some((conversation) =>
    conversation.mensajes.some(
      (message) => !message.enviadoPorMi && !message.leido
    )
  );

  const value = useMemo<ConversationsContextValue>(
    () => ({
      conversations,
      deleteConversation: (idConversacion) => {
        setConversations((currentConversations) =>
          currentConversations.filter(
            (conversation) => conversation.idConversacion !== idConversacion
          )
        );
      },
      hasUnreadMessages,
      markConversationAsRead: (idConversacion) => {
        setConversations((currentConversations) => {
          const targetConversation = currentConversations.find(
            (conversation) => conversation.idConversacion === idConversacion
          );
          const hasUnreadReceivedMessages = targetConversation?.mensajes.some(
            (message) => !message.enviadoPorMi && !message.leido
          );

          if (!hasUnreadReceivedMessages) {
            return currentConversations;
          }

          return currentConversations.map((conversation) =>
            conversation.idConversacion === idConversacion
              ? {
                  ...conversation,
                  mensajes: conversation.mensajes.map((message) =>
                    message.enviadoPorMi ? message : { ...message, leido: true }
                  ),
                }
              : conversation
          );
        });
      },
      sendMessage: (idConversacion, content) => {
        const now = new Date();
        const newMessage: ConversationMessage = {
          idMensaje: Date.now(),
          contenido: content,
          fecha: `${now.toISOString().slice(0, 10)} ${now
            .toTimeString()
            .slice(0, 5)}`,
          enviadoPorMi: true,
          leido: false,
        };

        setConversations((currentConversations) =>
          currentConversations.map((conversation) =>
            conversation.idConversacion === idConversacion
              ? {
                  ...conversation,
                  mensajes: [...conversation.mensajes, newMessage],
                }
              : conversation
          )
        );
      },
    }),
    [conversations, hasUnreadMessages]
  );

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
}
