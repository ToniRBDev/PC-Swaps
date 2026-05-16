# PC-Swaps — Documentación técnica del backend

## Índice

1. [Descripción general](#1-descripción-general)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Arquitectura y estructura de paquetes](#3-arquitectura-y-estructura-de-paquetes)
4. [Configuración](#4-configuración)
5. [Modelo de datos](#5-modelo-de-datos)
6. [Repositorios](#6-repositorios)
7. [DTOs](#7-dtos-data-transfer-objects)
8. [Mappers](#8-mappers)
9. [Servicios](#9-servicios)
10. [Controladores REST](#10-controladores-rest)
11. [WebConfig — servir imágenes estáticas](#11-webconfig--servir-imágenes-estáticas)
12. [LoggingAspect — registro transversal](#12-loggingaspect--registro-transversal)
13. [Seguridad — Spring Security y JWT](#13-seguridad--spring-security-y-jwt)
14. [Manejo de excepciones](#14-manejo-de-excepciones)
15. [Tests unitarios](#15-tests-unitarios)

---

## 1. Descripción general

PC-Swaps es un marketplace especializado en la compraventa de componentes de PC de segunda mano. Los usuarios pueden publicar artículos (procesadores, tarjetas gráficas, RAM, etc.), contactar con vendedores, guardar artículos en seguimiento y mantener conversaciones privadas.

El backend expone una **API REST** que consume el frontend desarrollado en React + TypeScript + Tailwind. La comunicación es completamente **sin estado (stateless)**: cada petición lleva un token JWT en la cabecera `Authorization` que identifica al usuario.

---

## 2. Stack tecnológico

| Tecnología | Versión | Para qué se usa |
|---|---|---|
| Java | 21 | Lenguaje principal |
| Spring Boot | 4.0.6 | Framework principal. Autoconfiguración, servidor embebido, etc. |
| Spring Data JPA | — | Acceso a base de datos mediante repositorios |
| Spring Security | 7.0.5 | Autenticación y autorización |
| Spring Validation | — | Validación de datos de entrada |
| Spring AOP | — | Programación orientada a aspectos (LoggingAspect) |
| Hibernate ORM | 7.2.12 | ORM que implementa JPA |
| MySQL | latest | Base de datos relacional |
| Docker | — | Contenedor para MySQL en desarrollo |
| JJWT | 0.12.6 | Generación y validación de tokens JWT |
| Lombok | 1.18.46 | Reducción de código repetitivo (getters, setters, builders) |
| SpringDoc OpenAPI | 2.8.8 | Documentación automática de la API (Swagger UI) |
| Maven | — | Gestor de dependencias y ciclo de construcción |

---

## 3. Arquitectura y estructura de paquetes

El proyecto sigue una **arquitectura en capas** clásica. Cada capa tiene una responsabilidad única y solo se comunica con la capa inmediatamente inferior.

```
Petición HTTP
      │
      ▼
┌─────────────┐
│ Controller  │  Recibe la petición, delega al servicio, devuelve la respuesta HTTP
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Service   │  Contiene la lógica de negocio. Valida reglas, coordina repositorios y mappers
└──────┬──────┘
       │
  ┌────┴────┐
  ▼         ▼
┌──────┐ ┌──────┐
│ Repo │ │Mapper│  Repositorio: acceso a BD. Mapper: convierte entidad ↔ DTO
└──────┘ └──────┘
  │
  ▼
┌──────────────┐
│  Base datos  │  MySQL (JPA/Hibernate gestiona las tablas automáticamente)
└──────────────┘
```

### Estructura de paquetes

```
com.tonidev.backend/
├── aspect/
│   └── LoggingAspect          ← Registro automático de todos los métodos de servicio
├── config/
│   ├── DataLoader             ← Carga datos iniciales al arrancar (categorías)
│   └── WebConfig              ← Configura cómo se sirven las imágenes al navegador
├── controller/                ← Endpoints REST (uno por entidad)
├── dto/                       ← Objetos de transferencia de datos (entrada y salida de la API)
├── exception/                 ← Excepciones personalizadas y manejador global
├── mapper/                    ← Conversión entre entidades JPA y DTOs
├── model/                     ← Entidades JPA (tablas de la base de datos)
├── repository/                ← Interfaces de acceso a datos (Spring Data JPA)
├── security/                  ← Todo lo relacionado con autenticación JWT
└── service/                   ← Lógica de negocio de la aplicación
```

---

## 4. Configuración

### 4.1 `application.properties` — configuración base

```properties
spring.application.name=pc-swaps
spring.profiles.active=dev
```

Este fichero solo define el nombre de la aplicación y el **perfil activo**. Un perfil en Spring Boot es un conjunto de propiedades que se activan según el entorno. Aquí se activa `dev`, lo que hace que Spring Boot cargue también `application-dev.properties`.

En producción, se cambiaría a `prod` para que cargue `application-prod.properties`.

### 4.2 `application-dev.properties` — desarrollo local

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/${MYSQL_DATABASE}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
app.uploads.dir=./uploads
jwt.secret=${JWT_SECRET:cGMtc3dhcHMtand0LWRldi1rZXktMjAyNC1YWFhYWCE=}
jwt.expiration=86400000
```

- **`ddl-auto=update`**: Hibernate actualiza el esquema de la BD automáticamente al arrancar. En desarrollo es cómodo porque crea tablas nuevas y añade columnas sin borrar datos.
- **`show-sql=true`**: Muestra las consultas SQL generadas por Hibernate en la consola. Útil para depurar.
- **`${MYSQL_USER}`**: Las variables entre `${}` se leen de las variables de entorno del sistema, que Docker Compose carga desde el fichero `.env`.
- **`jwt.expiration=86400000`**: El token JWT caduca en 86.400.000 ms = 24 horas.
- **`jwt.secret`**: La clave secreta para firmar los tokens. El valor tras `:` es el valor por defecto si la variable no está definida.

### 4.3 `application-prod.properties` — producción

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
app.uploads.dir=/app/uploads
```

- **`ddl-auto=validate`**: En producción, Hibernate solo verifica que las tablas coinciden con las entidades, pero no toca el esquema. Más seguro.
- **`show-sql=false`**: No se muestran las consultas SQL para no exponer información sensible.
- **`/app/uploads`**: Ruta absoluta dentro del contenedor Docker donde se guardarán las imágenes.

### 4.4 `compose.yaml` — Docker para MySQL

```yaml
services:
  mysql:
    image: mysql:latest
    container_name: pc-swaps-mysql
    environment:
      - MYSQL_DATABASE=${MYSQL_DATABASE}
      - MYSQL_USER=${MYSQL_USER}
      - MYSQL_PASSWORD=${MYSQL_PASSWORD}
      - MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

Spring Boot detecta el fichero `compose.yaml` automáticamente (gracias a `spring-boot-docker-compose`) y arranca o conecta al contenedor MySQL antes de inicializar la aplicación. El volumen `mysql_data` persiste los datos de la base de datos aunque el contenedor se elimine y vuelva a crear.

### 4.5 `DataLoader` — datos iniciales

```java
@Component
public class DataLoader implements CommandLineRunner {

    @Override
    public void run(String... args) {
        if (categoriaRepository.count() == 0) {
            Arrays.stream(NombreCategoria.values())
                    .map(nombre -> Categoria.builder()
                            .nombreCategoria(nombre.getValor())
                            .build())
                    .forEach(categoriaRepository::save);
        }
    }
}
```

`CommandLineRunner` es una interfaz de Spring Boot que hace que el método `run()` se ejecute automáticamente al arrancar la aplicación. Solo inserta las categorías si la tabla está vacía, evitando duplicados en cada reinicio. Las 5 categorías son: Tarjetas gráficas, Placas base, Procesadores, Memoria RAM, Monitores.

---

## 5. Modelo de datos

Las entidades son clases Java anotadas con `@Entity` que Hibernate mapea a tablas de MySQL. Se usa **Lombok** para no escribir manualmente getters, setters, constructores y builders.

### 5.1 Usuario

```
usuario
├── id_usuario       PK, autoincremental
├── nombre           NOT NULL
├── apellidos        NOT NULL
├── dni              NOT NULL, UNIQUE
├── correo_electronico NOT NULL, UNIQUE
├── fecha_nacimiento NOT NULL
├── direccion
├── num_telefono
├── imagen_usuario   (ruta relativa: /uploads/uuid.jpg)
├── nombre_usuario   NOT NULL, UNIQUE
└── password_hash    NOT NULL (hash BCrypt)
```

La contraseña nunca se guarda en texto plano. Se almacena el resultado de aplicar **BCrypt**, un algoritmo de hash diseñado específicamente para contraseñas que es lento a propósito (dificulta los ataques de fuerza bruta).

### 5.2 Articulo

```
articulo
├── id_articulo       PK
├── id_usuario        FK → usuario (propietario)
├── id_categoria      FK → categoria
├── marca             NOT NULL
├── modelo            NOT NULL
├── estado            ENUM (6 valores)
├── precio            DECIMAL(10,2)
├── descripcion       TEXT
├── imagen            (ruta relativa: /uploads/uuid.jpg)
├── fecha_publicacion NOT NULL
├── fecha_ultima_renovacion
├── activo            BOOLEAN
└── numero_visitas    INT
```

El campo `activo` es clave: un artículo puede desactivarse automáticamente si no se renueva en 7 días (ver `ArticuloScheduler`). El campo `numero_visitas` se incrementa cada vez que alguien consulta el detalle.

### 5.3 EstadoArticulo (enum)

```java
NUEVO_CON_ETIQUETAS, COMO_NUEVO, MUY_BUENO, BUENO, ACEPTABLE, PARA_REPARAR
```

Describe el estado físico del componente. Al ser un enum de JPA, Hibernate lo almacena como texto en la BD.

### 5.4 Categoria

```
categoria
├── id_categoria     PK
└── nombre_categoria NOT NULL, UNIQUE
```

### 5.5 Conversacion

```
conversacion
├── id_conversacion  PK
├── id_articulo      FK → articulo
├── id_comprador     FK → usuario
├── id_vendedor      FK → usuario
└── fecha_inicio     NOT NULL
```

Un usuario puede iniciar solo una conversación por artículo. El comprador y el vendedor son ambos usuarios, de ahí que haya dos FK a la misma tabla.

### 5.6 Mensaje

```
mensaje
├── id_mensaje       PK
├── id_conversacion  FK → conversacion
├── id_emisor        FK → usuario
├── contenido        TEXT NOT NULL
├── fecha_envio      DATETIME NOT NULL
└── leido            BOOLEAN
```

### 5.7 Seguimiento

```
seguimiento
├── id_seguimiento   PK
├── id_usuario       FK → usuario
├── id_articulo      FK → articulo
└── fecha_guardado   NOT NULL
```

Permite a los usuarios guardar artículos que les interesan, como una lista de favoritos.

### 5.8 Relaciones entre entidades

```
Usuario  ──(1:N)──  Articulo
Usuario  ──(1:N)──  Seguimiento
Articulo ──(1:N)──  Seguimiento
Usuario  ──(1:N)──  Conversacion  (como comprador)
Usuario  ──(1:N)──  Conversacion  (como vendedor)
Articulo ──(1:N)──  Conversacion
Conversacion ──(1:N)── Mensaje
Usuario  ──(1:N)──  Mensaje        (como emisor)
Articulo ──(N:1)──  Categoria
```

Las relaciones en JPA se definen con `@ManyToOne`, `@OneToMany`, etc. En este proyecto todas las relaciones en la entidad son `@ManyToOne` (cada artículo tiene un usuario, cada mensaje tiene una conversación), lo que es más eficiente y evita cargas masivas de datos.

---

## 6. Repositorios

Los repositorios son **interfaces** que extienden `JpaRepository`. Spring Data JPA genera automáticamente la implementación en tiempo de ejecución: no hay código SQL que escribir para las operaciones CRUD básicas.

```java
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByCorreoElectronico(String correoElectronico);
    boolean existsByCorreoElectronico(String correoElectronico);
    boolean existsByDni(String dni);
    boolean existsByNombreUsuario(String nombreUsuario);
}
```

Spring Data JPA **interpreta el nombre del método** para generar la consulta SQL:
- `findByCorreoElectronico` → `SELECT * FROM usuario WHERE correo_electronico = ?`
- `existsByDni` → `SELECT COUNT(*) > 0 FROM usuario WHERE dni = ?`

#### Consulta personalizada en ArticuloRepository

Para los artículos que hay que desactivar (no renovados en 7 días), el nombre del método sería demasiado largo, por lo que se usa `@Query` con JPQL (lenguaje de consultas de JPA, similar a SQL pero sobre entidades en lugar de tablas):

```java
@Query("SELECT a FROM Articulo a WHERE a.activo = true AND " +
       "(a.fechaUltimaRenovacion IS NOT NULL AND a.fechaUltimaRenovacion < :limite) OR " +
       "(a.fechaUltimaRenovacion IS NULL AND a.fechaPublicacion < :limite)")
List<Articulo> findArticulosParaDesactivar(@Param("limite") LocalDateTime limite);
```

---

## 7. DTOs (Data Transfer Objects)

Los DTOs son clases que definen qué datos entran y salen de la API. Se usan por dos motivos:

1. **Seguridad**: evitar exponer campos internos de las entidades (como `passwordHash`).
2. **Desacoplamiento**: la API puede cambiar sin afectar al modelo de la BD y viceversa.

En este proyecto los DTOs son **Java Records**, una característica de Java 16+ que genera automáticamente constructor, getters, `equals`, `hashCode` y `toString`.

```java
// Ejemplo: lo que el frontend envía para registrarse
public record UsuarioRegistroRequest(
        @NotBlank String nombre,
        @NotBlank String apellidos,
        @NotBlank String dni,
        @Email @NotBlank String correoElectronico,
        @NotNull LocalDate fechaNacimiento,
        String direccion,
        String numTelefono,
        @NotBlank String nombreUsuario,
        @Size(min = 8) @NotBlank String password
) {}

// Ejemplo: lo que la API devuelve al hacer login
public record LoginResponse(String token, Long idUsuario) {}
```

Las anotaciones `@NotBlank`, `@Email`, `@Size` son de **Spring Validation**. Si el cliente envía datos inválidos, Spring devuelve automáticamente un error 400 sin llegar a ejecutar el servicio.

---

## 8. Mappers

Los mappers son componentes (`@Component`) que convierten entidades en DTOs y viceversa. Separan esta responsabilidad de los servicios para mantenerlos enfocados en la lógica de negocio.

```java
@Component
public class UsuarioMapper {

    public Usuario toEntity(UsuarioRegistroRequest request, String passwordHash) {
        return Usuario.builder()
                .nombre(request.nombre())
                .apellidos(request.apellidos())
                // ... resto de campos
                .passwordHash(passwordHash)  // el hash ya calculado por el servicio
                .build();
    }

    public UsuarioPerfilResponse toPerfilResponse(Usuario usuario) {
        return new UsuarioPerfilResponse(
                usuario.getIdUsuario(),
                usuario.getNombre(),
                // ... resto de campos
        );
    }
}
```

---

## 9. Servicios

Los servicios contienen la **lógica de negocio** de la aplicación. Se anotan con `@Service` y reciben sus dependencias por constructor (inyección de dependencias).

### 9.1 UsuarioService

- **`registrar`**: valida que correo, DNI y nombre de usuario no estén ya en uso antes de crear la cuenta. La contraseña se hashea con `BCryptPasswordEncoder` antes de guardarla.
- **`cambiarPassword`**: verifica que la contraseña actual introducida coincide con el hash almacenado antes de permitir el cambio.
- **`actualizarImagen`**: si el usuario ya tenía imagen, elimina el fichero físico anterior antes de guardar el nuevo.
- **`eliminar`**: al eliminar una cuenta, las cascadas definidas en la BD eliminan automáticamente todos sus artículos, conversaciones, mensajes y seguimientos.

### 9.2 ArticuloService

- **`publicar`**: recibe el DTO del artículo y el fichero de imagen como partes separadas de un `multipart/form-data`. Guarda la imagen en disco mediante `ImagenService` y almacena la ruta resultante en la BD.
- **`obtenerDetalle`**: incrementa el contador de visitas cada vez que se consulta un artículo.
- **`listarTodos`**: excluye los artículos del propio usuario autenticado (para que no vea los suyos en el listado general).
- **`editar`** y **`eliminar`**: comprueban que el `idUsuario` que viene del token JWT coincide con el propietario del artículo. Si no, lanzan `AccesoNoAutorizadoException` (403).

### 9.3 ImagenService

Gestiona el ciclo de vida de los ficheros de imagen en disco:

- **Validación de tipo**: solo acepta `image/jpeg`, `image/png` e `image/webp`.
- **Nombre único**: genera un UUID aleatorio para cada imagen, evitando colisiones entre ficheros con el mismo nombre original.
- **Ruta relativa**: devuelve `/uploads/uuid.jpg`, que es la ruta que se guarda en BD y que el frontend usa para mostrar la imagen.

### 9.4 ArticuloScheduler

```java
@Scheduled(cron = "0 0 3 * * *")
public void desactivarArticulosExpirados() {
    LocalDateTime limite = LocalDateTime.now().minusDays(7);
    List<Articulo> articulosExpirados = articuloRepository.findArticulosParaDesactivar(limite);
    articulosExpirados.forEach(articulo -> articulo.setActivo(false));
    articuloRepository.saveAll(articulosExpirados);
}
```

Esta tarea se ejecuta **automáticamente cada día a las 3:00 AM** (cuando el tráfico es mínimo). La expresión cron `0 0 3 * * *` significa: segundo 0, minuto 0, hora 3, cualquier día del mes, cualquier mes, cualquier día de la semana.

Un artículo se desactiva si lleva más de 7 días sin renovarse. El usuario puede renovarlo manualmente desde su panel, lo que actualiza `fechaUltimaRenovacion` y lo reactiva.

### 9.5 AuthService

```java
public LoginResponse login(LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.correoElectronico(), request.password()
        )
    );
    Usuario usuario = usuarioRepository
        .findByCorreoElectronico(request.correoElectronico())
        .orElseThrow(...);
    String token = jwtUtil.generarToken(usuario.getIdUsuario(), usuario.getCorreoElectronico());
    return new LoginResponse(token, usuario.getIdUsuario());
}
```

`authenticationManager.authenticate()` delega en Spring Security, que internamente carga el usuario de la BD, compara el hash de la contraseña con BCrypt y lanza `BadCredentialsException` si no coincide. Solo si la autenticación tiene éxito se genera el token JWT.

### 9.6 ConversacionService

Aplica varias reglas de negocio:
- Un usuario no puede iniciar una conversación sobre su propio artículo.
- Un usuario no puede tener más de una conversación activa por artículo.
- Solo los participantes (comprador o vendedor) pueden ver o eliminar una conversación.

### 9.7 SeguimientoService

Antes de agregar un seguimiento, comprueba que no existe ya uno igual para evitar duplicados (`existsByUsuarioAndArticulo`).

---

## 10. Controladores REST

Los controladores reciben las peticiones HTTP y delegan inmediatamente en los servicios. No contienen lógica de negocio.

### Resumen de endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/usuarios/registro` | No | Crear cuenta |
| POST | `/api/auth/login` | No | Iniciar sesión, obtener JWT |
| GET | `/api/usuarios/me` | Sí | Ver mi perfil |
| PUT | `/api/usuarios/me` | Sí | Actualizar perfil |
| PUT | `/api/usuarios/me/password` | Sí | Cambiar contraseña |
| PUT | `/api/usuarios/me/imagen` | Sí | Actualizar foto de perfil |
| DELETE | `/api/usuarios/me` | Sí | Eliminar cuenta |
| GET | `/api/usuarios/{id}/contacto` | Sí | Ver contacto de vendedor |
| GET | `/api/categorias` | Sí | Listar categorías |
| POST | `/api/articulos` | Sí | Publicar artículo (multipart) |
| GET | `/api/articulos` | Sí | Listar todos (excluye propios) |
| GET | `/api/articulos/propios` | Sí | Mis artículos |
| GET | `/api/articulos/{id}` | Sí | Detalle de artículo |
| GET | `/api/articulos/buscar?texto=` | Sí | Buscar por marca/modelo |
| GET | `/api/articulos/categoria/{id}` | Sí | Filtrar por categoría |
| PUT | `/api/articulos/{id}` | Sí | Editar artículo (solo propietario) |
| PUT | `/api/articulos/{id}/renovar` | Sí | Renovar artículo |
| DELETE | `/api/articulos/{id}` | Sí | Eliminar artículo (solo propietario) |
| POST | `/api/seguimientos/{idArticulo}` | Sí | Guardar artículo |
| DELETE | `/api/seguimientos/{idArticulo}` | Sí | Quitar de seguidos |
| GET | `/api/seguimientos` | Sí | Mis artículos guardados |
| POST | `/api/conversaciones` | Sí | Iniciar conversación |
| GET | `/api/conversaciones` | Sí | Mis conversaciones |
| GET | `/api/conversaciones/{id}` | Sí | Ver conversación con mensajes |
| DELETE | `/api/conversaciones/{id}` | Sí | Eliminar conversación |
| POST | `/api/mensajes` | Sí | Enviar mensaje |
| PUT | `/api/mensajes/conversacion/{id}/leer` | Sí | Marcar mensajes como leídos |

### Cómo obtiene el controlador el usuario autenticado

```java
@GetMapping("/me")
public ResponseEntity<UsuarioPerfilResponse> obtenerPerfil(
        @AuthenticationPrincipal UsuarioDetails usuarioDetails) {
    return ResponseEntity.ok(usuarioService.obtenerPerfil(usuarioDetails.getIdUsuario()));
}
```

`@AuthenticationPrincipal` le dice a Spring que inyecte el objeto `UsuarioDetails` que el filtro JWT guardó en el `SecurityContextHolder`. De esta manera el controlador sabe qué usuario está haciendo la petición sin necesidad de leer el token manualmente.

---

## 11. WebConfig — servir imágenes estáticas

### El problema que resuelve

Cuando un usuario sube una foto de perfil o la imagen de un artículo, el backend la guarda en la carpeta `./uploads/` del servidor. El frontend necesita poder mostrar esa imagen en el navegador mediante una URL como `http://localhost:8080/uploads/foto.jpg`.

Por defecto, Spring Boot no sirve ficheros arbitrarios del sistema de ficheros. Solo sirve los recursos estáticos que están dentro del propio JAR (`/static`, `/public`). Para servir ficheros externos hay que configurarlo explícitamente.

### La solución

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.uploads.dir}")
    private String uploadsDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadPath = Paths.get(uploadsDir).toAbsolutePath().normalize();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
```

#### Paso a paso

1. **`@Configuration`**: indica a Spring que esta clase contiene configuración del framework.
2. **`implements WebMvcConfigurer`**: permite sobreescribir puntos de configuración de Spring MVC sin perder la configuración automática existente.
3. **`@Value("${app.uploads.dir}")`**: Spring inyecta el valor de la propiedad `app.uploads.dir` del fichero de propiedades. En desarrollo es `./uploads`, en producción es `/app/uploads`.
4. **`Paths.get(uploadsDir).toAbsolutePath().normalize()`**: convierte la ruta relativa `./uploads` en una ruta absoluta del sistema (por ejemplo: `C:\Users\tonyg\Desktop\PC-Swaps\backend\uploads`). Esto es necesario porque el prefijo `file:` requiere una ruta absoluta.
5. **`addResourceHandler("/uploads/**")`**: cualquier petición GET a `/uploads/cualquier-cosa` será interceptada por este handler.
6. **`addResourceLocations("file:" + uploadPath + "/")`**: le dice a Spring dónde buscar el fichero en disco. El prefijo `file:` indica que es una ruta del sistema de ficheros (no un recurso del classpath).

#### Resultado

```
GET http://localhost:8080/uploads/a1b2c3.jpg
        │
        ▼
Spring busca el fichero en:
C:\Users\tonyg\Desktop\PC-Swaps\backend\uploads\a1b2c3.jpg
        │
        ▼
Devuelve el fichero como respuesta HTTP con Content-Type: image/jpeg
```

#### Por qué se lee `app.uploads.dir` y no se pone la ruta a mano

Para que la misma aplicación funcione en desarrollo (ruta relativa `./uploads`) y en producción (ruta absoluta `/app/uploads`) sin cambiar código. Solo cambia el fichero de propiedades según el perfil activo.

---

## 12. LoggingAspect — registro transversal

### ¿Qué es la programación orientada a aspectos?

En una aplicación hay funcionalidades que son **transversales** (cross-cutting): no pertenecen a ninguna clase en concreto, sino que afectan a muchas. El logging (registro de trazas) es el ejemplo más típico: queremos registrar cuándo se llama a cada método de servicio sin tener que escribir `logger.info(...)` en cada uno de ellos.

La **Programación Orientada a Aspectos (AOP)** permite definir ese comportamiento en un único lugar (el aspecto) y aplicarlo automáticamente a múltiples clases.

### Conceptos clave de AOP

| Término | Significado |
|---|---|
| **Aspecto (Aspect)** | La clase que contiene el comportamiento transversal. En este proyecto: `LoggingAspect`. |
| **Consejo (Advice)** | El código que se ejecuta. En este proyecto: el método `registrarEjecucion`. |
| **Pointcut** | La expresión que define a qué métodos se aplica el aspecto. |
| **Join Point** | El momento concreto de la ejecución donde se aplica (en este caso, la llamada a un método). |
| **`@Around`** | Tipo de consejo que envuelve el método: se ejecuta antes Y después (o en lugar) del método original. |

### El código

```java
@Aspect
@Component
public class LoggingAspect {

    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    @Around("execution(* com.tonidev.backend.service.*.*(..))")
    public Object registrarEjecucion(ProceedingJoinPoint joinPoint) throws Throwable {
        String nombreClase  = joinPoint.getTarget().getClass().getSimpleName();
        String nombreMetodo = joinPoint.getSignature().getName();

        logger.info("Inicio: {}.{}()", nombreClase, nombreMetodo);
        long tiempoInicio = System.currentTimeMillis();

        try {
            Object resultado = joinPoint.proceed();   // ejecuta el método real
            long tiempoTotal = System.currentTimeMillis() - tiempoInicio;
            logger.info("Fin: {}.{}() — {} ms", nombreClase, nombreMetodo, tiempoTotal);
            return resultado;
        } catch (Exception excepcion) {
            logger.error("Error en {}.{}(): {}", nombreClase, nombreMetodo, excepcion.getMessage());
            throw excepcion;   // relanza la excepción sin modificarla
        }
    }
}
```

#### Desglose línea a línea

- **`@Aspect`**: marca la clase como un aspecto de Spring AOP.
- **`@Component`**: la registra como bean de Spring para que pueda ser gestionada por el contenedor.
- **`Logger`**: de SLF4J, el estándar de logging en Java. Logback (incluido en Spring Boot) es la implementación subyacente.
- **`@Around("execution(* com.tonidev.backend.service.*.*(..))")`**: la expresión pointcut. Se lee así:
  - `execution(...)` → intercepta ejecuciones de métodos
  - `*` → cualquier tipo de retorno
  - `com.tonidev.backend.service.*` → cualquier clase del paquete `service`
  - `.*` → cualquier método
  - `(..)` → con cualquier número y tipo de argumentos
- **`ProceedingJoinPoint`**: objeto que representa el método interceptado. Permite obtener el nombre del método (`getSignature().getName()`) y la instancia sobre la que se llama (`getTarget()`).
- **`joinPoint.proceed()`**: ejecuta el método original. Sin esta llamada, el método real nunca se ejecutaría.
- Si el método original lanza una excepción, el bloque `catch` la registra y la relanza. Así el error llega igualmente al manejador global de excepciones.

#### Resultado en consola durante una petición

```
INFO  LoggingAspect: Inicio: ArticuloService.publicar()
INFO  LoggingAspect: Fin:   ArticuloService.publicar() — 42 ms

INFO  LoggingAspect: Inicio: UsuarioService.registrar()
ERROR LoggingAspect: Error en UsuarioService.registrar(): El correo electrónico ya está en uso
```

#### Por qué es mejor que poner loggers en cada servicio

Sin AOP, habría que añadir en cada método de cada servicio:
```java
logger.info("Inicio registrar()");
long inicio = System.currentTimeMillis();
try {
    // lógica...
    logger.info("Fin registrar() — {} ms", System.currentTimeMillis() - inicio);
} catch (Exception e) {
    logger.error("Error en registrar(): {}", e.getMessage());
    throw e;
}
```

Con AOP, ese código está escrito **una sola vez** y se aplica automáticamente a los ~30 métodos de los 7 servicios. Si en el futuro se quiere cambiar el formato del log, se cambia en un único sitio.

---

## 13. Seguridad — Spring Security y JWT

Esta es la parte más compleja del proyecto. Tiene cuatro actores principales que trabajan juntos:

```
Petición con token JWT
        │
        ▼
┌───────────────────────┐
│ JwtAuthenticationFilter│  ← 1. Extrae y valida el token de la cabecera
└──────────┬────────────┘
           │ (si el token es válido)
           ▼
┌───────────────────────┐
│  UsuarioDetailsService │  ← 2. Carga el usuario de la BD por correo
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│     UsuarioDetails    │  ← 3. Objeto con los datos del usuario autenticado
└──────────┬────────────┘
           │
           ▼
┌───────────────────────┐
│  SecurityContextHolder │  ← 4. Guarda la autenticación para el resto de la petición
└───────────────────────┘
```

### 13.1 ¿Qué es JWT?

**JWT (JSON Web Token)** es un estándar para transmitir información de forma segura entre partes como un objeto JSON. Tiene tres partes separadas por puntos:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b25pQGVqZW1wbG8uY29tIiwiaWRVc3VhcmlvIjoxfQ.abc123
      ▲                              ▲                                    ▲
   Cabecera                        Payload                            Firma
(algoritmo)              (correo, idUsuario, fecha)          (verifica que no fue alterado)
```

La firma se genera con la clave secreta (`jwt.secret`). Si alguien modifica el payload, la firma ya no coincide y el token se rechaza. Esto permite confiar en los datos del token sin consultar la BD en cada petición.

### 13.2 JwtUtil

```java
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secreto;

    @Value("${jwt.expiration}")
    private long expiracion;

    public String generarToken(Long idUsuario, String correoElectronico) {
        return Jwts.builder()
                .subject(correoElectronico)
                .claim("idUsuario", idUsuario)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiracion))
                .signWith(construirSecretKey())
                .compact();
    }

    public String extraerCorreo(String token) {
        return extraerClaims(token).getSubject();
    }

    public boolean esTokenValido(String token) {
        try {
            extraerClaims(token);
            return true;
        } catch (JwtException excepcion) {
            return false;
        }
    }

    private Claims extraerClaims(String token) {
        return Jwts.parser()
                .verifyWith(construirSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey construirSecretKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secreto);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

- **`generarToken`**: crea el JWT con el correo como `subject` y el `idUsuario` como claim adicional. La fecha de expiración se calcula sumando `expiracion` (ms) al momento actual.
- **`esTokenValido`**: intenta parsear el token. Si la firma no coincide o ha expirado, JJWT lanza `JwtException` y el método devuelve `false`.
- **`construirSecretKey`**: decodifica el secreto de Base64 y construye la clave HMAC-SHA para firmar y verificar.

### 13.3 UsuarioDetails

```java
public class UsuarioDetails implements UserDetails {

    private final Long idUsuario;
    private final String correoElectronico;
    private final String passwordHash;

    @Override
    public String getUsername() { return correoElectronico; }

    @Override
    public String getPassword() { return passwordHash; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() { return List.of(); }
}
```

`UserDetails` es la interfaz de Spring Security que representa a un usuario autenticado. Esta implementación añade `idUsuario`, que no está en la interfaz estándar pero es necesario para que los servicios sepan qué usuario está haciendo la petición. `getAuthorities()` devuelve lista vacía porque no hay roles en esta aplicación (todos los usuarios tienen los mismos permisos).

### 13.4 UsuarioDetailsService

```java
@Service
public class UsuarioDetailsService implements UserDetailsService {

    @Override
    public UserDetails loadUserByUsername(String correoElectronico) {
        Usuario usuario = usuarioRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new UsernameNotFoundException(...));
        return new UsuarioDetails(
            usuario.getIdUsuario(),
            usuario.getCorreoElectronico(),
            usuario.getPasswordHash()
        );
    }
}
```

`UserDetailsService` es otra interfaz de Spring Security. Spring la usa internamente durante la autenticación para cargar el usuario de la BD. El nombre del método (`loadUserByUsername`) es obligatorio por la interfaz; en este proyecto el "username" es el correo electrónico.

### 13.5 JwtAuthenticationFilter

Este filtro se ejecuta **una vez por cada petición HTTP** antes de que llegue al controlador:

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest solicitud,
                                    HttpServletResponse respuesta,
                                    FilterChain cadena) throws ServletException, IOException {

        // 1. Leer la cabecera Authorization
        String cabeceraAutorizacion = solicitud.getHeader("Authorization");

        // 2. Si no hay token o no empieza por "Bearer ", pasar al siguiente filtro
        if (cabeceraAutorizacion == null || !cabeceraAutorizacion.startsWith("Bearer ")) {
            cadena.doFilter(solicitud, respuesta);
            return;
        }

        // 3. Extraer el token (quitando el prefijo "Bearer ")
        String token = cabeceraAutorizacion.substring(7);

        // 4. Validar el token y que no haya autenticación previa en el contexto
        if (jwtUtil.esTokenValido(token) && SecurityContextHolder.getContext().getAuthentication() == null) {
            String correoElectronico = jwtUtil.extraerCorreo(token);
            UserDetails usuarioDetails = usuarioDetailsService.loadUserByUsername(correoElectronico);

            // 5. Crear el objeto de autenticación y guardarlo en el contexto de seguridad
            UsernamePasswordAuthenticationToken autenticacion =
                new UsernamePasswordAuthenticationToken(usuarioDetails, null, usuarioDetails.getAuthorities());
            autenticacion.setDetails(new WebAuthenticationDetailsSource().buildDetails(solicitud));
            SecurityContextHolder.getContext().setAuthentication(autenticacion);
        }

        // 6. Continuar con el siguiente filtro (y eventualmente el controlador)
        cadena.doFilter(solicitud, respuesta);
    }
}
```

El `SecurityContextHolder` es un almacén por hilo (thread-local) donde Spring Security guarda la información del usuario autenticado. Una vez guardada, cualquier controlador puede acceder a ella mediante `@AuthenticationPrincipal`.

### 13.6 SecurityConfig

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sesion -> sesion.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(HttpMethod.POST, "/api/usuarios/registro").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers("/uploads/**").permitAll()
                .requestMatchers("/swagger-ui/**", "/api-docs/**").permitAll()
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}
```

#### Decisiones clave

- **`csrf.disable()`**: CSRF (Cross-Site Request Forgery) es un ataque que aprovecha las cookies de sesión. Como esta API es **stateless** y usa JWT en cabecera (no cookies), no es vulnerable a CSRF. Se desactiva para simplificar.
- **`SessionCreationPolicy.STATELESS`**: Spring Security no crea ni usa sesiones HTTP. Cada petición se autentica de forma independiente con el token JWT.
- **`permitAll()`**: las rutas de registro, login, imágenes y Swagger son públicas. Todo lo demás requiere token válido.
- **`addFilterBefore(..., UsernamePasswordAuthenticationFilter.class)`**: inserta el filtro JWT justo antes del filtro estándar de usuario/contraseña de Spring Security, de modo que la autenticación JWT se procese primero.

#### CORS (Cross-Origin Resource Sharing)

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuracion = new CorsConfiguration();
    configuracion.setAllowedOriginPatterns(List.of("*"));
    configuracion.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuracion.setAllowedHeaders(List.of("*"));
    configuracion.setAllowCredentials(true);
    // ...
}
```

CORS es un mecanismo del navegador que bloquea por defecto las peticiones de un dominio a otro. Como el frontend (React en `localhost:5173`) llama al backend (`localhost:8080`), son orígenes distintos y el navegador bloquearía las peticiones sin esta configuración. En producción se debería restringir `AllowedOriginPatterns` al dominio real del frontend.

#### Flujo completo de autenticación

```
1. Usuario hace POST /api/auth/login con email + password
2. AuthService llama a authenticationManager.authenticate()
3. Spring Security llama a UsuarioDetailsService.loadUserByUsername(email)
4. UsuarioDetailsService carga el usuario de la BD
5. Spring Security compara el hash de la contraseña con BCrypt
6. Si coincide, JwtUtil genera el token JWT
7. El token se devuelve al cliente

----- Petición posterior -----

8. El cliente envía una petición con cabecera: Authorization: Bearer <token>
9. JwtAuthenticationFilter intercepta la petición
10. JwtUtil valida la firma y la expiración del token
11. Se extrae el correo del token y se carga el usuario de la BD
12. Se guarda la autenticación en SecurityContextHolder
13. El controlador recibe la petición y puede acceder al usuario con @AuthenticationPrincipal
```

---

## 14. Manejo de excepciones

### Excepciones personalizadas

```java
// Recurso no encontrado → HTTP 404
public class RecursoNoEncontradoException extends RuntimeException {
    public RecursoNoEncontradoException(String mensaje) { super(mensaje); }
}

// Acceso no autorizado → HTTP 403
public class AccesoNoAutorizadoException extends RuntimeException { ... }

// Regla de negocio incumplida → HTTP 400
public class ReglaNegocioException extends RuntimeException { ... }
```

Son `RuntimeException` (no checked), lo que significa que los servicios pueden lanzarlas sin declararlas en la firma del método.

### GlobalExceptionHandler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleRecursoNoEncontrado(RecursoNoEncontradoException ex) {
        return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
    }

    @ExceptionHandler(AccesoNoAutorizadoException.class)
    public ResponseEntity<ErrorResponse> handleAccesoNoAutorizado(AccesoNoAutorizadoException ex) {
        return ResponseEntity.status(403).body(new ErrorResponse(403, ex.getMessage()));
    }

    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponse> handleReglaNegocio(ReglaNegocioException ex) {
        return ResponseEntity.status(400).body(new ErrorResponse(400, ex.getMessage()));
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException ex) {
        return ResponseEntity.status(500).body(new ErrorResponse(500, "Error al procesar la imagen: " + ex.getMessage()));
    }
}
```

`@RestControllerAdvice` hace que esta clase intercepte todas las excepciones lanzadas por cualquier controlador de la aplicación. Sin esto, Spring devolvería respuestas de error genéricas sin estructura consistente. Con esto, todos los errores siguen el mismo formato:

```json
{
  "estado": 404,
  "mensaje": "No existe un artículo con id: 99"
}
```

---

## 15. Tests unitarios

### ¿Por qué tests unitarios?

Los tests unitarios verifican que cada clase funciona correctamente de forma **aislada**, sin depender de la base de datos, del sistema de ficheros ni de otros servicios externos. Esto los hace rápidos (se ejecutan en milisegundos) y fiables.

### Herramientas utilizadas

- **JUnit 5**: el framework de testing estándar de Java. Proporciona `@Test`, `@BeforeEach`, `@DisplayName`, etc.
- **Mockito**: permite crear **mocks** (dobles de prueba) de las dependencias. Un mock simula el comportamiento de una clase real sin ejecutar su código.
- **AssertJ**: librería de aserciones con una API fluida y mensajes de error descriptivos.

### Estructura de un test

```java
@ExtendWith(MockitoExtension.class)   // activa Mockito para esta clase
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;   // mock del repositorio

    @Mock
    private PasswordEncoder passwordEncoder;       // mock del encoder

    @InjectMocks
    private UsuarioService usuarioService;         // clase real con mocks inyectados

    @BeforeEach
    void setUp() {
        // se ejecuta antes de cada test para preparar datos de ejemplo
        usuarioEjemplo = Usuario.builder()...build();
    }

    @Test
    @DisplayName("registrar: registra un usuario correctamente cuando los datos son únicos")
    void registrar_datosUnicos_registraCorrectamente() {
        // GIVEN — configurar el comportamiento de los mocks
        when(usuarioRepository.existsByCorreoElectronico(...)).thenReturn(false);
        when(passwordEncoder.encode(...)).thenReturn("hashCodificado");
        when(usuarioRepository.save(...)).thenReturn(usuarioEjemplo);

        // WHEN — ejecutar el método bajo prueba
        UsuarioPerfilResponse resultado = usuarioService.registrar(request);

        // THEN — verificar el resultado
        assertThat(resultado).isEqualTo(perfilEjemplo);
        verify(usuarioRepository).save(usuarioEjemplo);  // verificar que se llamó a save
    }
}
```

### El patrón Given-When-Then

Todos los tests siguen este patrón:
- **Given** (dado que): configura el estado inicial y el comportamiento de los mocks con `when(...).thenReturn(...)`.
- **When** (cuando): ejecuta el método que se está probando.
- **Then** (entonces): verifica el resultado con `assertThat` y que se llamaron los métodos correctos con `verify`.

### Qué prueba cada clase de test

#### AuthServiceTest (4 tests)

| Test | Qué verifica |
|---|---|
| `login_credencialesCorrectas_devuelveLoginResponse` | Con credenciales válidas, devuelve token e idUsuario |
| `login_passwordIncorrecta_lanzaBadCredentialsException` | Con contraseña errónea, lanza la excepción correcta |
| `login_correoNoRegistrado_lanzaBadCredentialsException` | Con correo inexistente, lanza la excepción correcta |
| `login_credencialesCorrectas_tokenContieneCorreoEId` | Verifica que el token se genera con los datos correctos |

#### UsuarioServiceTest (16 tests)

Cubre: registro (3 tests — éxito, correo duplicado, DNI duplicado, nombre duplicado), obtener perfil (2), obtener contacto (1), actualizar (3), cambiar contraseña (2), actualizar imagen (2), eliminar (2).

Ejemplo de test de caso negativo:
```java
@Test
@DisplayName("registrar: lanza ReglaNegocioException si el correo ya está en uso")
void registrar_correoEnUso_lanzaReglaNegocioException() {
    when(usuarioRepository.existsByCorreoElectronico(...)).thenReturn(true);

    assertThatThrownBy(() -> usuarioService.registrar(request))
            .isInstanceOf(ReglaNegocioException.class)
            .hasMessage("El correo electrónico ya está en uso");

    verify(usuarioRepository, never()).save(any());  // nunca debe llegar a guardar
}
```

`assertThatThrownBy` captura la excepción lanzada y permite verificar tanto su tipo como su mensaje. `verify(..., never())` comprueba que un método del mock nunca fue llamado, lo que garantiza que la validación cortó el flujo antes de llegar al `save`.

#### ArticuloServiceTest (13 tests)

Cubre: publicar (2), obtener detalle (2), listar todos (1), listar propios (1), editar (3 — éxito, no propietario, con nueva imagen), renovar (2), eliminar (2).

Ejemplo de test de autorización:
```java
@Test
@DisplayName("editar: lanza AccesoNoAutorizadoException cuando el usuario no es el propietario")
void editar_noPropietario_lanzaAccesoNoAutorizadoException() {
    when(articuloRepository.findById(1L)).thenReturn(Optional.of(articuloEjemplo));
    // articuloEjemplo.usuario.idUsuario = 1, pero se pasa idUsuario = 2

    assertThatThrownBy(() -> articuloService.editar(1L, 2L, requestEjemplo, null))
            .isInstanceOf(AccesoNoAutorizadoException.class);

    verify(articuloRepository, never()).save(any());
}
```

#### ConversacionServiceTest (12 tests)

Cubre: iniciar (4 — éxito, comprador es vendedor, conversación duplicada, artículo inexistente), obtener (3 — comprador, vendedor, tercero sin acceso), listar (2), eliminar (3).

#### MensajeServiceTest (7 tests)

Cubre: enviar mensaje (3 — éxito, emisor no participante, conversación inexistente), marcar como leídos (2), casos de error (2).

#### SeguimientoServiceTest (7 tests)

Cubre: agregar (3 — éxito, artículo inexistente, seguimiento duplicado), eliminar (2), listar (2).

### Ejecutar los tests

```bash
# Ejecutar todos los tests
mvn test

# Resultado esperado
Tests run: 59, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

### Por qué se usan mocks y no la base de datos real

Si los tests usaran la BD real necesitarían que MySQL esté corriendo, que las tablas existan y que los datos estén en un estado conocido. Esto los haría lentos, frágiles y difíciles de ejecutar en un entorno de integración continua. Los mocks eliminan todas esas dependencias externas.

---

*Documentación generada para PC-Swaps Backend — Spring Boot 4.0.6 / Java 21*
