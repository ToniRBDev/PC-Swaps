import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticle } from '../api/articles';
import type { ArticleResponse } from '../api/articles';
import {
  deleteConversation,
  getMyConversations,
} from '../api/conversations';
import type {
  ConversationResponse,
  ConversationUserResponse,
} from '../api/conversations';
import { getUserContact } from '../api/users';
import { getOtherConversationUser } from '../utils/conversationUsers';
import { getBackendImageUrl } from '../utils/images';
import { getSessionUserId } from '../utils/session';

interface ConversationItem {
  article?: ArticleResponse;
  conversation: ConversationResponse;
  otherUser?: ConversationUserResponse;
}

type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

export default function ConversationsPage() {
  const currentUserId = getSessionUserId();
  const [notification, setNotification] = useState<Notification>(null);
  const [conversationItems, setConversationItems] = useState<
    ConversationItem[]
  >([]);
  const [conversationToDelete, setConversationToDelete] =
    useState<ConversationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getMyConversations()
      .then(async (conversations) => {
        const items = await Promise.all(
          conversations.map(async (conversation) => {
            const otherUserCandidate = getOtherConversationUser(
              conversation,
              currentUserId,
            );
            let otherUser = otherUserCandidate ?? undefined;

            if (otherUserCandidate) {
              try {
                otherUser = await getUserContact(otherUserCandidate.idUsuario);
              } catch {
                otherUser = otherUserCandidate;
              }
            }

            try {
              return {
                conversation,
                otherUser,
                article: await getArticle(conversation.idArticulo),
              };
            } catch {
              return { conversation, otherUser };
            }
          }),
        );

        setConversationItems(items);
      })
      .catch((error: unknown) => {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar tus conversaciones',
        });
      })
      .finally(() => setIsLoading(false));
  }, [currentUserId]);

  const unreadMessages = conversationItems.reduce(
    (total, item) =>
      total +
      item.conversation.mensajes.filter(
        (message) => message.idEmisor !== currentUserId && !message.leido,
      ).length,
    0,
  );
  const totalMessages = conversationItems.reduce(
    (total, item) => total + item.conversation.mensajes.length,
    0,
  );

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    setIsDeleting(true);
    setNotification(null);

    try {
      await deleteConversation(conversationToDelete.idConversacion);
      setConversationItems((current) =>
        current.filter(
          (item) =>
            item.conversation.idConversacion !==
            conversationToDelete.idConversacion,
        ),
      );
      setNotification({
        type: 'success',
        message: 'Conversacion eliminada correctamente',
      });
      setConversationToDelete(null);
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se ha podido eliminar la conversacion',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-6 py-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mb-10 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver a la home
        </Link>

        <header className="mb-12 relative">
          <h1 className="font-headline text-5xl md:text-7xl font-black tracking-tighter text-white uppercase italic leading-none">
            Mis <span className="text-red-600">conversaciones</span>
          </h1>
          <div className="h-1 w-24 bg-red-600 mt-4" />
        </header>

        {notification && (
          <div
            className={`mb-8 border px-5 py-4 text-sm font-bold uppercase tracking-widest ${
              notification.type === 'success'
                ? 'border-green-600 bg-green-600/10 text-green-500'
                : 'border-red-900 bg-red-950/30 text-red-300'
            }`}
          >
            {notification.message}
          </div>
        )}

        <section className="space-y-4">
          {isLoading ? (
            <div className="border border-zinc-800 bg-zinc-900/30 p-10 text-zinc-500">
              Cargando conversaciones...
            </div>
          ) : conversationItems.length > 0 ? (
            conversationItems.map(({ article, conversation, otherUser }) => {
              const hasUnreadMessages = conversation.mensajes.some(
                (message) =>
                  message.idEmisor !== currentUserId && !message.leido,
              );

              return (
                <article
                  key={conversation.idConversacion}
                  className="group bg-[#201f21] hover:bg-[#2c2c2d] transition-all duration-200 hover:border-l-4 hover:border-red-600 flex flex-col md:flex-row items-center justify-between p-4 gap-4 relative"
                >
                  <Link
                    className="flex items-center gap-6 w-full min-w-0"
                    to={`/chat/${conversation.idConversacion}`}
                  >
                    <div className="relative w-24 h-24 bg-black shrink-0 overflow-hidden">
                      {article?.imagen ? (
                        <img
                          alt={`${article.marca} ${article.modelo}`}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                          src={getBackendImageUrl(article.imagen)}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-zinc-700">
                          <span className="material-symbols-outlined text-4xl">
                            memory
                          </span>
                        </div>
                      )}
                      {hasUnreadMessages && (
                        <div className="absolute top-1 left-1 size-3 bg-red-600 rounded-full shadow-[0_0_15px_rgba(235,0,0,0.8)]" />
                      )}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <UserAvatar
                          image={getBackendImageUrl(otherUser?.imagenUsuario)}
                          name={otherUser?.nombreUsuario ?? 'Otro usuario'}
                        />
                        <h2 className="font-headline text-xl font-bold text-white tracking-tight truncate">
                          {otherUser?.nombreUsuario ?? 'Otro usuario'}
                        </h2>
                        <span className="text-[10px] tracking-widest text-red-600 uppercase">
                          #{conversation.idConversacion}
                        </span>
                      </div>

                      <h3 className="font-headline text-xl font-bold text-white tracking-tight uppercase">
                        {article
                          ? `${article.marca} ${article.modelo}`
                          : `Articulo ${conversation.idArticulo}`}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest">
                        {article && <span>{article.estado}</span>}
                        {article && <span>{article.precio} EUR</span>}
                        <span>Inicio: {formatDate(conversation.fechaInicio)}</span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
                    <button
                      className="flex items-center justify-center size-12 bg-zinc-800 hover:bg-red-950 text-white transition-all border border-zinc-700 hover:border-red-600 active:scale-95"
                      onClick={() => setConversationToDelete(conversation)}
                      title="Eliminar conversacion"
                      type="button"
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-800">
              <span className="material-symbols-outlined text-6xl text-zinc-700 mb-4">
                mail_lock
              </span>
              <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-widest">
                Sin conversaciones
              </h2>
              <p className="text-zinc-500 mt-2">
                Tu bandeja de entrada esta vacia por ahora.
              </p>
            </div>
          )}
        </section>

        <section className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsBox
            label="Chats activos"
            value={conversationItems.length}
            active
          />
          <StatsBox label="Mensajes totales" value={totalMessages} />
          <StatsBox label="Pendientes de leer" value={unreadMessages} />
        </section>
      </div>

      {conversationToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md border border-neutral-800 bg-[#121212] p-8 shadow-2xl">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-white mb-4">
              Eliminar conversacion
            </h2>
            <p className="text-zinc-400 mb-8">
              Se eliminaran la conversacion y todos sus mensajes. Estas seguro?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="border border-neutral-700 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-neutral-900"
                onClick={() => setConversationToDelete(null)}
                type="button"
              >
                No
              </button>
              <button
                className="bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500 disabled:opacity-60"
                disabled={isDeleting}
                onClick={handleDeleteConversation}
                type="button"
              >
                {isDeleting ? 'Eliminando...' : 'Si'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

interface StatsBoxProps {
  active?: boolean;
  label: string;
  value: number;
}

function StatsBox({ active = false, label, value }: StatsBoxProps) {
  return (
    <div
      className={`bg-black p-6 border-b-2 ${
        active ? 'border-red-600' : 'border-zinc-800'
      }`}
    >
      <div
        className={`font-headline text-3xl font-black mb-2 ${
          active ? 'text-red-600' : 'text-white'
        }`}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
        {label}
      </div>
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
        className="size-8 object-cover border border-zinc-700 bg-black shrink-0"
        src={image}
      />
    );
  }

  return (
    <span className="flex size-8 shrink-0 items-center justify-center border border-zinc-700 bg-black text-[10px] font-black text-white">
      {initials}
    </span>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}
