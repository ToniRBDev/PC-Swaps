import type { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 1,
    marca: 'NVIDIA',
    modelo: 'RTX 4090',
    categoria: 'tarjeta-grafica',
    estado: 'COMO_NUEVO',
    precio: 1850,
    descripcion: '...',
    imagen: '/img/rtx.jpg',
    fechaPublicacion: '2025-03-10', // 👈 añadir
  },
  {
    id: 2,
    marca: 'AMD',
    modelo: 'Ryzen 9 7950X3D',
    categoria: 'procesador',
    estado: 'NUEVO_CON_ETIQUETAS',
    precio: 599,
    descripcion: 'Procesador de alto rendimiento.',
    imagen: '/img/ryzen.jpg',
    fechaPublicacion: '2025-04-15',
  },
];
