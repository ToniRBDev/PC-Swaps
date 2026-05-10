package com.tonidev.backend.dto;

import jakarta.validation.constraints.NotNull;

/**
 * DTO con los datos necesarios para iniciar una conversación sobre un artículo.
 * El comprador se obtiene del usuario autenticado y el vendedor del artículo.
 */
public record ConversacionRequest(

        @NotNull(message = "El artículo es obligatorio")
        Long idArticulo
) {}
