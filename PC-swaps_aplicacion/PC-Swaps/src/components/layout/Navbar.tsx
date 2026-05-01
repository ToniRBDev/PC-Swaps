//{ Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  // 1. Creamos estados para controlar qué menú está abierto
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Función para alternar los menús
  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav className="bg-black text-[#eb0000] border-b-0 shadow-[0_4px_20px_rgba(235,0,0,0.15)] w-full top-0 z-50 sticky">
      <div className="flex justify-between items-center w-full px-8 py-6 max-w-360 mx-auto">
        <div className="flex items-center gap-12">
          <a
            className="text-3xl font-black tracking-tighter text-[#eb0000] italic hover:opacity-80 transition-opacity"
            href="/"
          >
            PC-SWAPS
          </a>

          <div className="hidden md:flex gap-8 items-center font-['Space_Grotesk'] uppercase tracking-widest text-sm">
            {/* DROPDOWN: MIS ANUNCIOS */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('anuncios')} // 2. Al hacer clic, cambia el estado
                className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
                type="button"
              >
                Mis anuncios
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>

              {/* 3. Condición lógica: Si el estado es 'anuncios', quitamos el 'hidden' */}
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

            {/* DROPDOWN: MI PERFIL */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('perfil')}
                className="flex items-center gap-2 text-white/70 hover:text-white hover:bg-[#201f21] transition-all px-2 py-1"
                type="button"
              >
                Mi perfil
                <span className="material-symbols-outlined text-base">
                  expand_more
                </span>
              </button>

              <div
                className={`absolute left-0 top-full mt-3 min-w-55 border border-neutral-800 bg-[#121212] shadow-xl ${openDropdown === 'perfil' ? 'block' : 'hidden'}`}
              >
                <a
                  className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                  href="#"
                >
                  Modificar datos personales
                </a>
                <a
                  className="block px-4 py-3 text-white/80 hover:bg-[#201f21] hover:text-white"
                  href="#"
                >
                  Modificar datos de acceso
                </a>
                <a
                  className="block px-4 py-3 text-red-500 hover:bg-red-950/20"
                  href="#"
                >
                  Cerrar sesión
                </a>
                <a
                  className="block px-4 py-3 text-red-500 hover:bg-red-950/20"
                  href="#"
                >
                  Eliminar cuenta
                </a>
              </div>
            </div>

            {/* BUSCADOR */}
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Buscar componentes..."
                className="bg-neutral-900 text-sm text-white border border-neutral-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-red-600 w-64"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-neutral-500 text-xl">
                search
              </span>
            </div>
          </div>
        </div>

        {/* MENSAJES */}
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 text-neutral-400 hover:text-[#eb0000] transition-colors group">
            <span className="material-symbols-outlined">mail</span>
            <span className="font-['Space_Grotesk'] uppercase text-xs font-bold tracking-wider hidden lg:inline">
              Mis mensajes
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
