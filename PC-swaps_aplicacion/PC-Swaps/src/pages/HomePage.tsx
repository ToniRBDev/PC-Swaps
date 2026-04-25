import { useMemo, useState } from 'react';
import CategoryFilter from '../components/filters/CategoryFilter';
import Navbar from '../components/layout/Navbar';
import ProductCard from '../components/ui/ProductCard';
import { products } from '../data/products';
import { categories } from '../data/categories';
import type { CategoriaSlug } from '../types/Product';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaSlug | null>(null);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;

    return products.filter((product) => product.categoria === selectedCategory);
  }, [selectedCategory]);

  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory
  )?.nombre;

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0e0e0f] text-white">
        <section className="relative bg-black py-24 px-8">
          <div className="max-w-360 mx-auto">
            <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 max-w-4xl leading-none">
              El mercado{' '}
              <span className="text-red-600 italic">vanguardista</span> de
              hardware
            </h1>

            <input
              className="w-full max-w-2xl bg-zinc-900 border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 p-4"
              placeholder="BUSCAR COMPONENTES..."
              type="text"
            />
          </div>
        </section>

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <section className="px-8 py-16 max-w-360 mx-auto">
          <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4 mb-12">
            {selectedCategoryName ?? 'Artículos destacados'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
