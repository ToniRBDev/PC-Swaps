
# Creacion de especificacion dinamica en React + TypeScript

Esta guía detalla cómo implementar el formulario de creación de anuncios para **PC-SWAPS**, permitiendo que los campos técnicos cambien dinámicamente según la categoría seleccionada, utilizando **React** y **TypeScript**.

## 1. Contexto Técnico
Para cumplir con la especialización en componentes informáticos, el sistema utiliza un campo de tipo `JSONB` en la base de datos (PostgreSQL) y un `Map<String, Object>` en el backend (Spring Boot). En el frontend, esto se traduce en un objeto dinámico de TypeScript.

## 2. Modelado de Datos
El primer paso es definir los tipos de datos para asegurar que el compilador de TypeScript nos ayude a evitar errores.

```typescript
// Tipado estricto para las categorías iniciales del MVP
export type CategoriaSlug = "tarjeta-grafica" | "placa-base" | "procesador" | "ram" | "monitor";

// Interfaz para definir qué datos pediremos por cada característica
interface CampoTecnico {
  id: string;      // Clave que se guardará en el JSON
  label: string;   // Texto que verá el usuario
  placeholder: string;
}
```

## Diccionario de configuracion
- Este objeto actúa como la "fuente de verdad". Si en el futuro escalas la aplicación a periféricos o portátiles, solo tendrás que añadir una nueva clave aquí.

```typescript
const CONFIG_ESPECIFICACIONES: Record<CategoriaSlug, CampoTecnico[]> = {
  "tarjeta-grafica": [
    { id: "vram", label: "VRAM (GB)", placeholder: "e.g. 12GB" },
    { id: "tipo_memoria", label: "Tipo de Memoria", placeholder: "e.g. GDDR6X" },
    { id: "ensamblador", label: "Ensamblador", placeholder: "e.g. MSI, Gigabyte" }
  ],
  "ram": [
    { id: "capacidad", label: "Capacidad", placeholder: "e.g. 16GB (2x8)" },
    { id: "frecuencia", label: "Frecuencia (MHz)", placeholder: "e.g. 3600MHz" },
    { id: "tipo", label: "Generación", placeholder: "e.g. DDR4" }
  ],
  // ... añadir el resto de categorías según 01_Resumen.md
};
```
## Lofica del componente React
- Utilizamos dos estados: uno para la categoría y otro para el mapa de especificaciones.

```typescript
const [categoriaActual, setCategoriaActual] = useState<CategoriaSlug>("tarjeta-grafica");
const [especificaciones, setEspecificaciones] = useState<Record<string, string>>({});

// Manejador de cambios en inputs dinámicos
const handleSpecChange = (id: string, value: string) => {
  setEspecificaciones(prev => ({
    ...prev,
    [id]: value
  }));
};
```

## Renderizado en el formulario
- Dentro del JSX, iteramos sobre el diccionario para pintar los campos solo si existen para esa categoría.

``` typescript
{CONFIG_ESPECIFICACIONES[categoriaActual].map((campo) => (
  <div key={campo.id} className="group">
    <label className="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 block">
      {campo.label}
    </label>
    <input
      type="text"
      className="w-full bg-surface-container-lowest border-0 border-b-2 border-outline-variant focus:border-primary-dim focus:ring-0 text-on-surface font-body p-4 transition-all uppercase"
      placeholder={campo.placeholder}
      onChange={(e) => handleSpecChange(campo.id, e.target.value)}
    />
  </div>
))}
```

## Ventajas de esta Implementación
1. **Escalabilidad**: Cumple con el requisito no funcional de escalabilidad. Añadir componentes informáticos nuevos no requiere cambios en la estructura de la base de datos.

2. **Tipado Seguro**: TypeScript garantiza que no enviemos claves de "Monitor" cuando la categoría es "Procesador".

3. **Consistencia**: Los datos llegan al backend listos para ser persistidos en la columna especificaciones de la tabla Articulo.