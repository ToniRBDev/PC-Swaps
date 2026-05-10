import { Link } from 'react-router-dom';
import { useState } from 'react';
import BackButton from '../components/ui/BackButton';
import { products } from '../data/products';
import type { Product } from '../types/product';

type AdStatus = 'active' | 'expired';

interface UserAd extends Product {
  status: AdStatus;
}

const initialAds: UserAd[] = [
  { ...products[0], status: 'active', fechaUltimaRenovacion: '2026-05-01' },
  { ...products[1], status: 'active', fechaUltimaRenovacion: '2026-05-03' },
  {
    idArticulo: 99,
    marca: 'ASUS',
    modelo: 'ROG Swift 27',
    categoria: 'monitor',
    estado: 'BUENO',
    precio: 290,
    descripcion: 'Monitor gaming con buen estado general.',
    imagen: '/img/monitor.jpg',
    fechaPublicacion: '2026-03-12',
    fechaUltimaRenovacion: '2026-03-22',
    numeroVisitas: 41,
    especificaciones: {
      pulgadas: '27',
      resolucion: '1440p',
      refresco: '165 Hz',
    },
    status: 'expired',
  },
];

export default function MyAdsPage() {
  const [selectedStatus, setSelectedStatus] = useState<AdStatus>('active');
  const [ads, setAds] = useState<UserAd[]>(initialAds);
  const [adToDelete, setAdToDelete] = useState<UserAd | null>(null);
  const activeAds = ads.filter((ad) => ad.status === 'active');
  const expiredAds = ads.filter((ad) => ad.status === 'expired');
  const visibleAds = selectedStatus === 'active' ? activeAds : expiredAds;

  const handleDelete = () => {
    if (!adToDelete) return;

    setAds((currentAds) =>
      currentAds.filter((ad) => ad.idArticulo !== adToDelete.idArticulo)
    );
    setAdToDelete(null);
  };

  const handleRenew = (idArticulo: number) => {
    const today = new Date().toISOString().slice(0, 10);

    setAds((currentAds) =>
      currentAds.map((ad) =>
        ad.idArticulo === idArticulo
          ? { ...ad, status: 'active', fechaUltimaRenovacion: today }
          : ad
      )
    );
    setSelectedStatus('active');
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 lg:px-12 py-12">
      <div className="max-w-7xl mx-auto">
        <BackButton />

        <header className="mb-10 relative">
          <div className="absolute -left-4 top-0 w-1 h-20 bg-red-600" />
          <h1 className="font-headline text-5xl md:text-7xl font-black italic tracking-tighter text-white uppercase mb-2">
            Mis <span className="text-red-600">anuncios</span>
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-xs tracking-[0.3em] text-zinc-500 uppercase">
              Activos: {activeAds.length} / Expirados: {expiredAds.length}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
        </header>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex border border-zinc-800 bg-zinc-950">
            <StatusButton
              count={activeAds.length}
              isActive={selectedStatus === 'active'}
              label="Activos"
              onClick={() => setSelectedStatus('active')}
            />
            <StatusButton
              count={expiredAds.length}
              isActive={selectedStatus === 'expired'}
              label="Expirados"
              onClick={() => setSelectedStatus('expired')}
            />
          </div>

          <Link
            className="inline-flex items-center justify-center gap-3 bg-red-600 px-6 py-4 text-sm font-black uppercase tracking-widest text-black hover:brightness-125"
            to="/publicar-anuncio"
          >
            Publicar nuevo anuncio
            <span className="material-symbols-outlined">add_circle</span>
          </Link>
        </div>

        <section className="space-y-4">
          {visibleAds.length > 0 ? (
            visibleAds.map((ad) => (
              <AdRow
                key={ad.idArticulo}
                ad={ad}
                onDelete={() => setAdToDelete(ad)}
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

interface StatusButtonProps {
  count: number;
  isActive: boolean;
  label: string;
  onClick: () => void;
}

function StatusButton({ count, isActive, label, onClick }: StatusButtonProps) {
  return (
    <button
      className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
        isActive
          ? 'bg-red-600 text-black'
          : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
      }`}
      onClick={onClick}
      type="button"
    >
      {label} ({count})
    </button>
  );
}

interface AdRowProps {
  ad: UserAd;
  onDelete: () => void;
  onRenew: () => void;
}

function AdRow({ ad, onDelete, onRenew }: AdRowProps) {
  const isExpired = ad.status === 'expired';

  return (
    <article
      className={`group relative flex flex-col md:flex-row items-center border transition-all duration-200 ${
        isExpired
          ? 'bg-zinc-900/10 border-dashed border-zinc-800 opacity-70 hover:opacity-100'
          : 'bg-zinc-900/30 border-zinc-800 hover:border-red-600/50'
      }`}
    >
      <div
        className={`w-full md:w-48 h-32 overflow-hidden bg-black ${
          isExpired ? 'grayscale' : ''
        }`}
      >
        <img
          alt={`${ad.marca} ${ad.modelo}`}
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-transform duration-500"
          src={ad.imagen}
        />
      </div>

      <div className="flex-1 w-full p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span
            className={`text-[10px] tracking-widest uppercase ${
              isExpired ? 'text-zinc-600' : 'text-red-600'
            }`}
          >
            ARTICULO_{ad.idArticulo}
          </span>
          <h2
            className={`font-headline text-xl font-bold tracking-tight uppercase ${
              isExpired ? 'text-zinc-500' : 'text-white'
            }`}
          >
            {ad.marca} {ad.modelo}
          </h2>
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase ${
              isExpired ? 'text-zinc-700' : 'text-zinc-500'
            }`}
          >
            <span className="flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-1">
                category
              </span>
              {ad.categoria}
            </span>
            <span className="flex items-center">
              <span className="material-symbols-outlined text-[14px] mr-1">
                event
              </span>
              {ad.fechaUltimaRenovacion ?? ad.fechaPublicacion}
            </span>
            {isExpired && (
              <span className="flex items-center text-red-900">
                <span className="material-symbols-outlined text-[14px] mr-1">
                  warning
                </span>
                Expirado
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-8">
          <div className="text-right">
            <span className="block text-[10px] text-zinc-500 uppercase tracking-widest">
              Precio
            </span>
            <span
              className={`font-headline text-2xl font-black tracking-tighter ${
                isExpired ? 'text-zinc-600' : 'text-red-600'
              }`}
            >
              {ad.precio} <span className="text-sm">EUR</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="size-12 flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 transition-colors"
              title="Editar"
              to={`/publicar-anuncio?editar=${ad.idArticulo}`}
            >
              <span className="material-symbols-outlined">edit</span>
            </Link>
            <button
              className={`size-12 flex items-center justify-center transition-colors ${
                isExpired
                  ? 'bg-red-600 text-black hover:brightness-125'
                  : 'bg-zinc-800 hover:bg-red-600 hover:text-black'
              }`}
              onClick={onRenew}
              title="Renovar"
              type="button"
            >
              <span className="material-symbols-outlined">sync</span>
            </button>
            <button
              className="size-12 flex items-center justify-center bg-zinc-800 hover:bg-red-900 transition-colors"
              onClick={onDelete}
              title="Eliminar"
              type="button"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
