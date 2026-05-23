import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import type { LoginRequest } from '../api/auth';
import { createUser } from '../api/users';
import type { CreateUserRequest } from '../api/users';
import { saveSession } from '../utils/session';

/**
 * Propiedades de la pagina de autenticacion.
 *
 * El modo decide si la pantalla muestra el formulario de login o el formulario
 * completo de registro.
 */
interface AuthPageProps {
  mode: 'login' | 'register';
}

/**
 * Estado de notificacion mostrado por formularios de autenticacion.
 */
type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

/**
 * Datos del formulario de registro incluyendo la confirmacion local de contrasena.
 */
interface RegisterForm extends CreateUserRequest {
  confirmPassword: string;
}

/**
 * Datos del formulario de inicio de sesion.
 */
type LoginForm = LoginRequest;

/**
 * Estado inicial del formulario de login.
 */
const initialLoginForm: LoginForm = {
  correoElectronico: '',
  password: '',
};

/**
 * Estado inicial del formulario de registro.
 */
const initialRegisterForm: RegisterForm = {
  nombre: '',
  apellidos: '',
  dni: '',
  correoElectronico: '',
  fechaNacimiento: '',
  nombreUsuario: '',
  password: '',
  confirmPassword: '',
};

/**
 * Pagina de inicio de sesion y registro de usuarios.
 *
 * Reutiliza la misma vista para autenticar usuarios existentes o crear nuevas
 * cuentas, validando los campos antes de llamar a la API correspondiente.
 *
 * @param props - Propiedades que indican el modo de la pagina.
 * @returns Formulario de login o registro.
 */
