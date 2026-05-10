import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white">
      <section className="bg-black px-8 py-20">
        <div className="max-w-360 mx-auto">
          <p className="text-red-600 font-bold uppercase tracking-[0.3em] mb-6">
            PC-SWAPS
          </p>
          <h1 className="font-headline text-5xl md:text-8xl font-black uppercase tracking-tighter max-w-5xl leading-none mb-8">
            Hardware usado con criterio, comunidad y ahorro real
          </h1>
          <p className="max-w-2xl text-zinc-400 text-lg leading-relaxed">
            Compra y vende componentes informaticos en un marketplace centrado
            solo en PCs, piezas, monitores y perifericos.
          </p>
        </div>
      </section>

      <section className="px-8 py-16 max-w-360 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/40">
          {[
            [
              'Especializacion',
              'Un espacio pensado para hardware, no para objetos mezclados sin contexto.',
            ],
            [
              'Reutilizacion',
              'Da una segunda vida a componentes que todavia pueden rendir durante anos.',
            ],
            [
              'Ahorro',
              'Encuentra piezas para mejorar tu PC sin pagar siempre precio de estreno.',
            ],
          ].map(([title, text]) => (
            <article key={title} className="bg-zinc-900 p-8">
              <h2 className="font-headline text-xl font-bold uppercase tracking-widest text-white mb-4">
                {title}
              </h2>
              <p className="text-zinc-500 leading-relaxed">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="px-8 py-16 max-w-360 mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="font-headline text-2xl font-bold uppercase tracking-widest border-l-4 border-red-600 pl-4">
            Articulos anunciados
          </h2>
          <Link
            className="text-red-600 font-bold uppercase text-xs tracking-widest"
            to="/home"
          >
            Entrar al marketplace
          </Link>
        </div>
        {/* CONTENEDOR GRID AÑADIDO PARA EL DISEÑO RESPONSE DE LAS CARD */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <article className="group bg-zinc-900 relative flex flex-col transition-all hover:bg-zinc-800 ">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="aspect-4/5 overflow-hidden bg-black rounded-2xl">
              <img
                src="https://img.pccomponentes.com/articles/1086/10864442/1113-msi-geforce-rtx-3050-ventus-2x-e-oc-6gb-gddr6-opiniones.jpg"
                alt="MSI Nvidia RTX 3060"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>

            <div className="p-6 flex flex-col grow">
              <div className="flex items-start mb-2">
                <div className="w-1 h-6 bg-red-600 mr-2" />

                <h3 className="font-headline font-bold uppercase tracking-tight text-lg">
                  Nvidia RTX 3060
                </h3>
              </div>

              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                Buen estado
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-white font-headline tracking-tighter">
                  200 EUR
                </span>

                <button className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-500">
                  Ver articulo
                </button>
              </div>
            </div>
          </article>
          <article className="group bg-zinc-900 relative flex flex-col transition-all hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="aspect-4/5 overflow-hidden bg-black rounded-2xl">
              <img
                src="https://cdn.ibertronica.es/product/MICM8071505094017_00001.jpeg"
                alt="Intel Coreintel core i9-14900k"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>

            <div className="p-6 flex flex-col grow">
              <div className="flex items-start mb-2">
                <div className="w-1 h-6 bg-red-600 mr-2" />

                <h3 className="font-headline font-bold uppercase tracking-tight text-lg">
                  Intel Coreintel core i9-14900k
                </h3>
              </div>

              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                Nuevo con etiquetas
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-white font-headline tracking-tighter">
                  800 EUR
                </span>

                <button className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-500">
                  Ver articulo
                </button>
              </div>
            </div>
          </article>
          <article className="group bg-zinc-900 relative flex flex-col transition-all hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="aspect-4/5 overflow-hidden bg-black rounded-2xl">
              <img
                src="https://img.pccomponentes.com/articles/1086/10864442/1113-msi-geforce-rtx-3050-ventus-2x-e-oc-6gb-gddr6-opiniones.jpg"
                alt="MSI Nvidia RTX 3060"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>

            <div className="p-6 flex flex-col grow">
              <div className="flex items-start mb-2">
                <div className="w-1 h-6 bg-red-600 mr-2" />

                <h3 className="font-headline font-bold uppercase tracking-tight text-lg">
                  Nvidia RTX 3060
                </h3>
              </div>

              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                Buen estado
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-white font-headline tracking-tighter">
                  200 EUR
                </span>

                <button className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-500">
                  Ver articulo
                </button>
              </div>
            </div>
          </article>
          <article className="group bg-zinc-900 relative flex flex-col transition-all hover:bg-zinc-800">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="aspect-4/5 overflow-hidden bg-black rounded-2xl">
              <img
                src="https://img.pccomponentes.com/articles/1086/10864442/1113-msi-geforce-rtx-3050-ventus-2x-e-oc-6gb-gddr6-opiniones.jpg"
                alt="MSI Nvidia RTX 3060"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>

            <div className="p-6 flex flex-col grow">
              <div className="flex items-start mb-2">
                <div className="w-1 h-6 bg-red-600 mr-2" />

                <h3 className="font-headline font-bold uppercase tracking-tight text-lg">
                  Nvidia RTX 3060
                </h3>
              </div>

              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-6">
                Buen estado
              </p>

              <div className="mt-auto flex items-center justify-between gap-4">
                <span className="text-2xl font-black text-white font-headline tracking-tighter">
                  200 EUR
                </span>

                <button className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-red-500">
                  Ver articulo
                </button>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="px-8 py-20 bg-black">
        <div className="max-w-360 mx-auto grid grid-cols-1 md:grid-cols-2 gap-px bg-zinc-800/40">
          <div className="bg-zinc-950 p-10">
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight mb-6">
              Quieres unirte a nuestra comunidad?
            </h2>
            <Link
              className="inline-block bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white hover:bg-red-500"
              to="/registro"
            >
              Crear cuenta
            </Link>
          </div>

          <div className="bg-zinc-950 p-10">
            <h2 className="font-headline text-3xl font-black uppercase tracking-tight mb-6">
              Ya eres miembro?
            </h2>
            <Link
              className="inline-block border border-red-600/50 px-6 py-4 text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-600/10"
              to="/login"
            >
              Iniciar sesion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
