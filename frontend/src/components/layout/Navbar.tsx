import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useConversations } from '../../context/ConversationsContext';
import { clearSession } from '../../utils/session';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchValue = searchParams.get('search') ?? '';
  const { hasUnreadMessages } = useConversations();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleSearch = (value: string) => {
    const params = new URLSearchParams();

    if (value.trim()) {
      params.set('search', value);
    }

    navigate(`/home${params.toString() ? `?${params.toString()}` : ''}`);
  };

  const handleLogout = () => {
    setOpenDropdown(null);
    clearSession();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-black text-[#eb0000] border-b-0 shadow-[0_4px_20px_rgba(235,0,0,0.15)] w-full top-0 z-50 sticky">
        <div className="flex justify-between items-center gap-6 w-full px-8 py-6 max-w-360 mx-auto">
          <div className="flex items-center gap-10 min-w-0">
            <Link
              className="text-3xl font-black tracking-tighter text-[#eb0000] italic hover:opacity-80 transition-opacity shrink-0"
              to="/home"
            >
              PC-SWAPS
            </Link>

            <div className="hidden md:flex gap-6 items-center font-['Space_Grotesk'] uppercase tracking-widest text-sm min-w-0">
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('anuncios')}
                  className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
                  type="button"
                >
                  Mis anuncios
                  <span className="material-symbols-outlined text-base">
                    expand_more
                  </span>
                </button>

                <div
                  className={`absolute left-0 top-full mt-3 min-w-50 border border-neutral-800 bg-[#121212] shadow-xl ${openDropdown === 'anuncios' ? 'block' : 'hidden'}`}
                >
                  <Link
                    className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                    to="/mis-anuncios"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Ver mis anuncios
                  </Link>
                  <Link
                    className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                    to="/publicar-anuncio"
                    onClick={() => setOpenDropdown(null)}
                  >
                    Publicar anuncio
                  </Link>
                </div>
              </div>

              <Link
                className="relative flex items-center gap-2 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
                to="/mis-conversaciones"
              >
              <span className="material-symbols-outlined text-base">
                mail
              </span>
              <span>Mis mensajes</span>
                {hasUnreadMessages && (
                  <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-red-600" />
                )}
            </Link>

              <div className="relative hidden lg:block">
                <input
                  type="text"
                  placeholder="Buscar componentes..."
                  value={searchValue}
                  onChange={(event) => handleSearch(event.target.value)}
                  className="bg-neutral-900 text-sm text-white normal-case tracking-normal border border-neutral-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-red-600 w-64 xl:w-80"
                />
                <span className="material-symbols-outlined absolute left-3 top-2 text-neutral-500 text-xl">
                  search
                </span>
              </div>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              onClick={() => toggleDropdown('perfil')}
              className="flex items-center gap-3 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
              type="button"
            >
              <span className="hidden sm:inline font-['Space_Grotesk'] uppercase tracking-widest text-sm">
                Mi perfil
              </span>
              <span className="flex size-10 items-center justify-center rounded-full border border-red-600/50 bg-neutral-900 text-white font-bold">
                T
              </span>
              <span className="material-symbols-outlined text-base">
                expand_more
              </span>
            </button>

            <div
              className={`absolute right-0 top-full mt-3 min-w-55 border border-neutral-800 bg-[#121212] shadow-xl ${openDropdown === 'perfil' ? 'block' : 'hidden'}`}
            >
              <Link
                className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                to="/modificar-perfil"
                onClick={() => setOpenDropdown(null)}
              >
                Modificar mis datos
              </Link>
              <Link
                className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                to="/modificar-password"
                onClick={() => setOpenDropdown(null)}
              >
                Modificar contraseña
              </Link>
              <button
                className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-950/20"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesion
              </button>
              <button
                className="block w-full text-left px-4 py-3 text-red-500 hover:bg-red-950/20"
                onClick={() => {
                  setOpenDropdown(null);
                  setIsDeleteModalOpen(true);
                }}
                type="button"
              >
                Eliminar cuenta
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md border border-neutral-800 bg-[#121212] p-8 shadow-2xl">
            <h2 className="font-headline text-2xl font-bold uppercase tracking-widest text-white mb-4">
              Eliminar cuenta
            </h2>
            <p className="text-zinc-400 mb-8">
              Estas seguro de eliminar tu cuenta?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="border border-neutral-700 px-5 py-3 text-xs font-bold uppercase tracking-widest text-zinc-300 hover:bg-neutral-900"
                onClick={() => setIsDeleteModalOpen(false)}
                type="button"
              >
                No
              </button>
              <button
                className="bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  clearSession();
                  navigate('/login');
                }}
                type="button"
              >
                Si
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
