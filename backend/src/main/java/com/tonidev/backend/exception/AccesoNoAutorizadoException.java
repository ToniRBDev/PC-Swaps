package com.tonidev.backend.exception;

/**
 * Excepción lanzada cuando un usuario intenta realizar una acción sobre un recurso que no le pertenece.
 * Se mapea a una respuesta HTTP 403 Forbidden.
 */
public class AccesoNoAutorizadoException extends RuntimeException {

    /**
     * Constructor con el mensaje descriptivo del acceso denegado.
     *
     * @param mensaje descripción del motivo por el que se deniega el acceso
     */
    public AccesoNoAutorizadoException(String mensaje) {
        super(mensaje);
    }
}
