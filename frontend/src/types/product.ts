import type { EstadoArticulo } from './enums/estado-articulo';

// Un slug es una version amigable de una cadena de texto.
export type CategoriaSlug =
  | 'tarjeta-grafica'
  | 'placa-base'
  | 'procesador'
  | 'ram'
  | 'monitor';

export interface ProductCardData {
  idArticulo: number;
  imagen: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: EstadoArticulo;
}

export interface Product extends ProductCardData {
  categoria: CategoriaSlug;
  descripcion: string;
  fechaPublicacion: string;
  numeroVisitas: number;
  fechaUltimaRenovacion?: string;
  activo?: boolean;
  especificaciones: Record<string, string>;
}
