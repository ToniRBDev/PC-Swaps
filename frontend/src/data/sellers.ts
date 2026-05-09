import type { SellerContact } from '../types/seller';

export const sellersByArticleId: Record<number, SellerContact> = {
  1: {
    idUsuario: 10,
    nombreUsuario: 'HardwareTony',
    correoElectronico: 'hardwaretony@example.com',
    direccion: 'Madrid',
    numTelefono: '+34 600 000 000',
    imagenUsuario: '',
  },
  2: {
    idUsuario: 11,
    nombreUsuario: 'RyzenMaster',
    correoElectronico: 'ryzenmaster@example.com',
    direccion: '',
    numTelefono: '+34 611 111 111',
    imagenUsuario: '',
  },
};
