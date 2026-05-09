import { Link } from 'react-router-dom';

interface AuthPageProps {
  mode: 'login' | 'register';
}

export default function AuthPage({ mode }: AuthPageProps) {
  const isRegister = mode === 'register';

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

        <form className="space-y-5">
          {isRegister && (
            <>
              <TextInput label="Nombre" name="nombre" />
              <TextInput label="Apellidos" name="apellidos" />
              <TextInput label="DNI" name="dni" />
            </>
          )}

          <TextInput
            label="Correo electronico"
            name="correoElectronico"
            type="email"
          />

          {isRegister && (
            <>
              <TextInput
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
              />
              <TextInput label="Nombre de usuario" name="nombreUsuario" />
            </>
          )}

          <TextInput label="Contrasena" name="password" type="password" />

          <button
            className="w-full bg-red-600 text-white font-bold uppercase py-4 tracking-widest hover:bg-red-500"
            type="button"
          >
            {isRegister ? 'Crear cuenta' : 'Entrar'}
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

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
}

function TextInput({ label, name, type = 'text' }: TextInputProps) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
        {label}
      </span>
      <input
        className="w-full bg-neutral-900 border border-neutral-700 px-4 py-3 text-white focus:outline-none focus:border-red-600"
        name={name}
        type={type}
      />
    </label>
  );
}
