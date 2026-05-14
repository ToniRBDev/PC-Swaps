package com.tonidev.backend.controller;

import com.tonidev.backend.dto.ArticuloCardResponse;
import com.tonidev.backend.service.SeguimientoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de seguimientos de artículos.
 * Expone los endpoints bajo la ruta {@code /api/seguimientos}.
 */
@RestController
@RequestMapping("/api/seguimientos")
public class SeguimientoController {

    private final SeguimientoService seguimientoService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param seguimientoService servicio encargado de la lógica de negocio de seguimientos
     */
    public SeguimientoController(SeguimientoService seguimientoService) {
        this.seguimientoService = seguimientoService;
    }

    /**
     * Añade un artículo a la lista de seguimiento del usuario.
     *
     * @param idArticulo el identificador del artículo a seguir
     * @param idUsuario  el identificador del usuario autenticado
     * @return respuesta vacía con estado 201
     */
    @PostMapping("/{idArticulo}")
    public ResponseEntity<Void> agregar(
            @PathVariable Long idArticulo,
            @RequestParam Long idUsuario) {
        seguimientoService.agregar(idUsuario, idArticulo);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * Elimina un artículo de la lista de seguimiento del usuario.
     *
     * @param idArticulo el identificador del artículo a dejar de seguir
     * @param idUsuario  el identificador del usuario autenticado
     * @return respuesta vacía con estado 204
     */
    @DeleteMapping("/{idArticulo}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idArticulo,
            @RequestParam Long idUsuario) {
        seguimientoService.eliminar(idUsuario, idArticulo);
        return ResponseEntity.noContent().build();
    }

    /**
     * Devuelve los artículos guardados por el usuario en formato card.
     *
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de artículos en formato card
     */
    @GetMapping
    public ResponseEntity<List<ArticuloCardResponse>> listar(@RequestParam Long idUsuario) {
        return ResponseEntity.ok(seguimientoService.listar(idUsuario));
    }
}
