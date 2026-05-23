import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createArticle, getArticle, updateArticle } from '../api/articles';
import { getCategories } from '../api/categories';
import type { CategoryResponse } from '../api/categories';
import type { EstadoArticulo } from '../types/enums/estado-articulo';
import { MAX_IMAGE_SIZE_LABEL, validateImageSize } from '../utils/files';
import { getBackendImageUrl } from '../utils/images';

/**
 * Estados disponibles para publicar o editar un articulo.
 */
const articleStates: EstadoArticulo[] = [
  'NUEVO_CON_ETIQUETAS',
  'COMO_NUEVO',
  'MUY_BUENO',
  'BUENO',
  'ACEPTABLE',
  'PARA_REPARAR',
];

/**
 * Estado local del formulario de creacion y edicion de anuncios.
 */
interface ListingForm {
  marca: string;
  modelo: string;
  idCategoria: string;
  estado: EstadoArticulo;
  precio: string;
  descripcion: string;
  imagen: File | null;
}

/**
 * Estado de notificacion para la publicacion de anuncios.
 */
type Notification =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

/**
 * Pagina para crear un anuncio nuevo o editar uno existente.
 *
 * Usa el parametro de busqueda `editar` para activar el modo edicion, cargar el
 * articulo actual y permitir guardar cambios sin exigir una nueva imagen.
 *
 * @returns Formulario de publicacion o edicion de anuncio.
 */
