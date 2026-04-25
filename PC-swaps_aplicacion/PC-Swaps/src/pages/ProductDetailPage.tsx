import { Link, useParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { products } from '../data/products';

export default function ProductDetailPage() {
  const { id } = useParams();

  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
          <h1 className="text-3xl font-bold mb-4">Producto no encontrado</h1>
          <Link to="/" className="text-red-600 font-bold uppercase">
            Volver al inicio
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-16">
        <div className="max-w-360 mx-auto">
          <Link
            to="/"
            className="inline-block mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest"
          >
            ← Volver al marketplace
          </Link>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            <div className="lg:col-span-7 bg-black border-l-4 border-red-600 overflow-hidden">
              <img
                src={product.imagen}
                alt={product.modelo}
                className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>

            <div className="lg:col-span-5 bg-zinc-900 p-8 md:p-12 flex flex-col">
              <span className="text-red-500 text-xs uppercase tracking-[0.2em] font-bold mb-3">
                {product.categoria}
              </span>

              <h1 className="text-4xl md:text-5xl font-black uppercase leading-none mb-6">
                {product.modelo}
              </h1>

              <div className="mb-8">
                <span className="block text-zinc-500 text-xs uppercase mb-1">
                  Precio
                </span>
                <p className="text-4xl font-black text-white">
                  {product.precio}€
                </p>
              </div>

              <div className="grid grid-cols-2 gap-px bg-zinc-700/40 mb-8">
                <InfoBox label="Marca" value={product.marca} />
                <InfoBox label="Estado" value={product.estado} />
                <InfoBox label="Categoría" value={product.categoria} />
                <InfoBox label="Publicado" value={product.fechaPublicacion} />
              </div>

              <div className="mb-10">
                <h2 className="text-sm uppercase tracking-widest font-bold mb-4 text-zinc-300">
                  Descripción del vendedor
                </h2>
                <p className="text-zinc-400 leading-relaxed">
                  {product.descripcion}
                </p>
              </div>

              <div className="mb-10">
                <h2 className="text-sm uppercase tracking-widest font-bold mb-4 text-zinc-300">
                  Especificaciones
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-zinc-700/40">
                  {Object.entries(product.especificaciones).map(
                    ([key, value]) => (
                      <InfoBox key={key} label={key} value={value} />
                    )
                  )}
                </div>
              </div>

              <div className="mt-auto space-y-4">
                <button className="w-full bg-red-600 text-white font-bold uppercase py-4 tracking-widest hover:bg-red-500">
                  Información de contacto
                </button>

                <button className="w-full border border-red-600/50 text-red-500 font-bold uppercase py-4 tracking-widest hover:bg-red-600/10">
                  Añadir a seguimiento
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

interface InfoBoxProps {
  label: string;
  value: string | number;
}

function InfoBox({ label, value }: InfoBoxProps) {
  return (
    <div className="bg-zinc-950 p-4">
      <span className="block text-[10px] text-zinc-500 uppercase tracking-widest mb-1">
        {label}
      </span>
      <span className="text-sm font-bold uppercase text-zinc-100">{value}</span>
    </div>
  );
}
