import type { Conversation } from '../types/conversation';

export const conversations: Conversation[] = [
  {
    idConversacion: 1,
    idArticulo: 1,
    vendedor: 'HardwareTony',
    fechaInicio: '2026-05-02',
    mensajes: [
      {
        idMensaje: 1,
        contenido: 'Hola, sigue disponible la RTX 4090?',
        fecha: '2026-05-02 14:02',
        enviadoPorMi: true,
        leido: true,
      },
      {
        idMensaje: 2,
        contenido: 'Si, sigue disponible. Esta como nueva y con caja original.',
        fecha: '2026-05-02 14:07',
        enviadoPorMi: false,
        leido: true,
      },
      {
        idMensaje: 3,
        contenido: 'Perfecto, me interesa. Podriamos hablar por aqui?',
        fecha: '2026-05-02 14:09',
        enviadoPorMi: true,
        leido: false,
      },
    ],
  },
  {
    idConversacion: 2,
    idArticulo: 2,
    vendedor: 'RyzenMaster',
    fechaInicio: '2026-05-04',
    mensajes: [
      {
        idMensaje: 1,
        contenido: 'Buenas, aceptas algun ajuste en el precio?',
        fecha: '2026-05-04 18:31',
        enviadoPorMi: true,
        leido: true,
      },
      {
        idMensaje: 2,
        contenido: 'Podria bajarlo un poco si lo recoges esta semana.',
        fecha: '2026-05-04 18:45',
        enviadoPorMi: false,
        leido: false,
      },
    ],
  },
];
