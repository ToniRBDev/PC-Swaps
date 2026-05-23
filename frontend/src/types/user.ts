/**
 * Perfil completo del usuario autenticado.
 *
 * Agrupa los datos personales, credenciales visibles y campos opcionales de
 * contacto que se muestran o editan en la pantalla de perfil.
 */
export interface UserProfile {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  dni: string;
  correoElectronico: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  direccion?: string;
  numTelefono?: string;
  imagenUsuario?: string;
}
