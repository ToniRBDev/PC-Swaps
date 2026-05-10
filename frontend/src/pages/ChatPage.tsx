import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import type { ConversationMessage } from '../types/conversation';
import { useConversations } from '../context/ConversationsContext';

export default function ChatPage() {
  const { id } = useParams();
  const { conversations, markConversationAsRead, sendMessage } =
    useConversations();
  const conversation = conversations.find(
    (item) =>
      item.idConversacion === Number(id) || item.idArticulo === Number(id)
  );
  const product = products.find(
    (item) => item.idArticulo === conversation?.idArticulo
  );
  const [messageText, setMessageText] = useState('');
  const messages = conversation?.mensajes ?? [];

  useEffect(() => {
    if (conversation) {
      markConversationAsRead(conversation.idConversacion);
    }
  }, [conversation?.idConversacion, markConversationAsRead]);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!conversation || !messageText.trim()) return;

    sendMessage(conversation.idConversacion, messageText.trim());
    setMessageText('');
  };

  if (!conversation || !product) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-16">
        <Link
          to="/mis-conversaciones"
          className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver a mis conversaciones
        </Link>
        <h1 className="font-headline text-4xl font-black uppercase tracking-tight">
          Conversacion no encontrada
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white flex overflow-hidden">
      <section className="flex-1 flex flex-col bg-[#0e0e0f] relative border-r border-white/5 min-w-0">
        <header className="h-20 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-[#131314]">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              to="/mis-conversaciones"
              className="text-zinc-500 hover:text-red-600 transition-colors shrink-0"
              title="Volver a mis conversaciones"
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </Link>

            <div className="size-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-sm font-black text-white shrink-0">
              {conversation.vendedor.slice(0, 2).toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-headline font-bold text-sm tracking-tight text-white truncate">
                {conversation.vendedor}
              </span>
              <span className="text-[10px] text-red-600/80 font-bold uppercase tracking-wider">
                Conversacion sobre {product.marca} {product.modelo}
              </span>
            </div>
          </div>

          <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 hidden md:inline">
            {messages.length} mensajes
          </span>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          <div className="flex items-center gap-4 opacity-20">
            <div className="flex-1 h-px bg-white" />
            <span className="font-headline text-[10px] tracking-[0.4em] uppercase">
              {conversation.fechaInicio}
            </span>
            <div className="flex-1 h-px bg-white" />
          </div>

          {messages.map((message) => (
            <MessageBubble key={message.idMensaje} message={message} />
          ))}
        </div>

        <form
          className="p-6 md:p-8 bg-black border-t border-white/5"
          onSubmit={handleSendMessage}
        >
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className="material-symbols-outlined text-zinc-500 hover:text-red-600 transition-colors"
              type="button"
            >
              attach_file
            </button>
            <input
              className="flex-1 bg-black/50 border border-white/10 py-4 px-6 text-xs font-headline tracking-widest text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-700"
              onChange={(event) => setMessageText(event.target.value)}
              placeholder="ESCRIBE UN MENSAJE..."
              type="text"
              value={messageText}
            />
            <button
              className="bg-red-600 text-black size-14 flex items-center justify-center hover:scale-105 transition-all"
              type="submit"
            >
              <span className="material-symbols-outlined font-black">send</span>
            </button>
          </div>
        </form>
      </section>

      <aside className="w-96 bg-[#131314] p-8 hidden lg:block overflow-y-auto">
        <h2 className="font-headline font-black text-[11px] tracking-[0.3em] text-zinc-500 mb-8 uppercase">
          Informacion del articulo
        </h2>
        <ProductCard product={product} />
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
}

interface MessageBubbleProps {
  message: ConversationMessage;
}

function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div
      className={`flex flex-col max-w-[80%] ${
        message.enviadoPorMi ? 'self-end' : 'self-start'
      }`}
    >
      <div
        className={`p-5 text-sm leading-relaxed ${
          message.enviadoPorMi
            ? 'bg-red-600 text-black font-bold'
            : 'bg-[#201f21] border-l-4 border-red-600/40 text-zinc-300'
        }`}
      >
        {message.contenido}
      </div>
      <span
        className={`mt-2 font-headline text-[9px] tracking-widest uppercase ${
          message.enviadoPorMi
            ? 'self-end text-red-600/70'
            : 'text-zinc-600'
        }`}
      >
        {message.fecha} - {message.leido ? 'Leido' : 'No leido'}
      </span>
    </div>
  );
}
