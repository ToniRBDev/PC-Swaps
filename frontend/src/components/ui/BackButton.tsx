import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
}

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
