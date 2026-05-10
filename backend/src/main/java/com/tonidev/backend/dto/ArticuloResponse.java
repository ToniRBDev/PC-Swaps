package com.tonidev.backend.dto;

import com.tonidev.backend.model.Categoria;
import com.tonidev.backend.model.EstadoArticulo;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO con el detalle completo de un artículo publicado en la plataforma.
 */
public record ArticuloResponse(
        Long idArticulo,
        Categoria categoria,
        String marca,
        String modelo,
        EstadoArticulo estado,
        BigDecimal precio,
        String descripcion,
        String imagen,
        LocalDateTime fechaPublicacion,
        Integer numeroVisitas
) {}
