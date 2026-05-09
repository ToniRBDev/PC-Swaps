import { useState } from 'react';
import type { CategoriaSlug } from '../types/product';
import FollowedProductsSection from '../components/sections/FollowedProductsSection';
import { followedProducts } from '../data/followedProducts';
import { categories } from '../data/categories';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaSlug | null>(null);
  const visibleProducts = selectedCategory
    ? products.filter((product) => product.categoria === selectedCategory)
    : products;

  return (
    <>
      <main className="min-h-screen bg-[#0e0e0f] text-white">
        <section className="relative bg-black py-24 px-8">
          <div className="max-w-360 mx-auto">
            <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 max-w-4xl leading-none">
              El mercado{' '}
              <span className="text-red-600 italic">vanguardista</span> de
              hardware
            </h1>
          </div>
        </section>

        <section className="px-8 py-16 max-w-360 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
              Categorias
            </h2>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-red-600 font-bold uppercase text-xs tracking-widest"
                type="button"
              >
                Ver todo
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-px bg-zinc-800/40">
            {categories.map((category) => {
              const isActive = selectedCategory === category.slug;

              return (
                <button
                  key={category.slug}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`aspect-square  w-full flex flex-col items-center justify-center transition-all relative
                    ${isActive ? 'bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                  type="button"
                >
                  <span className="material-symbols-outlined text-7xl! mb-4 text-red-600">
                    {category.icono}
                  </span>

                  <span className="font-headline text-xs font-bold uppercase tracking-widest text-center px-4">
                    {category.nombre}
                  </span>

                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-red-600" />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-8 py-16 max-w-360 mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
              Últimos articulos subidos
            </h2>

            <span className="text-xs uppercase tracking-widest text-zinc-500">
              Items: {visibleProducts.length}
            </span>
          </div>

          {visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-zinc-500">
              No hay articulos disponibles para esta categoria.
            </p>
          )}
        </section>

        <FollowedProductsSection products={followedProducts} />
      </main>
    </>
  );
}
