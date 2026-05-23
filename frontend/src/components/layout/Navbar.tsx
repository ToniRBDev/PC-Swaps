import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useConversations } from '../../context/useConversations';
import { getMyProfile } from '../../api/users';
import type { UserProfile } from '../../types/user';
import { getBackendImageUrl } from '../../utils/images';
import { clearSession } from '../../utils/session';

/**
 * Barra de navegacion principal de la aplicacion.
 *
 * Gestiona los accesos a anuncios, conversaciones, busqueda, perfil y sesion
 * del usuario. Tambien adapta la navegacion a escritorio y movil, muestra el
 * indicador de mensajes no leidos y escucha actualizaciones del perfil para
 * refrescar la imagen o las iniciales del usuario.
 */
export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const searchValue = searchParams.get('search') ?? '';
  const { hasUnreadMessages } = useConversations();
  const profileImageUrl = getBackendImageUrl(profile?.imagenUsuario);
  const profileInitials =
    profile?.nombreUsuario.slice(0, 2).toUpperCase() ?? 'PC';

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setProfile(await getMyProfile());
      } catch {
        setProfile(null);
      }
    };

    const handleProfileUpdated = (event: Event) => {
      setProfile((event as CustomEvent<UserProfile>).detail);
    };

    void loadProfile();
    window.addEventListener('pcswaps:profile-updated', handleProfileUpdated);

    return () => {
      window.removeEventListener(
        'pcswaps:profile-updated',
        handleProfileUpdated,
      );
    };
  }, []);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleLogout = () => {
    closeMobileMenu();
    setProfile(null);
    clearSession();
    navigate('/login');
  };

  return (
    <>
      <nav className="bg-black text-[#eb0000] border-b-0 shadow-[0_4px_20px_rgba(235,0,0,0.15)] w-full top-0 z-50 sticky">
        <div className="flex justify-between items-center gap-4 w-full px-4 py-4 md:px-8 md:py-6 max-w-360 mx-auto">
          <div className="flex items-center gap-4 md:gap-10 min-w-0">
            <button
              aria-label="Abrir menu"
              aria-expanded={isMobileMenuOpen}
              className="flex size-10 items-center justify-center text-white/80 hover:bg-[#201f21] md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>

            <Link
              className="text-2xl sm:text-3xl font-black tracking-tighter text-[#eb0000] italic hover:opacity-80 transition-opacity shrink-0"
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
              className="flex items-center gap-2 sm:gap-3 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
              type="button"
            >
              <span className="hidden sm:inline font-['Space_Grotesk'] uppercase tracking-widest text-sm">
                Mi perfil
              </span>
              {profileImageUrl ? (
                <img
                  alt={profile?.nombreUsuario ?? 'Mi perfil'}
                  className="size-9 sm:size-10 rounded-full border border-red-600/50 object-cover"
                  src={profileImageUrl}
                />
              ) : (
                <span className="flex size-9 sm:size-10 items-center justify-center rounded-full border border-red-600/50 bg-neutral-900 text-white font-bold">
                  {profileInitials}
                </span>
              )}
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-60 md:hidden">
          <button
            aria-label="Cerrar menu"
            className="absolute inset-0 bg-black/70"
            onClick={closeMobileMenu}
            type="button"
          />

          <aside className="relative flex h-full w-[min(20rem,85vw)] flex-col border-r border-neutral-800 bg-[#121212] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
              <Link
                className="text-2xl font-black italic tracking-tighter text-[#eb0000]"
                onClick={closeMobileMenu}
                to="/home"
              >
                PC-SWAPS
              </Link>

              <button
                aria-label="Cerrar menu"
                className="flex size-10 items-center justify-center text-white/70 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                type="button"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="border-b border-neutral-800 p-5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar componentes..."
                  value={searchValue}
                  onChange={(event) => handleSearch(event.target.value)}
                  className="w-full rounded-full border border-neutral-700 bg-neutral-900 py-2.5 pl-10 pr-4 text-sm text-white focus:border-red-600 focus:outline-none"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-xl text-neutral-500">
                  search
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-3 font-['Space_Grotesk'] text-sm font-bold uppercase tracking-widest">
              <Link
                className="flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                to="/mis-anuncios"
              >
                <span className="material-symbols-outlined text-xl">
                  inventory_2
                </span>
                Ver mis anuncios
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                to="/publicar-anuncio"
              >
                <span className="material-symbols-outlined text-xl">add</span>
                Publicar anuncio
              </Link>
              <Link
                className="relative flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                to="/mis-conversaciones"
              >
                <span className="material-symbols-outlined text-xl">mail</span>
                Mis mensajes
                {hasUnreadMessages && (
                  <span className="ml-auto size-2.5 rounded-full bg-red-600" />
                )}
              </Link>

              <div className="my-3 h-px bg-neutral-800" />

              <Link
                className="flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                to="/modificar-perfil"
              >
                <span className="material-symbols-outlined text-xl">
                  person
                </span>
                Modificar mis datos
              </Link>
              <Link
                className="flex items-center gap-3 px-3 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                onClick={closeMobileMenu}
                to="/modificar-password"
              >
                <span className="material-symbols-outlined text-xl">key</span>
                Modificar contrasena
              </Link>
              <button
                className="flex items-center gap-3 px-3 py-3 text-left text-red-500 hover:bg-red-950/20"
                onClick={handleLogout}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">
                  logout
                </span>
                Cerrar sesion
              </button>
              <button
                className="flex items-center gap-3 px-3 py-3 text-left text-red-500 hover:bg-red-950/20"
                onClick={() => {
                  closeMobileMenu();
                  setIsDeleteModalOpen(true);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-xl">
                  delete
                </span>
                Eliminar cuenta
              </button>
            </div>
          </aside>
        </div>
      )}

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
                  setProfile(null);
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
