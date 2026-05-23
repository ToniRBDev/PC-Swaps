import { useNavigate } from 'react-router-dom';

/**
 * Propiedades del componente {@link BackButton}.
 *
 * Permite personalizar el texto visible del boton manteniendo la misma accion
 * de volver a la pagina anterior del historial.
 */
interface BackButtonProps {
  label?: string;
}

/**
 * Boton reutilizable para regresar a la ruta anterior.
 *
 * Usa el historial de React Router para navegar una posicion hacia atras y
 * mantiene el mismo estilo visual en las pantallas que necesitan una accion de
 * retorno.
 *
 * @param props - Propiedades del componente.
 * @returns Boton de navegacion hacia atras.
 */
export default function BackButton({ label = 'Volver atras' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
      onClick={() => navigate(-1)}
      type="button"
    >
      <span className="material-symbols-outlined text-sm">arrow_back_ios</span>
      {label}
    </button>
  );
}
