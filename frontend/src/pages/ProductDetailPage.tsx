import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getArticle } from '../api/articles';
import type { ArticleResponse } from '../api/articles';
import { getMyConversations, startConversation } from '../api/conversations';
import {
  followArticle,
  getFollowedArticles,
  unfollowArticle,
} from '../api/follows';
import { getBackendImageUrl } from '../utils/images';
import { getSessionUserId } from '../utils/session';

type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

export default function ProductDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const idArticulo = Number(id);
  const isValidArticleId = Number.isFinite(idArticulo);
  const currentUserId = getSessionUserId();
  const [product, setProduct] = useState<ArticleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(isValidArticleId);
  const [error, setError] = useState<string | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isFollowStatusLoading, setIsFollowStatusLoading] = useState(true);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [isUpdatingFollow, setIsUpdatingFollow] = useState(false);
  const [notification, setNotification] = useState<Notification>(null);
  const isOwnProduct =
    Boolean(product?.vendedor.idUsuario) &&
    product?.vendedor.idUsuario === currentUserId;

  useEffect(() => {
    if (!isValidArticleId) {
      return;
    }

    getArticle(idArticulo)
      .then((article) => setProduct(article))
      .catch((unknownError: unknown) => {
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Producto no encontrado',
        );
      })
      .finally(() => setIsLoading(false));

    getFollowedArticles()
      .then((articles) =>
        setIsFollowed(
          articles.some((article) => article.idArticulo === idArticulo),
        ),
      )
      .catch(() => setIsFollowed(false))
      .finally(() => setIsFollowStatusLoading(false));
  }, [idArticulo, isValidArticleId]);

  const handleStartChat = async () => {
    setIsStartingChat(true);
    setNotification(null);

    try {
      const conversation = await startConversation(idArticulo);
      navigate(`/chat/${conversation.idConversacion}`, {
        state: { backgroundLocation: location },
      });
    } catch (unknownError) {
      try {
        const conversations = await getMyConversations();
        const existingConversation = conversations.find(
          (conversation) => conversation.idArticulo === idArticulo,
        );

        if (existingConversation) {
          navigate(`/chat/${existingConversation.idConversacion}`, {
            state: { backgroundLocation: location },
          });
          return;
        }
      } catch {
        // Preserve the original error below.
      }

      setNotification({
        type: 'error',
        message:
          unknownError instanceof Error
            ? unknownError.message
            : 'No se ha podido iniciar el chat',
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  const handleToggleFollow = async () => {
    const nextFollowState = !isFollowed;

    setIsFollowed(nextFollowState);
    setIsUpdatingFollow(true);
    setNotification(null);

    try {
      if (!nextFollowState) {
        await unfollowArticle(idArticulo);
        setNotification({
          type: 'success',
          message: 'Articulo eliminado de seguimiento',
        });
      } else {
        await followArticle(idArticulo);
        setNotification({
          type: 'success',
          message: 'Articulo añadido a seguimiento',
        });
      }
    } catch (unknownError) {
      setIsFollowed(!nextFollowState);
      setNotification({
        type: 'error',
        message:
          unknownError instanceof Error
            ? unknownError.message
            : 'No se ha podido actualizar el seguimiento',
      });
    } finally {
      setIsUpdatingFollow(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <h1 className="text-3xl font-bold mb-4">Cargando producto...</h1>
      </main>
    );
  }

  if (!product || error || !isValidArticleId) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <h1 className="text-3xl font-bold mb-4">
          {error ?? 'Producto no encontrado'}
        </h1>
        <Link to="/home" className="text-red-600 font-bold uppercase">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-4 md:px-12 py-10 md:py-16">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver al marketplace
        </Link>

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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 bg-black relative group overflow-hidden border-l-4 border-red-600">
            <div className="aspect-square w-full">
              <img
                src={getBackendImageUrl(product.imagen)}
                alt={`${product.marca} ${product.modelo}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#201f21] p-5 sm:p-8 md:p-12 flex flex-col">
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start sm:gap-8 mb-8">
              <div>
                <span className="font-label text-xs text-red-500 tracking-[0.2em] uppercase">
                  {product.categoria.nombreCategoria}
                </span>
                <h1 className="text-3xl md:text-5xl font-black font-headline uppercase leading-none mt-2 tracking-tighter">
                  {product.marca} {product.modelo}
                </h1>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="font-label text-[10px] text-zinc-500 uppercase block mb-1">
                  Precio
                </span>
                <div className="text-2xl sm:text-3xl font-headline font-bold text-white">
                  {product.precio} EUR
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-700/30 mt-4 mb-8">
              <InfoBox label="Marca" value={product.marca} />
              <InfoBox label="Modelo" value={product.modelo} />
              <InfoBox
                label="Categoria"
                value={product.categoria.nombreCategoria}
              />
              <InfoBox label="Estado" value={product.estado} />
              <InfoBox
                label="Publicado"
                value={formatDate(product.fechaPublicacion)}
              />
              <InfoBox label="Visitas" value={product.numeroVisitas} />
            </div>

            <div className="mb-10">
              <h2 className="text-xs text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-red-600" />
                Descripcion del vendedor
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {product.descripcion}
              </p>
            </div>
            <div className="mb-10">
              <h2 className="text-xs text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-red-600" />
                Vendedor
              </h2>
              <div className="flex items-center gap-4 bg-[#131314] p-4 border-l-2 border-red-600">
                <SellerAvatar
                  image={getBackendImageUrl(product.vendedor.imagenUsuario)}
                  name={product.vendedor.nombreUsuario}
                />
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    Nombre de usuario
                  </span>
                  <span className="font-headline text-lg font-bold uppercase text-white">
                    {product.vendedor.nombreUsuario}
                  </span>
                </div>
              </div>
            </div>

            {!isOwnProduct && (
              <div className="mt-auto space-y-4">
                <button
                  className="block w-full bg-red-600 text-white text-center font-headline font-bold uppercase py-3.5 text-xs tracking-wider transition-all hover:bg-red-500 active:scale-[0.98] sm:py-5 sm:text-sm sm:tracking-widest"
                  disabled={isStartingChat}
                  onClick={handleStartChat}
                  type="button"
                >
                  {isStartingChat
                    ? 'Iniciando chat...'
                    : 'Iniciar chat con el vendedor'}
                </button>

                <Link
                  className="block w-full border border-zinc-600 text-zinc-200 text-center font-headline font-bold uppercase py-3.5 text-xs tracking-wider transition-all hover:bg-zinc-800 active:scale-[0.98] sm:py-5 sm:text-sm sm:tracking-widest"
                  to={`/vendedor/${product.vendedor.idUsuario}?producto=${product.idArticulo}`}
                >
                  Mostrar informacion del vendedor
                </Link>

                <button
                  className="w-full border border-red-600/40 hover:border-red-600 text-red-500 font-headline font-bold uppercase py-3.5 text-xs tracking-wider transition-all hover:bg-red-600/5 active:scale-[0.98] sm:py-5 sm:text-sm sm:tracking-widest"
                  disabled={isFollowStatusLoading || isUpdatingFollow}
                  onClick={handleToggleFollow}
                  type="button"
                >
                  {isFollowStatusLoading
                    ? 'Cargando seguimiento...'
                    : isUpdatingFollow
                    ? 'Actualizando seguimiento...'
                    : isFollowed
                    ? 'Eliminar de seguimiento'
                    : 'Anadir a seguimiento'}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

interface InfoBoxProps {
  label: string;
  value: string | number;
}

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="bg-[#131314] p-4">
      <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-sm font-semibold uppercase text-zinc-100">
        {value}
      </span>
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
        className="size-14 object-cover border border-zinc-700 bg-black"
        src={image}
      />
    );
  }

  return (
    <span className="flex size-14 items-center justify-center border border-zinc-700 bg-black text-sm font-black text-white">
      {initials}
    </span>
  );
}
