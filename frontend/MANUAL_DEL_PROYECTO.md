# PC-Swaps Frontend — Manual Completo del Proyecto

## Índice

1. [Visión General](#1-visión-general)
2. [Configuración Inicial del Proyecto](#2-configuración-inicial-del-proyecto)
   - [2.1 Crear el proyecto con Vite](#21-crear-el-proyecto-con-vite)
   - [2.2 Instalar dependencias](#22-instalar-dependencias)
   - [2.3 Configurar TypeScript](#23-configurar-typescript)
   - [2.4 Configurar Vite](#24-configurar-vite)
   - [2.5 Configurar ESLint](#25-configurar-eslint)
   - [2.6 Configurar Prettier](#26-configurar-prettier)
   - [2.7 Configurar VS Code](#27-configurar-vs-code)
   - [2.8 Configurar Tailwind CSS v4](#28-configurar-tailwind-css-v4)
   - [2.9 Configurar index.html](#29-configurar-indexhtml)
   - [2.10 Configurar .gitignore](#210-configurar-gitignore)
3. [Estructura del Proyecto](#3-estructura-del-proyecto)
   - [3.1 Árbol de directorios completo](#31-árbol-de-directorios-completo)
4. [Tipos e Interfaces (src/types/)](#4-tipos-e-interfaces-srctypes)
   - [4.1 Estado de artículo](#41-estado-de-artículo)
   - [4.2 Producto](#42-producto)
   - [4.3 Usuario](#43-usuario)
   - [4.4 Vendedor](#44-vendedor)
   - [4.5 Conversación](#45-conversación)
5. [Capa de API (src/api/)](#5-capa-de-api-srcapi)
   - [5.1 Cliente HTTP](#51-cliente-http)
   - [5.2 Autenticación](#52-autenticación)
   - [5.3 Artículos](#53-artículos)
   - [5.4 Categorías](#54-categorías)
   - [5.5 Conversaciones](#55-conversaciones)
   - [5.6 Usuarios](#56-usuarios)
   - [5.7 Seguimientos](#57-seguimientos)
6. [Utilidades (src/utils/)](#6-utilidades-srcutils)
   - [6.1 Gestión de sesión](#61-gestión-de-sesión)
   - [6.2 Imágenes](#62-imágenes)
   - [6.3 Usuarios de conversación](#63-usuarios-de-conversación)
7. [Estado Global (src/context/)](#7-estado-global-srccontext)
   - [7.1 Contexto de Conversaciones](#71-contexto-de-conversaciones)
8. [Datos de Prueba (src/data/)](#8-datos-de-prueba-srcdata)
9. [Componentes (src/components/)](#9-componentes-srccomponents)
   - [9.1 Navbar (Layout)](#91-navbar-layout)
   - [9.2 ProductCard (UI)](#92-productcard-ui)
   - [9.3 BackButton (UI)](#93-backbutton-ui)
   - [9.4 FollowedProductsSection (Secciones)](#94-followedproductssection-secciones)
10. [Páginas (src/pages/)](#10-páginas-srcpages)
    - [10.1 LandingPage](#101-landingpage)
    - [10.2 HomePage](#102-homepage)
    - [10.3 AuthPage](#103-authpage)
    - [10.4 ProductDetailPage](#104-productdetailpage)
    - [10.5 CreateListingPage](#105-createlistingpage)
    - [10.6 EditProfilePage](#106-editprofilepage)
    - [10.7 ChangePasswordPage](#107-changepasswordpage)
    - [10.8 MyAdsPage](#108-myasdpage)
    - [10.9 ConversationsPage](#109-conversationspage)
    - [10.10 ChatPage](#1010-chatpage)
    - [10.11 SellerInfoPage](#1011-sellerinfopage)
11. [Enrutamiento (src/App.tsx)](#11-enrutamiento-srcapptsx)
12. [Estilos y Diseño](#12-estilos-y-diseño)
13. [Puntos de Entrada](#13-puntos-de-entrada)
14. [Resumen de Endpoints del Backend](#14-resumen-de-endpoints-del-backend)
15. [Scripts Disponibles](#15-scripts-disponibles)

---

## 1. Visión General

**PC-Swaps** es un marketplace de hardware de PC. Los usuarios pueden comprar, vender, seguir artículos, chatear con vendedores y gestionar sus anuncios.

- **Tecnologías:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, React Router v7, React Compiler
- **Idioma:** Interfaz en español
- **Diseño:** Tema oscuro con acentos en rojo
- **Iconos:** Google Material Symbols
- **Autenticación:** JWT almacenado en localStorage
- **Estado:** React Context + estado local de componentes

---

## 2. Configuración Inicial del Proyecto

### 2.1 Crear el proyecto con Vite

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
```

Esto genera un proyecto React con TypeScript usando Vite como bundler.

### 2.2 Instalar dependencias

#### Dependencias de producción

```bash
npm install react@^19.2.5 react-dom@^19.2.5 react-router-dom@^7.14.2 @tailwindcss/vite@^4.2.4
```

| Paquete | Propósito |
|---------|-----------|
| `react` | Biblioteca UI (v19) |
| `react-dom` | Renderizado en DOM |
| `react-router-dom` | Enrutamiento cliente (v7) |
| `@tailwindcss/vite` | Plugin de Tailwind CSS v4 para Vite |

#### Dependencias de desarrollo

```bash
npm install -D \
  typescript@~6.0.2 \
  vite@^8.0.10 \
  @vitejs/plugin-react@^6.0.1 \
  @rolldown/plugin-babel@^0.2.3 \
  @babel/core@^7.29.0 \
  @types/babel__core@^7.20.5 \
  babel-plugin-react-compiler@^1.0.0 \
  tailwindcss@^4.2.4 \
  eslint@^10.2.1 \
  @eslint/js@^10.0.1 \
  typescript-eslint@^8.58.2 \
  eslint-plugin-react-hooks@^7.1.1 \
  eslint-plugin-react-refresh@^0.5.2 \
  globals@^17.5.0 \
  @types/react@^19.2.14 \
  @types/react-dom@^19.2.3 \
  @types/node@^24.12.2
```

| Paquete | Propósito |
|---------|-----------|
| `typescript` | Compilador TS (v6) |
| `vite` | Bundler y dev server (v8) |
| `@vitejs/plugin-react` | React Fast Refresh para Vite |
| `@rolldown/plugin-babel` | Plugin Babel para Rolldown (usado en Vite 8) |
| `@babel/core` | Núcleo de Babel |
| `babel-plugin-react-compiler` | React Compiler (memoización automática) |
| `tailwindcss` | Tailwind CSS v4 |
| `eslint` | Linter (v10 flat config) |
| `@eslint/js` | Reglas base de ESLint |
| `typescript-eslint` | Integración TS con ESLint |
| `eslint-plugin-react-hooks` | Reglas de hooks de React |
| `eslint-plugin-react-refresh` | Reglas para React Refresh |
| `globals` | Definiciones de variables globales |
| `@types/*` | Definiciones de tipo |

### 2.3 Configurar TypeScript

#### `tsconfig.json` (raíz)

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Usa referencias a dos configuraciones separadas: una para el código de la app y otra para el código de Node (vite.config.ts).

#### `tsconfig.app.json`

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"]
  },
  "include": ["src"]
}
```

- **Target ES2023** — últimas características de JS
- **Module ESNext** con resolución bundler — para que Vite lo procese
- **JSX react-jsx** — no requiere `import React` en cada archivo
- **Strict** — modo estricto habilitado
- **noUnusedLocals / noUnusedParameters** — evita código muerto

#### `tsconfig.node.json`

```json
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts"]
}
```

Igual que el anterior pero con tipos de Node para `vite.config.ts`.

### 2.4 Configurar Vite

#### `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),                                          // React Fast Refresh + HMR
    tailwindcss(),                                    // Tailwind CSS v4
    babel({ presets: [reactCompilerPreset()] }),      // React Compiler
  ],
});
```

Tres plugins trabajando juntos:
1. **@vitejs/plugin-react** — Hot Module Replacement y React Fast Refresh
2. **@tailwindcss/vite** — Procesamiento de Tailwind CSS v4 (sin archivo de configuración)
3. **@rolldown/plugin-babel** con `reactCompilerPreset` — React Compiler para optimizar re-renderizados automáticamente

### 2.5 Configurar ESLint

#### `eslint.config.js` (flat config de ESLint 10)

```javascript
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  // ... (configuración extendida de JS + TS + React)
);
```

Incluye:
- Reglas recomendadas de `@eslint/js`
- Reglas recomendadas de `typescript-eslint`
- Plugin `react-hooks` con configuración flat
- Plugin `react-refresh` para Vite

### 2.6 Configurar Prettier

#### `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

- Punto y coma obligatorio
- Comillas simples
- Indentación de 2 espacios
- Comas finales en ES5
- Ancho máximo de 80 caracteres

### 2.7 Configurar VS Code

#### `.vscode/settings.json`

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

Prettier como formateador por defecto, formatea al guardar.

### 2.8 Configurar Tailwind CSS v4

Tailwind v4 usa un enfoque "CSS-first": no hay archivo `tailwind.config.js`. La configuración se hace en el CSS.

#### `src/index.css`

```css
@import 'tailwindcss';

.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  display: inline-block;
  white-space: nowrap;
  direction: ltr;
  font-feature-settings: 'liga';
  -webkit-font-smoothing: antialiased;
}
```

La directiva `@import 'tailwindcss'` es todo lo que se necesita. Las clases de utilidad de Tailwind están disponibles globalmente sin configuración adicional.

Se añade también la clase para los iconos Material Symbols.

### 2.9 Configurar index.html

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>com.tonidev.pcswaps</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Carga la fuente Material Symbols desde Google Fonts. El punto de entrada es `/src/main.tsx`.

### 2.10 Configurar .gitignore

```
logs
node_modules
dist
dist-ssr
*.local
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
```

---

## 3. Estructura del Proyecto

### 3.1 Árbol de directorios completo

```
frontend/
├── .gitignore
├── .prettierrc
├── .vscode/
│   └── settings.json
├── eslint.config.js
├── FRONTEND_INSTRUCTIONS.md        # Instrucciones para desarrollo
├── index.html                       # Entrada HTML
├── package.json
├── package-lock.json
├── public/
│   ├── favicon.svg                  # Logo de Vite
│   └── icons.svg                    # SVGs de redes sociales
├── src/
│   ├── api/                         # Capa de servicios HTTP
│   │   ├── articles.ts              # CRUD de artículos
│   │   ├── auth.ts                  # Login
│   │   ├── categories.ts            # Obtener categorías
│   │   ├── client.ts                # Cliente HTTP genérico
│   │   ├── conversations.ts         # Conversaciones y mensajes
│   │   ├── follows.ts               # Seguir/dejar de seguir artículos
│   │   └── users.ts                 # Perfil, registro, password
│   ├── App.tsx                      # Componente raíz con rutas
│   ├── components/
│   │   ├── layout/
│   │   │   └── Navbar.tsx           # Barra de navegación superior
│   │   ├── sections/
│   │   │   └── FollowedProductsSection.tsx  # Sección de seguidos
│   │   └── ui/
│   │       ├── BackButton.tsx       # Botón "Volver atrás"
│   │       └── ProductCard.tsx      # Tarjeta de producto
│   ├── context/
│   │   └── ConversationsContext.tsx  # Estado global de conversaciones
│   ├── data/                        # Datos mock (temporales)
│   │   ├── categories.ts
│   │   ├── conversations.ts
│   │   ├── currentUser.ts
│   │   ├── followedProducts.ts
│   │   ├── products.ts
│   │   └── sellers.ts
│   ├── index.css                    # Tailwind import + Material Symbols
│   ├── main.tsx                     # Punto de entrada React
│   ├── pages/                       # Páginas de la aplicación
│   │   ├── AuthPage.tsx             # Login / Registro
│   │   ├── ChangePasswordPage.tsx   # Cambiar contraseña
│   │   ├── ChatPage.tsx             # Chat en tiempo real
│   │   ├── ConversationsPage.tsx    # Lista de conversaciones
│   │   ├── CreateListingPage.tsx    # Crear / Editar anuncio
│   │   ├── EditProfilePage.tsx      # Editar perfil
│   │   ├── HomePage.tsx             # Página principal del marketplace
│   │   ├── LandingPage.tsx          # Landing page pública
│   │   ├── MyAdsPage.tsx            # Gestión de anuncios del usuario
│   │   ├── ProductDetailPage.tsx    # Detalle de producto
│   │   └── SellerInfoPage.tsx       # Información de contacto del vendedor
│   ├── types/                       # Definiciones de tipo
│   │   ├── conversation.ts
│   │   ├── enums/
│   │   │   └── estado-articulo.ts   # Enum de estado del artículo
│   │   ├── product.ts
│   │   ├── seller.ts
│   │   └── user.ts
│   └── utils/                       # Funciones de utilidad
│       ├── conversationUsers.ts     # Extraer otro usuario de conversación
│       ├── images.ts                # Resolver URLs de imágenes del backend
│       └── session.ts               # Gestión de token JWT en localStorage
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 4. Tipos e Interfaces (src/types/)

Todas las definiciones de tipo TypeScript que modelan los datos de la aplicación.

### 4.1 Estado de artículo

**`src/types/enums/estado-articulo.ts`**

```typescript
export type EstadoArticulo =
  | 'NUEVO_CON_ETIQUETAS'   // Nuevo con etiquetas
  | 'COMO_NUEVO'             // Como nuevo
  | 'MUY_BUENO'              // Muy bueno
  | 'BUENO'                  // Bueno
  | 'ACEPTABLE'              // Aceptable
  | 'PARA_REPARAR';          // Para reparar
```

Union type que representa los 6 estados posibles de un artículo de hardware.

### 4.2 Producto

**`src/types/product.ts`**

```typescript
export type CategoriaSlug =
  | 'tarjeta-grafica'
  | 'placa-base'
  | 'procesador'
  | 'ram'
  | 'monitor';

export interface ProductCardData {
  idArticulo: number;
  imagen: string;
  marca: string;
  modelo: string;
  precio: number;
  estado: EstadoArticulo;
}

export interface Product extends ProductCardData {
  categoria: CategoriaSlug;
  descripcion: string;
  fechaPublicacion: string;
  numeroVisitas: number;
  fechaUltimaRenovacion?: string;
  activo?: boolean;
  especificaciones: Record<string, string>;
}
```

- `ProductCardData` — datos mínimos para mostrar una tarjeta
- `Product` — extiende con información completa del artículo
- `CategoriaSlug` — slugs de las 5 categorías de hardware

### 4.3 Usuario

**`src/types/user.ts`**

```typescript
export interface UserProfile {
  idUsuario: number;
  nombre: string;
  apellidos: string;
  dni: string;
  correoElectronico: string;
  fechaNacimiento: string;
  nombreUsuario: string;
  direccion?: string;
  numTelefono?: string;
  imagenUsuario?: string;
}
```

Perfil completo del usuario con campos opcionales para dirección, teléfono e imagen.

### 4.4 Vendedor

**`src/types/seller.ts`**

```typescript
export interface SellerContact {
  idUsuario: number;
  nombreUsuario: string;
  correoElectronico?: string;
  direccion?: string;
  numTelefono?: string;
  imagenUsuario?: string;
}
```

Información de contacto pública de un vendedor (subconjunto del perfil de usuario).

### 4.5 Conversación

**`src/types/conversation.ts`**

```typescript
export interface ConversationMessage {
  idMensaje: number;
  contenido: string;
  fecha: string;
  enviadoPorMi: boolean;
  leido: boolean;
}

export interface Conversation {
  idConversacion: number;
  idArticulo: number;
  vendedor: string;
  fechaInicio: string;
  mensajes: ConversationMessage[];
}
```

- `ConversationMessage` — un mensaje individual con flag de leído y de ownership
- `Conversation` — agrupa mensajes con referencia al artículo y vendedor

---

## 5. Capa de API (src/api/)

Toda la comunicación con el backend está centralizada en esta carpeta.

### 5.1 Cliente HTTP

**`src/api/client.ts`**

Función genérica `apiRequest<TResponse>(path, options)`:

```typescript
const BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api';

export async function apiRequest<TResponse = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  // 1. Obtiene el token JWT localStorage
  // 2. Construye la URL completa (BASE_URL + path)
  // 3. Añade header Authorization: Bearer <token>
  // 4. Serializa body a JSON (o usa FormData para uploads)
  // 5. Maneja respuestas 204 No Content
  // 6. Extrae mensajes de error del JSON de respuesta
  // 7. Lanza errores con mensajes descriptivos
}
```

**Características clave:**
- Token JWT automático en cada petición
- Soporte para `FormData` (multipart para subida de imágenes)
- Soporte para `204 No Content`
- Manejo de errores centralizado extrayendo mensajes del backend

**Variable de entorno:**
- `VITE_API_BASE_URL` — URL base de la API (por defecto `http://localhost:8080/api`)

### 5.2 Autenticación

**`src/api/auth.ts`**

```typescript
export async function login(credentials: {
  correoElectronico: string;
  password: string;
}): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
// LoginResponse = { token: string; idUsuario: number }
```

Una sola función: `POST /auth/login` que devuelve token JWT e ID de usuario.

### 5.3 Artículos

**`src/api/articles.ts`**

| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `createArticle(article, imageFile)` | POST | `/articulos` | Crear artículo con imagen (multipart) |
| `getArticle(idArticulo)` | GET | `/articulos/:id` | Obtener un artículo |
| `getArticles()` | GET | `/articulos` | Listar todos los artículos |
| `getArticlesByCategory(idCategoria)` | GET | `/articulos/categoria/:id` | Filtrar por categoría |
| `getMyArticles()` | GET | `/articulos/propios` | Artículos del usuario actual |
| `updateArticle(id, article, image?)` | PUT | `/articulos/:id` | Actualizar artículo (multipart) |
| `renewArticle(idArticulo)` | PUT | `/articulos/:id/renovar` | Renovar anuncio |
| `deleteArticle(idArticulo)` | DELETE | `/articulos/:id` | Eliminar artículo |

Las funciones `createArticle` y `updateArticle` construyen un `FormData` para enviar tanto los datos JSON como el archivo de imagen.

### 5.4 Categorías

**`src/api/categories.ts`**

```typescript
export async function getCategories(): Promise<CategoryResponse[]> {
  return apiRequest<CategoryResponse[]>('/categorias');
}
```

Obtiene la lista de categorías de hardware disponibles.

### 5.5 Conversaciones

**`src/api/conversations.ts`**

| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `getMyConversations()` | GET | `/conversaciones` | Listar conversaciones del usuario |
| `startConversation(idArticulo)` | POST | `/conversaciones` | Iniciar nueva conversación sobre un artículo |
| `getConversation(idConversacion)` | GET | `/conversaciones/:id` | Obtener una conversación |
| `deleteConversation(idConversacion)` | DELETE | `/conversaciones/:id` | Eliminar conversación |
| `sendConversationMessage(idConv, contenido)` | POST | `/mensajes` | Enviar mensaje en conversación |
| `markConversationAsRead(idConv)` | PUT | `/mensajes/conversacion/:id/leer` | Marcar conversación como leída |

### 5.6 Usuarios

**`src/api/users.ts`**

| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `createUser(user)` | POST | `/usuarios/registro` | Registrar nuevo usuario |
| `getMyProfile()` | GET | `/usuarios/me` | Obtener perfil propio |
| `getUserContact(idUsuario)` | GET | `/usuarios/:id/contacto` | Obtener contacto de un usuario |
| `updateMyProfile(user)` | PUT | `/usuarios/me` | Actualizar perfil |
| `updateMyProfileImage(file)` | PUT | `/usuarios/me/imagen` | Subir foto de perfil (multipart) |
| `changeMyPassword({current, new})` | PUT | `/usuarios/me/password` | Cambiar contraseña |

### 5.7 Seguimientos

**`src/api/follows.ts`**

| Función | Método | Endpoint | Descripción |
|---------|--------|----------|-------------|
| `getFollowedArticles()` | GET | `/seguimientos` | Artículos que sigo |
| `followArticle(idArticulo)` | POST | `/seguimientos/:id` | Seguir un artículo |
| `unfollowArticle(idArticulo)` | DELETE | `/seguimientos/:id` | Dejar de seguir artículo |

---

## 6. Utilidades (src/utils/)

### 6.1 Gestión de sesión

**`src/utils/session.ts`**

Gestiona la autenticación mediante localStorage con dos claves:

| Clave | Descripción |
|-------|-------------|
| `pcswaps_token` | Token JWT |
| `pcswaps_user_id` | ID del usuario autenticado |

```typescript
export function getSessionToken(): string | null;
export function getSessionUserId(): number | null;
export function saveSession(token: string, idUsuario: number): void;
export function clearSession(): void;
```

- `getSessionToken()` — usado por el cliente HTTP para el header `Authorization`
- `getSessionUserId()` — usado para identificar al usuario actual
- `saveSession()` — llamado tras login exitoso
- `clearSession()` — llamado al cerrar sesión

### 6.2 Imágenes

**`src/utils/images.ts`**

```typescript
export function getBackendImageUrl(image?: string | null): string | undefined;
```

Convierte rutas relativas de imágenes del backend a URLs completas. Si la imagen ya es una URL absoluta (http/https), la devuelve sin cambios. Si es `null` o `undefined`, devuelve `undefined`.

### 6.3 Usuarios de conversación

**`src/utils/conversationUsers.ts`**

```typescript
export function getOtherConversationUser(
  conversation: Conversation,
  currentUserId: number | null
): string;
```

Extrae el nombre del otro participante en una conversación (el que no es el usuario actual).

---

## 7. Estado Global (src/context/)

### 7.1 Contexto de Conversaciones

**`src/context/ConversationsContext.tsx`**

Proporciona estado global para las conversaciones:

```typescript
interface ConversationsContextType {
  conversations: Conversation[];
  deleteConversation: (id: number) => void;
  hasUnreadMessages: boolean;
  markConversationAsRead: (id: number) => void;
  sendMessage: (conversationId: number, content: string) => void;
}
```

- Se inicializa con datos mock de `data/conversations.ts`
- `hasUnreadMessages` — detecta si hay mensajes no enviados por el usuario actual que no estén leídos
- Usado por el `Navbar` para mostrar un indicador de no leídos (punto rojo) en el icono de mensajes

> **Nota:** Este contexto se inicializa con datos mock pero está diseñado para integrarse con la API real.

---

## 8. Datos de Prueba (src/data/)

Datos mock usados durante el desarrollo. Son temporales y deben reemplazarse por llamadas API.

| Archivo | Contenido |
|---------|-----------|
| `products.ts` | 2 productos de ejemplo (RTX 4090, Ryzen 9 7950X3D) |
| `categories.ts` | 5 categorías con slug, nombre e icono de Material |
| `sellers.ts` | 2 vendedores indexados por ID de artículo |
| `conversations.ts` | 2 conversaciones con mensajes |
| `currentUser.ts` | Usuario "tonidev" con perfil completo |
| `followedProducts.ts` | 3 productos seguidos |

---

## 9. Componentes (src/components/)

### 9.1 Navbar (Layout)

**`src/components/layout/Navbar.tsx`** — 238 líneas

Barra de navegación superior fija (sticky) con:

- **Logo** "PC-SWAPS" enlazado a `/home`
- **Menú "Mis anuncios"** — dropdown con "Ver mis anuncios" y "Publicar anuncio"
- **"Mis mensajes"** — enlace a `/mis-conversaciones` con indicador de no leídos (punto rojo)
- **Buscador** — input que navega a `/home?search=...`
- **Menú de usuario** — dropdown con:
  - Avatar/imagen de perfil o iniciales
  - Modificar perfil
  - Cambiar contraseña
  - Cerrar sesión (limpia localStorage)
  - Eliminar cuenta (con modal de confirmación)

**Características técnicas:**
- Obtiene el perfil del usuario desde la API al montarse (`getMyProfile()`)
- Escucha el evento personalizado `pcswaps:profile-updated` para refrescar el avatar sin recargar
- Oculta el navbar en las rutas `/`, `/login`, `/registro`

### 9.2 ProductCard (UI)

**`src/components/ui/ProductCard.tsx`** — 49 líneas

Tarjeta de producto con:

- Imagen con relación de aspecto 4:5
- Marca y modelo
- Estado del artículo
- Precio
- Botón "Ver artículo" que enlaza a `/producto/:id`

**Efectos visuales:**
- La imagen está en escala de grises por defecto, se colorea al hacer hover
- La imagen hace un scale-up suave al hacer hover
- Barra de acento roja aparece en hover debajo de la tarjeta
- Tema oscuro con fondo `bg-[#131314]`

### 9.3 BackButton (UI)

**`src/components/ui/BackButton.tsx`** — 20 líneas

```typescript
interface BackButtonProps {
  label?: string;  // Por defecto: "Volver atrás"
}
```

Botón simple con icono de flecha que llama a `useNavigate()(-1)` para volver a la página anterior.

### 9.4 FollowedProductsSection (Secciones)

**`src/components/sections/FollowedProductsSection.tsx`** — 42 líneas

Sección que muestra una cuadrícula de productos seguidos por el usuario:

- Solo se renderiza si hay productos (si el array está vacío, devuelve `null`)
- Título "Seguimiento" con icono de visibilidad
- Transforma los datos de la API (`ArticleCardResponse`) al formato `ProductCardData` con URLs de imagen resueltas
- Usa el componente `ProductCard` para renderizar cada producto

---

## 10. Páginas (src/pages/)

### 10.1 LandingPage

**`src/pages/LandingPage.tsx`** — 266 líneas · Ruta: `/`

Página pública de marketing (sin navbar, accesible sin autenticación).

**Secciones:**
1. **Navegación** — logo + enlaces que apuntan a `/login`
2. **Hero** — imagen de fondo, eslogan "Domina el Mercado del Hardware", CTAs "Explorar Inventario" y "Vender Componente"
3. **Features** — 3 columnas: Especialización Elite, Sostenibilidad, Ahorro
4. **Productos destacados** — grid de 4 artículos hardcodeados (RTX 5090, Ryzen 7 9800X3D, RX 9070 XT, i9-14900K)
5. **CTA final** — "Crear cuenta" / "Iniciar sesión"
6. **Footer** — copyright + iconos de redes sociales (Bluesky, Discord, GitHub, X)

### 10.2 HomePage

**`src/pages/HomePage.tsx`** — 330 líneas · Ruta: `/home`

Marketplace principal con:

1. **Título hero** — "Explora el Mercado de Hardware"
2. **Categorías** — grid de 5 categorías con iconos de Material. Al hacer clic, filtra productos por categoría vía API
3. **Productos** — grid de tarjetas de producto con:
   - Vista previa de 3 productos + botón "Ver todo" que expande a lista paginada
   - Filtro por búsqueda (`?search=`)
   - Paginación con controles
4. **Productos seguidos** — sección `FollowedProductsSection` (visible solo sin filtros activos)
5. **Notificaciones** — banners de éxito/error
6. **Estados de carga** — skeletons/spinners mientras carga

**Lógica de categorías:**
- Mapeo `apiTerms` que convierte slugs del frontend a nombres de categoría de la API con normalización de acentos

### 10.3 AuthPage

**`src/pages/AuthPage.tsx`** — 314 líneas · Rutas: `/login`, `/registro`

Página dual de autenticación controlada por prop `mode`.

**Modo Login:**
- Campos: email, contraseña
- Validación: campos no vacíos
- Al hacer submit: llama a `login()`, guarda sesión en localStorage, redirige a `/home`

**Modo Registro:**
- Campos: nombre, apellidos, DNI, email, fecha de nacimiento, nombre de usuario, contraseña, confirmar contraseña
- Validación: todos obligatorios, contraseña ≥ 8 caracteres, coincidencia de contraseñas
- Al hacer submit: llama a `createUser()`, muestra éxito, redirige a `/login` tras 900ms

**Sub-componente:** `TextInput` definido inline con label, input y mensaje de error.

### 10.4 ProductDetailPage

**`src/pages/ProductDetailPage.tsx`** — 347 líneas · Ruta: `/producto/:id`

Vista detallada de un producto con:

- **Imagen grande** con efecto grayscale→color en hover
- **Info grid** — marca, modelo, categoría, estado, fecha de publicación, visitas
- **Descripción del vendedor**
- **Info del vendedor** — avatar (imagen o iniciales)
- **Precio** destacado
- **Botones de acción** (solo si no es producto propio):
  - "Iniciar chat con el vendedor" — crea conversación o navega a existente
  - "Mostrar información del vendedor" — enlace a SellerInfoPage
  - "Añadir a seguimiento" / "Eliminar de seguimiento" — toggle con actualización pesimista (revierte en error)
- Carga el estado de seguimiento desde la API al montar
- Navegación hacia atrás al historial anterior

### 10.5 CreateListingPage

**`src/pages/CreateListingPage.tsx`** — 459 líneas · Ruta: `/publicar-anuncio` (+ `?editar=ID`)

Formulario de creación/edición de anuncios con:

**Secciones:**
1. **Identificación del activo** — marca, modelo, categoría (dropdown), estado (dropdown), precio
2. **Descripción del vendedor** — textarea
3. **Imagen del producto** — zona de arrastrar y soltar (drag & drop) + selector de archivo

**Modo edición** (`?editar=ID`):
- Precarga los datos del artículo existente
- Muestra la imagen actual
- La imagen es opcional (si no se selecciona, mantiene la existente)

**Validación:**
- Categoría seleccionada
- Marca y modelo no vacíos
- Precio > 0
- Descripción no vacía
- Imagen obligatoria en creación

**Sub-componentes:** `TextInput` definido inline.

### 10.6 EditProfilePage

**`src/pages/EditProfilePage.tsx`** — 365 líneas · Ruta: `/modificar-perfil`

Edición de perfil en dos columnas:

- **Columna izquierda** — avatar actual con botón para subir nueva foto y previsualización
- **Columna derecha** — formulario con:
  - **Solo lectura:** nombre, apellidos, DNI, email, fecha de nacimiento
  - **Editables:** nombre de usuario, teléfono, dirección
- La imagen se previsualiza con `URL.createObjectURL()`
- Al guardar, dispara el evento `pcswaps:profile-updated` para que el Navbar refresque el avatar

**Sub-componentes:** `ReadOnlyField`, `EditableField`.

### 10.7 ChangePasswordPage

**`src/pages/ChangePasswordPage.tsx`** — 186 líneas · Ruta: `/modificar-password`

Formulario simple:

- Contraseña actual
- Nueva contraseña
- Confirmar nueva contraseña
- Validación: actual requerida, nueva ≥ 8 caracteres, coincidencia
- Al éxito: limpia formulario, muestra mensaje

**Sub-componente:** `PasswordInput`.

### 10.8 MyAdsPage

**`src/pages/MyAdsPage.tsx`** — 312 líneas · Ruta: `/mis-anuncios`

Gestión de anuncios propios:

- **Lista de anuncios** — filas con:
  - Imagen, info del artículo, precio
  - Botones: editar, renovar, eliminar
- **Modal de confirmación** para eliminar
- **Botón "Publicar nuevo anuncio"**
- Refresca la lista tras renovar un anuncio

**Sub-componente:** `AdRow` con soporte de navegación por teclado.

### 10.9 ConversationsPage

**`src/pages/ConversationsPage.tsx`** — 361 líneas · Ruta: `/mis-conversaciones`

Lista de conversaciones con:

- **Cada conversación muestra:**
  - Imagen del artículo (o placeholder)
  - Avatar del otro usuario
  - Nombre del otro usuario, ID de conversación
  - Marca/modelo, estado, precio del artículo
  - Indicador de no leídos (punto rojo)
  - Botón de eliminar
- **Estadísticas** — chats activos, total de mensajes, pendientes de leer
- **Modal de confirmación** para eliminar
- Enriquece datos de conversación con info del artículo y contacto del usuario

**Sub-componentes:** `StatsBox`, `UserAvatar`, `formatDate`.

### 10.10 ChatPage

**`src/pages/ChatPage.tsx`** — 328 líneas · Ruta: `/chat/:id`

Vista de chat en dos paneles:

- **Panel izquierdo (principal):**
  - Cabecera con avatar y nombre del otro usuario
  - Lista de mensajes con scroll automático al final
  - Input de texto + botón enviar
- **Panel derecho (sidebar en lg):**
  - Tarjeta del artículo sobre el que se está conversando

**Burbujas de mensaje:**
- Mensajes propios → fondo rojo
- Mensajes del otro → fondo oscuro con borde rojo
- Muestra estado leído/no leído y timestamps

**Comportamiento:**
- Marca la conversación como leída al cargar
- Envía mensajes vía API y los añade al estado local
- Auto-scroll al último mensaje

**Sub-componentes:** `MessageBubble`, `UserAvatar`, `formatDate`, `formatDateTime`.

### 10.11 SellerInfoPage

**`src/pages/SellerInfoPage.tsx`** — 190 líneas · Ruta: `/vendedor/:id`

Información de contacto del vendedor:

- **Dos paneles:**
  - Izquierdo — avatar (o iniciales), nombre de usuario, etiqueta "Vendedor"
  - Derecho — campos de contacto: nombre de usuario, email, dirección, teléfono
- Enlace "Volver" que retorna al detalle del producto o a home

**Sub-componente:** `ContactField`.

---

## 11. Enrutamiento (src/App.tsx)

**`src/App.tsx`** — Componente raíz con la configuración de rutas:

```typescript
<BrowserRouter>
  <ConversationsProvider>
    <AppRoutes />
  </ConversationsProvider>
</BrowserRouter>
```

`AppRoutes` decide si mostrar el `<Navbar />` (se oculta en `/`, `/login`, `/registro`).

### Tabla de rutas

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `LandingPage` | Landing pública |
| `/home` | `HomePage` | Marketplace principal |
| `/login` | `AuthPage mode="login"` | Iniciar sesión |
| `/registro` | `AuthPage mode="register"` | Registro |
| `/producto/:id` | `ProductDetailPage` | Detalle de producto |
| `/publicar-anuncio` | `CreateListingPage` | Crear anuncio (+ `?editar=ID`) |
| `/modificar-perfil` | `EditProfilePage` | Editar perfil |
| `/modificar-password` | `ChangePasswordPage` | Cambiar contraseña |
| `/mis-anuncios` | `MyAdsPage` | Gestionar anuncios |
| `/mis-conversaciones` | `ConversationsPage` | Lista de chats |
| `/chat/:id` | `ChatPage` | Chat individual |
| `/vendedor/:id` | `SellerInfoPage` | Contacto del vendedor |

---

## 12. Estilos y Diseño

### Sistema de diseño

- **Tema:** Oscuro con fondos `#0e0e0f` (principal), `#131314` (tarjetas), `#201f21` (superficies), `black`
- **Acento:** Rojo `#eb0000` / `red-600`
- **Tipografía:** `Space_Grotesk` para el navbar, clases utilitarias `font-headline`
- **Iconos:** Google Material Symbols (variante outlined, ligaduras tipográficas)
- **CSS:** Solo un archivo `src/index.css` que importa Tailwind y define la clase `.material-symbols-outlined`

### Uso de Tailwind v4

Todas las clases son utilitarias de Tailwind aplicadas directamente en el JSX. No hay archivos CSS adicionales. Ejemplos de clases usadas:
- `bg-[#0e0e0f]`, `text-white`, `border-red-600`
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- `hover:grayscale-0`, `transition-all duration-300`

---

## 13. Puntos de Entrada

### `src/main.tsx`

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Entrada estándar de React 19. Renderiza `<App />` dentro de `<StrictMode>` en el elemento `#root` del `index.html`.

### `index.html`

- Carga Google Material Symbols
- Título: `com.tonidev.pcswaps`
- Favicon: `/favicon.svg`
- Script de entrada: `/src/main.tsx`

---

## 14. Resumen de Endpoints del Backend

La API esperada está en `http://localhost:8080/api` (configurable con `VITE_API_BASE_URL`):

### Autenticación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/auth/login` | Login → `{token, idUsuario}` |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/usuarios/registro` | Registrar usuario |
| GET | `/usuarios/me` | Perfil del usuario autenticado |
| PUT | `/usuarios/me` | Actualizar perfil |
| PUT | `/usuarios/me/imagen` | Subir foto de perfil (multipart) |
| PUT | `/usuarios/me/password` | Cambiar contraseña |
| GET | `/usuarios/:id/contacto` | Contacto de un usuario |

### Categorías
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/categorias` | Listar categorías |

### Artículos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/articulos` | Listar todos |
| GET | `/articulos/:id` | Obtener uno |
| GET | `/articulos/categoria/:id` | Filtrar por categoría |
| GET | `/articulos/propios` | Artículos del usuario |
| POST | `/articulos` | Crear (multipart) |
| PUT | `/articulos/:id` | Actualizar (multipart) |
| PUT | `/articulos/:id/renovar` | Renovar anuncio |
| DELETE | `/articulos/:id` | Eliminar |

### Conversaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/conversaciones` | Listar conversaciones |
| GET | `/conversaciones/:id` | Obtener una |
| POST | `/conversaciones` | Iniciar conversación |
| DELETE | `/conversaciones/:id` | Eliminar |
| POST | `/mensajes` | Enviar mensaje |
| PUT | `/mensajes/conversacion/:id/leer` | Marcar leída |

### Seguimientos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/seguimientos` | Artículos seguidos |
| POST | `/seguimientos/:id` | Seguir artículo |
| DELETE | `/seguimientos/:id` | Dejar de seguir |

---

## 15. Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo Vite |
| `npm run build` | Compila TypeScript y genera build de producción |
| `npm run lint` | Ejecuta ESLint en el proyecto |
| `npm run preview` | Previsualiza la build de producción |
