import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="bg-[#0e0e0f] shadow-[0_4px_20px_rgba(235,0,0,0.15)] sticky top-0 z-50">
      <nav className="flex justify-between items-center w-full px-8 py-6 max-w-360 mx-auto">
        <Link
          to="/"
          className="text-3xl font-black tracking-tighter text-red-600 italic uppercase"
        >
          PC-SWAPS
        </Link>

        <div className="hidden md:flex gap-8 items-center uppercase tracking-widest text-sm">
          <Link
            className="text-white/70 hover:text-white transition-colors"
            to="/"
          >
            Inicio
          </Link>

          <Link
            className="text-white/70 hover:text-white transition-colors"
            to="/crear-anuncio"
          >
            Crear anuncio
          </Link>

          <Link
            className="text-white/70 hover:text-white transition-colors"
            to="/mis-anuncios"
          >
            Mis anuncios
          </Link>

          <Link
            className="text-white/70 hover:text-white transition-colors"
            to="/perfil"
          >
            Perfil
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/chat"
            className="hover:bg-zinc-800 p-2 transition-all"
            aria-label="Mensajes"
          >
            <span className="material-symbols-outlined text-white">mail</span>
          </Link>

          <Link
            to="/auth"
            className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-500 transition-colors"
          >
            Acceder
          </Link>
        </div>
      </nav>
    </header>
  );
}
