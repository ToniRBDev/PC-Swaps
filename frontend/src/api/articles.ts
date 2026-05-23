import { apiRequest } from './client';
import type { EstadoArticulo } from '../types/enums/estado-articulo';

/**
 * Datos necesarios para crear o actualizar un articulo.
 *
 * Contiene la informacion editable del anuncio, sin incluir la imagen porque se
 * envia como archivo separado cuando el endpoint usa `FormData`.
 */
export interface ArticleRequest {
  idCategoria: number;
  marca: string;
  modelo: string;
  estado: EstadoArticulo;
  precio: number;
  descripcion: string;
}

/**
 * Detalle completo de un articulo devuelto por el backend.
 *
 * Se usa en la vista de detalle del producto y contiene tanto la informacion
 * del anuncio como datos relacionados del vendedor y la categoria.
 */
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

/**
 * Version resumida de un articulo para listados y tarjetas.
 *
 * Reduce el contrato del articulo a los campos necesarios para pintar grids,
 * secciones de destacados y tarjetas de producto.
 */
export interface ArticleCardResponse {
  idArticulo: number;
  imagen: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: EstadoArticulo;
}

/**
 * Crea un articulo nuevo enviando sus datos y la imagen en multipart/form-data.
 *
 * @remarks
 * El backend espera el JSON del articulo en el campo `articulo` y el archivo en
 * el campo `imagen`.
 *
 * @param article - Datos del articulo que se quiere publicar.
 * @param image - Imagen principal del articulo.
 * @returns Articulo creado con todos sus datos.
 */
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

/**
 * Recupera el detalle completo de un articulo por su identificador.
 *
 * @param idArticulo - Identificador del articulo.
 * @returns Detalle completo del articulo solicitado.
 */
export function getArticle(idArticulo: number) {
  return apiRequest<ArticleResponse>(`/articulos/${idArticulo}`);
}

/**
 * Obtiene todos los articulos disponibles para mostrarlos como tarjetas.
 *
 * @returns Lista de articulos en formato resumido.
 */
export function getArticles() {
  return apiRequest<ArticleCardResponse[]>('/articulos');
}

/**
 * Obtiene los articulos filtrados por categoria.
 *
 * @param idCategoria - Identificador de la categoria usada como filtro.
 * @returns Lista de articulos de la categoria indicada.
 */
export function getArticlesByCategory(idCategoria: number) {
  return apiRequest<ArticleCardResponse[]>(`/articulos/categoria/${idCategoria}`);
}

/**
 * Recupera los articulos publicados por el usuario autenticado.
 *
 * @returns Lista de articulos propios en formato resumido.
 */
export function getMyArticles() {
  return apiRequest<ArticleCardResponse[]>('/articulos/propios');
}

/**
 * Actualiza un articulo existente y, si se proporciona, reemplaza su imagen.
 *
 * @remarks
 * Igual que en la creacion, el backend recibe un `FormData` con el JSON en
 * `articulo`. La imagen es opcional para permitir editar datos sin cambiarla.
 *
 * @param idArticulo - Identificador del articulo que se actualiza.
 * @param article - Nuevos datos del articulo.
 * @param image - Nueva imagen principal, si se quiere reemplazar la actual.
 * @returns Articulo actualizado.
 */
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

/**
 * Renueva un articulo para volver a destacarlo o actualizar su publicacion.
 *
 * @param idArticulo - Identificador del articulo que se renueva.
 */
export function renewArticle(idArticulo: number) {
  return apiRequest<void>(`/articulos/${idArticulo}/renovar`, {
    method: 'PUT',
  });
}

/**
 * Elimina un articulo publicado por el usuario autenticado.
 *
 * @param idArticulo - Identificador del articulo que se elimina.
 */
export function deleteArticle(idArticulo: number) {
  return apiRequest<void>(`/articulos/${idArticulo}`, {
    method: 'DELETE',
  });
}
