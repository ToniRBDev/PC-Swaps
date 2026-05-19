import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticle } from '../api/articles';
import type { ArticleResponse } from '../api/articles';
import {
  getConversation,
  markConversationAsRead,
  sendConversationMessage,
} from '../api/conversations';
import type {
  ConversationUserResponse,
  ConversationResponse,
  MessageResponse,
} from '../api/conversations';
import { getUserContact } from '../api/users';
import ProductCard from '../components/ui/ProductCard';
import { getOtherConversationUser } from '../utils/conversationUsers';
import { getBackendImageUrl } from '../utils/images';
import { getSessionUserId } from '../utils/session';

interface ChatPageProps {
  isOverlay?: boolean;
}

export default function ChatPage({ isOverlay = false }: ChatPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const idConversacion = Number(id);
  const currentUserId = getSessionUserId();
  const [conversation, setConversation] = useState<ConversationResponse | null>(
    null
  );
  const [article, setArticle] = useState<ArticleResponse | null>(null);
  const [otherUser, setOtherUser] = useState<ConversationUserResponse | null>(
    null
  );
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(Number.isFinite(idConversacion));
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const closeChat = () => {
    if (isOverlay) {
      navigate(-1);
      return;
    }

    navigate('/mis-conversaciones');
  };

  useEffect(() => {
    if (!Number.isFinite(idConversacion)) {
      return;
    }

    getConversation(idConversacion)
      .then(async (loadedConversation) => {
        setConversation(loadedConversation);
        await markConversationAsRead(loadedConversation.idConversacion);

        const otherUserCandidate = getOtherConversationUser(
          loadedConversation,
          currentUserId
        );

        if (otherUserCandidate) {
          try {
            setOtherUser(await getUserContact(otherUserCandidate.idUsuario));
          } catch {
            setOtherUser(otherUserCandidate);
          }
        } else {
          setOtherUser(null);
        }

        try {
          setArticle(await getArticle(loadedConversation.idArticulo));
        } catch {
          setArticle(null);
        }
      })
      .catch((unknownError: unknown) => {
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Conversacion no encontrada'
        );
      })
      .finally(() => setIsLoading(false));
  }, [currentUserId, idConversacion]);

  const handleSendMessage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!conversation || !messageText.trim()) return;

    setIsSending(true);
    setError(null);

    try {
      const message = await sendConversationMessage(
        conversation.idConversacion,
        messageText.trim()
      );
      setConversation((current) =>
        current
          ? { ...current, mensajes: [...current.mensajes, message] }
          : current
      );
      setMessageText('');
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'No se ha podido enviar el mensaje'
      );
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return renderChatShell(
      isOverlay,
      closeChat,
      <main className={`${getChatPanelClassName(isOverlay)} p-8 md:p-12`}>
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight">
          Cargando conversacion...
        </h1>
      </main>,
    );
  }

  if (!conversation || error) {
    return renderChatShell(
      isOverlay,
      closeChat,
      <main className={`${getChatPanelClassName(isOverlay)} p-8 md:p-12`}>
        <button
          onClick={closeChat}
          className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver a mis conversaciones
        </button>
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight">
          {error ?? 'Conversacion no encontrada'}
        </h1>
      </main>,
    );
  }

  const chatContent = (
    <main className={getChatPanelClassName(isOverlay)}>
      <section className="flex-1 flex flex-col bg-[#0e0e0f] relative border-r border-white/5 min-w-0">
        <header className="h-16 md:h-20 flex items-center justify-between px-4 md:px-8 border-b border-white/5 bg-[#131314]">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={closeChat}
              className="text-zinc-500 hover:text-red-600 transition-colors shrink-0"
              title="Volver a mis conversaciones"
              type="button"
            >
              <span className="material-symbols-outlined">
                {isOverlay ? 'close' : 'arrow_back_ios'}
              </span>
            </button>

            <UserAvatar
              image={getBackendImageUrl(otherUser?.imagenUsuario)}
              name={otherUser?.nombreUsuario ?? 'Otro usuario'}
            />

            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-sm tracking-tight text-white truncate">
                {otherUser?.nombreUsuario ?? 'Otro usuario'}
              </span>
              <span className="text-[10px] text-red-600/80 font-bold uppercase tracking-wider">
                {article
                  ? `${article.marca} ${article.modelo}`
                  : `Articulo ${conversation.idArticulo}`}
              </span>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 hidden md:inline">
            {conversation.mensajes.length} mensajes
          </span>
        </header>

        {error && (
          <div className="border-b border-red-900 bg-red-950/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-red-300">
            {error}
          </div>
        )}

        <div className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto flex flex-col gap-5">
          <div className="flex items-center gap-4 opacity-20">
            <div className="flex-1 h-px bg-white" />
            <span className="font-headline text-[10px] tracking-[0.4em] uppercase">
              {formatDate(conversation.fechaInicio)}
            </span>
            <div className="flex-1 h-px bg-white" />
          </div>

          {conversation.mensajes.map((message) => (
            <MessageBubble
              currentUserId={currentUserId}
              key={message.idMensaje}
              message={message}
            />
          ))}
        </div>

        <form
          className="p-4 md:p-6 bg-black border-t border-white/5"
          onSubmit={handleSendMessage}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <input
              className="flex-1 bg-black/50 border border-white/10 py-4 px-6 text-xs font-headline tracking-widest text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-700"
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="ESCRIBE UN MENSAJE..."
              type="text"
              value={messageText}
            />
            <button
              className="bg-red-600 text-black size-14 flex items-center justify-center hover:scale-105 transition-all disabled:opacity-60"
              disabled={isSending}
              type="submit"
            >
              <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </form>
      </section>

      <aside className="w-80 xl:w-96 bg-[#131314] p-6 xl:p-8 hidden lg:block overflow-y-auto">
        <h2 className="font-headline font-black text-[11px] tracking-[0.3em] text-zinc-500 mb-8 uppercase">
          Informacion del articulo
        </h2>
        {article ? (
          <ProductCard
            product={{
              idArticulo: article.idArticulo,
              imagen: getBackendImageUrl(article.imagen) ?? '',
              marca: article.marca,
              modelo: article.modelo,
              precio: article.precio,
              estado: article.estado,
            }}
          />
        ) : (
          <div className="border border-zinc-800 bg-black p-6 text-zinc-500">
            No se ha podido cargar el articulo.
          </div>
        )}
        <div className="mt-12 space-y-4 opacity-30 text-center">
          <div className="font-headline text-[8px] tracking-[0.5em] leading-relaxed">
            CONEXION SEGURA P2P <br />
            ESTADO: ESTABLE <br />
            PC-SWAPS
          </div>
        </div>
      </aside>
    </main>
  );

  return renderChatShell(isOverlay, closeChat, chatContent);
}

