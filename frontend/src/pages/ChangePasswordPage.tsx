import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { changeMyPassword } from '../api/users';

type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<Notification>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    try {
      validatePasswordForm(form);
      await changeMyPassword({
        passwordActual: form.currentPassword,
        passwordNueva: form.newPassword,
      });
      setForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setNotification({
        type: 'success',
        message: 'Contraseña modificada correctamente',
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se ha podido modificar la contraseña',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white flex items-center justify-center p-6 md:p-12">
      <div className="max-w-xl w-full relative">
        <div className="absolute -left-4 top-0 bottom-0 w-1 bg-red-600 opacity-50" />

        <section className="bg-[#201f21] p-8 md:p-12">
          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic mb-2">
              Modificar <span className="text-red-600">Constraseña</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Asegura tu cuenta con una clave de alta complejidad.
            </p>
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

          <form className="space-y-8" onSubmit={handleSubmit}>
            <PasswordInput
              id="current_password"
              label="Contraseña actual"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  currentPassword: value,
                }))
              }
              value={form.currentPassword}
            />
            <PasswordInput
              id="new_password"
              label="Nueva contraseña"
              onChange={(value) =>
                setForm((current) => ({ ...current, newPassword: value }))
              }
              value={form.newPassword}
            />
            <PasswordInput
              id="confirm_password"
              label="Confirmar nueva contraseña"
              onChange={(value) =>
                setForm((current) => ({
                  ...current,
                  confirmPassword: value,
                }))
              }
              value={form.confirmPassword}
            />

            <div className="pt-6 flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-br from-red-600 to-[#ff7763] text-white font-white border-2 uppercase tracking-widest text-sm py-4 px-8 hover:shadow-[0_0_20px_rgba(235,0,0,0.3)] transition-all active:scale-95 disabled:opacity-60"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
              <button
                className="flex-1 border border-red-600/40 text-red-600 font-black uppercase tracking-widest text-sm py-4 px-8 hover:bg-red-600/5 transition-all active:scale-95"
                onClick={() => navigate('/home')}
                type="button"
              >
                Descartar
              </button>
            </div>
          </form>
        </section>

        <div className="mt-8 grid grid-cols-3 gap-2 opacity-20">
          <div className="h-1 bg-red-600" />
          <div className="h-1 bg-zinc-800" />
          <div className="h-1 bg-zinc-800" />
        </div>
      </div>
    </main>
  );
}

interface PasswordInputProps {
  id: string;
  label: string;
  onChange: (value: string) => void;
  value: string;
}

function PasswordInput({ id, label, onChange, value }: PasswordInputProps) {
  return (
    <label className="relative group block" htmlFor={id}>
      <span className="block text-[10px] uppercase tracking-[0.2em] text-zinc-400 mb-1 group-focus-within:text-red-600 transition-colors">
        {label}
      </span>
      <input
        className="w-full bg-transparent border-t-0 border-x-0 border-b-2 border-zinc-700 py-3 px-0 text-white focus:ring-0 focus:border-red-600 focus:bg-[#131314] transition-all placeholder:text-zinc-700"
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder="************"
        required
        type="password"
        value={value}
      />
    </label>
  );
}

function validatePasswordForm(form: PasswordForm) {
  if (!form.currentPassword.trim()) {
    throw new Error('Introduce tu contraseña actual');
  }

  if (form.newPassword.length < 8) {
    throw new Error('La nueva contraseña debe tener al menos 8 caracteres');
  }

  if (form.newPassword !== form.confirmPassword) {
    throw new Error('Las contraseñas no coinciden');
  }
}
