import type { CategoriaSlug } from '../../types/product.ts';
import { categories } from '../../data/categories.ts';

interface Props {
  selectedCategory: CategoriaSlug | null;
  onSelectCategory: (category: CategoriaSlug | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onSelectCategory,
}: Props) {
  return (
    <section className="px-8 py-16 max-w-360 mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
          Categorías
        </h2>

        {selectedCategory && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-red-600 font-bold uppercase text-xs tracking-widest"
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
              onClick={() => onSelectCategory(category.slug)}
              className={`aspect-square flex flex-col items-center justify-center transition-all relative
                ${isActive ? 'bg-zinc-800' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <span className="material-symbols-outlined text-5xl mb-4 text-red-600">
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
  );
}
