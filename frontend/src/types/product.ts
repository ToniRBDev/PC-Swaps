import type { EstadoArticulo } from './enums/estado-articulo';

/**
 * Identificador legible usado por la interfaz para representar categorias.
 *
 * Un slug permite mapear rutas, filtros y textos visibles sin depender del
 * identificador numerico que utiliza la API.
 */
export type CategoriaSlug =
  | 'tarjeta-grafica'
  | 'placa-base'
  | 'procesador'
  | 'ram'
  | 'monitor';

/**
 * Datos minimos de producto necesarios para renderizar tarjetas y listados.
 */
export interface ProductCardData {
  idArticulo: number;
  imagen: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: EstadoArticulo;
}

/**
 * Modelo completo de producto utilizado por vistas que necesitan detalle.
 *
 * Extiende los datos de tarjeta con categoria, descripcion, metadatos de
 * publicacion y especificaciones tecnicas.
 */
export interface Product extends ProductCardData {
  categoria: CategoriaSlug;
  descripcion: string;
  fechaPublicacion: string;
  numeroVisitas: number;
  fechaUltimaRenovacion?: string;
  activo?: boolean;
  especificaciones: Record<string, string>;
}
