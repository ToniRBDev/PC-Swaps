import { Link, useSearchParams, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserContact } from '../api/users';
import type { UserContactResponse } from '../api/users';
import { getBackendImageUrl } from '../utils/images';

/**
 * Mapa de iconos usados para los campos de contacto del vendedor.
 */
const fieldIcons = {
  correoElectronico: 'mail',
  direccion: 'location_on',
  numTelefono: 'call',
};

/**
 * Pagina publica de informacion de contacto del vendedor.
 *
 * Carga los datos disponibles del usuario indicado por ruta y muestra solo los
 * campos de contacto informados por el backend.
 *
 * @returns Tarjeta de contacto del vendedor.
 */
export default function SellerInfoPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const idUsuario = Number(id);
  const productId = searchParams.get('producto');
  const backUrl = productId ? `/producto/${productId}` : '/home';
  const [seller, setSeller] = useState<UserContactResponse | null>(null);
  const [isLoading, setIsLoading] = useState(Number.isFinite(idUsuario));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!Number.isFinite(idUsuario)) {
      return;
    }

    getUserContact(idUsuario)
      .then((contact) => setSeller(contact))
      .catch((unknownError: unknown) => {
        setError(
          unknownError instanceof Error
            ? unknownError.message
            : 'Vendedor no encontrado',
        );
      })
      .finally(() => setIsLoading(false));
  }, [idUsuario]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <h1 className="text-3xl font-bold mb-4">Cargando vendedor...</h1>
      </main>
    );
  }

  if (!seller || error) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <Link
          to={backUrl}
          className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver al anuncio
        </Link>
        <h1 className="text-3xl font-bold mb-4">
          {error ?? 'Vendedor no encontrado'}
        </h1>
      </main>
    );
  }

  const fields = [
    {
      key: 'correoElectronico',
      label: 'Correo electronico',
      value: seller.correoElectronico,
    },
    { key: 'direccion', label: 'Direccion', value: seller.direccion },
    {
      key: 'numTelefono',
      label: 'Numero de telefono',
      value: seller.numTelefono,
    },
  ].filter((field) => Boolean(field.value?.trim()));
  const initials = seller.nombreUsuario.slice(0, 2).toUpperCase();
  const sellerImageUrl = getBackendImageUrl(seller.imagenUsuario);

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-6 py-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(235,0,0,0.05)_51%)] bg-size-[100%_4px] opacity-20 pointer-events-none" />

      <section className="relative w-full max-w-4xl bg-[#201f21] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 bg-black p-8 flex flex-col items-center justify-center relative border-r border-zinc-800">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_#eb0000]" />

          <div className="relative mb-6">
            <div className="absolute inset-0 border-2 border-red-600 translate-x-2 translate-y-2" />
            {sellerImageUrl ? (
              <img
                alt={seller.nombreUsuario}
                className="w-48 h-48 object-cover relative z-10 border border-white/10"
                src={sellerImageUrl}
              />
            ) : (
              <div className="w-48 h-48 relative z-10 border border-white/10 bg-zinc-900 flex items-center justify-center text-5xl font-black text-white">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-red-600 text-black px-3 py-1 font-bold text-[10px] z-20 uppercase">
              Usuario verificado
            </div>
          </div>

          <h1 className="font-headline text-4xl font-black italic text-white uppercase tracking-tighter mb-1 text-center">
            {seller.nombreUsuario}
          </h1>
          <p className="text-red-600 text-xs tracking-[0.2em] uppercase font-bold">
            Vendedor
          </p>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-10 relative">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="font-headline text-2xl font-bold text-white uppercase tracking-tight">
                Informacion de contacto
              </h2>
              <div className="h-1 w-12 bg-red-600 mt-2" />
            </div>
            <Link
              className="text-zinc-500 hover:text-white transition-colors"
              to={backUrl}
              aria-label="Volver al anuncio"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </Link>
          </div>

          <div className="mb-8">
            <Link
              to={backUrl}
              className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back_ios
              </span>
              Volver al anuncio
            </Link>
          </div>

          <div className="space-y-6">
            <ContactField
              icon="person"
              label="Nombre de usuario"
              value={seller.nombreUsuario}
            />

            {fields.map((field) => (
              <ContactField
                key={field.key}
                icon={fieldIcons[field.key as keyof typeof fieldIcons]}
                label={field.label}
                value={field.value ?? ''}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/**
 * Propiedades de un campo de contacto del vendedor.
 */
interface ContactFieldProps {
  icon: string;
  label: string;
  value: string;
}

/**
 * Fila visual para mostrar un dato de contacto con icono.
 *
 * @param props - Propiedades del campo.
 * @returns Bloque de contacto del vendedor.
 */
function ContactField({ icon, label, value }: ContactFieldProps) {
  return (
    <div className="group">
      <span className="text-[10px] text-red-600 uppercase font-black tracking-widest block mb-2 opacity-70">
        {label}
      </span>
      <div className="flex items-center gap-4 bg-black p-4 transition-all group-hover:bg-zinc-900 border-l-2 border-transparent group-hover:border-red-600">
        <span className="material-symbols-outlined text-zinc-400 group-hover:text-red-600">
          {icon}
        </span>
        <span className="font-headline text-lg tracking-tight text-white">
          {value}
        </span>
      </div>
    </div>
  );
}
