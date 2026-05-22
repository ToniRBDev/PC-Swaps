import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getMyProfile,
  updateMyProfile,
  updateMyProfileImage,
} from '../api/users';
import type { UserProfile } from '../types/user';
import { MAX_IMAGE_SIZE_LABEL, validateImageSize } from '../utils/files';
import { getBackendImageUrl } from '../utils/images';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<EditableProfile>({
    nombreUsuario: '',
    direccion: '',
    numTelefono: '',
    imagenUsuario: null,
  });
  const initials = user?.nombreUsuario.slice(0, 2).toUpperCase() ?? 'PC';
  const selectedImagePreviewUrl = useMemo(
    () =>
      form.imagenUsuario ? URL.createObjectURL(form.imagenUsuario) : null,
    [form.imagenUsuario],
  );
  const imagePreviewUrl =
    selectedImagePreviewUrl ?? getBackendImageUrl(user?.imagenUsuario);

  const handleProfileImageChange = (file?: File) => {
    if (!file) {
      setForm((current) => ({ ...current, imagenUsuario: null }));
      return;
    }

    try {
      validateImageSize(file);
      setNotification(null);
      setForm((current) => ({ ...current, imagenUsuario: file }));
    } catch (error) {
      setForm((current) => ({ ...current, imagenUsuario: null }));
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : `La imagen no puede superar los ${MAX_IMAGE_SIZE_LABEL}`,
      });
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getMyProfile();

        setUser(profile);
        setForm((current) => ({
          ...current,
          nombreUsuario: profile.nombreUsuario,
          direccion: profile.direccion ?? '',
          numTelefono: profile.numTelefono ?? '',
        }));
      } catch (error) {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar tus datos',
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadProfile();
  }, []);

  useEffect(() => {
    if (!form.imagenUsuario) {
      return;
    }

    return () => URL.revokeObjectURL(selectedImagePreviewUrl ?? '');
  }, [form.imagenUsuario, selectedImagePreviewUrl]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    try {
      await updateMyProfile({
        nombreUsuario: form.nombreUsuario,
        direccion: form.direccion,
        numTelefono: form.numTelefono,
      });

      if (form.imagenUsuario) {
        await updateMyProfileImage(form.imagenUsuario);
        setForm((current) => ({ ...current, imagenUsuario: null }));
      }

      const refreshedProfile = await getMyProfile();
      setUser(refreshedProfile);
      window.dispatchEvent(
        new CustomEvent<UserProfile>('pcswaps:profile-updated', {
          detail: refreshedProfile,
        }),
      );
      setForm((current) => ({
        ...current,
        nombreUsuario: refreshedProfile.nombreUsuario,
        direccion: refreshedProfile.direccion ?? '',
        numTelefono: refreshedProfile.numTelefono ?? '',
      }));
      setNotification({
        type: 'success',
        message: refreshedProfile.imagenUsuario
          ? 'Datos e imagen modificados correctamente'
          : 'Datos modificados correctamente',
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
              Usuario: {user?.idUsuario ?? '-'}
            </p>
          </div>
        </header>

        {notification && (
          <div
            className={`mb-8 border px-5 py-4 text-sm font-bold uppercase tracking-widest ${
              notification.type === 'success'
                ? 'border-green-600 bg-green-600/10 text-green-500'
                : 'border-red-900 bg-red-950/30 text-red-300'
            }`}
          >
            {notification.message}
          </div>
        )}

        {isLoading ? (
          <div className="border border-neutral-800 bg-black px-5 py-4 text-sm font-bold uppercase tracking-widest text-zinc-400">
            Cargando datos...
          </div>
        ) : !user ? (
          <div className="border border-red-900 bg-red-950/30 px-5 py-4 text-sm font-bold uppercase tracking-widest text-red-300">
            No se han podido cargar tus datos
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <aside className="lg:col-span-4 space-y-6">
              <div className="bg-[#201f21] p-1 relative group">
                <div className="absolute -top-2 -right-2 bg-red-600 px-3 py-1 text-[10px] font-bold tracking-widest text-black">
                  ID {user.idUsuario}
                </div>

                {imagePreviewUrl ? (
                  <img
                    alt={user.nombreUsuario}
                    className="w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    src={imagePreviewUrl}
                  />
                ) : (
                  <div className="w-full aspect-square bg-black flex items-center justify-center text-7xl font-black text-white">
                    {initials}
                  </div>
                )}

                <label
                  aria-label="Anadir imagen de usuario"
                  className="absolute bottom-4 right-4 bg-black/80 p-3 hover:bg-red-600 transition-colors cursor-pointer"
                  title="Anadir imagen de usuario"
                >
                  <span className="material-symbols-outlined text-white">
                    photo_camera
                  </span>
                  <input
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(event) =>
                      handleProfileImageChange(event.target.files?.[0])
                    }
                    type="file"
                  />
                </label>
              </div>

              {form.imagenUsuario && (
                <div className="bg-black border-l-4 border-red-600 p-6">
                  <p className="text-[10px] tracking-widest text-zinc-500 uppercase mb-2">
                    Imagen seleccionada (max. {MAX_IMAGE_SIZE_LABEL})
                  </p>
                  <p className="text-sm text-zinc-300">
                    {form.imagenUsuario.name}
                  </p>
                </div>
              )}
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
                    <ReadOnlyField label="Nombre" value={user.nombre} />
                    <ReadOnlyField label="Apellidos" value={user.apellidos} />
                    <ReadOnlyField label="DNI" value={user.dni} />
                    <ReadOnlyField
                      label="Correo electronico"
                      value={user.correoElectronico}
                    />
                    <ReadOnlyField
                      label="Fecha de nacimiento"
                      value={user.fechaNacimiento}
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
                    <div className="flex gap-3 sm:gap-4 w-full md:w-auto">
                      <button
                        className="flex-1 md:flex-none border border-red-600/40 px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-600/10 transition-all active:scale-95 sm:px-8 sm:py-4 sm:text-xs sm:tracking-widest"
                        onClick={() => navigate('/home')}
                        type="button"
                      >
                        Descartar
                      </button>
                      <button
                        className="flex-1 md:flex-none bg-linear-to-br from-red-600 to-[#ff7763] px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-black hover:shadow-[0_0_20px_#eb000080] transition-all active:scale-95 disabled:opacity-60 sm:px-12 sm:py-4 sm:text-xs sm:tracking-widest"
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
        )}
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
