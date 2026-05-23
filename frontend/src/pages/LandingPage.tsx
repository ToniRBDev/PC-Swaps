import { Link } from 'react-router-dom';

/**
 * Correo de soporte mostrado en la landing publica.
 */
const supportEmail = 'obt59086@educastur.es';

/**
 * Enlace mailto preconfigurado para contactar con soporte.
 */
const supportMailto = `mailto:${supportEmail}?subject=Soporte%20PC-SWAPS`;

/**
 * Articulos estaticos usados para ilustrar el inventario destacado de la landing.
 */
const featuredArticles = [
  {
    category: 'GPU',
    title: 'RTX 4090 OC Edition',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNdgvN_3o_WxWmcMSPc5QkHE7X87DClpXOwukAZejJF1ziS5zRSc5pZ-M1kWn0T97mc1T6jgm62Ipgb_eG7N6qAY8xJOkb9qwxeENS3eiqP1zne3TsxsTiX6E2QJFz8tQPr-zk4LbPmNmL-Kg5kDUZAmrv4KT9TJMpk9zWtSDK4gi_MUxYhYb7dioN-pduoGV1n6JHgy0t9LtFGUZ1NKK6iceuQp9O60o0ccYU8OPh5plcWCLI9-ZvCY2braaib0vZ4OgSz3m2s32q',
  },
  {
    category: 'Placa Base',
    title: 'ROG Maximus Z790 Hero',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBMRG_Qh6AU_DIMAQSnL5G2ubmv4qWVF71xXDWkzUX1u6DZ_9QsUmu8f_ZPede99gpazaW5jAhd1TdJH_NjWQc0rXlHnnw_SJCi1N8SvRlSJnxLAFuLHGsKcjqeoZXhw2ARfOL4On3Tlpl7B50E2RraPlxhRH7uJcxEtyqRjwJaV6yWYBs_7V11FO-9lJJa893sJFsFCGA9P-vygZMZRn46Ju__kzZztDtdXa_BWCcr1ExPXLHmDmc0NTQ5VT96yccBVcvAhzNnyLCP',
  },
  {
    category: 'CPU',
    title: 'Core i9-14900K Unlocked',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAyespgAsm4zK7OwWlcerX4UBpJfifqmjXtZ0SJE_qScLl5g8ShGUQBuY-JM-AH8SOGLGUs_0kUyfqJJv1jEh1633ryRRSmEO7eFvbzlM90b1QQDwKM5JsLN-woX324mzpakCHXg8RdgJdcD8-Qe62bQmleVwDZtswQCebZb2gOFaB41N7sTQQww0_Tf-m6cWbek_AO7LBWlDsMDHS5vByzVyvZif9WUoxY07nCLqlVl8wU1PTa4inO4Wt-V6eM4Gg_ZVwWfamvX3gZ',
  },
  {
    category: 'Monitor',
    title: 'Odyssey G9 Neo 49"',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6yRIZ3aJmE8ArF5hInU61mgmVUJeX-4o35tM9xraLsf2AL-TtGlleIaB94UPDRY18KwbY7gUeduoRIMz6E3dhfKxwDapHKhhovBrsx0aE2W0-1EET8SBp8YXqDurS4XuxddWPknBCEqcgVtMrILSNX8oBkCyOjAkPw6hzqv3_oCmUZzlD2YDXGNQo_NZxV7xhxh1799deFBGBHy8qWJpuq41M2bXx2cN-CPf0untwFtnhn_BZA02WpYf9ih7BAUIWDHiyaWdxFY3O',
  },
];

