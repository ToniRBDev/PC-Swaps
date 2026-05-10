import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import type { CategoriaSlug } from '../types/product';
import type { EstadoArticulo } from '../types/enums/estado-articulo';

const articleStates: EstadoArticulo[] = [
  'NUEVO_CON_ETIQUETAS',
  'COMO_NUEVO',
  'MUY_BUENO',
  'BUENO',
  'ACEPTABLE',
  'PARA_REPARAR',
];

interface ListingForm {
  marca: string;
  modelo: string;
  categoria: CategoriaSlug;
  estado: EstadoArticulo;
  precio: string;
  descripcion: string;
  imagen: File | null;
}

type Notification = 'success' | 'error' | null;

export default function CreateListingPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ListingForm>({
    marca: '',
    modelo: '',
    categoria: categories[0].slug,
    estado: articleStates[0],
    precio: '',
    descripcion: '',
    imagen: null,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      await createListing(form);
      setNotification('success');
      window.setTimeout(() => navigate('/home'), 1200);
    } catch {
      setNotification('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageName = form.imagen?.name ?? 'JPG, PNG (1 imagen)';

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-16">
      <div className="max-w-[1440px] mx-auto w-full">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mb-10 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver a la pagina de inicio
        </Link>

        <header className="mb-12 relative">
          <div className="absolute -left-4 top-0 w-1 h-full bg-red-600" />
          <h1 className="font-headline text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 leading-none">
            Desplegar <span className="text-red-600 italic">anuncio</span>
          </h1>
          <p className="text-zinc-500 tracking-[0.3em] text-[10px] uppercase">
            Terminal / Marketplace / Nuevo activo
          </p>
        </header>

        {notification && (
          <div
            className={`mb-8 border px-5 py-4 text-sm font-bold uppercase tracking-widest ${
              notification === 'success'
                ? 'border-red-600 bg-red-600/10 text-red-500'
                : 'border-red-900 bg-red-950/30 text-red-300'
            }`}
          >
            {notification === 'success'
              ? 'Anuncio creado!!'
              : 'No se ha podido crear el anuncio!!'}
          </div>
        )}

        <form
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          onSubmit={handleSubmit}
        >
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-[#201f21] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 -rotate-45 translate-x-16 -translate-y-16" />
              <h2 className="font-headline text-xl font-bold uppercase mb-8 border-l-4 border-red-600 pl-4">
                Identificacion del activo
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Marca"
                    name="marca"
                    onChange={(value) =>
                      setForm((current) => ({ ...current, marca: value }))
                    }
                    placeholder="NVIDIA, ASUS, INTEL"
                    value={form.marca}
                  />
                  <TextInput
                    label="Modelo"
                    name="modelo"
                    onChange={(value) =>
                      setForm((current) => ({ ...current, modelo: value }))
                    }
                    placeholder="RTX 4090 Founders Edition"
                    value={form.modelo}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">
                      Categoria
                    </span>
                    <select
                      className="w-full bg-black border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 text-white p-4 uppercase"
                      value={form.categoria}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          categoria: event.target.value as CategoriaSlug,
                        }))
                      }
                    >
                      {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                          {category.nombre}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">
                      Estado del articulo
                    </span>
                    <select
                      className="w-full bg-black border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 text-white p-4 uppercase"
                      value={form.estado}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          estado: event.target.value as EstadoArticulo,
                        }))
                      }
                    >
                      {articleStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">
                    Precio (EUR)
                  </span>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-600 font-headline font-bold text-xl">
                      EUR
                    </span>
                    <input
                      className="w-full bg-black border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 text-white font-headline text-3xl font-bold pl-20 p-4"
                      min="0"
                      name="precio"
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          precio: event.target.value,
                        }))
                      }
                      placeholder="0.00"
                      required
                      step="0.01"
                      type="number"
                      value={form.precio}
                    />
                  </div>
                </label>
              </div>
            </section>

            <section className="bg-[#201f21] p-8 shadow-2xl">
              <h2 className="font-headline text-xl font-bold uppercase mb-8 border-l-4 border-red-600 pl-4">
                Descripcion del vendedor
              </h2>
              <textarea
                className="w-full bg-black border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 text-white p-4 min-h-44 placeholder:text-zinc-700"
                name="descripcion"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    descripcion: event.target.value,
                  }))
                }
                placeholder="Detalles tecnicos, uso, garantia..."
                required
                value={form.descripcion}
              />
            </section>
          </div>

          <section className="lg:col-span-5 bg-[#201f21] p-8 shadow-2xl flex flex-col">
            <h2 className="font-headline text-xl font-bold uppercase mb-8 border-l-4 border-red-600 pl-4">
              Imagen del producto
            </h2>
            <label
              className="flex-grow min-h-96 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center p-12 group hover:border-red-600 transition-colors cursor-pointer bg-black"
              htmlFor="imagen"
            >
              <span className="material-symbols-outlined text-6xl text-zinc-700 group-hover:text-red-600 mb-4 transition-colors">
                cloud_upload
              </span>
              <span className="text-center text-xs tracking-widest text-zinc-500 uppercase">
                Haz clic para subir una imagen
              </span>
              <span className="text-[10px] text-zinc-700 mt-2">
                {imageName}
              </span>
              <input
                accept="image/png,image/jpeg"
                className="hidden"
                id="imagen"
                name="imagen"
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    imagen: event.target.files?.[0] ?? null,
                  }))
                }
                required
                type="file"
              />
            </label>
          </section>

          <div className="lg:col-span-12 mt-4">
            <button
              className="w-full py-8 bg-gradient-to-r from-red-600 to-[#ff7763] text-black font-headline text-2xl font-black uppercase tracking-tighter hover:shadow-[0_0_30px_rgba(235,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-60"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Creando anuncio...' : 'Crear anuncio'}
              <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">
                bolt
              </span>
            </button>
            <p className="text-center mt-4 text-[10px] text-zinc-600 tracking-[0.3em] uppercase">
              Al confirmar, el anuncio se publicara en PC-SWAPS.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}

interface TextInputProps {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

function TextInput({
  label,
  name,
  onChange,
  placeholder,
  value,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">
        {label}
      </span>
      <input
        className="w-full bg-black border-0 border-b-2 border-zinc-700 focus:border-red-600 focus:ring-0 text-white p-4 uppercase placeholder:text-zinc-700"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        type="text"
        value={value}
      />
    </label>
  );
}

async function createListing(form: ListingForm) {
  const payload = {
    marca: form.marca,
    modelo: form.modelo,
    categoria: form.categoria,
    estado: form.estado,
    precio: Number(form.precio),
    descripcion: form.descripcion,
    imagen: form.imagen?.name,
  };

  await new Promise((resolve) => window.setTimeout(resolve, 500));

  if (!payload.marca || !payload.modelo || !payload.precio) {
    throw new Error('Invalid listing');
  }

  return payload;
}
