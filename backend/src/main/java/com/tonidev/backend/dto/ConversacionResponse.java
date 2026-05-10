package com.tonidev.backend.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * DTO con los datos de una conversación para mostrar en el frontend.
 */
public record ConversacionResponse(
        Long idConversacion,
        Long idArticulo,
        UsuarioSimpleInfoResponse vendedor,
        List<MensajeResponse> mensajes,
        LocalDate fechaInicio
) {}
