import { apiRequest } from './client';
import type { ArticleCardResponse } from './articles';

export function getFollowedArticles() {
  return apiRequest<ArticleCardResponse[]>('/seguimientos');
}

export function followArticle(idArticulo: number) {
  return apiRequest<void>(`/seguimientos/${idArticulo}`, {
    method: 'POST',
  });
}

export function unfollowArticle(idArticulo: number) {
  return apiRequest<void>(`/seguimientos/${idArticulo}`, {
    method: 'DELETE',
  });
}
