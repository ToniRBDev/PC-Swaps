import type { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 1,
    marca: 'NVIDIA',
    modelo: 'RTX 4090',
    categoria: 'tarjeta-grafica',
    estado: 'Como nuevo',
    precio: 1850,
    descripcion: '...',
    imagen: '/img/rtx.jpg',
    fechaPublicacion: '2025-03-10', // 👈 añadir
    especificaciones: {
      vram: '24GB',
    },
  },
  {
    id: 2,
    marca: 'AMD',
    modelo: 'Ryzen 9 7950X3D',
    categoria: 'procesador',
    estado: 'Nuevo',
    precio: 599,
    descripcion: 'Procesador de alto rendimiento.',
    imagen: '/img/ryzen.jpg',
    fechaPublicacion: '2025-04-15',
    especificaciones: {
      nucleos: '16',
      hilos: '32',
      socket: 'AM5',
    },
  },
];
