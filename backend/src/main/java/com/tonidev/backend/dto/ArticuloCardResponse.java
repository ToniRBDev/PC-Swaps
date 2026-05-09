package com.tonidev.backend.dto;

import com.tonidev.backend.model.EstadoArticulo;

import java.math.BigDecimal;

/**
 * DTO con los datos necesarios para mostrar un artículo en formato card en el listado.
 */
public record ArticuloCardResponse(
        Long idArticulo,
        String imagen,
        String marca,
        String modelo,
        BigDecimal precio,
        EstadoArticulo estado
) {}
