import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

/**
 * Punto de entrada del frontend.
 *
 * Monta la aplicacion React dentro del nodo `root` definido en `index.html` y
 * activa `StrictMode` para detectar problemas durante el desarrollo.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
