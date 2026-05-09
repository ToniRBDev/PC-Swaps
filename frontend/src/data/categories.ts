import type { CategoriaSlug } from '../types/product.ts';

export interface Categoria {
  slug: CategoriaSlug;
  nombre: string;
  icono: string;
}

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