function renderChatShell(
  isOverlay: boolean,
  closeChat: () => void,
  content: ReactNode,
) {
  if (!isOverlay) {
    return content;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-3 py-4 backdrop-blur-sm md:px-8"
      onClick={closeChat}
    >
      <div
        className="h-[min(760px,calc(100vh-2rem))] w-full max-w-6xl overflow-hidden border border-white/10 bg-[#0e0e0f] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
}

function getChatPanelClassName(isOverlay: boolean) {
  return isOverlay
    ? 'h-full bg-[#0e0e0f] text-white flex overflow-hidden'
    : 'min-h-screen bg-[#0e0e0f] text-white flex overflow-hidden';
}

interface MessageBubbleProps {
  currentUserId: number | null;
  message: MessageResponse;
}

function MessageBubble({ currentUserId, message }: MessageBubbleProps) {
  const isMine = message.idEmisor === currentUserId;

  return (
    <div
      className={`flex flex-col max-w-[80%] ${
        isMine ? 'self-end' : 'self-start'
      }`}
    >
      <div
        className={`p-5 text-sm leading-relaxed ${
          isMine
            ? 'bg-red-600 text-black font-bold'
            : 'bg-[#201f21] border-l-4 border-red-600/40 text-zinc-300'
        }`}
      >
        {message.contenido}
      </div>
      <span
        className={`mt-2 font-headline text-[9px] tracking-widest uppercase ${
          isMine ? 'self-end text-red-600/70' : 'text-zinc-600'
        }`}
      >
        {formatDateTime(message.fechaEnvio)} -{' '}
        {message.leido ? 'Leido' : 'No leido'}
      </span>
    </div>
  );
}

interface UserAvatarProps {
  image?: string;
  name: string;
}

function UserAvatar({ image, name }: UserAvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();

  if (image) {
    return (
      <img
        alt={name}
        className="size-10 object-cover border border-white/10 bg-zinc-900 shrink-0"
        src={image}
      />
    );
  }

  return (
    <div className="size-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-black text-white shrink-0">
      {initials}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
