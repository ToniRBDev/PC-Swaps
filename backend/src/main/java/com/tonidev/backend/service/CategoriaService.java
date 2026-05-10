package com.tonidev.backend.service;

import com.tonidev.backend.dto.CategoriaResponse;
import com.tonidev.backend.mapper.CategoriaMapper;
import com.tonidev.backend.repository.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Servicio encargado de la lógica de negocio relacionada con las categorías.
 */
@Service
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final CategoriaMapper categoriaMapper;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param categoriaRepository repositorio para acceder a las categorías en base de datos
     * @param categoriaMapper     mapper para convertir las entidades a DTOs
     */
    public CategoriaService(CategoriaRepository categoriaRepository, CategoriaMapper categoriaMapper) {
        this.categoriaRepository = categoriaRepository;
        this.categoriaMapper = categoriaMapper;
    }

    /**
     * Devuelve todas las categorías disponibles en la plataforma.
     *
     * @return lista de categorías en formato DTO
     */
    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll()
                .stream()
                .map(categoriaMapper::toResponse)
                .toList();
    }
}
