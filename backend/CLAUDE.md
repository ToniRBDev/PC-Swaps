# PC-SWAPS Backend — Guía para Claude

## Reglas de trabajo
- **Ir paso a paso consultando al usuario antes de cada acción.** Ejemplo: "¿Te parece bien que creemos la entidad Usuario en el paquete model?"
- **No añadir nada que no se pida sin consultar.**
- **No hacer cambios sin consultar con el usuario.**
- Inyección de dependencias siempre por constructor. Si en algún caso particular no parece lo más adecuado, consultar antes.
- Nombrar variables con nombres descriptivos, nunca abreviados. Ejemplo incorrecto: `Coche c -> c.getNombre()`. Ejemplo correcto: `Coche coche -> coche.getNombre()`.
- Añadir Javadoc en español a todo: clases, constructores, métodos.
- Al finalizar el backend, hacer tests con Mockito y JUnit.

## Estructura de paquetes

```
src/
└── main/
    ├── java/
    │   └── com/tonidev/backend/
    │       ├── aspect/
    │       │   └── LoggingAspect
    │       ├── config/
    │       │   └── DataLoader
    │       ├── controller/
    │       ├── dto/
    │       ├── exception/          ← si da tiempo
    │       ├── mapper/
    │       ├── model/
    │       ├── repository/
    │       ├── security/           ← si da tiempo
    │       ├── service/
    │       └── PcSwapsBackendApplication
    └── resources/
        ├── templates/
        ├── application.properties
        ├── application.dev.properties
        └── application.prod.properties
```

## Orden de implementación
1. `application.properties` — conexión MySQL
2. `model/` — entidades JPA + enum EstadoArticulo
3. `repository/` — interfaces JPA
4. `dto/` — objetos de transferencia
5. `mapper/` — conversión entidad ↔ DTO
6. `service/` — lógica de negocio
7. `controller/` — endpoints REST
8. `config/` — DataLoader
9. `aspect/` — LoggingAspect
10. `exception/` — si da tiempo
11. `security/` — si da tiempo
12. Tests (Mockito + JUnit) — si da tiempo

## Proyecto
Marketplace especializado en compraventa de componentes de PC de segunda mano.

**Stack:**
- Java 21
- Spring Boot 4.0.6
- Spring Data JPA
- Spring Security
- Spring Validation
- MySQL (Docker, puerto 3306)
- Lombok
- Maven

**Package base:** `com.tonidev.backend`

**DB config (compose.yaml):**
- DB name: `pc-swaps`
- User: `tonidam`
- Puerto: 3306
- Credenciales en `.env` (no incluir en commits)

## Entidades del dominio

### Usuario
| Campo | Tipo |
|-------|------|
| idUsuario | PK |
| nombre | String |
| apellidos | String |
| dni | String |
| correoElectronico | String |
| fechaNacimiento | Date |
| direccion | String |
| numTelefono | String |
| imagenUsuario | String (ruta/url) |
| nombreUsuario | String |
| passwordHash | String |

### Articulo
| Campo | Tipo |
|-------|------|
| idArticulo | PK |
| usuario | FK → Usuario |
| categoria | FK → Categoria |
| marca | String |
| modelo | String |
| estado | Enum EstadoArticulo |
| precio | Decimal |
| descripcion | String |
| imagen | String |
| fechaPublicacion | Date |
| fechaUltimaRenovacion | Date |
| activo | Boolean |

### Categoria
| Campo | Tipo |
|-------|------|
| idCategoria | PK |
| nombreCategoria | String |

Categorías iniciales: Tarjetas gráficas, Placas base, Procesadores, Memoria RAM, Monitores

### Seguimiento
| Campo | Tipo |
|-------|------|
| idSeguimiento | PK |
| usuario | FK → Usuario |
| articulo | FK → Articulo |
| fechaGuardado | Date |

### Conversacion
| Campo | Tipo |
|-------|------|
| idConversacion | PK |
| articulo | FK → Articulo |
| comprador | FK → Usuario |
| vendedor | FK → Usuario |
| fechaInicio | Date |

### Mensaje
| Campo | Tipo |
|-------|------|
| idMensaje | PK |
| conversacion | FK → Conversacion |
| emisor | FK → Usuario |
| contenido | String |
| fechaEnvio | DateTime |
| leido | Boolean |

### EstadoArticulo (Enum)
`NUEVO_CON_ETIQUETAS`, `COMO_NUEVO`, `MUY_BUENO`, `BUENO`, `ACEPTABLE`, `PARA_REPARAR`

## Relaciones
- Usuario (1) → Articulo (0..*)
- Articulo (0..*) → Categoria (1)
- Usuario (1) → Seguimiento (0..*)
- Articulo (1) → Seguimiento (0..*)
- Usuario (1) → Conversacion (0..*) [como comprador y vendedor]
- Articulo (1) → Conversacion (0..*)
- Conversacion (1) → Mensaje (1..*)
- Usuario (1) → Mensaje (0..*) [como emisor]

## Requisitos funcionales

### Usuarios
- Crear cuenta, eliminar cuenta, iniciar/cerrar sesión
- Modificar datos de usuario, foto de perfil, credenciales de login

### Artículos
- Publicar, eliminar, ver propios, editar, renovar artículo
- Ver artículos de otros usuarios y sus detalles
- Ver datos de contacto del vendedor
- Buscar por categoría y barra de búsqueda

### Seguimiento
- Añadir/quitar artículo de seguimiento

### Conversaciones
- Iniciar conversación sobre un artículo
- Enviar, responder y recibir mensajes
- Ver conversaciones iniciadas
- Eliminar conversación
- Notificación de nuevo mensaje

### Categorías
- Buscar productos por categoría

## Reglas de negocio
- Al eliminar una cuenta de usuario, se elimina todo lo relacionado con él (artículos, conversaciones, mensajes, seguimientos).
- Al eliminar un artículo, se eliminan también las conversaciones asociadas.
- Solo el propietario puede editar o eliminar sus propios artículos (validar en backend).
- Un usuario no ve sus propios anuncios en el listado general; solo los ve en "Mis productos" (gestión principalmente en frontend, pero el backend puede contemplarlo).

## Diagrama de clases
Ver `docs/UML/PC-SWAPS_diagrama_clases.png` y diagrama Mermaid en `docs/03_Diagrama_clases.md`.

## Notas
- El frontend lo gestiona un agente separado (React + TypeScript + Tailwind).
- La BD ya está creada y corriendo en Docker.
- Añadir configuración de Spring Security / JWT cuando se llegue a ese punto.
