import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CategoriaSlug } from '../types/product';
import FollowedProductsSection from '../components/sections/FollowedProductsSection';
import { followedProducts } from '../data/followedProducts';
import { categories } from '../data/categories';
import { products } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

const ITEMS_PER_PAGE = 12;
const PREVIEW_ITEMS = 3;

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaSlug | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory
  )?.nombre;
  const hasActiveFilter = Boolean(selectedCategory || search);
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory
      ? product.categoria === selectedCategory
      : true;
    const matchesSearch = search
      ? [product.marca, product.modelo, product.estado, product.categoria]
          .join(' ')
          .toLowerCase()
          .includes(search)
      : true;

    return matchesCategory && matchesSearch;
  });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const visibleProducts = showAllProducts
    ? filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      )
    : filteredProducts.slice(0, PREVIEW_ITEMS);
  const shouldHideFollowedProducts = hasActiveFilter || showAllProducts;
  const productsTitle = hasActiveFilter
    ? selectedCategoryName || 'Resultados'
    : 'Ultimos articulos subidos';

  const handleSelectCategory = (category: CategoriaSlug) => {
    setSelectedCategory(category);
    setShowAllProducts(false);
    setCurrentPage(1);
  };

  const handleShowAll = () => {
    setShowAllProducts(true);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white">
      <section className="relative bg-black py-24 px-8">
        <div className="max-w-360 mx-auto">
          <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 max-w-4xl leading-none">
            El mercado <span className="text-red-600 italic">vanguardista</span>{' '}
            de hardware
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
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
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
                onClick={() => handleSelectCategory(category.slug)}
                className={`aspect-square w-full flex flex-col items-center justify-center transition-all relative
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
            {productsTitle}
          </h2>

          <div className="flex items-center gap-4">
            {!showAllProducts && filteredProducts.length > PREVIEW_ITEMS && (
              <button
                className="text-red-600 font-bold uppercase text-xs tracking-widest"
                onClick={handleShowAll}
                type="button"
              >
                Ver todo
              </button>
            )}

            <span className="text-xs uppercase tracking-widest text-zinc-500">
              Items: {filteredProducts.length}
            </span>
          </div>
        </div>

        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.idArticulo} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-zinc-500">
            No hay articulos disponibles para esta categoria.
          </p>
        )}

        {showAllProducts && totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-3">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  key={page}
                  className={`size-10 text-sm font-bold ${
                    currentPage === page
                      ? 'bg-red-600 text-white'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                  onClick={() => setCurrentPage(page)}
                  type="button"
                >
                  {page}
                </button>
              )
            )}
          </div>
        )}
      </section>

      {!shouldHideFollowedProducts && (
        <FollowedProductsSection products={followedProducts} />
      )}
    </main>
  );
}
