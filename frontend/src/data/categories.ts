import type { CategoriaSlug } from '../types/product.ts';

/**
 * Categoria visible en la navegacion y filtros del marketplace.
 */
export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  icono: string;
}

/**
 * Catalogo local de categorias destacadas por la interfaz.
 *
 * Cada categoria incluye el slug usado por los filtros, el nombre visible y el
 * icono de Material Symbols que representa la categoria.
 */
export const categories: Categoria[] = [
  {
    slug: 'tarjeta-grafica',
    nombre: 'Tarjetas gráficas',
    icono: 'developer_board',
  },
  { slug: 'placa-base', nombre: 'Placas base', icono: 'grid_view' },
  { slug: 'procesador', nombre: 'Procesadores', icono: 'memory' },
  { slug: 'ram', nombre: 'RAM', icono: 'settings_input_component' },
  { slug: 'monitor', nombre: 'Monitores', icono: 'monitor' },
];
