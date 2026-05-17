import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Conversation, ConversationMessage } from '../types/conversation';

interface ConversationsContextValue {
  conversations: Conversation[];
  deleteConversation: (idConversacion: number) => void;
  hasUnreadMessages: boolean;
  markConversationAsRead: (idConversacion: number) => void;
  sendMessage: (idConversacion: number, content: string) => void;
}

const ConversationsContext = createContext<ConversationsContextValue | null>(
  null
);

interface ConversationsProviderProps {
  children: ReactNode;
}

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

export function useConversations() {
  const context = useContext(ConversationsContext);

  if (!context) {
    throw new Error(
      'useConversations must be used within ConversationsProvider'
    );
  }

  return context;
}
