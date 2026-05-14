package com.tonidev.backend.exception;

/**
 * Excepción lanzada cuando no se encuentra un recurso solicitado en la base de datos.
 * Se mapea a una respuesta HTTP 404 Not Found.
 */
public class RecursoNoEncontradoException extends RuntimeException {

    /**
     * Constructor con el mensaje descriptivo del recurso no encontrado.
     *
     * @param mensaje descripción del recurso que no existe
     */
    public RecursoNoEncontradoException(String mensaje) {
        super(mensaje);
    }
}
