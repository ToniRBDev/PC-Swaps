import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import BackButton from '../components/ui/BackButton';
import { deleteArticle, getMyArticles, renewArticle } from '../api/articles';
import type { ArticleCardResponse } from '../api/articles';
import { getBackendImageUrl } from '../utils/images';

type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

export default function MyAdsPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification>(null);
  const [ads, setAds] = useState<ArticleCardResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mutatingId, setMutatingId] = useState<number | null>(null);
  const [adToDelete, setAdToDelete] = useState<ArticleCardResponse | null>(
    null
  );

  const loadAds = async () => {
    try {
      setAds(await getMyArticles());
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se han podido cargar tus anuncios',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMyArticles()
      .then((articles) => setAds(articles))
      .catch((error: unknown) => {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar tus anuncios',
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async () => {
    if (!adToDelete) return;

    setMutatingId(adToDelete.idArticulo);
    setNotification(null);

    try {
      await deleteArticle(adToDelete.idArticulo);
      setAds((currentAds) =>
        currentAds.filter((ad) => ad.idArticulo !== adToDelete.idArticulo)
      );
      setNotification({
        type: 'success',
        message: 'Anuncio eliminado correctamente',
      });
      setAdToDelete(null);
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se ha podido eliminar el anuncio',
      });
    } finally {
      setMutatingId(null);
    }
  };

  const handleRenew = async (idArticulo: number) => {
    setMutatingId(idArticulo);
    setNotification(null);

    try {
      await renewArticle(idArticulo);
      await loadAds();
      setNotification({
        type: 'success',
        message: 'Anuncio actualizado correctamente',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se ha podido actualizar el anuncio',
      });
    } finally {
      setMutatingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 lg:px-12 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <header className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-20 bg-red-600" />
          <h1 className="font-headline text-4xl md:text-7xl font-black italic tracking-tighter text-white uppercase mb-2">
            Mis <span className="text-red-600">anuncios</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
              Total: {ads.length}
            </p>
            <div className="h-px flex-1 bg-linear-to-r from-zinc-800 to-transparent" />
          </div>
        </header>

        {notification && (
          <div
            className={`mb-8 border px-5 py-4 text-sm font-bold uppercase tracking-widest ${
              notification.type === 'success'
                ? 'border-green bg-green-600/10 text-green-500'
                : 'border-red-900 bg-red-950/30 text-red-300'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="border border-zinc-800 bg-zinc-950 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
            Mis anuncios ({ads.length})
          </div>

          <Link
            className="inline-flex items-center justify-center gap-2 bg-red-600 px-4 py-3 text-xs font-black uppercase tracking-widest text-black hover:brightness-125 sm:gap-3 sm:px-6 sm:py-4 sm:text-sm"
            to="/publicar-anuncio"
          >
            Publicar nuevo anuncio
            <span className="material-symbols-outlined">add_circle</span>
          </Link>
        </div>

        <section className="space-y-4">
          {isLoading ? (
            <div className="border border-zinc-800 bg-zinc-900/30 p-10 text-zinc-500">
              Cargando anuncios...
            </div>
          ) : ads.length > 0 ? (
            ads.map((ad) => (
              <AdRow
                key={ad.idArticulo}
                ad={ad}
                isMutating={mutatingId === ad.idArticulo}
                onDelete={() => setAdToDelete(ad)}
                onOpen={() => navigate(`/producto/${ad.idArticulo}`)}
                onRenew={() => handleRenew(ad.idArticulo)}
              />
            ))
          ) : (
            <div className="border border-zinc-800 bg-zinc-900/30 p-10 text-zinc-500">
              No hay anuncios en esta categoria.
            </div>
          )}
        </section>
      </div>

      {adToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md border border-neutral-800 bg-[#121212] p-8 shadow-2xl">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-white mb-4">
              Eliminar anuncio
            </h2>
            <p className="text-zinc-400 mb-8">
              Estas seguro de eliminar el anuncio {adToDelete.marca}{' '}
              {adToDelete.modelo}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="border border-neutral-700 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-neutral-900"
                onClick={() => setAdToDelete(null)}
                type="button"
              >
                No
              </button>
              <button
                className="bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500"
                onClick={handleDelete}
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

interface AdRowProps {
  ad: ArticleCardResponse;
  isMutating: boolean;
  onDelete: () => void;
  onOpen: () => void;
  onRenew: () => void;
}

function AdRow({ ad, isMutating, onDelete, onOpen, onRenew }: AdRowProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpen();
    }
  };

  const stopRowNavigation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  return (
    <article
      className="group relative flex cursor-pointer flex-col items-center border bg-zinc-900/30 border-zinc-800 hover:border-red-600/50 transition-all duration-200 focus:outline-none focus:border-red-600 md:flex-row"
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      title="Ver detalle del anuncio"
    >
      <div className="w-full md:w-48 h-32 overflow-hidden bg-black">
        <img
          alt={`${ad.marca} ${ad.modelo}`}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
          src={getBackendImageUrl(ad.imagen)}
        />
      </div>

      <div className="flex-1 w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] tracking-widest uppercase text-red-600">
            ARTICULO_{ad.idArticulo}
          </span>
          <h2 className="font-headline text-xl font-bold tracking-tight uppercase text-white">
            {ad.marca} {ad.modelo}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase text-zinc-500">
            <span className="flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-1">
                memory
              </span>
              {ad.estado}
            </span>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end md:gap-8">
          <div className="text-right">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">
              Precio
            </span>
            <span className="font-headline text-2xl font-black tracking-tighter text-red-600">
              {ad.precio} <span className="text-sm">EUR</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="size-10 sm:size-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
              onClick={stopRowNavigation}
              title="Editar"
              to={`/publicar-anuncio?editar=${ad.idArticulo}`}
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">edit</span>
            </Link>
            <button
              className="size-10 sm:size-12 flex items-center justify-center bg-zinc-800 hover:bg-red-600 hover:text-black transition-colors"
              disabled={isMutating}
              onClick={(event) => {
                stopRowNavigation(event);
                onRenew();
              }}
              title="Renovar"
              type="button"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">sync</span>
            </button>
            <button
              className="size-10 sm:size-12 flex items-center justify-center bg-zinc-800 hover:bg-red-900 transition-colors"
              disabled={isMutating}
              onClick={(event) => {
                stopRowNavigation(event);
                onDelete();
              }}
              title="Eliminar"
              type="button"
            >
              <span className="material-symbols-outlined text-xl sm:text-2xl">delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
