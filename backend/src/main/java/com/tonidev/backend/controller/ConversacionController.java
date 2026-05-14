package com.tonidev.backend.controller;

import com.tonidev.backend.dto.ConversacionRequest;
import com.tonidev.backend.dto.ConversacionResponse;
import com.tonidev.backend.service.ConversacionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador REST para la gestión de conversaciones.
 * Expone los endpoints bajo la ruta {@code /api/conversaciones}.
 */
@RestController
@RequestMapping("/api/conversaciones")
public class ConversacionController {

    private final ConversacionService conversacionService;

    /**
     * Constructor con inyección de dependencias.
     *
     * @param conversacionService servicio encargado de la lógica de negocio de conversaciones
     */
    public ConversacionController(ConversacionService conversacionService) {
        this.conversacionService = conversacionService;
    }

    /**
     * Inicia una conversación sobre un artículo.
     *
     * @param idUsuario el identificador del usuario que inicia la conversación (comprador)
     * @param request   el DTO con el identificador del artículo
     * @return el DTO con los datos de la conversación creada con estado 201
     */
    @PostMapping
    public ResponseEntity<ConversacionResponse> iniciar(
            @RequestParam Long idUsuario,
            @RequestBody ConversacionRequest request) {
        ConversacionResponse respuesta = conversacionService.iniciar(idUsuario, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);
    }

    /**
     * Devuelve el detalle de una conversación con todos sus mensajes.
     *
     * @param idConversacion el identificador de la conversación
     * @param idUsuario      el identificador del usuario autenticado
     * @return el DTO con los datos de la conversación y sus mensajes
     */
    @GetMapping("/{idConversacion}")
    public ResponseEntity<ConversacionResponse> obtener(
            @PathVariable Long idConversacion,
            @RequestParam Long idUsuario) {
        return ResponseEntity.ok(conversacionService.obtener(idConversacion, idUsuario));
    }

    /**
     * Devuelve todas las conversaciones del usuario autenticado, como comprador y como vendedor.
     *
     * @param idUsuario el identificador del usuario autenticado
     * @return lista de conversaciones con sus mensajes
     */
    @GetMapping
    public ResponseEntity<List<ConversacionResponse>> listar(@RequestParam Long idUsuario) {
        return ResponseEntity.ok(conversacionService.listar(idUsuario));
    }

    /**
     * Elimina una conversación y todos sus mensajes.
     *
     * @param idConversacion el identificador de la conversación a eliminar
     * @param idUsuario      el identificador del usuario autenticado
     * @return respuesta vacía con estado 204
     */
    @DeleteMapping("/{idConversacion}")
    public ResponseEntity<Void> eliminar(
            @PathVariable Long idConversacion,
            @RequestParam Long idUsuario) {
        conversacionService.eliminar(idConversacion, idUsuario);
        return ResponseEntity.noContent().build();
    }
}
