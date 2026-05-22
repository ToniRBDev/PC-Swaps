package com.tonidev.backend.exception;

import com.tonidev.backend.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.io.IOException;

/**
 * Manejador global de excepciones para toda la API REST.
 * Captura las excepciones lanzadas por los servicios y las transforma en respuestas HTTP estructuradas.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Maneja los casos en que no se encuentra un recurso en la base de datos.
     *
     * @param excepcion la excepción lanzada con el detalle del recurso no encontrado
     * @return respuesta con estado 404 y el mensaje de error
     */
    @ExceptionHandler(RecursoNoEncontradoException.class)
    public ResponseEntity<ErrorResponse> handleRecursoNoEncontrado(RecursoNoEncontradoException excepcion) {
        ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), excepcion.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    /**
     * Maneja los casos en que un usuario intenta acceder a un recurso sin permiso.
     *
     * @param excepcion la excepción lanzada con el detalle del acceso denegado
     * @return respuesta con estado 403 y el mensaje de error
     */
    @ExceptionHandler(AccesoNoAutorizadoException.class)
    public ResponseEntity<ErrorResponse> handleAccesoNoAutorizado(AccesoNoAutorizadoException excepcion) {
        ErrorResponse error = new ErrorResponse(HttpStatus.FORBIDDEN.value(), excepcion.getMessage());
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error);
    }

    /**
     * Maneja los casos en que se incumple una regla de negocio de la plataforma.
     *
     * @param excepcion la excepción lanzada con el detalle de la regla incumplida
     * @return respuesta con estado 400 y el mensaje de error
     */
    @ExceptionHandler(ReglaNegocioException.class)
    public ResponseEntity<ErrorResponse> handleReglaNegocio(ReglaNegocioException excepcion) {
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), excepcion.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Maneja las subidas que superan el limite configurado para ficheros multipart.
     *
     * @return respuesta con estado 413 y un mensaje claro para el usuario
     */
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ErrorResponse> handleMaxUploadSizeExceeded() {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.PAYLOAD_TOO_LARGE.value(),
                "La imagen no puede superar los 5 MB"
        );
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE).body(error);
    }

    /**
     * Maneja argumentos invalidos enviados por el usuario, como imagenes vacias,
     * formatos no permitidos o ficheros demasiado grandes.
     *
     * @param excepcion la excepcion con el detalle del dato invalido
     * @return respuesta con estado 400 y el mensaje de error
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException excepcion) {
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), excepcion.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    /**
     * Maneja los errores de entrada/salida al gestionar imágenes en disco.
     *
     * @param excepcion la excepción de I/O lanzada
     * @return respuesta con estado 500 y un mensaje descriptivo
     */
    @ExceptionHandler(IOException.class)
    public ResponseEntity<ErrorResponse> handleIOException(IOException excepcion) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error al procesar la imagen: " + excepcion.getMessage()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
