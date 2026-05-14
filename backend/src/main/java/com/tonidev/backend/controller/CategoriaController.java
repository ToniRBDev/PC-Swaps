package com.tonidev.backend.controller;

import com.tonidev.backend.dto.CategoriaResponse;
import com.tonidev.backend.service.CategoriaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de categorías.
 * Expone los endpoints bajo la ruta {@code /api/categorias}.
 */
@RestController
@RequestMapping("/api/categorias")
public class CategoriaController {

    private final CategoriaService categoriaService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param categoriaService servicio encargado de la lógica de negocio de categorías
     */
    public CategoriaController(CategoriaService categoriaService) {
        this.categoriaService = categoriaService;
    }

    /**
     * Devuelve todas las categorías disponibles en la plataforma.
     *
     * @return lista de categorías en formato DTO
     */
    @GetMapping
    public ResponseEntity<List<CategoriaResponse>> listarTodas() {
        return ResponseEntity.ok(categoriaService.listarTodas());
    }
}
