import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser } from '../data/currentUser';

type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

interface EditableProfile {
  nombreUsuario: string;
  direccion: string;
  numTelefono: string;
  imagenUsuario: File | null;
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EditableProfile>({
    nombreUsuario: currentUser.nombreUsuario,
    direccion: currentUser.direccion ?? '',
    numTelefono: currentUser.numTelefono ?? '',
    imagenUsuario: null,
  });
  const initials = currentUser.nombreUsuario.slice(0, 2).toUpperCase();
  const imageName = form.imagenUsuario?.name ?? 'Cambiar imagen';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    try {
      await updateProfile(form);
      setNotification({
        type: 'success',
        message: 'Datos modificados correctamente',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se han podido modificar los datos!!',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-6 md:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 mb-10 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest transition-colors"
        >
          <span className="material-symbols-outlined text-sm">
            arrow_back_ios
          </span>
          Volver a la home
        </Link>

        <header className="relative mb-16">
          <h1 className="font-headline text-7xl md:text-9xl font-bold uppercase tracking-tighter text-zinc-800 opacity-50 absolute -top-12 -left-4 select-none pointer-events-none">
            Perfil
          </h1>
          <div className="relative z-10 pt-4">
            <div className="flex items-end gap-2">
              <div className="w-3 h-12 bg-red-600" />
              <h2 className="font-headline text-5xl font-black uppercase tracking-tight text-white">
                Modificar perfil
              </h2>
            </div>
            <p className="text-red-600 text-xs tracking-[0.2em] mt-2 uppercase">
              Usuario: {currentUser.idUsuario}
            </p>
          </div>
        </header>

        {notification && (
          <div
            className={`mb-8 border px-5 py-4 text-sm font-bold uppercase tracking-widest ${
              notification.type === 'success'
                ? 'border-red-600 bg-red-600/10 text-red-500'
                : 'border-red-900 bg-red-950/30 text-red-300'
            }`}
          >
            {notification.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#201f21] p-1 relative group">
              <div className="absolute -top-2 -right-2 bg-red-600 px-3 py-1 text-[10px] font-bold tracking-widest text-black">
                ID {currentUser.idUsuario}
              </div>

              {currentUser.imagenUsuario ? (
                <img
                  alt={currentUser.nombreUsuario}
                  className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  src={currentUser.imagenUsuario}
                />
              ) : (
                <div className="w-full aspect-square bg-black flex items-center justify-center text-7xl font-black text-white">
                  {initials}
                </div>
              )}

              <label className="absolute bottom-4 right-4 bg-black/80 p-3 hover:bg-red-600 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-white">
                  photo_camera
                </span>
                <input
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      imagenUsuario: event.target.files?.[0] ?? null,
                    }))
                  }
                  type="file"
                />
              </label>
            </div>

            <div className="bg-black border-l-4 border-red-600 p-6">
              <p className="text-[10px] tracking-widest text-zinc-500 uppercase mb-2">
                Imagen de usuario
              </p>
              <p className="text-sm text-zinc-300">{imageName}</p>
            </div>
          </aside>

          <section className="lg:col-span-8">
            <div className="bg-black p-8 md:p-12 border border-zinc-800">
              <form className="space-y-10" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <div className="md:col-span-2">
                    <EditableField
                      label="Nombre de usuario"
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          nombreUsuario: value,
                        }))
                      }
                      required
                      value={form.nombreUsuario}
                    />
                  </div>
                  <ReadOnlyField label="Nombre" value={currentUser.nombre} />
                  <ReadOnlyField
                    label="Apellidos"
                    value={currentUser.apellidos}
                  />
                  <ReadOnlyField label="DNI" value={currentUser.dni} />
                  <ReadOnlyField
                    label="Correo electronico"
                    value={currentUser.correoElectronico}
                  />
                  <ReadOnlyField
                    label="Fecha de nacimiento"
                    value={currentUser.fechaNacimiento}
                  />
                  <EditableField
                    label="Numero de telefono"
                    onChange={(value) =>
                      setForm((current) => ({
                        ...current,
                        numTelefono: value,
                      }))
                    }
                    type="tel"
                    value={form.numTelefono}
                  />
                  <div className="md:col-span-2">
                    <EditableField
                      label="Direccion"
                      onChange={(value) =>
                        setForm((current) => ({
                          ...current,
                          direccion: value,
                        }))
                      }
                      value={form.direccion}
                    />
                  </div>
                </div>

                <div className="pt-12 flex flex-col md:flex-row items-center justify-end gap-6">
                  <div className="flex gap-4 w-full md:w-auto">
                    <button
                      className="flex-1 md:flex-none border border-red-600/40 px-8 py-4 text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-600/10 transition-all active:scale-95"
                      onClick={() => navigate('/home')}
                      type="button"
                    >
                      Descartar
                    </button>
                    <button
                      className="flex-1 md:flex-none bg-linear-to-br from-red-600 to-[#ff7763] px-12 py-4 text-xs font-bold uppercase tracking-widest text-black hover:shadow-[0_0_20px_#eb000080] transition-all active:scale-95 disabled:opacity-60"
                      disabled={isSubmitting}
                      type="submit"
                    >
                      {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

interface ReadOnlyFieldProps {
  label: string;
  value: string | number;
}

function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </span>
      <input
        className="w-full bg-transparent border-0 border-b-2 border-zinc-800 py-3 px-0 font-headline text-xl font-medium text-zinc-500 uppercase"
        readOnly
        type="text"
        value={value}
      />
    </label>
  );
}

interface EditableFieldProps {
  label: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  value: string;
}

function EditableField({
  label,
  onChange,
  required = false,
  type = 'text',
  value,
}: EditableFieldProps) {
  return (
    <label className="block group">
      <span className="block text-[10px] uppercase tracking-widest text-zinc-500 mb-2 group-focus-within:text-red-600 transition-colors">
        {label}
      </span>
      <input
        className="w-full bg-transparent border-0 border-b-2 border-zinc-700 py-3 px-0 font-headline text-xl font-medium focus:ring-0 focus:border-red-600 focus:bg-[#131314] transition-all uppercase"
        onChange={(event) => onChange(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

async function updateProfile(form: EditableProfile) {
  await new Promise((resolve) => window.setTimeout(resolve, 500));

  if (!form.nombreUsuario.trim()) {
    throw new Error('El nombre de usuario es obligatorio!!');
  }

  return {
    nombreUsuario: form.nombreUsuario,
    direccion: form.direccion,
    numTelefono: form.numTelefono,
    imagenUsuario: form.imagenUsuario?.name,
  };
}
