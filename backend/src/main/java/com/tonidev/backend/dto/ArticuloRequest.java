package com.tonidev.backend.dto;

import com.tonidev.backend.model.EstadoArticulo;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

/**
 * DTO con los datos necesarios para publicar o editar un artículo.
 */
public record ArticuloRequest(

        @NotNull(message = "La categoría es obligatoria")
        Long idCategoria,

        @NotBlank(message = "La marca es obligatoria")
        String marca,

        @NotBlank(message = "El modelo es obligatorio")
        String modelo,

        @NotNull(message = "El estado del artículo es obligatorio")
        EstadoArticulo estado,

        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.01", message = "El precio debe ser mayor que cero")
        BigDecimal precio,

        @NotBlank(message = "La descripción es obligatoria")
        String descripcion
) {}
