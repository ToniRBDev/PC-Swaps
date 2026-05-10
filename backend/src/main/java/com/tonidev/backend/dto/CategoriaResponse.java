package com.tonidev.backend.dto;

/**
 * DTO con los datos de una categoría para mostrar en el frontend.
 */
public record CategoriaResponse(
        Long idCategoria,
        String nombreCategoria
) {}
