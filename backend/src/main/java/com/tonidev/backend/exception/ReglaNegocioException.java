package com.tonidev.backend.exception;

/**
 * Excepción lanzada cuando se incumple una regla de negocio de la plataforma.
 * Cubre casos como datos duplicados, validaciones de estado o restricciones de uso.
 * Se mapea a una respuesta HTTP 400 Bad Request.
 */
public class ReglaNegocioException extends RuntimeException {

    /**
     * Constructor con el mensaje descriptivo de la regla de negocio incumplida.
     *
     * @param mensaje descripción de la regla de negocio que se ha violado
     */
    public ReglaNegocioException(String mensaje) {
        super(mensaje);
    }
}
