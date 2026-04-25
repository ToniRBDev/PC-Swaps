classDiagram

    class Usuario {
        +int idUsuario
        +String nombre
        +String apellidos
        +String dni
        +String correoElectronico
        +Date fechaNacimiento
        +String direccion
        +String numTelefono
        +String imagenUsuario
        +String nombreUsuario
        +String passwordHash
    }

    class Categoria {
        +int idCategoria
        +String nombreCategoria
    }

    class Articulo {
        +int idArticulo
        +int idUsuario
        +int idCategoria
        +String marca
        +String modelo
        +String estado
        +double precio
        +String descripcion
        +String imagen
        +Date fechaPublicacion
        +Date fechaUltimaRenovacion
        +String especificaciones
        +boolean activo
    }

    class Seguimiento {
        +int idSeguimiento
        +int idUsuario
        +int idArticulo
        +Date fechaGuardado
    }

    class Conversacion {
        +int idConversacion
        +int idArticulo
        +int idComprador
        +int idVendedor
        +Date fechaInicio
    }

    class Mensaje {
        +int idMensaje
        +int idConversacion
        +int idEmisor
        +String contenido
        +DateTime fechaEnvio
        +boolean leido
    }

    %% Relaciones de Propiedad y Clasificación
    Usuario "1" --> "0..*" Articulo : publica
    Categoria "1" --> "0..*" Articulo : clasifica

    %% Relación de Seguimiento (Favoritos)
    Usuario "1" -- "0..*" Seguimiento : posee
    Articulo "1" -- "0..*" Seguimiento : es_guardado

    %% Relaciones de Mensajería
    Articulo "1" -- "0..*" Conversacion : origina
    Usuario "1" --> "0..*" Conversacion : comprador
    Usuario "1" --> "0..*" Conversacion : vendedor
    Conversacion "1" --> "1..*" Mensaje : contiene
    Usuario "1" --> "0..*" Mensaje : escribe
