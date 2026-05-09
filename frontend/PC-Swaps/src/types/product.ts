import type { EstadoArticulo } from './enums/EstadoArticulo';
// Un Slug es una versión amigable de una cadena de texto.
export type CategoriaSlug =
  | 'tarjeta-grafica'
  | 'placa-base'
  | 'procesador'
  | 'ram'
  | 'monitor';

export interface Product {
  id: number;
  marca: string;
  modelo: string;
  categoria: CategoriaSlug;
  estado: EstadoArticulo;
  precio: number;
  descripcion: string;
  imagen: string;
  fechaPublicacion: string;
  fechaUltimaRenovacion?: string;
  activo?: boolean;
  especificaciones: Record<string, string>;
}
