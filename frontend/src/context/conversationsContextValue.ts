import { createContext } from 'react';
import type { Conversation } from '../types/conversation';

export interface ConversationsContextValue {
  conversations: Conversation[];
  deleteConversation: (idConversacion: number) => void;
  hasUnreadMessages: boolean;
  markConversationAsRead: (idConversacion: number) => void;
  sendMessage: (idConversacion: number, content: string) => void;
}

export const ConversationsContext =
  createContext<ConversationsContextValue | null>(null);
