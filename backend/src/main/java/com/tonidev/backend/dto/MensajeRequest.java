package com.tonidev.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO con los datos necesarios para enviar un mensaje en una conversación.
 * El emisor se obtiene del usuario autenticado.
 */
public record MensajeRequest(

        @NotNull(message = "La conversación es obligatoria")
        Long idConversacion,

        @NotBlank(message = "El contenido del mensaje es obligatorio")
        String contenido
) {}
