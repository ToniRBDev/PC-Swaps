import { Link, useParams } from 'react-router-dom';
import { sellersByArticleId } from '../data/sellers';

const fieldIcons = {
  correoElectronico: 'mail',
  direccion: 'location_on',
  numTelefono: 'call',
};

export default function SellerInfoPage() {
  const { id } = useParams();
  const articleId = Number(id);
  const seller = sellersByArticleId[articleId];

  if (!seller) {
    return (
      <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-20">
        <Link
          to={`/producto/${articleId}`}
          className="inline-flex items-center gap-2 mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver al anuncio
        </Link>
        <h1 className="text-3xl font-bold mb-4">Vendedor no encontrado</h1>
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

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-6 py-16 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(235,0,0,0.05)_51%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />

      <section className="relative w-full max-w-4xl bg-[#201f21] shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-2/5 bg-black p-8 flex flex-col items-center justify-center relative border-r border-zinc-800">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_15px_#eb0000]" />

          <div className="relative mb-6">
            <div className="absolute inset-0 border-2 border-red-600 translate-x-2 translate-y-2" />
            {seller.imagenUsuario ? (
              <img
                alt={seller.nombreUsuario}
                className="w-48 h-48 object-cover relative z-10 border border-white/10"
                src={seller.imagenUsuario}
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
              to={`/producto/${articleId}`}
              aria-label="Volver al anuncio"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </Link>
          </div>

          <div className="mb-8">
            <Link
              to={`/producto/${articleId}`}
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

          <div className="mt-12">
            <Link
              className="block w-full bg-red-600 text-white text-center font-headline font-black uppercase tracking-widest py-4 px-6 hover:shadow-[0_0_20px_rgba(235,0,0,0.4)] transition-all active:scale-95"
              to={`/chat/${articleId}`}
            >
              Iniciar chat
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

interface ContactFieldProps {
  icon: string;
  label: string;
  value: string;
}

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
