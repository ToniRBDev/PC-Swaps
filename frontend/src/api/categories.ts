import { apiRequest } from './client';

/**
 * Categoria disponible para clasificar articulos publicados.
 *
 * Se usa para poblar selectores de categoria y para mostrar la clasificacion
 * asignada a cada articulo.
 */
export interface CategoryResponse {
  idCategoria: number;
  nombreCategoria: string;
}

/**
 * Recupera todas las categorias disponibles para clasificar los articulos.
 *
 * @returns Lista de categorias configuradas en el backend.
 */
export function getCategories() {
  return apiRequest<CategoryResponse[]>('/categorias');
}
