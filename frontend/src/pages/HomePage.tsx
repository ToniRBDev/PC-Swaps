import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CategoriaSlug } from '../types/product';
import FollowedProductsSection from '../components/sections/FollowedProductsSection';
import { categories } from '../data/categories';
import ProductCard from '../components/ui/ProductCard';
import { getArticles, getArticlesByCategory } from '../api/articles';
import type { ArticleCardResponse } from '../api/articles';
import { getCategories } from '../api/categories';
import type { CategoryResponse } from '../api/categories';
import { getFollowedArticles } from '../api/follows';
import { getBackendImageUrl } from '../utils/images';

/**
 * Numero de productos mostrados por pagina cuando el listado completo esta abierto.
 */
const ITEMS_PER_PAGE = 12;

/**
 * Numero de productos visibles en la vista previa de la portada.
 */
const PREVIEW_ITEMS = 3;

/**
 * Terminos que relacionan los slugs locales con nombres de categorias de la API.
 */
const categoryApiTerms: Record<CategoriaSlug, string[]> = {
  'tarjeta-grafica': ['gpu', 'grafica', 'gráfica', 'rtx', 'radeon'],
  'placa-base': ['placa', 'motherboard'],
  procesador: ['cpu', 'ryzen', 'intel', 'procesador'],
  ram: ['ram', 'ddr'],
  monitor: ['monitor', 'pantalla'],
};

/**
 * Estado de notificacion usado para errores de carga o acciones informativas.
 */
type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

/**
 * Pagina principal del marketplace.
 *
 * Carga articulos, categorias y seguimientos del usuario, permite filtrar por
 * categoria o busqueda, y muestra una vista previa paginable de productos.
 *
 * @returns Pantalla de inicio con categorias y articulos.
 */
export default function HomePage() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoriaSlug | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<ArticleCardResponse[]>([]);
  const [apiCategories, setApiCategories] = useState<CategoryResponse[]>([]);
  const [followedProducts, setFollowedProducts] = useState<
    ArticleCardResponse[]
  >([]);
  const [notification, setNotification] = useState<Notification>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingFollowed, setIsLoadingFollowed] = useState(true);
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search')?.trim().toLowerCase() ?? '';

  const loadProducts = async (categoryId?: number) => {
    setIsLoadingProducts(true);
    setNotification(null);

    try {
      const articles =
        typeof categoryId === 'number'
          ? await getArticlesByCategory(categoryId)
          : await getArticles();

      setProducts([...articles].sort((a, b) => b.idArticulo - a.idArticulo));
    } catch (error) {
      setProducts([]);
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se han podido cargar los articulos',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    getCategories()
      .then((loadedCategories) => setApiCategories(loadedCategories))
      .catch((error: unknown) => {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar las categorias',
        });
      });

    getArticles()
      .then((articles) =>
        setProducts(
          [...articles].sort((a, b) => b.idArticulo - a.idArticulo),
        ),
      )
      .catch((error: unknown) => {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar los articulos',
        });
      })
      .finally(() => setIsLoadingProducts(false));

    getFollowedArticles()
      .then((articles) => setFollowedProducts(articles))
      .catch(() => setFollowedProducts([]))
      .finally(() => setIsLoadingFollowed(false));
  }, []);

  const selectedCategoryName = categories.find(
    (category) => category.slug === selectedCategory,
  )?.nombre;
  const hasActiveFilter = Boolean(selectedCategory || search);
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const searchableText = [
          product.marca,
          product.modelo,
          product.estado,
        ]
          .join(' ')
          .toLowerCase();
        const matchesSearch = search ? searchableText.includes(search) : true;

        return matchesSearch;
      }),
    [products, search],
  );
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE),
  );
  const visibleProducts = showAllProducts
    ? filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE,
      )
    : filteredProducts.slice(0, PREVIEW_ITEMS);
  const shouldHideFollowedProducts = hasActiveFilter || showAllProducts;
  const productsTitle = hasActiveFilter
    ? selectedCategoryName || 'Resultados'
    : 'Ultimos articulos subidos';

  const handleSelectCategory = (category: CategoriaSlug) => {
    const apiCategory = findApiCategoryBySlug(apiCategories, category);

    setSelectedCategory(category);
    setShowAllProducts(false);
    setCurrentPage(1);

    if (apiCategory) {
      loadProducts(apiCategory.idCategoria);
      return;
    }

    setProducts([]);
    setNotification({
      type: 'error',
      message: 'No se ha encontrado esta categoria en la API',
    });
    setIsLoadingProducts(false);
  };

  const handleShowAll = () => {
    setShowAllProducts(true);
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white">
      <section className="relative bg-black px-4 py-16 md:px-8 md:py-24">
        <div className="max-w-360 mx-auto">
          <h1 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter mb-8 max-w-4xl leading-none">
            El mercado <span className="text-red-600 italic">vanguardista</span>{' '}
            de hardware
          </h1>
        </div>
      </section>

      <section className="px-4 py-12 md:px-8 md:py-16 max-w-360 mx-auto">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <h2 className="font-headline text-xl md:text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
            Categorias
          </h2>

          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
                loadProducts();
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
                className={`h-32 w-full flex flex-col items-center justify-center transition-all relative md:aspect-square md:h-auto
                  ${isActive ? 'bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800'}`}
                type="button"
              >
                <span className="material-symbols-outlined text-5xl! md:text-7xl! mb-3 md:mb-4 text-red-600">
                  {category.icono}
                </span>

                <span className="font-headline text-[10px] md:text-xs font-bold uppercase tracking-widest text-center px-2 md:px-4">
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

      <section className="px-4 py-12 md:px-8 md:py-16 max-w-360 mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-8 md:mb-12">
          <h2 className="font-headline text-xl md:text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
            {productsTitle}
          </h2>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
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

        {isLoadingProducts ? (
          <p className="text-zinc-500">Cargando articulos...</p>
        ) : visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.idArticulo}
                product={{
                  ...product,
                  imagen: getBackendImageUrl(product.imagen) ?? '',
                }}
              />
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
              ),
            )}
          </div>
        )}
      </section>

      {!shouldHideFollowedProducts && !isLoadingFollowed && (
        <FollowedProductsSection products={followedProducts} />
      )}
    </main>
  );
}

/**
 * Busca la categoria de la API que corresponde a un slug local.
 *
 * @param apiCategories - Categorias recibidas desde el backend.
 * @param slug - Slug local seleccionado en la interfaz.
 * @returns Categoria de la API coincidente o `undefined`.
 */
function findApiCategoryBySlug(
  apiCategories: CategoryResponse[],
  slug: CategoriaSlug,
) {
  const terms = categoryApiTerms[slug];

  return apiCategories.find((category) => {
    const normalizedName = normalizeText(category.nombreCategoria);

    return terms.some((term) => normalizedName.includes(normalizeText(term)));
  });
}

/**
 * Normaliza texto para comparaciones sin acentos ni diferencias de mayusculas.
 *
 * @param value - Texto original.
 * @returns Texto normalizado en minusculas.
 */
function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
