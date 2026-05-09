import { useState } from 'react';
import CategoryFilter from '../components/filters/CategoryFilter';
import type { CategoriaSlug } from '../types/product';
import FollowedProductsSection from '../components/sections/FollowedProductsSection';
import { followedProducts } from '../data/followedProducts';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaSlug | null>(null);

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

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <FollowedProductsSection products={followedProducts} />
      </main>
    </>
  );
}