/**
 * Pagina publica de bienvenida de PC-SWAPS.
 *
 * Presenta la propuesta de valor, ejemplos de hardware destacado y enlaces a
 * login, registro y soporte antes de que el usuario acceda al marketplace.
 *
 * @returns Landing page publica de la aplicacion.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white">
      <nav className="bg-[#0e0e0f] dark:bg-black flex justify-between items-center w-full px-8 py-6 border-b border-white/5 sticky top-0 z-50">
        <Link
          className="text-3xl font-black tracking-tighter text-red-600 italic font-headline"
          to="/login"
        >
          PC-SWAPS
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          {[
            'Mis anuncios',
            'Seguimiento',
            'Modificar perfil',
            'Modificar datos acceso',
          ].map((item) => (
            <Link
              key={item}
              className="font-['Space_Grotesk'] uppercase tracking-widest text-sm transition-all duration-100 text-zinc-500 hover:text-red-600 hover:bg-white/5 px-2"
              to="/login"
            >
              {item}
            </Link>
          ))}
        </div>

        <a
          className="text-red-600 p-2 hover:bg-white/5 transition-colors"
          href={supportMailto}
          title="Contactar con soporte"
        >
          <span className="material-symbols-outlined">mail</span>
        </a>
      </nav>

      <section className="relative flex items-center overflow-hidden px-8 md:px-20 py-20">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover opacity-40"
            alt="PC custom con iluminacion roja"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCt29oTQGnd1BPv2tFOhENC4Hi6gbmJFyL3olF452olCqS33X7VaIgFYAASuHLZE1yC0kWyjJi8yndthNxnVQrdCnKkWd_y-rfJtRKwi9Lff-3kF4BruqPHwb7j3TBDoekEpKlYjzgFTj7VJMtDKsoClZPOObm1fTcwU_xX-fMPTQhvV0wybvZorLj_FuHR--lou9Bh6siUXoRsx0uUjD-gGyR5aG3kICWiBMBOt52iKnfLBgaA8VETA93Tp8WvUYoPwCPl_zzNNr76"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0e0e0f] via-[#0e0e0f]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black font-headline uppercase leading-none tracking-tighter mb-5">
            Domina el <span className="text-red-600 italic">Mercado</span> del
            Hardware
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-8 font-light leading-relaxed">
            Intercambia, vende y adquiere componentes de elite. La plataforma
            definitiva disenada para el rendimiento extremo y la precision
            tecnica.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              className="bg-linear-to-br from-red-600 to-[#ff7763] text-black font-black uppercase tracking-widest px-10 py-5 hover:shadow-[0_0_20px_rgba(235,0,0,0.4)] transition-all duration-200 active:scale-95"
              to="/login"
            >
              Explorar Inventario
            </Link>
            <Link
              className="border border-red-600/40 text-red-600 font-bold uppercase tracking-widest px-10 py-5 hover:bg-red-600/10 transition-all duration-200"
              to="/login"
            >
              Vender Componente
            </Link>
          </div>
        </div>
      </section>

      <section className="py-32 px-8 md:px-20 bg-black">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {[
            {
              icon: 'sports_esports',
              title: 'Especializacion Elite',
              text: 'Creado por gamers para entusiastas del hardware. Aqui no hay basura, solo componentes probados para el maximo rendimiento competitivo.',
            },
            {
              icon: 'cycle',
              title: 'Sostenibilidad High-End',
              text: 'Dale una segunda vida al hardware de alta gama. Reduce la huella electronica mientras mantienes tu rig en la cima de los benchmarks.',
            },
            {
              icon: 'payments',
              title: 'Ahorro Estrategico',
              text: 'Accede a componentes Pro-tier a una fraccion de su coste original. Maximiza tus FPS por cada euro invertido en tu setup.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="bg-[#0e0e0f] p-12 border-l-2 border-l-transparent hover:border-l-red-600 hover:bg-[#2c2c2d] transition-all"
            >
              <span className="material-symbols-outlined text-red-600 text-4xl mb-6">
                {feature.icon}
              </span>
              <h3 className="font-headline text-2xl font-bold uppercase tracking-tight mb-4">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-8 md:px-20">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-red-600 font-headline font-bold uppercase tracking-[0.3em] text-sm">
              Hardware Disponible
            </span>
            <h2 className="text-5xl font-black font-headline uppercase mt-2">
              Equipamiento Destacado
            </h2>
          </div>
          <Link
            className="text-zinc-400 hover:text-red-600 transition-colors uppercase tracking-widest font-headline text-sm border-b border-red-600/20 pb-1"
            to="/login"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredArticles.map((article, index) => (
            <div
              key={article.title}
              className="bg-[#201f21] transition-all flex flex-col group h-full hover:bg-[#2c2c2d]"
            >
              <div className="aspect-square relative overflow-hidden bg-black">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={article.title}
                  src={article.image}
                />
                {index === 0 && (
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-red-600 text-black font-black text-[10px] px-3 py-1 uppercase tracking-tighter">
                      Disponible
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6 border-l-2 border-l-transparent group-hover:border-l-red-600 flex flex-col grow transition-all">
                <span className="text-[10px] font-headline font-bold uppercase tracking-widest text-red-600 mb-2">
                  {article.category}
                </span>
                <h4 className="text-xl font-bold font-headline uppercase leading-tight mb-4">
                  {article.title}
                </h4>
                <div className="mt-auto pt-6">
                  <Link
                    className="block text-center w-full bg-[#2c2c2d] hover:bg-red-600 hover:text-black transition-all font-headline font-bold uppercase text-xs py-4 tracking-widest"
                    to="/login"
                  >
                    Ver articulo
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black py-32 border-y border-white/5 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 opacity-5 rotate-12">
          <span className="text-[20rem] font-black font-headline uppercase leading-none">
            SWAPS
          </span>
        </div>
        <div className="relative z-10 px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-20">
          <div>
            <h2 className="text-4xl font-black font-headline uppercase mb-8">
              Quieres unirte a nuestra comunidad?
            </h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Unete a la red de intercambio de hardware mas sofisticada de
              Europa. Compra y vende con total seguridad.
            </p>
            <Link
              className="inline-block bg-red-600 text-black font-black uppercase tracking-widest px-12 py-6 hover:shadow-[0_0_20px_rgba(235,0,0,0.4)] active:scale-95 transition-all"
              to="/registro"
            >
              Crear cuenta
            </Link>
          </div>
          <div className="md:border-l md:border-white/10 md:pl-20">
            <h2 className="text-4xl font-black font-headline uppercase mb-8">
              Ya eres miembro?
            </h2>
            <p className="text-zinc-400 mb-10 text-lg">
              Accede a tu panel de control, gestiona tus anuncios activos y
              sigue el estado de tus transacciones.
            </p>
            <Link
              className="inline-block border border-white/40 text-white font-black uppercase tracking-widest px-12 py-6 hover:border-red-600 hover:text-red-600 transition-all active:scale-95"
              to="/login"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-[#0e0e0f] dark:bg-black border-t border-white/5 flex flex-col md:flex-row justify-between items-center px-10 py-12 w-full">
        <div className="mb-8 md:mb-0">
          <span className="text-lg font-bold text-white font-headline">
            PC-SWAPS
          </span>
          <p className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-2">
            2026 PC-SWAPS
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-6">
          <a
            className="font-['Space_Grotesk'] text-[10px] uppercase tracking-[0.2em] text-zinc-600 hover:text-red-600 underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100 transition-all"
            href={supportMailto}
          >
            Soporte: {supportEmail}
          </a>
          <div className="flex gap-4">
            {['terminal', 'shield', 'memory'].map((icon) => (
              <Link key={icon} to="/login">
                <span className="material-symbols-outlined text-zinc-600 cursor-pointer hover:text-red-600">
                  {icon}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
