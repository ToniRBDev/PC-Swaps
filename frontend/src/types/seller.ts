/**
 * Datos de contacto de un vendedor.
 *
 * Resume la informacion que puede mostrarse en la pagina publica del vendedor
 * o en vistas relacionadas con un articulo.
 */
export interface SellerContact {
  idUsuario: number;
  nombreUsuario: string;
  correoElectronico?: string;
  direccion?: string;
  numTelefono?: string;
  imagenUsuario?: string;
}
