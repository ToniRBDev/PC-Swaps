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
  estado: string;
  precio: number;
  descripcion: string;
  imagen: string;
  especificaciones: Record<string, string>;
  fechaPublicacion: string;
}
