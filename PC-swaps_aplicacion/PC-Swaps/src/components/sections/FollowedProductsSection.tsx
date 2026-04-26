import ProductCard from '../ui/ProductCard';
import type { Product } from '../../types/product';

interface Props {
  products: Product[];
}

export default function FollowedProductsSection({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="px-8 py-16 max-w-360 mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
            Seguimiento
          </h2>
          <p className="text-zinc-500 text-sm mt-2">
            Artículos guardados por el usuario
          </p>
        </div>

        <span className="text-xs uppercase tracking-widest text-zinc-500">
          Items: {products.length}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
