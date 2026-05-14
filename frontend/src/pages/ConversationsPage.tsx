import { Link } from 'react-router-dom';
import { useState } from 'react';
import { products } from '../data/products';
import type { Conversation } from '../types/conversation';
import { useConversations } from '../context/ConversationsContext';
import { sellersByArticleId } from '../data/sellers';

export default function ConversationsPage() {
  const { conversations, deleteConversation } = useConversations();
  const [conversationToDelete, setConversationToDelete] =
    useState<Conversation | null>(null);
  const unreadMessages = conversations.reduce(
    (total, conversation) =>
      total +
      conversation.mensajes.filter(
        (message) => !message.enviadoPorMi && !message.leido
      ).length,
    0
  );
  const totalMessages = conversations.reduce(
    (total, conversation) => total + conversation.mensajes.length,
    0
  );

  const handleDeleteConversation = () => {
    if (!conversationToDelete) return;

    deleteConversation(conversationToDelete.idConversacion);
    setConversationToDelete(null);
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

        <section className="space-y-4">
          {conversations.length > 0 ? (
            conversations.map((conversation) => {
              const product = products.find(
                (item) => item.idArticulo === conversation.idArticulo
              );
              const seller = sellersByArticleId[conversation.idArticulo];
              const sellerName = seller?.nombreUsuario ?? conversation.vendedor;

              if (!product) return null;

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
                      <img
                        alt={`${product.marca} ${product.modelo}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        src={product.imagen}
                      />
                      {conversation.mensajes.some(
                        (message) => !message.enviadoPorMi && !message.leido
                      ) && (
                        <div className="absolute top-1 left-1 size-3 bg-red-600 rounded-full shadow-[0_0_15px_rgba(235,0,0,0.8)]" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] tracking-widest text-red-600 uppercase">
                          Vendedor
                        </span>
                        <h2 className="font-headline text-xl font-bold text-white tracking-tight">
                          {sellerName}
                        </h2>
                        <SellerAvatar
                          image={seller?.imagenUsuario}
                          name={sellerName}
                        />
                      </div>

                      <h3 className="text-sm text-zinc-300 uppercase font-bold">
                        {product.marca} {product.modelo}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 uppercase tracking-widest">
                        <span>{product.estado}</span>
                        <span>{product.precio} EUR</span>
                        <span>Inicio: {conversation.fechaInicio}</span>
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
          <StatsBox label="Chats activos" value={conversations.length} active />
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
                className="bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500"
                onClick={handleDeleteConversation}
                type="button"
              >
                Si
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

interface SellerAvatarProps {
  image?: string;
  name: string;
}

function SellerAvatar({ image, name }: SellerAvatarProps) {
  const initials = name.slice(0, 2).toUpperCase();

  if (image) {
    return (
      <img
        alt={name}
        className="size-8 object-cover border border-zinc-700 bg-black"
        src={image}
      />
    );
  }

  return (
    <span className="flex size-8 items-center justify-center border border-zinc-700 bg-black text-[10px] font-black text-white">
      {initials}
    </span>
  );
}
