import { useState } from 'react';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-black text-[#eb0000] border-b-0 shadow-[0_4px_20px_rgba(235,0,0,0.15)] w-full top-0 z-50 sticky">
      <div className="flex justify-between items-center gap-6 w-full px-8 py-6 max-w-360 mx-auto">
        <div className="flex items-center gap-10 min-w-0">
          <a
            className="text-3xl font-black tracking-tighter text-[#eb0000] italic hover:opacity-80 transition-opacity shrink-0"
            href="/"
          >
            PC-SWAPS
          </a>

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
                <a
                  className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                  href="#"
                >
                  Ver mis anuncios
                </a>
                <a
                  className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                  href="#"
                >
                  Publicar anuncio
                </a>
              </div>
            </div>

            <button
              className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
              type="button"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              <span>Mis mensajes</span>
            </button>

            <div className="relative hidden lg:block">
              <input
                type="text"
                placeholder="Buscar componentes..."
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
            <a
              className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
              href="#"
            >
              Modificar mis datos
            </a>
            <a
              className="block px-4 py-3 text-red-500 hover:bg-red-950/20"
              href="#"
            >
              Cerrar sesion
            </a>
            <a
              className="block px-4 py-3 text-red-500 hover:bg-red-950/20"
              href="#"
            >
              Eliminar cuenta
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
