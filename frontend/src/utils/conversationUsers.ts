import type {
  ConversationResponse,
  ConversationUserResponse,
} from '../api/conversations';

/**
 * Deduce el usuario contrario al usuario autenticado dentro de una conversacion.
 *
 * @remarks
 * La API puede devolver el participante con distintos nombres de propiedad. La
 * funcion prioriza esos campos explicitos y, si no existen, intenta inferir el
 * usuario a partir del vendedor o de los mensajes.
 *
 * @param conversation - Conversacion recibida desde la API.
 * @param currentUserId - Identificador del usuario autenticado.
 * @returns Usuario contrario o `null` si no se puede deducir.
 */
export function getOtherConversationUser(
  conversation: ConversationResponse,
  currentUserId: number | null,
): ConversationUserResponse | null {
  const explicitUsers = [
    conversation.otroUsuario,
    conversation.comprador,
    conversation.participante,
    conversation.usuario,
  ];

  const explicitOtherUser = explicitUsers.find(
    (user) => user && user.idUsuario !== currentUserId,
  );

  if (explicitOtherUser) {
    return explicitOtherUser;
  }

  if (
    currentUserId === null ||
    conversation.vendedor.idUsuario !== currentUserId
  ) {
    return conversation.vendedor;
  }

  const otherUserMessage = conversation.mensajes.find(
    (message) => message.idEmisor !== currentUserId,
  );

  if (!otherUserMessage) {
    return null;
  }

  return {
    idUsuario: otherUserMessage.idEmisor,
    nombreUsuario: `Usuario ${otherUserMessage.idEmisor}`,
  };
}
