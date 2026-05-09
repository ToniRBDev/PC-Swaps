import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  label?: string;
}

export default function BackButton({ label = 'Volver atras' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      className="inline-block mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest"
      onClick={() => navigate(-1)}
      type="button"
    >
      {label}
    </button>
  );
}
