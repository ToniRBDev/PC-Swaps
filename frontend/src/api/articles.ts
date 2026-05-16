import { apiRequest } from './client';
import type { EstadoArticulo } from '../types/enums/estado-articulo';

export interface ArticleRequest {
  idCategoria: number;
  marca: string;
  modelo: string;
  estado: EstadoArticulo;
  precio: number;
  descripcion: string;
}

export interface ArticleResponse {
  idArticulo: number;
  vendedor: {
    idUsuario: number;
    nombreUsuario: string;
    imagenUsuario?: string;
  };
  categoria: {
    idCategoria: number;
    nombreCategoria: string;
  };
  marca: string;
  modelo: string;
  estado: EstadoArticulo;
  precio: number;
  descripcion: string;
  imagen: string;
  fechaPublicacion: string;
  numeroVisitas: number;
}

export interface ArticleCardResponse {
  idArticulo: number;
  imagen: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: EstadoArticulo;
}

export function createArticle(article: ArticleRequest, image: File) {
  const formData = new FormData();
  formData.append(
    'articulo',
    new Blob([JSON.stringify(article)], { type: 'application/json' }),
  );
  formData.append('imagen', image);

  return apiRequest<ArticleResponse>('/articulos', {
    body: formData,
    method: 'POST',
  });
}

export function getArticle(idArticulo: number) {
  return apiRequest<ArticleResponse>(`/articulos/${idArticulo}`);
}

export function getArticles() {
  return apiRequest<ArticleCardResponse[]>('/articulos');
}

export function getArticlesByCategory(idCategoria: number) {
  return apiRequest<ArticleCardResponse[]>(`/articulos/categoria/${idCategoria}`);
}

export function getMyArticles() {
  return apiRequest<ArticleCardResponse[]>('/articulos/propios');
}

export function updateArticle(
  idArticulo: number,
  article: ArticleRequest,
  image?: File,
) {
  const formData = new FormData();
  formData.append(
    'articulo',
    new Blob([JSON.stringify(article)], { type: 'application/json' }),
  );

  if (image) {
    formData.append('imagen', image);
  }

  return apiRequest<ArticleResponse>(`/articulos/${idArticulo}`, {
    body: formData,
    method: 'PUT',
  });
}

export function renewArticle(idArticulo: number) {
  return apiRequest<void>(`/articulos/${idArticulo}/renovar`, {
    method: 'PUT',
  });
}

export function deleteArticle(idArticulo: number) {
  return apiRequest<void>(`/articulos/${idArticulo}`, {
    method: 'DELETE',
  });
}
