package com.tonidev.backend.mapper;

import com.tonidev.backend.dto.CategoriaResponse;
import com.tonidev.backend.model.Categoria;
import org.springframework.stereotype.Component;

/**
 * Mapper encargado de convertir la entidad {@link Categoria} a su DTO de respuesta.
 */
@Component
public class CategoriaMapper {

    /**
     * Convierte una entidad {@link Categoria} a un {@link CategoriaResponse}.
     *
     * @param categoria la entidad a convertir
     * @return el DTO con los datos de la categoría
     */
    public CategoriaResponse toResponse(Categoria categoria) {
        return new CategoriaResponse(
                categoria.getIdCategoria(),
                categoria.getNombreCategoria()
        );
    }
}
