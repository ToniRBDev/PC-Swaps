import { apiRequest } from './client';
import type { ArticleCardResponse } from './articles';

/**
 * Obtiene los articulos que sigue el usuario autenticado.
 *
 * @returns Lista de articulos seguidos en formato de tarjeta.
 */
export function getFollowedArticles() {
  return apiRequest<ArticleCardResponse[]>('/seguimientos');
}

/**
 * Anade un articulo a la lista de seguimientos del usuario.
 *
 * @param idArticulo - Identificador del articulo que se quiere seguir.
 */
export function followArticle(idArticulo: number) {
  return apiRequest<void>(`/seguimientos/${idArticulo}`, {
    method: 'POST',
  });
}

/**
 * Quita un articulo de la lista de seguimientos del usuario.
 *
 * @param idArticulo - Identificador del articulo que se quiere dejar de seguir.
 */
export function unfollowArticle(idArticulo: number) {
  return apiRequest<void>(`/seguimientos/${idArticulo}`, {
    method: 'DELETE',
  });
}