export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const isRegister = mode === 'register';
  const [notification, setNotification] = useState<Notification>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>(initialLoginForm);
  const [registerForm, setRegisterForm] =
    useState<RegisterForm>(initialRegisterForm);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotification(null);
    setIsSubmitting(true);

    try {
      if (isRegister) {
        await handleRegister();
      } else {
        await handleLogin();
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : isRegister
              ? 'No se ha podido crear la cuenta'
              : 'No se ha podido iniciar sesion',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    validateLoginForm(loginForm);

    const response = await login(loginForm);
    saveSession(response.token, response.idUsuario);

    navigate('/home');
  };

  const handleRegister = async () => {
    validateRegisterForm(registerForm);

    await createUser(getCreateUserPayload(registerForm));
    setNotification({
      type: 'success',
      message: 'Cuenta creada correctamente. Redirigiendo al login...',
    });
    window.setTimeout(() => navigate('/login'), 900);
  };

  const updateLoginField = (field: keyof LoginForm) => (value: string) => {
    setLoginForm((current) => ({ ...current, [field]: value }));
  };

  const updateRegisterField =
    (field: keyof RegisterForm) => (value: string) => {
      setRegisterForm((current) => ({ ...current, [field]: value }));
    };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-8 py-16">
      <section className="max-w-2xl mx-auto bg-zinc-950 border border-neutral-800 p-8 md:p-12">
        <Link
          to="/"
          className="inline-block mb-8 text-zinc-400 hover:text-red-600 uppercase text-xs font-bold tracking-widest"
        >
          Volver al inicio
        </Link>

        <h1 className="font-headline text-4xl font-black uppercase tracking-tight mb-8">
          {isRegister ? 'Crear cuenta' : 'Iniciar sesion'}
        </h1>

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

        <form className="space-y-5" onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <TextInput
                label="Nombre"
                name="nombre"
                onChange={updateRegisterField('nombre')}
                required
                value={registerForm.nombre}
              />
              <TextInput
                label="Apellidos"
                name="apellidos"
                onChange={updateRegisterField('apellidos')}
                required
                value={registerForm.apellidos}
              />
              <TextInput
                label="DNI"
                name="dni"
                onChange={updateRegisterField('dni')}
                required
                value={registerForm.dni}
              />
            </>
          )}

          <TextInput
            label="Correo electronico"
            name="correoElectronico"
            onChange={
              isRegister
                ? updateRegisterField('correoElectronico')
                : updateLoginField('correoElectronico')
            }
            required
            type="email"
            value={
              isRegister
                ? registerForm.correoElectronico
                : loginForm.correoElectronico
            }
          />

          {isRegister && (
            <>
              <TextInput
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                onChange={updateRegisterField('fechaNacimiento')}
                required
                type="date"
                value={registerForm.fechaNacimiento}
              />
              <TextInput
                label="Nombre de usuario"
                name="nombreUsuario"
                onChange={updateRegisterField('nombreUsuario')}
                required
                value={registerForm.nombreUsuario}
              />
            </>
          )}

          <TextInput
            label="Contrasena"
            name="password"
            onChange={
              isRegister
                ? updateRegisterField('password')
                : updateLoginField('password')
            }
            required
            type="password"
            value={isRegister ? registerForm.password : loginForm.password}
          />

          {isRegister && (
            <TextInput
              label="Confirmar contrasena"
              name="confirmPassword"
              onChange={updateRegisterField('confirmPassword')}
              required
              type="password"
              value={registerForm.confirmPassword}
            />
          )}

          <button
            className="w-full bg-red-600 text-white font-bold uppercase py-4 tracking-widest hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? isRegister
                ? 'Creando...'
                : 'Entrando...'
              : isRegister
                ? 'Crear cuenta'
                : 'Entrar'}
          </button>
        </form>

        <div className="mt-8 text-sm text-zinc-500">
          {isRegister ? (
            <Link className="text-red-500 hover:text-red-400" to="/login">
              Ya tengo cuenta
            </Link>
          ) : (
            <Link className="text-red-500 hover:text-red-400" to="/registro">
              Crear una cuenta nueva
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

/**
 * Propiedades del campo de texto reutilizado por la pagina de autenticacion.
 */
interface TextInputProps {
  label: string;
  name: string;
  onChange?: (value: string) => void;
  required?: boolean;
  type?: string;
  value?: string;
}

/**
 * Campo de formulario con etiqueta y estilos comunes para login y registro.
 *
 * @param props - Propiedades del campo.
 * @returns Control de entrada de texto.
 */
function TextInput({
  label,
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}: TextInputProps) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </span>
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-red-600"
        name={name}
        onChange={(event) => onChange?.(event.target.value)}
        required={required}
        type={type}
        value={value}
      />
    </label>
  );
}

/**
 * Valida que el formulario de login tenga las credenciales minimas.
 *
 * @param form - Datos actuales del formulario de login.
 * @throws Error cuando faltan correo electronico o contrasena.
 */
function validateLoginForm(form: LoginForm) {
  if (!form.correoElectronico.trim() || !form.password.trim()) {
    throw new Error('Introduce tu correo electronico y contrasena');
  }
}

/**
 * Valida los datos del formulario de registro antes de enviarlos al backend.
 *
 * @param form - Datos actuales del formulario de registro.
 * @throws Error cuando faltan campos, la contrasena es corta o no coincide.
 */
function validateRegisterForm(form: RegisterForm) {
  if (Object.values(form).some((value) => !value.trim())) {
    throw new Error('Completa todos los campos obligatorios');
  }

  if (form.password.length < 8) {
    throw new Error('La contrasena debe tener al menos 8 caracteres');
  }

  if (form.password !== form.confirmPassword) {
    throw new Error('Las contrasenas no coinciden');
  }
}

/**
 * Convierte el formulario de registro en el payload esperado por la API.
 *
 * @param form - Datos completos del formulario de registro.
 * @returns Datos de creacion de usuario sin la confirmacion de contrasena.
 */
function getCreateUserPayload(form: RegisterForm): CreateUserRequest {
  return {
    nombre: form.nombre,
    apellidos: form.apellidos,
    dni: form.dni,
    correoElectronico: form.correoElectronico,
    fechaNacimiento: form.fechaNacimiento,
    nombreUsuario: form.nombreUsuario,
    password: form.password,
  };
}
