import type { Product } from '../../types/Product';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  return (
    <article className="group bg-zinc-900 relative flex flex-col transition-all hover:bg-zinc-800">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="aspect-4/5 overflow-hidden bg-black">
        <img
          src={product.imagen}
          alt={product.modelo}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
        />
      </div>

      <div className="p-6 flex flex-col grow">
        <div className="flex items-start mb-2">
          <div className="w-1 h-6 bg-red-600 mr-2" />

          <h3 className="font-headline font-bold uppercase tracking-tight text-lg">
            {product.modelo}
          </h3>
        </div>

        <p className="text-zinc-400 text-sm line-clamp-2 mb-6">
          {product.descripcion}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <span className="text-2xl font-black text-white font-headline tracking-tighter">
            {product.precio}€
          </span>

          <Link
            to={`/producto/${product.id}`}
            className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-500"
          >
            Ver artículo
          </Link>
        </div>
      </div>
    </article>
  );
}
