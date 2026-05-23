import { useContext } from 'react';
import { ConversationsContext } from './conversationsContextValue';

/**
 * Hook de acceso al contexto de conversaciones.
 *
 * @returns Valor actual del contexto de conversaciones.
 * @throws Error cuando se usa fuera de {@link ConversationsProvider}.
 */
export function useConversations() {
  const context = useContext(ConversationsContext);

  if (!context) {
    throw new Error(
      'useConversations must be used within ConversationsProvider'
    );
  }

  return context;
}
