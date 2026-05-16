import type {
  ConversationResponse,
  ConversationUserResponse,
} from '../api/conversations';

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
