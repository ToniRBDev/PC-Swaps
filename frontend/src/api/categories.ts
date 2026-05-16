import { apiRequest } from './client';

export interface CategoryResponse {
  idCategoria: number;
  nombreCategoria: string;
}

export function getCategories() {
  return apiRequest<CategoryResponse[]>('/categorias');
}
