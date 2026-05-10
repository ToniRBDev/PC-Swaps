package com.tonidev.backend.dto;

import java.time.LocalDateTime;

/**
 * DTO con los datos de un mensaje para mostrar en el frontend.
 */
public record MensajeResponse(
        Long idMensaje,
        Long idEmisor,
        String contenido,
        LocalDateTime fechaEnvio,
        Boolean leido
) {}
