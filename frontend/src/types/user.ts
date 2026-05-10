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
