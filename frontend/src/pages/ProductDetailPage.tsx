import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { followedProducts } from '../data/followedProducts';
import { products } from '../data/products';
import { sellersByArticleId } from '../data/sellers';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = products.find((p) => p.idArticulo === Number(id));
  const seller = product ? sellersByArticleId[product.idArticulo] : undefined;
  const [isFollowed, setIsFollowed] = useState(() =>
    followedProducts.some((followed) => followed.idArticulo === Number(id))
  );

  if (!product) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/home" className="text-red-600 font-bold uppercase">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-4 md:px-12 py-16">
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

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 bg-black relative group overflow-hidden border-l-4 border-red-600">
            <div className="aspect-square w-full">
              <img
                src={product.imagen}
                alt={`${product.marca} ${product.modelo}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#201f21] p-8 md:p-12 flex flex-col">
            <div className="flex justify-between items-start gap-8 mb-8">
              <div>
                <span className="font-label text-xs text-red-500 tracking-[0.2em] uppercase">
                  {product.categoria}
                </span>
                <h1 className="text-4xl md:text-5xl font-black font-headline uppercase leading-none mt-2 tracking-tighter">
                  {product.marca} {product.modelo}
                </h1>
              </div>

              <div className="text-right shrink-0">
                <span className="font-label text-[10px] text-zinc-500 uppercase block mb-1">
                  Precio
                </span>
                <div className="text-3xl font-headline font-bold text-white">
                  {product.precio} EUR
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-px bg-zinc-700/30 mt-4 mb-8">
              <InfoBox label="Marca" value={product.marca} />
              <InfoBox label="Modelo" value={product.modelo} />
              <InfoBox label="Categoria" value={product.categoria} />
              <InfoBox label="Estado" value={product.estado} />
              <InfoBox label="Publicado" value={product.fechaPublicacion} />
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
                  image={seller?.imagenUsuario}
                  name={seller?.nombreUsuario ?? 'Vendedor'}
                />
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
                    Nombre de usuario
                  </span>
                  <span className="font-headline text-lg font-bold uppercase text-white">
                    {seller?.nombreUsuario ?? 'Vendedor'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <Link
                className="block w-full bg-red-600 text-white text-center font-headline font-bold uppercase py-5 text-sm tracking-widest transition-all hover:bg-red-500 active:scale-[0.98]"
                to={`/chat/${product.idArticulo}`}
              >
                Iniciar chat con el vendedor
              </Link>

              <Link
                className="block w-full border border-zinc-600 text-zinc-200 text-center font-headline font-bold uppercase py-5 text-sm tracking-widest transition-all hover:bg-zinc-800 active:scale-[0.98]"
                to={`/vendedor/${product.idArticulo}`}
              >
                Mostrar informacion del vendedor
              </Link>

              <button
                className="w-full border border-red-600/40 hover:border-red-600 text-red-500 font-headline font-bold uppercase py-5 text-sm tracking-widest transition-all hover:bg-red-600/5 active:scale-[0.98]"
                onClick={() => setIsFollowed((current) => !current)}
                type="button"
              >
                {isFollowed
                  ? 'Eliminar de seguimiento'
                  : 'Anadir a seguimiento'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
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