export default function CreateListingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = Number(searchParams.get('editar'));
  const isEditMode = Number.isFinite(editId) && editId > 0;
  const [notification, setNotification] = useState<Notification>(null);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryResponse[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingArticle, setIsLoadingArticle] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | undefined>();
  const [form, setForm] = useState<ListingForm>({
    marca: '',
    modelo: '',
    idCategoria: '',
    estado: articleStates[0],
    precio: '',
    descripcion: '',
    imagen: null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getCategories();
        setAvailableCategories(categories);
        setForm((current) => ({
          ...current,
          idCategoria: current.idCategoria || String(categories[0]?.idCategoria ?? ''),
        }));
      } catch (error) {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se han podido cargar las categorias',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadArticle = async () => {
      try {
        const article = await getArticle(editId);
        setCurrentImage(article.imagen);
        setForm((current) => ({
          ...current,
          marca: article.marca,
          modelo: article.modelo,
          idCategoria: String(article.categoria.idCategoria),
          estado: article.estado,
          precio: String(article.precio),
          descripcion: article.descripcion,
          imagen: null,
        }));
      } catch (error) {
        setNotification({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'No se ha podido cargar el anuncio',
        });
      } finally {
        setIsLoadingArticle(false);
      }
    };

    void loadArticle();
  }, [editId, isEditMode]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    try {
      validateListingForm(form, isEditMode);
      const payload = {
        idCategoria: Number(form.idCategoria),
        marca: form.marca,
        modelo: form.modelo,
        estado: form.estado,
        precio: Number(form.precio),
        descripcion: form.descripcion,
      };
      const article = isEditMode
        ? await updateArticle(editId, payload, form.imagen ?? undefined)
        : await createArticle(payload, getRequiredImage(form.imagen));

      setNotification({
        type: 'success',
        message: isEditMode
          ? 'Anuncio actualizado correctamente'
          : 'Anuncio creado correctamente',
      });
      window.setTimeout(() => navigate(`/producto/${article.idArticulo}`), 900);
    } catch (error) {
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'No se ha podido crear el anuncio',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const imageName =
    form.imagen?.name ??
    `JPG, PNG, WebP (1 imagen, max. ${MAX_IMAGE_SIZE_LABEL})`;

  const handleImageChange = (file?: File) => {
    if (!file) {
      setForm((current) => ({ ...current, imagen: null }));
      return;
    }

    try {
      validateImageSize(file);
      setNotification(null);
      setForm((current) => ({ ...current, imagen: file }));
    } catch (error) {
      setForm((current) => ({ ...current, imagen: null }));
      setNotification({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : `La imagen no puede superar los ${MAX_IMAGE_SIZE_LABEL}`,
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#0e0e0f] text-white px-4 py-10 md:px-8 md:py-16">
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
            {isEditMode ? 'Editar' : 'Desplegar'}{' '}
            <span className="text-red-600 italic">anuncio</span>
          </h1>
          <p className="text-zinc-500 tracking-[0.3em] text-[10px] uppercase">
            Terminal / Marketplace / {isEditMode ? 'Editar activo' : 'Nuevo activo'}
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
                      disabled={isLoadingCategories}
                      required
                      value={form.idCategoria}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          idCategoria: event.target.value,
                        }))
                      }
                    >
                      {availableCategories.map((category) => (
                        <option
                          key={category.idCategoria}
                          value={category.idCategoria}
                        >
                          {category.nombreCategoria}
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
              {isEditMode && currentImage && !form.imagen && (
                <img
                  alt="Imagen actual del producto"
                  className="mt-6 max-h-48 w-full object-contain opacity-70"
                  src={getBackendImageUrl(currentImage)}
                />
              )}
              <input
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                id="imagen"
                name="imagen"
                onChange={(event) =>
                  handleImageChange(event.target.files?.[0])
                }
                required={!isEditMode}
                type="file"
              />
            </label>
          </section>

          <div className="lg:col-span-12 mt-4">
            <button
              className="w-full py-4 md:py-8 bg-gradient-to-r from-red-600 to-[#ff7763] text-black font-headline text-lg md:text-2xl font-black uppercase tracking-tight md:tracking-tighter hover:shadow-[0_0_30px_rgba(235,0,0,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 md:gap-4 group disabled:opacity-60"
              disabled={isSubmitting || isLoadingCategories || isLoadingArticle}
              type="submit"
            >
              {isSubmitting
                ? isEditMode
                  ? 'Actualizando anuncio...'
                  : 'Creando anuncio...'
                : isEditMode
                  ? 'Actualizar anuncio'
                  : 'Crear anuncio'}
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

/**
 * Propiedades del campo de texto reutilizado en el formulario de anuncio.
 */
interface TextInputProps {
  label: string;
  name: string;
  onChange: (value: string) => void;
  placeholder: string;
  value: string;
}

/**
 * Campo de texto con etiqueta y estilos del formulario de anuncio.
 *
 * @param props - Propiedades del campo.
 * @returns Entrada de texto controlada.
 */
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

/**
 * Valida los campos obligatorios del formulario de anuncio.
 *
 * @param form - Estado actual del formulario.
 * @param isEditMode - Indica si se esta editando un anuncio existente.
 * @throws Error cuando falta algun dato obligatorio o el precio no es valido.
 */
function validateListingForm(
  form: ListingForm,
  isEditMode: boolean,
): asserts form is ListingForm & { imagen: File | null } {
  if (!form.idCategoria) {
    throw new Error('Selecciona una categoria');
  }

  if (!form.marca.trim() || !form.modelo.trim()) {
    throw new Error('La marca y el modelo son obligatorios');
  }

  if (Number(form.precio) <= 0) {
    throw new Error('El precio debe ser mayor que cero');
  }

  if (!form.descripcion.trim()) {
    throw new Error('La descripcion es obligatoria');
  }

  if (!isEditMode && !form.imagen) {
    throw new Error('Selecciona una imagen del producto');
  }
}

/**
 * Garantiza que existe una imagen antes de crear un anuncio nuevo.
 *
 * @param image - Imagen seleccionada en el formulario.
 * @returns Archivo de imagen confirmado.
 * @throws Error cuando no se ha seleccionado ninguna imagen.
 */
function getRequiredImage(image: File | null) {
  if (!image) {
    throw new Error('Selecciona una imagen del producto');
  }

  return image;
}
