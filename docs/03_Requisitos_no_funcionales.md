# Requisitos no funcionales

## Seguridad
- Autenticación mediante JWT con expiración de token
- Solo el propietario puede modificar o eliminar sus artículos (validación en backend)
- Contraseñas almacenadas con hash (BCrypt)
- Protección contra inyección SQL (garantizado por JPA)

---

## Usabilidad
- Interfaz responsiva (móvil y escritorio)
- Feedback visual inmediato ante cualquier acción (notificaciones de éxito/error)
- Mensajes de error comprensibles para el usuario

---

## Mantenibilidad
- Arquitectura en capas bien definida (controller → service → repository)
- Documentación del código con Javadoc
- Separación frontend/backend mediante API REST